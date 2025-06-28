import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserConversationService } from '@/services/user-conversation.service'
import { PersonaId } from '@/config/langchain'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const personaId = searchParams.get('personaId') as PersonaId | null
    
    const conversationService = new UserConversationService()
    
    const conversations = await conversationService.getUserConversationHistory(userId, {
      limit,
      offset,
      personaId: personaId || undefined
    })
    
    return NextResponse.json({
      success: true,
      data: {
        conversations,
        total: conversations.length,
        hasMore: conversations.length === limit
      }
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    
    const { action, conversationId } = await request.json()
    
    const conversationService = new UserConversationService()
    
    switch (action) {
      case 'archive':
        const archived = await conversationService.archiveConversation(conversationId, userId)
        return NextResponse.json({
          success: archived,
          message: archived ? 'Conversation archived' : 'Failed to archive conversation'
        })
      
      case 'end_session':
        const endedSession = await conversationService.endSession(conversationId)
        return NextResponse.json({
          success: !!endedSession,
          data: endedSession,
          message: endedSession ? 'Session ended successfully' : 'Failed to end session'
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing conversation action:', error)
    return NextResponse.json(
      { error: 'Failed to process conversation action' },
      { status: 500 }
    )
  }
}
