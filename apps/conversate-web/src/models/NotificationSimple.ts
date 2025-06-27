import { Schema, model, models, Document } from 'mongoose'

export interface NotificationDocument extends Document {
  _id: string
  recipientId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<NotificationDocument>({
  recipientId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

NotificationSchema.index({ recipientId: 1, isRead: 1 })
NotificationSchema.index({ createdAt: -1 })

export default models.Notification || model<NotificationDocument>('Notification', NotificationSchema)
