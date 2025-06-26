import { Schema, model, models, Document } from 'mongoose'
import type { MediaDocument as MediaDocumentType } from '../types/database'

export interface MediaDocument extends Omit<MediaDocumentType, '_id'>, Document {
  _id: string
}

const MediaSchema = new Schema<MediaDocument>({
  upload_id: {
    type: String,
    required: [true, 'Upload ID is required'],
    unique: true,
    index: true
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true,
    maxlength: [255, 'Filename cannot exceed 255 characters']
  },
  original_name: {
    type: String,
    required: [true, 'Original name is required'],
    trim: true,
    maxlength: [255, 'Original name cannot exceed 255 characters']
  },
  mime_type: {
    type: String,
    required: [true, 'MIME type is required'],
    validate: {
      validator: function(v: string) {
        // Basic MIME type validation
        return /^[a-zA-Z]+\/[a-zA-Z0-9\-\+\.]+$/.test(v)
      },
      message: 'Invalid MIME type format'
    },
    index: true
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size cannot be negative']
  },
  dimensions: {
    width: {
      type: Number,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative']
    }
  },
  duration: {
    type: Number,
    min: [0, 'Duration cannot be negative']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'URL must be a valid HTTP(S) URL'
    }
  },
  thumbnail_url: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'Thumbnail URL must be a valid HTTP(S) URL'
    }
  },
  alt_text: {
    type: String,
    maxlength: [200, 'Alt text cannot exceed 200 characters'],
    trim: true
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
    trim: true
  }],
  usage_count: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  is_public: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error'],
    default: 'uploading',
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
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

// Indexes for media management and performance
MediaSchema.index({ user_id: 1, created_at: -1 })
MediaSchema.index({ upload_id: 1 })
MediaSchema.index({ mime_type: 1 })
MediaSchema.index({ status: 1 })
MediaSchema.index({ tags: 1 })
MediaSchema.index({ is_public: 1, status: 1 })

// Virtual for file type category
MediaSchema.virtual('fileType').get(function() {
  const mimeType = this.mime_type.toLowerCase()
  
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('text/')) return 'text'
  return 'other'
})

// Virtual for formatted file size
MediaSchema.virtual('formattedSize').get(function() {
  const size = this.size
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
MediaSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null
  
  const duration = this.duration
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Virtual for aspect ratio
MediaSchema.virtual('aspectRatio').get(function() {
  if (!this.dimensions?.width || !this.dimensions?.height) return null
  return this.dimensions.width / this.dimensions.height
})

// Method to mark as ready
MediaSchema.methods.markAsReady = function() {
  this.status = 'ready'
  return this.save()
}

// Method to mark as error
MediaSchema.methods.markAsError = function() {
  this.status = 'error'
  return this.save()
}

// Method to increment usage count
MediaSchema.methods.incrementUsage = function() {
  this.usage_count += 1
  return this.save()
}

// Method to update metadata
MediaSchema.methods.updateMetadata = function(metadata: Record<string, any>) {
  this.metadata = { ...this.metadata, ...metadata }
  return this.save()
}

// Static method to create media entry
MediaSchema.statics.createMedia = async function(
  uploadId: string,
  userId: string,
  filename: string,
  originalName: string,
  mimeType: string,
  size: number,
  url: string,
  options: {
    dimensions?: { width: number; height: number }
    duration?: number
    thumbnailUrl?: string
    altText?: string
    tags?: string[]
    isPublic?: boolean
    metadata?: Record<string, any>
  } = {}
) {
  const media = new this({
    upload_id: uploadId,
    user_id: userId,
    filename,
    original_name: originalName,
    mime_type: mimeType,
    size,
    url,
    dimensions: options.dimensions,
    duration: options.duration,
    thumbnail_url: options.thumbnailUrl,
    alt_text: options.altText,
    tags: options.tags || [],
    is_public: options.isPublic || false,
    metadata: options.metadata || {},
    status: 'processing'
  })
  
  return await media.save()
}

// Static method to get user media
MediaSchema.statics.getUserMedia = async function(
  userId: string,
  filters: {
    fileType?: string
    status?: string
    isPublic?: boolean
  } = {},
  limit: number = 50,
  skip: number = 0
) {
  const query: any = { user_id: userId }
  
  if (filters.fileType) {
    const mimeTypePattern = filters.fileType === 'image' ? /^image\//
      : filters.fileType === 'video' ? /^video\//
      : filters.fileType === 'audio' ? /^audio\//
      : filters.fileType === 'pdf' ? /pdf/
      : null
    
    if (mimeTypePattern) {
      query.mime_type = { $regex: mimeTypePattern }
    }
  }
  
  if (filters.status) query.status = filters.status
  if (filters.isPublic !== undefined) query.is_public = filters.isPublic
  
  return await this.find(query)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

// Static method to get public media
MediaSchema.statics.getPublicMedia = async function(
  filters: {
    fileType?: string
    tags?: string[]
  } = {},
  limit: number = 50,
  skip: number = 0
) {
  const query: any = { 
    is_public: true, 
    status: 'ready' 
  }
  
  if (filters.fileType) {
    const mimeTypePattern = filters.fileType === 'image' ? /^image\//
      : filters.fileType === 'video' ? /^video\//
      : filters.fileType === 'audio' ? /^audio\//
      : null
    
    if (mimeTypePattern) {
      query.mime_type = { $regex: mimeTypePattern }
    }
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags }
  }
  
  return await this.find(query)
    .sort({ usage_count: -1, created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

// Static method to cleanup orphaned media
MediaSchema.statics.cleanupOrphanedMedia = async function(olderThanDays: number = 7) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)
  
  return await this.deleteMany({
    status: { $in: ['uploading', 'error'] },
    created_at: { $lt: cutoffDate }
  })
}

// Static method to get storage statistics
MediaSchema.statics.getStorageStats = async function(userId?: string) {
  const matchStage = userId ? { user_id: userId, status: 'ready' } : { status: 'ready' }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: '$size' },
        avgSize: { $avg: '$size' },
        fileTypes: {
          $push: {
            $switch: {
              branches: [
                { case: { $regexMatch: { input: '$mime_type', regex: /^image\// } }, then: 'image' },
                { case: { $regexMatch: { input: '$mime_type', regex: /^video\// } }, then: 'video' },
                { case: { $regexMatch: { input: '$mime_type', regex: /^audio\// } }, then: 'audio' },
                { case: { $regexMatch: { input: '$mime_type', regex: /pdf/ } }, then: 'pdf' }
              ],
              default: 'other'
            }
          }
        }
      }
    }
  ])
  
  return stats[0] || {
    totalFiles: 0,
    totalSize: 0,
    avgSize: 0,
    fileTypes: []
  }
}

// Pre-save middleware to validate file constraints
MediaSchema.pre('save', function(next) {
  // Validate file size (max 100MB by default)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (this.size > maxSize) {
    next(new Error('File size exceeds maximum allowed size'))
  }
  
  // Validate image dimensions if provided
  if (this.dimensions && (this.dimensions.width <= 0 || this.dimensions.height <= 0)) {
    next(new Error('Invalid image dimensions'))
  }
  
  next()
})

export const MediaModel = models.Media || model<MediaDocument>('Media', MediaSchema)
