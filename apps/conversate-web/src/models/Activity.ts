import { Schema, model, models, Document } from 'mongoose'
import type { ActivityDocument as ActivityDocumentType } from '../../types/database'

export interface ActivityDocument extends Omit<ActivityDocumentType, '_id'>, Document {
  _id: string
}

const ActivitySchema = new Schema<ActivityDocument>({
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'profile_updated', 'post_created', 'comment_added', 'reaction_added',
      'community_joined', 'community_left', 'lesson_completed', 'achievement_earned',
      'friend_added', 'message_sent', 'conversation_started', 'login', 'logout',
      'resource_shared', 'resource_completed', 'study_session_started', 'study_session_completed',
      'streak_achieved', 'level_up', 'badge_earned', 'quiz_completed', 'pronunciation_practiced'
    ],
    index: true
  },
  target_type: {
    type: String,
    enum: ['post', 'comment', 'community', 'user', 'lesson', 'conversation', 'achievement', 'resource', 'quiz'],
    required: function(this: ActivityDocument) {
      return this.target_id != null
    }
  },
  target_id: {
    type: String,
    validate: {
      validator: function(this: ActivityDocument, value: string) {
        // If target_id is provided, target_type must also be provided
        if (value && !this.target_type) {
          return false
        }
        return true
      },
      message: 'target_type is required when target_id is provided'
    }
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ip_address: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        // Basic IP validation (IPv4 and IPv6)
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
        return ipv4Regex.test(v) || ipv6Regex.test(v)
      },
      message: 'Invalid IP address format'
    }
  },
  user_agent: {
    type: String,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  }
}, {
  timestamps: { createdAt: 'timestamp' },
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

// Indexes for activity tracking and analytics
ActivitySchema.index({ user_id: 1, timestamp: -1 })
ActivitySchema.index({ action: 1, timestamp: -1 })
ActivitySchema.index({ target_type: 1, target_id: 1 })
ActivitySchema.index({ user_id: 1, action: 1, timestamp: -1 })

// Virtual for formatted timestamp
ActivitySchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toISOString()
})

// Static method to log activity
ActivitySchema.statics.logActivity = async function(
  userId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) {
  const activity = new this({
    user_id: userId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata: metadata || {},
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date()
  })
  
  return await activity.save()
}

// Static method to get user activity feed
ActivitySchema.statics.getUserActivity = async function(
  userId: string,
  limit: number = 50,
  before?: Date,
  actions?: string[]
) {
  const query: any = { user_id: userId }
  
  if (before) {
    query.timestamp = { $lt: before }
  }
  
  if (actions && actions.length > 0) {
    query.action = { $in: actions }
  }
  
  return await this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean()
}

// Static method to get activity analytics
ActivitySchema.statics.getActivityAnalytics = async function(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  return await this.aggregate([
    {
      $match: {
        user_id: userId,
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ])
}

// Static method to get daily activity counts
ActivitySchema.statics.getDailyActivityCounts = async function(
  userId: string,
  days: number = 30
) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return await this.aggregate([
    {
      $match: {
        user_id: userId,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$timestamp'
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ])
}

// TTL index to automatically delete old activities (optional - keep 1 year)
ActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 })

export const ActivityModel = models.Activity || model<ActivityDocument>('Activity', ActivitySchema)
