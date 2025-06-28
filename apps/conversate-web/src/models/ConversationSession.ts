import { Schema, model, models } from 'mongoose'
import { PersonaId } from '@/config/langchain'

export interface IConversationSession {
  sessionId: string
  userId: string
  personaId: PersonaId
  context: {
    targetLanguage: string
    userNativeLanguage: string
    proficiencyLevel: string
    learningGoals: string[]
    currentTopic: string
  }
  recentMessages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  sessionMetrics: {
    messagesCount: number
    wordsSpoken: number
    startTime: Date
    lastActivity: Date
    duration: number // in seconds
  }
  status: 'active' | 'paused' | 'ended'
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

const ConversationSessionSchema = new Schema<IConversationSession>({
  sessionId: {
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
    required: true
  },
  context: {
    targetLanguage: {
      type: String,
      required: true
    },
    userNativeLanguage: {
      type: String,
      required: true
    },
    proficiencyLevel: {
      type: String,
      required: true
    },
    learningGoals: [{
      type: String
    }],
    currentTopic: {
      type: String,
      required: true
    }
  },
  recentMessages: [{
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
    }
  }],
  sessionMetrics: {
    messagesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    wordsSpoken: {
      type: Number,
      default: 0,
      min: 0
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended'],
    default: 'active',
    index: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from creation
    index: { expireAfterSeconds: 0 } // TTL index for automatic cleanup
  }
}, {
  timestamps: true
})

// Indexes for performance and cleanup
ConversationSessionSchema.index({ userId: 1, status: 1 })
ConversationSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
ConversationSessionSchema.index({ 'sessionMetrics.lastActivity': 1 })

export const ConversationSession = models.ConversationSession || model<IConversationSession>('ConversationSession', ConversationSessionSchema)
