import { Schema, model, models } from 'mongoose'
import { PersonaId } from '@/config/langchain'

export interface IUserProgress {
  userId: string
  targetLanguage: string
  nativeLanguage: string
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced'
  totalConversations: number
  totalWords: number
  totalMinutes: number
  streakDays: number
  lastActiveDate: Date
  favoritePersona?: PersonaId
  weeklyGoal: number
  monthlyGoal: number
  achievements: string[]
  createdAt: Date
  updatedAt: Date
}

const UserProgressSchema = new Schema<IUserProgress>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  targetLanguage: {
    type: String,
    required: true,
    default: 'Spanish'
  },
  nativeLanguage: {
    type: String,
    required: true,
    default: 'English'
  },
  proficiencyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  totalConversations: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWords: {
    type: Number,
    default: 0,
    min: 0
  },
  totalMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  streakDays: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  favoritePersona: {
    type: String,
    enum: ['maya', 'alex', 'luna', 'diego', 'priya', 'jean-claude'],
    required: false
  },
  weeklyGoal: {
    type: Number,
    default: 5,
    min: 1
  },
  monthlyGoal: {
    type: Number,
    default: 20,
    min: 1
  },
  achievements: [{
    type: String
  }]
}, {
  timestamps: true
})

// Indexes for performance
UserProgressSchema.index({ userId: 1 })
UserProgressSchema.index({ lastActiveDate: -1 })
UserProgressSchema.index({ totalConversations: -1 })

export const UserProgress = models.UserProgress || model<IUserProgress>('UserProgress', UserProgressSchema)
