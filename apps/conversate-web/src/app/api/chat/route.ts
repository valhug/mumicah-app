import { NextRequest, NextResponse } from 'next/server'
import { EnhancedPersonaConversationService as LangChainEnhancedService } from '@/services/langchain-enhanced-service'
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

    const { message, userId, personaId, targetLanguage, proficiencyLevel } = await request.json()

    if (!message || !userId || !personaId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, userId, or personaId' },
        { status: 400 }
      )
    }

    const service = new LangChainEnhancedService()
    
    // Create or resume session
    const context = await service.createOrResumeSession(
      userId,
      personaId as PersonaId,
      targetLanguage || 'Spanish',
      proficiencyLevel || 'intermediate'
    )

    // Send message and get response
    const response = await service.sendMessage(context.sessionId, message)

    return NextResponse.json({
      success: true,
      data: {
        message: response.message,
        metadata: response.metadata,
        sessionId: context.sessionId,
        learningProgress: context.learningProgress
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const service = new LangChainEnhancedService()
    
    if (sessionId) {
      // Get specific session
      const context = await service.getSession(sessionId)
      return NextResponse.json({
        success: true,
        data: { session: context }
      })
    } else {
      // Get user's sessions summary
      const sessions = await service.getUserSessions(userId)
      return NextResponse.json({
        success: true,
        data: { sessions }
      })
    }

  } catch (error) {
    console.error('Chat API GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
