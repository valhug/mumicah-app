import { Schema, model, models, Document } from 'mongoose'

export interface ConversationDocument extends Document {
  _id: string
  participants: string[]
  type: 'direct' | 'group'
  title?: string
  messages: Array<{
    senderId: string
    content: string
    timestamp: Date
    type: 'text' | 'image' | 'audio' | 'file'
    metadata?: Record<string, unknown>
  }>
  lastMessageAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema({
  senderId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['text', 'image', 'audio', 'file'],
    default: 'text'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, { _id: true })

const ConversationSchema = new Schema<ConversationDocument>({
  participants: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct',
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  messages: [MessageSchema],
  lastMessageAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ lastMessageAt: -1 })
ConversationSchema.index({ type: 1, isActive: 1 })

export default models.Conversation || model<ConversationDocument>('Conversation', ConversationSchema)
