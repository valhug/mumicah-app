import { Schema, model, models, Document } from 'mongoose'

export interface NotificationDocument extends Document {
  _id: string
  recipient_id: string
  sender_id?: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  action_url?: string
  is_read: boolean
  is_archived: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  expires_at?: Date
  created_at: Date
  updated_at?: Date
}

const NotificationSchema = new Schema<NotificationDocument>({
  recipient_id: {
    type: String,
    required: true,
    index: true
  },
  sender_id: {
    type: String,
    index: true
  },
  type: {
    type: String,
    required: true,
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
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
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
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes
NotificationSchema.index({ recipient_id: 1, created_at: -1 })
NotificationSchema.index({ recipient_id: 1, is_read: 1 })
NotificationSchema.index({ recipient_id: 1, type: 1 })

// Static methods
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
  return await this.create({
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
}

export const NotificationModel = models.Notification || model<NotificationDocument>('Notification', NotificationSchema)

// Default export for compatibility
export default NotificationModel
