import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LangChainService from '@/services/langchain-simple.service'
import { DatabaseUserService } from '@/services/database-user.service'
import { UserConversationService } from '@/services/user-conversation.service'
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

    // Get user session (supports both authenticated users and guests)
    const userSession = await getServerSession(authOptions)
    const userId = userSession?.user?.id || 'guest'
    const userEmail = userSession?.user?.email || 'guest@example.com'
    const userName = userSession?.user?.name || 'Guest User'

    // Initialize services
    const dbService = new DatabaseUserService()
    const conversationService = new UserConversationService()

    // Get or create user profile and progress
    let userProfile = await dbService.getUserProfile(userId)
    let userProgress = await dbService.getUserProgress(userId)

    if (!userProfile) {
      userProfile = await dbService.updateUserProfile(userId, {
        userId,
        name: userName,
        email: userEmail,
        provider: 'credentials',
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            streakReminders: true,
            achievementAlerts: true
          },
          privacy: {
            profileVisibility: 'public',
            showProgress: true,
            showLocation: false
          }
        },
        subscription: {
          type: 'free',
          status: 'active'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      })
    }

    if (!userProgress) {
      userProgress = await dbService.updateUserProgress(userId, {
        userId,
        targetLanguage: targetLanguage || 'Spanish',
        nativeLanguage: 'English',
        proficiencyLevel: proficiencyLevel || 'intermediate',
        totalConversations: 0,
        totalWords: 0,
        totalMinutes: 0,
        streakDays: 0,
        lastActiveDate: new Date(),
        weeklyGoal: 5,
        monthlyGoal: 20,
        achievements: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Initialize LangChain service
    const langChainService = new LangChainService()

    // Create conversation context using user preferences
    const context = {
      userId,
      personaId: personaId as PersonaId,
      targetLanguage: targetLanguage || userProgress.targetLanguage,
      userNativeLanguage: userProgress.nativeLanguage,
      proficiencyLevel: proficiencyLevel || userProgress.proficiencyLevel,
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
    
    // Start or get existing conversation session
    let conversationSession = await conversationService.getActiveSession(userId, personaId as PersonaId)
    if (!conversationSession) {
      conversationSession = await conversationService.createConversationSession(userId, personaId as PersonaId, {
        targetLanguage: userProgress.targetLanguage,
        userNativeLanguage: userProgress.nativeLanguage,
        proficiencyLevel: userProgress.proficiencyLevel,
        learningGoals: ['General conversation practice'],
        currentTopic: 'General conversation'
      })
    }

    // Update session with the new message exchange
    if (conversationSession) {
      await conversationService.updateSessionActivity(conversationSession.sessionId, {
        role: 'user',
        content: message,
        wordCount: wordCount
      })
      
      await conversationService.updateSessionActivity(conversationSession.sessionId, {
        role: 'assistant', 
        content: aiResponse.response,
        wordCount: aiResponse.response.split(' ').length
      })
    }
    await dbService.incrementUserStats(userId, {
      conversations: 1,
      words: wordCount,
      minutes: 1 // Approximate 1 minute per message
    })

    // Update favorite persona
    await dbService.updateUserProgress(userId, {
      favoritePersona: personaId as PersonaId
    })

    // Get updated progress for response
    const updatedProgress = await dbService.getUserProgress(userId)

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse.response,
        metadata: aiResponse.metadata,
        persona: personaId,
        userProgress: {
          totalConversations: updatedProgress?.totalConversations || 0,
          totalWords: updatedProgress?.totalWords || 0,
          streakDays: updatedProgress?.streakDays || 0
        },
        userInfo: {
          userId,
          name: userName,
          email: userEmail,
          isAuthenticated: !!userSession
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
    const userSession = await getServerSession(authOptions)
    const userId = requestedUserId || userSession?.user?.id || 'guest'

    // Initialize services
    const dbService = new DatabaseUserService()
    const conversationService = new UserConversationService()

    // Get user data from database
    const userProgress = await dbService.getUserProgress(userId)
    const conversationHistory = await conversationService.getUserConversationHistory(userId, { limit: 10 })

    // Calculate weekly stats from conversation history
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weeklyConversations = conversationHistory.filter(conv => 
      new Date(conv.createdAt) >= weekStart
    )

    const weeklyStats = {
      conversationsThisWeek: weeklyConversations.length,
      minutesThisWeek: weeklyConversations.reduce((sum, conv) => sum + (conv.metadata?.duration || 0), 0),
      wordsThisWeek: weeklyConversations.reduce((sum, conv) => sum + (conv.metadata?.totalWords || 0), 0)
    }

    return NextResponse.json({
      success: true,
      data: {
        userProgress: {
          totalConversations: userProgress?.totalConversations || 0,
          totalWords: userProgress?.totalWords || 0,
          streakDays: userProgress?.streakDays || 0,
          favoritePersona: userProgress?.favoritePersona || 'maya'
        },
        preferences: {
          targetLanguage: userProgress?.targetLanguage || 'Spanish',
          nativeLanguage: userProgress?.nativeLanguage || 'English',
          proficiencyLevel: userProgress?.proficiencyLevel || 'intermediate'
        },
        conversationHistory: conversationHistory.map(conv => ({
          id: conv.id,
          timestamp: conv.createdAt,
          persona: conv.personaId,
          messageCount: conv.messages?.length || 0,
          duration: conv.metadata?.duration || 0
        })),
        weeklyStats
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
