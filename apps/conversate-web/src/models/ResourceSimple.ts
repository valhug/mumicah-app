import { Schema, model, models, Document } from 'mongoose'

export interface ResourceDocument extends Document {
  _id: string
  title: string
  description: string
  content: string
  type: 'article' | 'video' | 'audio' | 'exercise' | 'quiz'
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  authorId: string
  url?: string
  downloadCount: number
  rating: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

const ResourceSchema = new Schema<ResourceDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'audio', 'exercise', 'quiz']
  },
  language: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true
  }],
  authorId: {
    type: String,
    required: true,
    index: true
  },
  url: {
    type: String,
    trim: true
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

ResourceSchema.index({ language: 1, difficulty: 1 })
ResourceSchema.index({ type: 1, isPublished: 1 })
ResourceSchema.index({ authorId: 1, createdAt: -1 })
ResourceSchema.index({ tags: 1 })

export default models.Resource || model<ResourceDocument>('Resource', ResourceSchema)
