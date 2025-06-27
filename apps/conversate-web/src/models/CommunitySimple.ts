import { Schema, model, models, Document } from 'mongoose'

export interface CommunityDocument extends Document {
  _id: string
  name: string
  description: string
  language: string
  memberCount: number
  isPrivate: boolean
  tags: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const CommunitySchema = new Schema<CommunityDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  language: {
    type: String,
    required: true
  },
  memberCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

CommunitySchema.index({ name: 1 })
CommunitySchema.index({ language: 1 })
CommunitySchema.index({ tags: 1 })

export default models.Community || model<CommunityDocument>('Community', CommunitySchema)
