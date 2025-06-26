import { Schema, model, models, Document } from 'mongoose'
import type { ConversationDocument as ConversationDocumentType, Message } from '../types/database'

export interface ConversationDocument extends Omit<ConversationDocumentType, '_id'>, Document {
  _id: string
}

const MessageSchema = new Schema<Message>({
  sender_id: {
    type: String,
    required: [true, 'Sender ID is required'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'audio', 'file'],
    default: 'text'
  },
  media_url: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'Media URL must be a valid URL'
    }
  },
  reply_to: {
    type: Schema.Types.ObjectId,
    default: undefined
  },
  edited_at: {
    type: Date,
    default: undefined
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { _id: true })

const ConversationSchema = new Schema<ConversationDocument>({
  participants: [{
    type: String,
    required: true,
    index: true
  }],
  type: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    default: undefined
  },
  messages: [MessageSchema],
  last_message_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  is_archived: {
    type: Boolean,
    default: false,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      // Transform message IDs to strings
      if (ret.messages) {
        ret.messages = ret.messages.map((msg: any) => ({
          ...msg,
          id: msg._id.toString(),
          _id: undefined
        }))
      }
      return ret
    }
  }
})

// Indexes for better query performance
ConversationSchema.index({ participants: 1, last_message_at: -1 })
ConversationSchema.index({ 'messages.sender_id': 1 })
ConversationSchema.index({ type: 1, is_archived: 1 })

// Virtual for message count
ConversationSchema.virtual('messageCount').get(function() {
  return this.messages?.length || 0
})

// Virtual for last message
ConversationSchema.virtual('lastMessage').get(function() {
  if (!this.messages || this.messages.length === 0) return null
  return this.messages[this.messages.length - 1]
})

// Method to add a message
ConversationSchema.methods.addMessage = function(messageData: Partial<Message>) {
  const message = {
    ...messageData,
    created_at: new Date()
  }
  
  this.messages.push(message)
  this.last_message_at = new Date()
  
  return this.save()
}

// Method to get messages for a user (with pagination)
ConversationSchema.methods.getMessagesForUser = function(
  userId: string, 
  limit: number = 50, 
  before?: Date
) {
  // Check if user is a participant
  if (!this.participants.includes(userId)) {
    throw new Error('User is not a participant in this conversation')
  }
  
  let messages = this.messages || []
  
  // Filter messages before a certain date if specified
  if (before) {
    messages = messages.filter((msg: any) => msg.created_at < before)
  }
  
  // Sort by creation date (newest first) and limit
  return messages
    .sort((a: any, b: any) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, limit)
}

// Method to mark messages as read (for future implementation)
ConversationSchema.methods.markAsRead = function(userId: string, messageId?: string) {
  // This could be extended to track read status per user
  // For now, we'll just update the conversation timestamp
  this.updated_at = new Date()
  return this.save()
}

// Pre-save middleware
ConversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.last_message_at = new Date()
  }
  next()
})

// Validation for participants
ConversationSchema.pre('save', function(next) {
  if (this.type === 'direct' && this.participants.length !== 2) {
    next(new Error('Direct conversations must have exactly 2 participants'))
  } else if (this.type === 'group' && this.participants.length < 2) {
    next(new Error('Group conversations must have at least 2 participants'))
  } else {
    next()
  }
})

export const ConversationModel = models.Conversation || model<ConversationDocument>('Conversation', ConversationSchema)
