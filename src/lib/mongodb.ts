// lib/mongodb.ts
import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    console.warn('MongoDB URI not defined - MongoDB features will be disabled')
    throw new Error('MongoDB URI not defined')
  }

  // Check if this is a placeholder URI
  if (MONGODB_URI.includes('demo:demo123@cluster0.example.mongodb.net')) {
    console.warn('Using placeholder MongoDB URI - MongoDB features will be disabled')
    throw new Error('Placeholder MongoDB URI - please configure a real MongoDB connection')
  }

  if (cached.conn) return cached.conn
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('MongoDB connection failed:', error.message)
      cached.promise = null
      throw error
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection error:', e)
    throw e
  }
  
  return cached.conn
}

export default connectMongoDB
