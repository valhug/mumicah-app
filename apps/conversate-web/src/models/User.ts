import { Schema, model, models, Document } from 'mongoose'

export interface UserDocument extends Document {
  _id: string
  email: string
  name?: string
  avatar?: string
  preferredLanguages: string[]
  nativeLanguage: string
  level: number
  xp: number
  streakDays: number
  lastActiveDate: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  avatar: String,
  preferredLanguages: [{
    type: String,
    default: []
  }],
  nativeLanguage: {
    type: String,
    default: 'English'
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  xp: {
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
  }
}, {
  timestamps: true
})

UserSchema.index({ email: 1 })
UserSchema.index({ level: -1, xp: -1 })

export default models.User || model<UserDocument>('User', UserSchema)
