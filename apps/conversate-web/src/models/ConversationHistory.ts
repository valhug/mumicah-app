import { Schema, model, models } from 'mongoose'
import { PersonaId } from '@/config/langchain'

export interface IMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    wordCount: number
    corrections?: string[]
    feedback?: string
    difficulty?: 'easy' | 'medium' | 'hard'
  }
}

export interface IConversationHistory {
  id: string
  userId: string
  personaId: PersonaId
  title?: string
  messages: IMessage[]
  metadata: {
    targetLanguage: string
    userProficiencyLevel: string
    totalWords: number
    totalMessages: number
    duration: number // in minutes
    topics: string[]
    corrections: number
    quality: 'poor' | 'fair' | 'good' | 'excellent'
  }
  status: 'active' | 'completed' | 'archived'
  startedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  id: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    wordCount: {
      type: Number,
      min: 0
    },
    corrections: [{
      type: String
    }],
    feedback: {
      type: String
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  }
})

const ConversationHistorySchema = new Schema<IConversationHistory>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  personaId: {
    type: String,
    enum: ['maya', 'alex', 'luna', 'diego', 'priya', 'jean-claude'],
    required: true,
    index: true
  },
  title: {
    type: String,
    maxlength: 200
  },
  messages: [MessageSchema],
  metadata: {
    targetLanguage: {
      type: String,
      required: true
    },
    userProficiencyLevel: {
      type: String,
      required: true
    },
    totalWords: {
      type: Number,
      default: 0,
      min: 0
    },
    totalMessages: {
      type: Number,
      default: 0,
      min: 0
    },
    duration: {
      type: Number,
      default: 0,
      min: 0
    },
    topics: [{
      type: String
    }],
    corrections: {
      type: Number,
      default: 0,
      min: 0
    },
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: 'fair'
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes for performance
ConversationHistorySchema.index({ userId: 1, createdAt: -1 })
ConversationHistorySchema.index({ personaId: 1 })
ConversationHistorySchema.index({ status: 1 })
ConversationHistorySchema.index({ 'metadata.targetLanguage': 1 })

export const ConversationHistory = models.ConversationHistory || model<IConversationHistory>('ConversationHistory', ConversationHistorySchema)
