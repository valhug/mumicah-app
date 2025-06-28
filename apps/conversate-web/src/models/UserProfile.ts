import { Schema, model, models } from 'mongoose'

export interface IUserProfile {
  userId: string
  email: string
  name: string
  image?: string
  provider: 'credentials' | 'google' | 'github'
  providerId?: string
  bio?: string
  location?: string
  timezone?: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: {
      email: boolean
      push: boolean
      streakReminders: boolean
      achievementAlerts: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private'
      showProgress: boolean
      showLocation: boolean
    }
  }
  subscription: {
    type: 'free' | 'premium' | 'enterprise'
    status: 'active' | 'cancelled' | 'expired'
    expiresAt?: Date
  }
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    required: true
  },
  providerId: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    maxlength: 500,
    required: false
  },
  location: {
    type: String,
    maxlength: 100,
    required: false
  },
  timezone: {
    type: String,
    required: false
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      streakReminders: {
        type: Boolean,
        default: true
      },
      achievementAlerts: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
      },
      showProgress: {
        type: Boolean,
        default: true
      },
      showLocation: {
        type: Boolean,
        default: false
      }
    }
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    expiresAt: {
      type: Date,
      required: false
    }
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for performance
UserProfileSchema.index({ email: 1 })
UserProfileSchema.index({ userId: 1 })
UserProfileSchema.index({ provider: 1 })
UserProfileSchema.index({ 'subscription.type': 1 })

export const UserProfile = models.UserProfile || model<IUserProfile>('UserProfile', UserProfileSchema)
