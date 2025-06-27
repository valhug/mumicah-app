import { Schema, model, models, Document } from 'mongoose'

export interface PostDocument extends Document {
  _id: string
  communityId: string
  authorId: string
  title?: string
  content: string
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  likes: number
  commentsCount: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<PostDocument>({
  communityId: {
    type: String,
    required: true,
    index: true
  },
  authorId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
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
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  commentsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

PostSchema.index({ communityId: 1, createdAt: -1 })
PostSchema.index({ authorId: 1, createdAt: -1 })
PostSchema.index({ language: 1, difficulty: 1 })
PostSchema.index({ tags: 1 })

export default models.Post || model<PostDocument>('Post', PostSchema)
