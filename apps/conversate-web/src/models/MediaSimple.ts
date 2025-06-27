import { Schema, model, models, Document } from 'mongoose'

export interface MediaDocument extends Document {
  _id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<MediaDocument>({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  url: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

MediaSchema.index({ uploadedBy: 1, createdAt: -1 })
MediaSchema.index({ mimeType: 1 })

export default models.Media || model<MediaDocument>('Media', MediaSchema)
