import { Schema, model, models, Document } from 'mongoose'
import type { NotificationDocument as NotificationDocumentType } from '../../types/database'

export interface NotificationDocument extends Omit<NotificationDocumentType, '_id'>, Document {
  _id: string
}

const NotificationSchema = new Schema<NotificationDocument>({
  recipient_id: {
    type: String,
    required: [true, 'Recipient ID is required'],
    index: true
  },
  sender_id: {
    type: String,
    index: true,
    default: undefined
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'friend_request', 'friend_accepted', 'message', 'mention', 'reaction',
      'comment', 'community_invite', 'achievement', 'lesson_reminder',
      'subscription_update', 'system_announcement', 'content_featured',
      'streak_reminder', 'study_reminder', 'community_post', 'resource_shared',
      'level_up', 'badge_earned', 'course_completed', 'weekly_report'
    ],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  action_url: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        // Allow relative URLs starting with / or full URLs
        return /^(\/|https?:\/\/)/.test(v)
      },
      message: 'Action URL must be a valid URL or relative path'
    }
  },
  is_read: {
    type: Boolean,
    default: false,
    index: true
  },
  is_archived: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true
  },
  expires_at: {
    type: Date,
    index: true,
    default: undefined
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: { createdAt: 'created_at' },
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

// Indexes for notification management and performance
NotificationSchema.index({ recipient_id: 1, created_at: -1 })
NotificationSchema.index({ recipient_id: 1, is_read: 1 })
NotificationSchema.index({ recipient_id: 1, type: 1 })
NotificationSchema.index({ type: 1, created_at: -1 })
NotificationSchema.index({ expires_at: 1 }, { sparse: true })
NotificationSchema.index({ sender_id: 1, created_at: -1 }, { sparse: true })

// Virtual for formatted time
NotificationSchema.virtual('timeAgo').get(function() {
  const now = new Date()
  const diff = now.getTime() - this.created_at.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return this.created_at.toLocaleDateString()
})

// Virtual to check if notification is expired
NotificationSchema.virtual('isExpired').get(function() {
  if (!this.expires_at) return false
  return new Date() > this.expires_at
})

// Method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.is_read = true
  return this.save()
}

// Method to mark as archived
NotificationSchema.methods.markAsArchived = function() {
  this.is_archived = true
  return this.save()
}

// Static method to create notification
NotificationSchema.statics.createNotification = async function(
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
  const notification = new this({
    recipient_id: recipientId,
    sender_id: options.senderId,
    type,
    title,
    message,
    data: options.data || {},
    action_url: options.actionUrl,
    priority: options.priority || 'normal',
    expires_at: options.expiresAt
  })
  
  return await notification.save()
}

// Static method to get unread notifications
NotificationSchema.statics.getUnreadNotifications = async function(
  userId: string,
  limit: number = 50
) {
  return await this.find({
    recipient_id: userId,
    is_read: false,
    is_archived: false,
    $or: [
      { expires_at: null },
      { expires_at: { $gt: new Date() } }
    ]
  })
  .sort({ created_at: -1 })
  .limit(limit)
  .lean()
}

// Static method to get notifications by type
NotificationSchema.statics.getNotificationsByType = async function(
  userId: string,
  type: string,
  limit: number = 20
) {
  return await this.find({
    recipient_id: userId,
    type,
    is_archived: false,
    $or: [
      { expires_at: null },
      { expires_at: { $gt: new Date() } }
    ]
  })
  .sort({ created_at: -1 })
  .limit(limit)
  .lean()
}

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function(userId: string) {
  return await this.updateMany(
    {
      recipient_id: userId,
      is_read: false
    },
    {
      $set: { is_read: true }
    }
  )
}

// Static method to get notification count
NotificationSchema.statics.getUnreadCount = async function(userId: string) {
  return await this.countDocuments({
    recipient_id: userId,
    is_read: false,
    is_archived: false,
    $or: [
      { expires_at: null },
      { expires_at: { $gt: new Date() } }
    ]
  })
}

// Static method to clean up expired notifications
NotificationSchema.statics.cleanupExpired = async function() {
  return await this.deleteMany({
    expires_at: { $lt: new Date() }
  })
}

// Static method to send bulk notifications
NotificationSchema.statics.sendBulkNotifications = async function(
  notifications: Array<{
    recipientId: string
    type: string
    title: string
    message: string
    senderId?: string
    data?: Record<string, any>
    actionUrl?: string
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    expiresAt?: Date
  }>
) {
  const notificationDocs = notifications.map(notification => ({
    recipient_id: notification.recipientId,
    sender_id: notification.senderId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data || {},
    action_url: notification.actionUrl,
    priority: notification.priority || 'normal',
    expires_at: notification.expiresAt
  }))
  
  return await this.insertMany(notificationDocs)
}

// TTL index to automatically delete old archived notifications
NotificationSchema.index({ created_at: 1 }, { 
  expireAfterSeconds: 90 * 24 * 60 * 60, // 90 days
  partialFilterExpression: { is_archived: true }
})

export const NotificationModel = models.Notification || model<NotificationDocument>('Notification', NotificationSchema)
