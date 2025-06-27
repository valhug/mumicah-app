import { Schema, model, models, Document } from 'mongoose'

export interface ActivityDocument extends Document {
  _id: string
  userId: string
  type: 'conversation' | 'lesson' | 'quiz' | 'achievement'
  description: string
  metadata?: Record<string, unknown>
  xpGained?: number
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new Schema<ActivityDocument>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['conversation', 'lesson', 'quiz', 'achievement'],
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  xpGained: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

ActivitySchema.index({ userId: 1, createdAt: -1 })
ActivitySchema.index({ type: 1, createdAt: -1 })

export const ActivityModel = models.Activity || model<ActivityDocument>('Activity', ActivitySchema)

// Default export for compatibility
export default ActivityModel
