import { Schema, model, models, Document } from 'mongoose'
import type { ResourceDocument as ResourceDocumentType, ResourceReview } from '../types/database'

export interface ResourceDocument extends Omit<ResourceDocumentType, '_id'>, Document {
  _id: string
}

const ResourceReviewSchema = new Schema<ResourceReview>({
  user_id: {
    type: String,
    required: [true, 'User ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Review comment cannot exceed 500 characters'],
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { _id: true })

const ResourceSchema = new Schema<ResourceDocument>({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  content_type: {
    type: String,
    enum: ['video', 'audio', 'pdf', 'article', 'interactive', 'quiz', 'flashcards'],
    required: [true, 'Content type is required'],
    index: true
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    index: true
  },
  target_language: {
    type: String,
    index: true,
    default: undefined
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Difficulty level is required'],
    index: true
  },
  topics: [{
    type: String,
    trim: true,
    maxlength: [50, 'Topic cannot exceed 50 characters']
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  url: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'URL must be a valid HTTP(S) URL'
    }
  },
  file_data: {
    size: {
      type: Number,
      min: [0, 'File size cannot be negative']
    },
    mime_type: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true
          // Basic MIME type validation
          return /^[a-zA-Z]+\/[a-zA-Z0-9\-\+\.]+$/.test(v)
        },
        message: 'Invalid MIME type format'
      }
    },
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative']
    },
    transcript: {
      type: String,
      maxlength: [10000, 'Transcript cannot exceed 10000 characters']
    }
  },
  creator_id: {
    type: String,
    required: [true, 'Creator ID is required'],
    index: true
  },
  is_public: {
    type: Boolean,
    default: true,
    index: true
  },
  is_premium: {
    type: Boolean,
    default: false,
    index: true
  },
  usage_count: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be negative'],
      max: [5, 'Average rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: [ResourceReviewSchema],
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
      // Transform review IDs to strings
      if (ret.reviews) {
        ret.reviews = ret.reviews.map((review: any) => ({
          ...review,
          id: review._id.toString(),
          _id: undefined
        }))
      }
      return ret
    }
  }
})

// Indexes for resource discovery and performance
ResourceSchema.index({ language: 1, difficulty: 1, content_type: 1 })
ResourceSchema.index({ tags: 1 })
ResourceSchema.index({ topics: 1 })
ResourceSchema.index({ creator_id: 1, created_at: -1 })
ResourceSchema.index({ 'rating.average': -1, usage_count: -1 })
ResourceSchema.index({ is_public: 1, is_premium: 1 })
ResourceSchema.index({ title: 'text', description: 'text', topics: 'text', tags: 'text' })

// Virtual for formatted file size
ResourceSchema.virtual('formattedFileSize').get(function() {
  if (!this.file_data?.size) return null
  
  const size = this.file_data.size
  if (size >= 1024 * 1024 * 1024) {
    return Math.round(size / (1024 * 1024 * 1024) * 10) / 10 + ' GB'
  }
  if (size >= 1024 * 1024) {
    return Math.round(size / (1024 * 1024) * 10) / 10 + ' MB'
  }
  if (size >= 1024) {
    return Math.round(size / 1024 * 10) / 10 + ' KB'
  }
  return size + ' bytes'
})

// Virtual for formatted duration
ResourceSchema.virtual('formattedDuration').get(function() {
  if (!this.file_data?.duration) return null
  
  const duration = this.file_data.duration
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Method to add a review
ResourceSchema.methods.addReview = function(userId: string, rating: number, comment?: string) {
  // Check if user has already reviewed
  const existingReview = this.reviews.find((review: any) => review.user_id === userId)
  if (existingReview) {
    throw new Error('User has already reviewed this resource')
  }
  
  // Add the review
  this.reviews.push({
    user_id: userId,
    rating,
    comment,
    created_at: new Date()
  })
  
  // Update rating statistics
  this.rating.count = this.reviews.length
  this.rating.average = this.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / this.reviews.length
  
  return this.save()
}

// Method to update review
ResourceSchema.methods.updateReview = function(userId: string, rating: number, comment?: string) {
  const review = this.reviews.find((review: any) => review.user_id === userId)
  if (!review) {
    throw new Error('Review not found')
  }
  
  review.rating = rating
  review.comment = comment
  
  // Update rating statistics
  this.rating.average = this.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / this.reviews.length
  
  return this.save()
}

// Method to increment usage count
ResourceSchema.methods.incrementUsage = function() {
  this.usage_count += 1
  return this.save()
}

// Static method to get popular resources
ResourceSchema.statics.getPopularResources = async function(
  language?: string,
  difficulty?: string,
  contentType?: string,
  limit: number = 20
) {
  const query: any = { is_public: true }
  
  if (language) query.language = language
  if (difficulty) query.difficulty = difficulty
  if (contentType) query.content_type = contentType
  
  return await this.find(query)
    .sort({ 'rating.average': -1, usage_count: -1 })
    .limit(limit)
    .lean()
}

// Static method to search resources
ResourceSchema.statics.searchResources = async function(
  searchTerm: string,
  filters: {
    language?: string
    difficulty?: string
    contentType?: string
    isPremium?: boolean
  } = {},
  limit: number = 20,
  skip: number = 0
) {
  const query: any = {
    is_public: true,
    $text: { $search: searchTerm }
  }
  
  if (filters.language) query.language = filters.language
  if (filters.difficulty) query.difficulty = filters.difficulty
  if (filters.contentType) query.content_type = filters.contentType
  if (filters.isPremium !== undefined) query.is_premium = filters.isPremium
  
  return await this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .lean()
}

// Pre-save middleware to validate file data
ResourceSchema.pre('save', function(next) {
  if (this.url && this.file_data?.size) {
    next(new Error('Resource cannot have both URL and file data'))
  }
  
  if (!this.url && !this.file_data?.size) {
    next(new Error('Resource must have either URL or file data'))
  }
  
  next()
})

export const ResourceModel = models.Resource || model<ResourceDocument>('Resource', ResourceSchema)
