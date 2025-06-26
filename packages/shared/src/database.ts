import mongoose from 'mongoose'

export async function connectMongoDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected')
      return
    }

    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/mumicah'
    
    await mongoose.connect(mongoUrl, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export async function disconnectMongoDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('MongoDB disconnected')
  }
}

// Database utilities
export const dbUtils = {
  isValidObjectId: (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id)
  },
  
  createObjectId: (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId()
  },
  
  toObjectId: (id: string): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId(id)
  }
}

export default connectMongoDB