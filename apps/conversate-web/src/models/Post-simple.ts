import { Schema, model, models, Document } from 'mongoose'

export interface PostDocument extends Document {
  _id: string
  user_id: string
  community_id?: string
  content: string
  title?: string
  language: string
  media?: Array<{
    type: 'image' | 'video' | 'audio'
    url: string
    thumbnail?: string
    alt?: string
  }>
  reactions: Array<{
    user_id: string
    type: 'like' | 'love' | 'helpful' | 'celebrate' | 'thinking'
    created_at: Date
  }>
  comments: Array<{
    user_id: string
    content: string
    created_at: Date
  }>
  tags: string[]
  view_count: number
  is_archived: boolean
  created_at: Date
  updated_at: Date
}

const PostSchema = new Schema<PostDocument>({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  community_id: {
    type: String,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  language: {
    type: String,
    required: true,
    index: true
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    alt: String
  }],
  reactions: [{
    user_id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['like', 'love', 'helpful', 'celebrate', 'thinking'],
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user_id: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  view_count: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  is_archived: {
    type: Boolean,
    default: false,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes
PostSchema.index({ user_id: 1, created_at: -1 })
PostSchema.index({ community_id: 1, created_at: -1 })
PostSchema.index({ language: 1, created_at: -1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ content: 'text', title: 'text', tags: 'text' })

// Virtual methods
PostSchema.virtual('reactionCount').get(function() {
  return this.reactions?.length || 0
})

PostSchema.virtual('commentCount').get(function() {
  return this.comments?.length || 0
})

export const PostModel = models.Post || model<PostDocument>('Post', PostSchema)

// Default export for compatibility
export default PostModel
