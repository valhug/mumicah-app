import { Schema, model, models, Document } from 'mongoose'
import type { PostDocument as PostDocumentType, MediaAttachment, Reaction, Comment, LanguageNote } from '../../types/database'

export interface PostDocument extends Omit<PostDocumentType, '_id'>, Document {
  _id: string
}

const MediaAttachmentSchema = new Schema<MediaAttachment>({
  type: { type: String, enum: ['image', 'video', 'audio'], required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  alt: { type: String },
  size: { type: Number },
  width: { type: Number },
  height: { type: Number }
}, { _id: false })

const ReactionSchema = new Schema<Reaction>({
  user_id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['like', 'love', 'helpful', 'celebrate', 'thinking'], 
    required: true 
  },
  created_at: { type: Date, default: Date.now }
}, { _id: false })

const CommentSchema = new Schema<Comment>({
  user_id: { type: String, required: true },
  content: { 
    type: String, 
    required: true,
    maxlength: [500, 'Comment cannot exceed 500 characters'] 
  },
  created_at: { type: Date, default: Date.now },
  edited_at: { type: Date }
}, { _id: false })

const LanguageCorrectionSchema = new Schema({
  original: { type: String, required: true },
  suggested: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['grammar', 'vocabulary', 'spelling', 'style'], 
    required: true 
  },
  explanation: { type: String, required: true }
}, { _id: false })

const LanguageNoteSchema = new Schema<LanguageNote>({
  corrected_text: { type: String, required: true },
  corrections: [LanguageCorrectionSchema]
}, { _id: false })

const PostSchema = new Schema<PostDocument>({
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  community_id: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Community ID is required'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  media: [MediaAttachmentSchema],
  reactions: [ReactionSchema],
  comments: [CommentSchema],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  language_note: {
    type: LanguageNoteSchema,
    default: undefined
  },
  is_pinned: {
    type: Boolean,
    default: false,
    index: true
  },
  is_archived: {
    type: Boolean,
    default: false,
    index: true
  },
  view_count: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
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
PostSchema.index({ community_id: 1, created_at: -1 })
PostSchema.index({ user_id: 1, created_at: -1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ 'reactions.user_id': 1 })
PostSchema.index({ content: 'text', tags: 'text' })

// Virtual for reaction count
PostSchema.virtual('reactionCount').get(function() {
  return this.reactions?.length || 0
})

// Virtual for comment count
PostSchema.virtual('commentCount').get(function() {
  return this.comments?.length || 0
})

// Method to get reactions by type
PostSchema.methods.getReactionsByType = function(type: string) {
  return this.reactions?.filter((reaction: any) => reaction.type === type) || []
}

// Method to check if user has reacted
PostSchema.methods.hasUserReacted = function(userId: string, type?: string) {
  if (!this.reactions) return false
  
  if (type) {
    return this.reactions.some((reaction: any) => 
      reaction.user_id === userId && reaction.type === type
    )
  }
  
  return this.reactions.some((reaction: any) => reaction.user_id === userId)
}

// Pre-save middleware to update view count
PostSchema.pre('save', function(next) {
  if (this.isModified('view_count')) {
    this.updated_at = new Date()
  }
  next()
})

export const PostModel = models.Post || model<PostDocument>('Post', PostSchema)
