import { createClient } from '@/lib/supabase/server'
import { connectMongoDB } from '@/lib/mongodb'
import { ActivityModel } from '@/models/Activity'
import { NotificationModel } from '@/models/Notification'

// Use any for now to avoid type issues
type Profile = any
type ProfileInsert = any
type ProfileUpdate = any

export class UserService {
  private async getSupabase() {
    return await createClient()
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // No rows found
      throw error
    }
    
    return data
  }

  async createProfile(profileData: ProfileInsert): Promise<Profile> {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) throw error
    
    // Log activity in MongoDB
    await this.logActivity(profileData.id!, 'profile_created', undefined, undefined, {
      created_fields: Object.keys(profileData)
    })
    
    return data
  }

  async updateProfile(userId: string, profileData: ProfileUpdate): Promise<Profile> {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    
    // Log activity in MongoDB
    await this.logActivity(userId, 'profile_updated', undefined, undefined, {
      updated_fields: Object.keys(profileData)
    })
    
    return data
  }

  async getUserProgress(userId: string) {
    const supabase = await this.getSupabase()
    
    const { data: progress, error } = await supabase
      .from('progress')
      .select(`
        *,
        lessons:lesson_id (
          title,
          learning_path_id,
          learning_paths:learning_path_id (
            title,
            language
          )
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    
    return progress
  }

  async getSubscription(userId: string) {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    
    return data
  }
  async getUserActivity(userId: string, limit = 20, before?: Date) {
    await connectMongoDB()
    
    return (ActivityModel as any).getUserActivity(userId, limit, before)
  }

  async getUserStats(userId: string) {
    const supabase = await this.getSupabase()
    await connectMongoDB()
    
    // Get basic stats from Supabase
    const [progressData, subscriptionData] = await Promise.all([
      supabase
        .from('progress')
        .select('status, score')
        .eq('user_id', userId),
      this.getSubscription(userId)
    ])
    
    const progress = progressData.data || []
      // Calculate progress stats
    const completedLessons = progress.filter((p: any) => p.status === 'completed').length
    const averageScore = progress.length > 0 
      ? progress.reduce((sum: any, p: any) => sum + (p.score || 0), 0) / progress.length 
      : 0
    
    // Get activity stats from MongoDB
    const activityStats = await (ActivityModel as any).getActivityAnalytics(
      userId,
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      new Date()
    )
    
    return {
      lessons: {
        completed: completedLessons,
        total: progress.length,
        averageScore: Math.round(averageScore)
      },
      subscription: subscriptionData,
      recentActivity: activityStats
    }
  }

  async searchUsers(query: string, limit = 20) {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bio, native_language, learning_languages')
      .or(`display_name.ilike.%${query}%, bio.ilike.%${query}%`)
      .limit(limit)
    
    if (error) throw error
    
    return data
  }

  async followUser(followerId: string, followeeId: string) {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        followee_id: followeeId
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Log activities
    await Promise.all([
      this.logActivity(followerId, 'friend_added', 'user', followeeId),
      this.createNotification(
        followeeId,
        'friend_request',
        'New Follower',
        'Someone started following you!',
        { senderId: followerId }
      )
    ])
    
    return data
  }

  async unfollowUser(followerId: string, followeeId: string) {
    const supabase = await this.getSupabase()
    
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId)
    
    if (error) throw error
    
    // Log activity
    await this.logActivity(followerId, 'friend_removed', 'user', followeeId)
  }

  async getFollowers(userId: string) {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        profiles:follower_id (
          id, display_name, avatar_url, bio
        )
      `)
      .eq('followee_id', userId)
    
    if (error) throw error
    
    return data
  }

  async getFollowing(userId: string) {
    const supabase = await this.getSupabase()
    
    const { data, error } = await supabase
      .from('follows')
      .select(`
        followee_id,
        profiles:followee_id (
          id, display_name, avatar_url, bio
        )
      `)
      .eq('follower_id', userId)
    
    if (error) throw error
    
    return data
  }

  private async logActivity(
    userId: string,
    action: string,
    targetType?: string,
    targetId?: string,
    metadata?: Record<string, any>
  ) {
    try {
      await connectMongoDB()
      await (ActivityModel as any).logActivity(userId, action, targetType, targetId, metadata)
    } catch (error) {
      console.error('Failed to log activity:', error)
      // Don't throw error for activity logging failures
    }
  }

  private async createNotification(
    recipientId: string,
    type: string,
    title: string,
    message: string,
    options: {
      senderId?: string
      data?: Record<string, any>
      actionUrl?: string
      priority?: 'low' | 'normal' | 'high' | 'urgent'
    } = {}
  ) {    try {
      await connectMongoDB()
      await (NotificationModel as any).createNotification(
        recipientId,
        type,
        title,
        message,
        options
      )
    } catch (error) {
      console.error('Failed to create notification:', error)
      // Don't throw error for notification failures
    }
  }
}
