import { IUserProfile, UserProfile } from '@/models/UserProfile'
import { IUserProgress, UserProgress } from '@/models/UserProgress'
import { IConversationHistory, ConversationHistory } from '@/models/ConversationHistory'
import { PersonaId } from '@/config/langchain'

export class DatabaseUserService {
  // User Profile Operations
  async createUserProfile(userData: Partial<IUserProfile>): Promise<IUserProfile> {
    try {
      const userProfile = new UserProfile(userData)
      return await userProfile.save()
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw new Error('Failed to create user profile')
    }
  }

  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    try {
      return await UserProfile.findOne({ userId }).lean() as IUserProfile | null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<IUserProfile>): Promise<IUserProfile | null> {
    try {
      return await UserProfile.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: new Date() },
        { new: true, upsert: true }
      ).lean() as IUserProfile | null
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  }

  // User Progress Operations
  async getUserProgress(userId: string): Promise<IUserProgress | null> {
    try {
      return await UserProgress.findOne({ userId }).lean() as IUserProgress | null
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return null
    }
  }

  async updateUserProgress(userId: string, progressData: Partial<IUserProgress>): Promise<IUserProgress> {
    try {
      const updated = await UserProgress.findOneAndUpdate(
        { userId },
        { 
          ...progressData, 
          lastActiveDate: new Date(),
          updatedAt: new Date() 
        },
        { new: true, upsert: true }
      ).lean() as IUserProgress

      if (!updated) {
        throw new Error('Failed to update user progress')
      }

      return updated
    } catch (error) {
      console.error('Error updating user progress:', error)
      throw new Error('Failed to update user progress')
    }
  }

  async incrementUserStats(userId: string, stats: {
    conversations?: number
    words?: number
    minutes?: number
  }): Promise<void> {
    try {
      const updateData: Record<string, unknown> = { lastActiveDate: new Date() }
      
      if (stats.conversations) {
        updateData.$inc = { ...updateData.$inc as Record<string, number>, totalConversations: stats.conversations }
      }
      if (stats.words) {
        updateData.$inc = { ...updateData.$inc as Record<string, number>, totalWords: stats.words }
      }
      if (stats.minutes) {
        updateData.$inc = { ...updateData.$inc as Record<string, number>, totalMinutes: stats.minutes }
      }

      await UserProgress.findOneAndUpdate(
        { userId },
        updateData,
        { upsert: true }
      ).lean()
    } catch (error) {
      console.error('Error incrementing user stats:', error)
      throw new Error('Failed to update user statistics')
    }
  }

  // Conversation History Operations
  async saveConversation(conversationData: IConversationHistory): Promise<IConversationHistory> {
    try {
      const conversation = new ConversationHistory(conversationData)
      return await conversation.save()
    } catch (error) {
      console.error('Error saving conversation:', error)
      throw new Error('Failed to save conversation')
    }
  }

  async getUserConversations(
    userId: string, 
    options: {
      limit?: number
      offset?: number
      personaId?: PersonaId
      status?: 'active' | 'completed' | 'archived'
    } = {}
  ): Promise<IConversationHistory[]> {
    try {
      const { limit = 20, offset = 0, personaId, status } = options
      
      const query: Record<string, unknown> = { userId }
      if (personaId) query.personaId = personaId
      if (status) query.status = status

      return await ConversationHistory
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean() as IConversationHistory[]
    } catch (error) {
      console.error('Error fetching user conversations:', error)
      return []
    }
  }

  async getConversationById(conversationId: string, userId: string): Promise<IConversationHistory | null> {
    try {
      return await ConversationHistory.findOne({ 
        id: conversationId, 
        userId 
      }).lean() as IConversationHistory | null
    } catch (error) {
      console.error('Error fetching conversation:', error)
      return null
    }
  }

  // Analytics Operations
  async getUserAnalytics(userId: string): Promise<{
    totalConversations: number
    totalWords: number
    totalMinutes: number
    streakDays: number
    favoritePersona?: PersonaId
    weeklyStats: {
      conversationsThisWeek: number
      wordsThisWeek: number
      minutesThisWeek: number
    }
    monthlyStats: {
      conversationsThisMonth: number
      wordsThisMonth: number
      minutesThisMonth: number
    }
  }> {
    try {
      const progress = await this.getUserProgress(userId)
      
      // Calculate weekly stats
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const weeklyConversations = await ConversationHistory.countDocuments({
        userId,
        createdAt: { $gte: weekAgo }
      })

      // Calculate monthly stats
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      
      const monthlyConversations = await ConversationHistory.countDocuments({
        userId,
        createdAt: { $gte: monthAgo }
      })

      // Aggregate weekly and monthly word/minute counts
      const weeklyStats = await ConversationHistory.aggregate([
        { $match: { userId, createdAt: { $gte: weekAgo } } },
        { $group: { 
          _id: null, 
          totalWords: { $sum: '$metadata.totalWords' },
          totalMinutes: { $sum: '$metadata.duration' }
        }}
      ])

      const monthlyStats = await ConversationHistory.aggregate([
        { $match: { userId, createdAt: { $gte: monthAgo } } },
        { $group: { 
          _id: null, 
          totalWords: { $sum: '$metadata.totalWords' },
          totalMinutes: { $sum: '$metadata.duration' }
        }}
      ])

      return {
        totalConversations: progress?.totalConversations || 0,
        totalWords: progress?.totalWords || 0,
        totalMinutes: progress?.totalMinutes || 0,
        streakDays: progress?.streakDays || 0,
        favoritePersona: progress?.favoritePersona,
        weeklyStats: {
          conversationsThisWeek: weeklyConversations,
          wordsThisWeek: weeklyStats[0]?.totalWords || 0,
          minutesThisWeek: weeklyStats[0]?.totalMinutes || 0
        },
        monthlyStats: {
          conversationsThisMonth: monthlyConversations,
          wordsThisMonth: monthlyStats[0]?.totalWords || 0,
          minutesThisMonth: monthlyStats[0]?.totalMinutes || 0
        }
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      // Return default analytics if database fails
      return {
        totalConversations: 0,
        totalWords: 0,
        totalMinutes: 0,
        streakDays: 0,
        weeklyStats: {
          conversationsThisWeek: 0,
          wordsThisWeek: 0,
          minutesThisWeek: 0
        },
        monthlyStats: {
          conversationsThisMonth: 0,
          wordsThisMonth: 0,
          minutesThisMonth: 0
        }
      }
    }
  }

  // User Management
  async deleteUserData(userId: string): Promise<void> {
    try {
      await Promise.all([
        UserProfile.deleteOne({ userId }),
        UserProgress.deleteOne({ userId }),
        ConversationHistory.deleteMany({ userId })
      ])
    } catch (error) {
      console.error('Error deleting user data:', error)
      throw new Error('Failed to delete user data')
    }
  }
}
