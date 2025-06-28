import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LangChainService from '@/services/langchain-simple.service'
import { PersonaId } from '@/config/langchain'

// Simple in-memory store for user preferences (will be replaced with database later)
const userPreferences: Record<string, {
  targetLanguage: string
  nativeLanguage: string
  proficiencyLevel: string
  totalConversations: number
  totalWords: number
  streakDays: number
  favoritePersona?: PersonaId
  conversationHistory: Array<{
    id: string
    timestamp: Date
    persona: PersonaId
    messageCount: number
    duration: number
  }>
}> = {}

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

    // Get user session (supports both authenticated users and guests)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    const userEmail = session?.user?.email || 'guest@example.com'
    const userName = session?.user?.name || 'Guest User'

    // Get or create user preferences
    if (!userPreferences[userId]) {
      userPreferences[userId] = {
        targetLanguage: targetLanguage || 'Spanish',
        nativeLanguage: 'English',
        proficiencyLevel: proficiencyLevel || 'intermediate',
        totalConversations: 0,
        totalWords: 0,
        streakDays: 0,
        favoritePersona: personaId as PersonaId,
        conversationHistory: []
      }
    }

    const userProfile = userPreferences[userId]

    // Initialize LangChain service
    const langChainService = new LangChainService()

    // Create conversation context using user preferences
    const context = {
      userId,
      personaId: personaId as PersonaId,
      targetLanguage: targetLanguage || userProfile.targetLanguage,
      userNativeLanguage: userProfile.nativeLanguage,
      proficiencyLevel: proficiencyLevel || userProfile.proficiencyLevel,
      conversationHistory: [], // Will be enhanced with actual history later
      learningGoals: ['General conversation practice'],
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

    // Update user progress
    const wordCount = message.split(' ').length
    userProfile.totalWords += wordCount
    userProfile.totalConversations += 1

    // Update favorite persona if this is their most used one
    userProfile.favoritePersona = personaId as PersonaId

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse.response,
        metadata: aiResponse.metadata,
        persona: personaId,
        userProgress: {
          totalConversations: userProfile.totalConversations,
          totalWords: userProfile.totalWords,
          streakDays: userProfile.streakDays
        },
        userInfo: {
          userId,
          name: userName,
          email: userEmail,
          isAuthenticated: !!session
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

// GET endpoint for user analytics and conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')

    // Get user session
    const session = await getServerSession(authOptions)
    const userId = requestedUserId || session?.user?.id || 'guest'

    // Get user analytics
    const userProfile = userPreferences[userId] || {
      targetLanguage: 'Spanish',
      nativeLanguage: 'English',
      proficiencyLevel: 'intermediate',
      totalConversations: 0,
      totalWords: 0,
      streakDays: 0,
      favoritePersona: 'maya' as PersonaId,
      conversationHistory: []
    }

    return NextResponse.json({
      success: true,
      data: {
        userProgress: {
          totalConversations: userProfile.totalConversations,
          totalWords: userProfile.totalWords,
          streakDays: userProfile.streakDays,
          favoritePersona: userProfile.favoritePersona
        },
        preferences: {
          targetLanguage: userProfile.targetLanguage,
          nativeLanguage: userProfile.nativeLanguage,
          proficiencyLevel: userProfile.proficiencyLevel
        },
        conversationHistory: userProfile.conversationHistory,
        weeklyStats: {
          conversationsThisWeek: userProfile.conversationHistory.length,
          minutesThisWeek: userProfile.conversationHistory.reduce((sum, conv) => sum + conv.duration, 0),
          wordsThisWeek: userProfile.totalWords
        }
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
