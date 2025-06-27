import { Schema, model, models, Document } from 'mongoose'

// Simple Community type for UI components
export interface Community {
  _id: string
  name: string
  description: string
  language: string
  category?: string
  memberCount: number
  isActive: boolean
  difficulty?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Mongoose Document interface
export interface CommunityDocument extends Document {
  name: string
  description: string
  language: string
  level: string
  category: string
  creator_id: string
  moderators: string[]
  member_count: number
  is_private: boolean
  rules: string[]
  tags: string[]
  settings: {
    allow_media: boolean
    require_approval: boolean
    auto_approve_members: boolean
  }
  created_at: Date
  updated_at: Date
}

const CommunitySettingsSchema = new Schema({
  allow_media: { type: Boolean, default: true },
  require_approval: { type: Boolean, default: false },
  auto_approve_members: { type: Boolean, default: true }
}, { _id: false })

const CommunitySchema = new Schema<CommunityDocument>({
  name: {
    type: String,
    required: [true, 'Community name is required'],
    trim: true,
    maxlength: [100, 'Community name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Community description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  creator_id: {
    type: String,
    required: [true, 'Creator ID is required'],
    index: true
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    index: true
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['beginner', 'intermediate', 'advanced', 'mixed'],
    index: true
  },
  moderators: [{
    type: String
  }],
  is_private: {
    type: Boolean,
    default: false,
    index: true
  },
  member_count: {
    type: Number,
    default: 1,
    min: [0, 'Member count cannot be negative']
  },
  rules: [{
    type: String,
    trim: true,
    maxlength: [200, 'Rule cannot exceed 200 characters']
  }],
  settings: {
    type: CommunitySettingsSchema,
    default: () => ({})
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
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
      return ret
    }
  }
})

// Indexes for better query performance
CommunitySchema.index({ language: 1, level: 1 })
CommunitySchema.index({ creator_id: 1, created_at: -1 })
CommunitySchema.index({ is_private: 1 })
CommunitySchema.index({ name: 'text', description: 'text', tags: 'text' })

// Virtual for formatted member count
CommunitySchema.virtual('formattedMemberCount').get(function() {
  if (this.member_count >= 1000000) {
    return Math.floor(this.member_count / 100000) / 10 + 'M'
  }
  if (this.member_count >= 1000) {
    return Math.floor(this.member_count / 100) / 10 + 'k'
  }
  return this.member_count.toString()
})

// Pre-save middleware
CommunitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.member_count = 1
  }
  next()
})

export const CommunityModel = models.Community || model<CommunityDocument>('Community', CommunitySchema)

// Default export for compatibility
export default CommunityModel
