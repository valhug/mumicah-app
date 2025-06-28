import { PersonaId } from '@/config/langchain'

// Simple in-memory user data store (for development)
// In production, this would be stored in a database
const userStore = new Map<string, UserData>()

export interface UserData {
  id: string
  email: string
  name: string
  preferences: {
    targetLanguage: string
    nativeLanguage: string
    proficiencyLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
    favoritePersonas: PersonaId[]
    defaultPersona: PersonaId
    learningGoals: string[]
  }
  progress: {
    totalConversations: number
    totalWords: number
    streakDays: number
    weeklyMinutes: number
    lastActiveDate: string
  }
  settings: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    voiceEnabled: boolean
  }
  conversationHistory: ConversationRecord[]
}

export interface ConversationRecord {
  id: string
  personaId: PersonaId
  messages: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    metadata?: {
      corrections?: string[]
      vocabulary?: string[]
      culturalNotes?: string[]
    }
  }[]
  startedAt: string
  lastMessageAt: string
  isActive: boolean
}

export class SimpleUserService {
  /**
   * Get or create user data
   */
  async getOrCreateUser(userId: string, email: string, name: string): Promise<UserData> {
    let userData = userStore.get(userId)
    
    if (!userData) {
      userData = {
        id: userId,
        email,
        name,
        preferences: {
          targetLanguage: 'Spanish',
          nativeLanguage: 'English',
          proficiencyLevel: 'intermediate',
          favoritePersonas: ['maya'],
          defaultPersona: 'maya',
          learningGoals: ['General conversation practice', 'Build confidence']
        },
        progress: {
          totalConversations: 0,
          totalWords: 0,
          streakDays: 0,
          weeklyMinutes: 0,
          lastActiveDate: new Date().toISOString()
        },
        settings: {
          theme: 'system',
          notifications: true,
          voiceEnabled: true
        },
        conversationHistory: []
      }
      
      userStore.set(userId, userData)
      console.log(`✨ Created new user profile for: ${name} (${userId})`)
    } else {
      // Update basic info
      userData.name = name
      userData.email = email
    }
    
    return userData
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: Partial<UserData['preferences']>): Promise<UserData | null> {
    const userData = userStore.get(userId)
    if (!userData) return null
    
    userData.preferences = { ...userData.preferences, ...preferences }
    userStore.set(userId, userData)
    
    return userData
  }

  /**
   * Start a new conversation session
   */
  async startConversation(userId: string, personaId: PersonaId): Promise<ConversationRecord> {
    const userData = userStore.get(userId)
    if (!userData) throw new Error('User not found')
    
    // End any active conversations
    userData.conversationHistory.forEach(conv => {
      if (conv.isActive) {
        conv.isActive = false
      }
    })
    
    const newConversation: ConversationRecord = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      personaId,
      messages: [],
      startedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      isActive: true
    }
    
    userData.conversationHistory.unshift(newConversation)
    userStore.set(userId, userData)
    
    console.log(`🎯 Started new conversation: ${newConversation.id} with ${personaId}`)
    return newConversation
  }

  /**
   * Add message to active conversation
   */
  async addMessage(
    userId: string, 
    role: 'user' | 'assistant', 
    content: string, 
    metadata?: {
      corrections?: string[]
      vocabulary?: string[]
      culturalNotes?: string[]
      suggestedTopics?: string[]
    }
  ): Promise<ConversationRecord | null> {
    const userData = userStore.get(userId)
    if (!userData) return null
    
    const activeConversation = userData.conversationHistory.find(conv => conv.isActive)
    if (!activeConversation) return null
    
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    activeConversation.messages.push({
      id: messageId,
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata
    })
    
    activeConversation.lastMessageAt = new Date().toISOString()
    
    // Update user progress for user messages
    if (role === 'user') {
      const wordCount = content.split(' ').length
      userData.progress.totalWords += wordCount
      userData.progress.lastActiveDate = new Date().toISOString()
    }
    
    userStore.set(userId, userData)
    return activeConversation
  }

  /**
   * Get active conversation
   */
  async getActiveConversation(userId: string): Promise<ConversationRecord | null> {
    const userData = userStore.get(userId)
    if (!userData) return null
    
    return userData.conversationHistory.find(conv => conv.isActive) || null
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId: string): Promise<{
    user: UserData | null
    analytics: {
      totalConversations: number
      totalMessages: number
      averageMessagesPerConversation: number
      favoritePersona: PersonaId | null
      weeklyActivity: number
    }
  }> {
    const userData = userStore.get(userId)
    if (!userData) {
      return {
        user: null,
        analytics: {
          totalConversations: 0,
          totalMessages: 0,
          averageMessagesPerConversation: 0,
          favoritePersona: null,
          weeklyActivity: 0
        }
      }
    }
    
    const totalMessages = userData.conversationHistory.reduce(
      (sum, conv) => sum + conv.messages.length, 0
    )
    
    const personaCounts = userData.conversationHistory.reduce((counts, conv) => {
      counts[conv.personaId] = (counts[conv.personaId] || 0) + 1
      return counts
    }, {} as Record<PersonaId, number>)
    
    const favoritePersona = Object.entries(personaCounts).reduce(
      (max, [persona, count]) => count > (max[1] || 0) ? [persona, count] : max,
      ['', 0] as [string, number]
    )[0] as PersonaId || null
    
    return {
      user: userData,
      analytics: {
        totalConversations: userData.conversationHistory.length,
        totalMessages,
        averageMessagesPerConversation: totalMessages / Math.max(userData.conversationHistory.length, 1),
        favoritePersona,
        weeklyActivity: userData.progress.weeklyMinutes
      }
    }
  }

  /**
   * End active conversation
   */
  async endConversation(userId: string): Promise<ConversationRecord | null> {
    const userData = userStore.get(userId)
    if (!userData) return null
    
    const activeConversation = userData.conversationHistory.find(conv => conv.isActive)
    if (!activeConversation) return null
    
    activeConversation.isActive = false
    userData.progress.totalConversations++
    
    userStore.set(userId, userData)
    console.log(`✅ Ended conversation: ${activeConversation.id}`)
    
    return activeConversation
  }
}
