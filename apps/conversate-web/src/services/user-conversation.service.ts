import { DatabaseUserService } from './database-user.service'
import { IConversationHistory } from '@/models/ConversationHistory'
import { IConversationSession, ConversationSession } from '@/models/ConversationSession'
import { PersonaId } from '@/config/langchain'
import { v4 as uuidv4 } from 'uuid'

export class UserConversationService {
  private dbService: DatabaseUserService

  constructor() {
    this.dbService = new DatabaseUserService()
  }

  // Session Management
  async createConversationSession(
    userId: string,
    personaId: PersonaId,
    context: {
      targetLanguage: string
      userNativeLanguage: string
      proficiencyLevel: string
      learningGoals: string[]
      currentTopic: string
    }
  ): Promise<IConversationSession> {
    try {
      const sessionId = uuidv4()
      const session = new ConversationSession({
        sessionId,
        userId,
        personaId,
        context,
        recentMessages: [],
        sessionMetrics: {
          messagesCount: 0,
          wordsSpoken: 0,
          startTime: new Date(),
          lastActivity: new Date(),
          duration: 0
        },
        status: 'active'
      })

      return await session.save()
    } catch (error) {
      console.error('Error creating conversation session:', error)
      throw new Error('Failed to create conversation session')
    }
  }

  async getActiveSession(userId: string, personaId?: PersonaId): Promise<IConversationSession | null> {
    try {
      const query: Record<string, unknown> = { 
        userId, 
        status: 'active' 
      }
      if (personaId) query.personaId = personaId

      return await ConversationSession.findOne(query)
        .sort({ updatedAt: -1 })
    } catch (error) {
      console.error('Error fetching active session:', error)
      return null
    }
  }

  async updateSessionActivity(sessionId: string, message: {
    role: 'user' | 'assistant'
    content: string
    wordCount: number
  }): Promise<void> {
    try {
      const session = await ConversationSession.findOne({ sessionId })
      if (!session) return

      // Add message to recent messages (keep last 10)
      session.recentMessages.push({
        role: message.role,
        content: message.content,
        timestamp: new Date()
      })

      if (session.recentMessages.length > 10) {
        session.recentMessages = session.recentMessages.slice(-10)
      }

      // Update metrics
      session.sessionMetrics.messagesCount += 1
      session.sessionMetrics.wordsSpoken += message.wordCount
      session.sessionMetrics.lastActivity = new Date()
      session.sessionMetrics.duration = Math.floor(
        (Date.now() - session.sessionMetrics.startTime.getTime()) / 1000
      )

      await session.save()
    } catch (error) {
      console.error('Error updating session activity:', error)
    }
  }

  async endSession(sessionId: string): Promise<IConversationHistory | null> {
    try {
      const session = await ConversationSession.findOne({ sessionId })
      if (!session) return null

      // Create conversation history from session
      const conversationHistory: IConversationHistory = {
        id: uuidv4(),
        userId: session.userId,
        personaId: session.personaId,
        title: this.generateConversationTitle(session.recentMessages),
        messages: session.recentMessages.map((msg) => ({
          id: uuidv4(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          metadata: {
            wordCount: msg.content.split(' ').length
          }
        })),
        metadata: {
          targetLanguage: session.context.targetLanguage,
          userProficiencyLevel: session.context.proficiencyLevel,
          totalWords: session.sessionMetrics.wordsSpoken,
          totalMessages: session.sessionMetrics.messagesCount,
          duration: Math.floor(session.sessionMetrics.duration / 60), // Convert to minutes
          topics: [session.context.currentTopic],
          corrections: 0,
          quality: this.assessConversationQuality(session.sessionMetrics)
        },
        status: 'completed',
        startedAt: session.sessionMetrics.startTime,
        completedAt: new Date(),
        createdAt: session.createdAt,
        updatedAt: new Date()
      }

      // Save conversation history
      const savedConversation = await this.dbService.saveConversation(conversationHistory)

      // Update user progress
      await this.dbService.incrementUserStats(session.userId, {
        conversations: 1,
        words: session.sessionMetrics.wordsSpoken,
        minutes: Math.floor(session.sessionMetrics.duration / 60)
      })

      // Mark session as ended
      session.status = 'ended'
      await session.save()

      return savedConversation
    } catch (error) {
      console.error('Error ending session:', error)
      return null
    }
  }

  // Conversation History Management
  async getUserConversationHistory(
    userId: string,
    options: {
      limit?: number
      offset?: number
      personaId?: PersonaId
    } = {}
  ): Promise<IConversationHistory[]> {
    return this.dbService.getUserConversations(userId, options)
  }

  async getConversationDetails(conversationId: string, userId: string): Promise<IConversationHistory | null> {
    return this.dbService.getConversationById(conversationId, userId)
  }

  async archiveConversation(conversationId: string, userId: string): Promise<boolean> {
    try {
      const conversation = await this.dbService.getConversationById(conversationId, userId)
      if (!conversation) return false

      // Update status to archived
      // Note: This would need to be implemented in the database service
      return true
    } catch (error) {
      console.error('Error archiving conversation:', error)
      return false
    }
  }

  // Helper Methods
  private generateConversationTitle(messages: Array<{ content: string; role: string }>): string {
    // Find the first user message and use it to generate a title
    const firstUserMessage = messages.find(msg => msg.role === 'user')
    if (!firstUserMessage) return 'New Conversation'

    const words = firstUserMessage.content.split(' ').slice(0, 6)
    return words.join(' ') + (firstUserMessage.content.split(' ').length > 6 ? '...' : '')
  }

  private assessConversationQuality(metrics: {
    messagesCount: number
    wordsSpoken: number
    duration: number
  }): 'poor' | 'fair' | 'good' | 'excellent' {
    const avgWordsPerMessage = metrics.wordsSpoken / Math.max(metrics.messagesCount, 1)
    const durationMinutes = metrics.duration / 60

    if (durationMinutes < 2 || avgWordsPerMessage < 3) return 'poor'
    if (durationMinutes < 5 || avgWordsPerMessage < 5) return 'fair'
    if (durationMinutes < 10 || avgWordsPerMessage < 8) return 'good'
    return 'excellent'
  }

  // Analytics
  async getConversationAnalytics(userId: string): Promise<{
    totalConversations: number
    averageDuration: number
    mostUsedPersona: PersonaId | null
    conversationQualityDistribution: Record<string, number>
    weeklyProgress: Array<{ date: string; conversations: number }>
  }> {
    try {
      const conversations = await this.dbService.getUserConversations(userId, { limit: 100 })
      
      if (conversations.length === 0) {
        return {
          totalConversations: 0,
          averageDuration: 0,
          mostUsedPersona: null,
          conversationQualityDistribution: {},
          weeklyProgress: []
        }
      }

      // Calculate average duration
      const avgDuration = conversations.reduce((sum, conv) => sum + conv.metadata.duration, 0) / conversations.length

      // Find most used persona
      const personaCount: Record<string, number> = {}
      conversations.forEach(conv => {
        personaCount[conv.personaId] = (personaCount[conv.personaId] || 0) + 1
      })
      const mostUsedPersona = Object.keys(personaCount).reduce((a, b) => 
        personaCount[a] > personaCount[b] ? a : b
      ) as PersonaId

      // Quality distribution
      const qualityDistribution: Record<string, number> = {}
      conversations.forEach(conv => {
        qualityDistribution[conv.metadata.quality] = (qualityDistribution[conv.metadata.quality] || 0) + 1
      })

      // Weekly progress (last 7 days)
      const weeklyProgress = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
        
        const dayConversations = conversations.filter(conv => 
          conv.createdAt >= dayStart && conv.createdAt < dayEnd
        ).length

        weeklyProgress.push({
          date: date.toISOString().split('T')[0],
          conversations: dayConversations
        })
      }

      return {
        totalConversations: conversations.length,
        averageDuration: Math.round(avgDuration),
        mostUsedPersona,
        conversationQualityDistribution: qualityDistribution,
        weeklyProgress
      }
    } catch (error) {
      console.error('Error fetching conversation analytics:', error)
      return {
        totalConversations: 0,
        averageDuration: 0,
        mostUsedPersona: null,
        conversationQualityDistribution: {},
        weeklyProgress: []
      }
    }
  }
}
