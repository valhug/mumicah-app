import { connectMongoDB } from '@/lib/mongodb'
import { NotificationModel } from '@/models/Notification'
import type { NotificationDocument } from '../../types/database'

export class NotificationService {
  async createNotification(
    recipientId: string,
    type: string,
    title: string,
    message: string,
    options: {
      senderId?: string
      data?: Record<string, any>
      actionUrl?: string
      priority?: 'low' | 'normal' | 'high' | 'urgent'
      expiresAt?: Date
    } = {}
  ) {
    await connectMongoDB()
    
    return await (NotificationModel as any).createNotification(
      recipientId,
      type,
      title,
      message,
      options
    )
  }

  async getUnreadNotifications(userId: string, limit = 50) {
    await connectMongoDB()
    
    return await (NotificationModel as any).getUnreadNotifications(userId, limit)
  }

  async getAllNotifications(
    userId: string,
    filters: {
      type?: string
      isRead?: boolean
      isArchived?: boolean
    } = {},
    limit = 50,
    skip = 0
  ) {
    await connectMongoDB()
    
    const query: any = { recipient_id: userId }
    
    if (filters.type) query.type = filters.type
    if (filters.isRead !== undefined) query.is_read = filters.isRead
    if (filters.isArchived !== undefined) query.is_archived = filters.isArchived
    
    // Don't show expired notifications
    query.$or = [
      { expires_at: null },
      { expires_at: { $gt: new Date() } }
    ]
    
    return await NotificationModel
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  }

  async markAsRead(notificationId: string, userId: string) {
    await connectMongoDB()
    
    const notification = await NotificationModel.findOneAndUpdate(
      { 
        _id: notificationId, 
        recipient_id: userId 
      },
      { is_read: true },
      { new: true }
    )
    
    if (!notification) {
      throw new Error('Notification not found or unauthorized')
    }
    
    return notification
  }

  async markAllAsRead(userId: string) {
    await connectMongoDB()
    
    return await (NotificationModel as any).markAllAsRead(userId)
  }

  async markAsArchived(notificationId: string, userId: string) {
    await connectMongoDB()
    
    const notification = await NotificationModel.findOneAndUpdate(
      { 
        _id: notificationId, 
        recipient_id: userId 
      },
      { is_archived: true },
      { new: true }
    )
    
    if (!notification) {
      throw new Error('Notification not found or unauthorized')
    }
    
    return notification
  }

  async getUnreadCount(userId: string) {
    await connectMongoDB()
    
    return await (NotificationModel as any).getUnreadCount(userId)
  }

  async deleteNotification(notificationId: string, userId: string) {
    await connectMongoDB()
    
    const result = await NotificationModel.deleteOne({
      _id: notificationId,
      recipient_id: userId
    })
    
    if (result.deletedCount === 0) {
      throw new Error('Notification not found or unauthorized')
    }
    
    return true
  }

  async getNotificationsByType(userId: string, type: string, limit = 20) {
    await connectMongoDB()
    
    return await (NotificationModel as any).getNotificationsByType(userId, type, limit)
  }

  async sendBulkNotifications(notifications: Array<{
    recipientId: string
    type: string
    title: string
    message: string
    senderId?: string
    data?: Record<string, any>
    actionUrl?: string
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    expiresAt?: Date
  }>) {
    await connectMongoDB()
    
    return await (NotificationModel as any).sendBulkNotifications(notifications)
  }

  async cleanupExpired() {
    await connectMongoDB()
    
    return await (NotificationModel as any).cleanupExpired()
  }

  // Convenience methods for common notification types
  async sendWelcomeNotification(userId: string) {
    return await this.createNotification(
      userId,
      'system_announcement',
      'Welcome to Mumicah!',
      'Start your language learning journey today. Explore communities and connect with learners.',
      {
        actionUrl: '/communities',
        priority: 'normal'
      }
    )
  }

  async sendStreakReminder(userId: string, streakDays: number) {
    return await this.createNotification(
      userId,
      'streak_reminder',
      `${streakDays}-day streak!`,
      `Keep your learning streak alive! Complete a lesson today to maintain your ${streakDays}-day streak.`,
      {
        actionUrl: '/learn',
        priority: 'normal',
        data: { streak_days: streakDays }
      }
    )
  }

  async sendAchievementNotification(
    userId: string, 
    achievementName: string,
    achievementDescription: string
  ) {
    return await this.createNotification(
      userId,
      'achievement',
      'Achievement Unlocked!',
      `Congratulations! You've earned the "${achievementName}" achievement: ${achievementDescription}`,
      {
        actionUrl: '/profile/achievements',
        priority: 'high',
        data: { achievement_name: achievementName }
      }
    )
  }

  async sendLessonReminderNotification(userId: string) {
    return await this.createNotification(
      userId,
      'lesson_reminder',
      'Time to Practice!',
      'You haven\'t practiced today. Spend a few minutes learning to keep up your progress.',
      {
        actionUrl: '/learn',
        priority: 'normal'
      }
    )
  }

  async sendCommunityInviteNotification(
    userId: string,
    communityName: string,
    inviterId: string,
    communityId: string
  ) {
    return await this.createNotification(
      userId,
      'community_invite',
      'Community Invitation',
      `You've been invited to join the "${communityName}" community!`,
      {
        senderId: inviterId,
        actionUrl: `/communities/${communityId}`,
        priority: 'normal',
        data: { community_id: communityId, community_name: communityName }
      }
    )
  }

  async sendFriendRequestNotification(
    userId: string,
    requesterName: string,
    requesterId: string
  ) {
    return await this.createNotification(
      userId,
      'friend_request',
      'Friend Request',
      `${requesterName} wants to connect with you!`,
      {
        senderId: requesterId,
        actionUrl: `/profile/${requesterId}`,
        priority: 'normal',
        data: { requester_id: requesterId, requester_name: requesterName }
      }
    )
  }

  async sendWeeklyProgressReport(
    userId: string,
    stats: {
      lessonsCompleted: number
      timeSpent: number
      streakDays: number
    }
  ) {
    const message = `This week: ${stats.lessonsCompleted} lessons completed, ${Math.round(stats.timeSpent / 60)} minutes practiced. Current streak: ${stats.streakDays} days!`
    
    return await this.createNotification(
      userId,
      'weekly_report',
      'Weekly Progress Report',
      message,
      {
        actionUrl: '/progress',
        priority: 'low',
        data: stats,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 1 week
      }
    )
  }
}
