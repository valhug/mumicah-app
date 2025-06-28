import { connectToDatabase } from '@/lib/mongoose-wrapper'
import { PersonaId } from '@/config/langchain'
import { v4 as uuidv4 } from 'uuid'

// Simplified interfaces for now
export interface SimpleUserProfile {
  userId: string
  email: string
  name?: string
  image?: string
  preferences: {
    targetLanguage: string
    nativeLanguage: string
    proficiencyLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
    learningGoals: string[]
    defaultPersona: PersonaId
  }
  progress: {
    totalConversations: number
    totalWords: number
    streakDays: number
    lastActiveDate: Date
  }
}

export interface SimpleMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    persona?: PersonaId
    language?: string
    corrections?: string[]
    vocabulary?: string[]
    culturalNotes?: string[]
  }
}

export interface SimpleConversationSession {
  userId: string
  sessionId: string
  persona: PersonaId
  targetLanguage: string
  userNativeLanguage: string
  proficiencyLevel: string
  messages: SimpleMessage[]
  learningGoals: string[]
  currentTopic?: string
  isActive: boolean
  startedAt: Date
  lastMessageAt: Date
}

export class SimpleUserConversationService {
  private userProfiles: Map<string, SimpleUserProfile> = new Map()
  private conversationSessions: Map<string, SimpleConversationSession> = new Map()

  /**
   * Get or create user profile (in-memory for now)
   */
  async getOrCreateUserProfile(
    userId: string, 
    email: string, 
    name?: string, 
    image?: string
  ): Promise<SimpleUserProfile> {
    try {
      await connectToDatabase()
    } catch (error) {
      console.warn('MongoDB connection failed, using in-memory storage:', error)
    }

    let userProfile = this.userProfiles.get(userId)
    
    if (!userProfile) {
      userProfile = {
        userId,
        email,
        name,
        image,
        preferences: {
          targetLanguage: 'Spanish',
          nativeLanguage: 'English',
          proficiencyLevel: 'beginner',
          learningGoals: ['General conversation practice'],
          defaultPersona: 'maya'
        },
        progress: {
          totalConversations: 0,
          totalWords: 0,
          streakDays: 0,
          lastActiveDate: new Date()
        }
      }
      
      this.userProfiles.set(userId, userProfile)
      console.log('Created new user profile for:', userId)
    } else {
      // Update profile with latest info
      userProfile.name = name || userProfile.name
      userProfile.image = image || userProfile.image
    }
    
    return userProfile
  }

  /**
   * Create a new conversation session
   */
  async createConversationSession(
    userId: string,
    persona: PersonaId,
    targetLanguage: string,
    userNativeLanguage: string,
    proficiencyLevel: string,
    learningGoals: string[] = []
  ): Promise<SimpleConversationSession> {
    
    // End any existing active sessions for this user
    for (const [sessionId, session] of this.conversationSessions.entries()) {
      if (session.userId === userId && session.isActive) {
        session.isActive = false
        console.log('Ended previous session:', sessionId)
      }
    }
    
    const sessionId = uuidv4()
    
    const session: SimpleConversationSession = {
      userId,
      sessionId,
      persona,
      targetLanguage,
      userNativeLanguage,
      proficiencyLevel,
      messages: [],
      learningGoals,
      isActive: true,
      startedAt: new Date(),
      lastMessageAt: new Date()
    }
    
    this.conversationSessions.set(sessionId, session)
    console.log('Created new conversation session:', sessionId, 'for user:', userId)
    
    return session
  }

  /**
   * Get active conversation session for user
   */
  async getActiveConversationSession(userId: string): Promise<SimpleConversationSession | null> {
    for (const session of this.conversationSessions.values()) {
      if (session.userId === userId && session.isActive) {
        return session
      }
    }
    return null
  }

  /**
   * Add message to conversation session
   */
  async addMessageToSession(
    sessionId: string,
    message: Omit<SimpleMessage, 'id' | 'timestamp'>
  ): Promise<SimpleConversationSession | null> {
    const session = this.conversationSessions.get(sessionId)
    
    if (!session || !session.isActive) {
      console.warn('Session not found or not active:', sessionId)
      return null
    }

    const messageWithId: SimpleMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    }
    
    session.messages.push(messageWithId)
    session.lastMessageAt = new Date()
    
    // Update user's progress if it's a user message
    if (message.role === 'user') {
      await this.updateUserProgress(session.userId, message.content)
    }
    
    console.log('Added message to session:', sessionId, 'Message role:', message.role)
    return session
  }

  /**
   * Get conversation history for user
   */
  async getConversationHistory(
    userId: string,
    limit: number = 10
  ): Promise<SimpleConversationSession[]> {
    const userSessions = Array.from(this.conversationSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
      .slice(0, limit)
    
    return userSessions
  }

  /**
   * Update user progress based on conversation activity
   */
  private async updateUserProgress(userId: string, userMessage: string): Promise<void> {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) return

    const wordCount = userMessage.split(' ').length
    userProfile.progress.totalWords += wordCount
    userProfile.progress.lastActiveDate = new Date()
    
    console.log('Updated user progress:', userId, 'Words added:', wordCount)
  }

  /**
   * Get user learning analytics
   */
  async getUserAnalytics(userId: string): Promise<{
    profile: SimpleUserProfile | null
    recentSessions: SimpleConversationSession[]
    weeklyStats: {
      conversationsThisWeek: number
      messagesThisWeek: number
      wordsThisWeek: number
    }
  }> {
    const profile = this.userProfiles.get(userId) || null
    
    // Get sessions from the last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const recentSessions = Array.from(this.conversationSessions.values())
      .filter(session => 
        session.userId === userId && 
        session.lastMessageAt >= weekAgo
      )
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
      .slice(0, 5)
    
    // Calculate weekly stats
    const weeklyStats = {
      conversationsThisWeek: recentSessions.filter(s => !s.isActive).length,
      messagesThisWeek: recentSessions.reduce((sum, s) => sum + s.messages.length, 0),
      wordsThisWeek: recentSessions.reduce((sum, s) => 
        sum + s.messages
          .filter(m => m.role === 'user')
          .reduce((wordSum, m) => wordSum + m.content.split(' ').length, 0), 0
      )
    }
    
    return {
      profile,
      recentSessions,
      weeklyStats
    }
  }

  /**
   * End conversation session
   */
  async endConversationSession(sessionId: string): Promise<SimpleConversationSession | null> {
    const session = this.conversationSessions.get(sessionId)
    
    if (!session) {
      return null
    }

    session.isActive = false
    
    // Update user profile progress
    const userProfile = this.userProfiles.get(session.userId)
    if (userProfile) {
      userProfile.progress.totalConversations += 1
    }
    
    console.log('Ended conversation session:', sessionId)
    return session
  }
}
