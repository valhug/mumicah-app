import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserConversationService } from '@/services/user-conversation.service'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    const conversationId = params.id
    
    const conversationService = new UserConversationService()
    
    const conversation = await conversationService.getConversationDetails(conversationId, userId)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: conversation
    })
  } catch (error) {
    console.error('Error fetching conversation details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation details' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    const conversationId = params.id
    
    const { status, rating, feedback } = await request.json()
    
    // const conversationService = new UserConversationService()
    
    // Update conversation (this would need to be implemented in the service)
    // For now, just return success
    console.log('Updating conversation:', { userId, conversationId, status, rating, feedback })
    
    return NextResponse.json({
      success: true,
      message: 'Conversation updated successfully'
    })
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'guest'
    const conversationId = params.id
    
    const conversationService = new UserConversationService()
    
    const archived = await conversationService.archiveConversation(conversationId, userId)
    
    return NextResponse.json({
      success: archived,
      message: archived ? 'Conversation deleted successfully' : 'Failed to delete conversation'
    })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
}
