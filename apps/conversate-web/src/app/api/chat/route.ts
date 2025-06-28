import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LangChainService from '@/services/langchain-simple.service'
import { SimpleUserService } from '@/services/simple-user.service'
import { PersonaId } from '@/config/langchain'

export async function POST(request: NextRequest) {
  try {
    // Debug: Check environment variables
    console.log('Environment check:', {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10),
      hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
      nodeEnv: process.env.NODE_ENV
    })

    const { message, personaId, targetLanguage, proficiencyLevel } = await request.json()

    if (!message || !personaId) {
      return NextResponse.json(
        { error: 'Missing required fields: message or personaId' },
        { status: 400 }
      )
    }

    // Get user session (supports both authenticated and guest users)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    const userEmail = session?.user?.email || 'guest@example.com'
    const userName = session?.user?.name || 'Guest User'

    // Initialize services
    const langChainService = new LangChainService()
    const userService = new SimpleUserService()

    // Get or create user profile
    const userData = await userService.getOrCreateUser(userId, userEmail, userName)

    // Get or start conversation
    let activeConversation = await userService.getActiveConversation(userId)
    if (!activeConversation) {
      activeConversation = await userService.startConversation(userId, personaId as PersonaId)
    }

    // Create conversation context using user preferences and conversation history
    const context = {
      userId,
      personaId: personaId as PersonaId,
      targetLanguage: targetLanguage || userData.preferences.targetLanguage,
      userNativeLanguage: userData.preferences.nativeLanguage,
      proficiencyLevel: proficiencyLevel || userData.preferences.proficiencyLevel,
      conversationHistory: activeConversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata
      })),
      learningGoals: userData.preferences.learningGoals,
      currentTopic: 'General conversation'
    }

    console.log('LangChain Service initialization:', {
      hasLangChainKey: !!process.env.LANGCHAIN_API_KEY,
      keyPrefix: process.env.LANGCHAIN_API_KEY ? `${process.env.LANGCHAIN_API_KEY.substring(0, 10)}...` : 'NOT_SET'
    })

    console.log('Generating response for persona:', context.personaId)
    console.log('Using persona config for:', context.personaId)

    // Generate AI response
    const aiResponse = await langChainService.generateResponse(message, context)

    // Save user message to conversation history
    await userService.addMessage(userId, 'user', message)

    // Save AI response to conversation history
    await userService.addMessage(userId, 'assistant', aiResponse.response, aiResponse.metadata)

    // Get updated user analytics
    const analytics = await userService.getUserAnalytics(userId)

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse.response,
        metadata: aiResponse.metadata,
        persona: personaId,
        conversation: {
          id: activeConversation.id,
          messageCount: activeConversation.messages.length + 2 // +2 for the new messages
        },
        user: {
          id: userId,
          name: userName,
          email: userEmail,
          isAuthenticated: !!session,
          preferences: userData.preferences
        },
        userProgress: {
          totalConversations: analytics.analytics.totalConversations,
          totalWords: userData.progress.totalWords,
          streakDays: userData.progress.streakDays,
          totalMessages: analytics.analytics.totalMessages,
          favoritePersona: analytics.analytics.favoritePersona
        }
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint for conversation history and user analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    
    // Get user session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || requestedUserId || 'guest'
    
    const userService = new SimpleUserService()
    const analytics = await userService.getUserAnalytics(userId)
    
    return NextResponse.json({
      success: true,
      data: {
        user: analytics.user,
        analytics: analytics.analytics,
        conversations: analytics.user?.conversationHistory.slice(0, 10) || [], // Last 10 conversations
        isAuthenticated: !!session
      }
    })
  } catch (error) {
    console.error('Chat GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
