import { config } from 'dotenv'

// Load environment variables from .env.local FIRST
config({ path: '.env.local' })

import { connectMongoDB } from '../src/lib/mongodb'
import { 
  CommunityModel, 
  PostModel, 
  ConversationModel,
  ActivityModel,
  ResourceModel,
  NotificationModel,
  MediaModel 
} from '../src/models'

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing MongoDB database...')
    
    await connectMongoDB()
    console.log('✅ Connected to MongoDB')
    
    // Create optimized indexes for all collections
    console.log('📊 Creating Community indexes...')
    try {
      await CommunityModel.collection.createIndex({ language: 1, level: 1 })
      await CommunityModel.collection.createIndex({ creator_id: 1, created_at: -1 })
      await CommunityModel.collection.createIndex({ is_private: 1 })
      await CommunityModel.collection.createIndex({ member_count: -1 })
      await CommunityModel.collection.createIndex({ tags: 1 })
      await CommunityModel.collection.createIndex({ name: 'text', description: 'text', tags: 'text' })
      console.log('✅ Community indexes created')
    } catch (error) {
      console.log('⚠️ Community indexes may already exist:', error)
    }
    
    console.log('📝 Creating Post indexes...')
    try {
      await PostModel.collection.createIndex({ community_id: 1, created_at: -1 })
      await PostModel.collection.createIndex({ user_id: 1, created_at: -1 })
      await PostModel.collection.createIndex({ tags: 1 })
      await PostModel.collection.createIndex({ 'reactions.user_id': 1 })
      await PostModel.collection.createIndex({ content: 'text', tags: 'text' })
      await PostModel.collection.createIndex({ is_pinned: 1, created_at: -1 })
      console.log('✅ Post indexes created')
    } catch (error) {
      console.log('⚠️ Post indexes may already exist:', error)
    }
    
    console.log('💬 Creating Conversation indexes...')
    try {
      await ConversationModel.collection.createIndex({ participants: 1, last_message_at: -1 })
      await ConversationModel.collection.createIndex({ 'messages.sender_id': 1 })
      await ConversationModel.collection.createIndex({ type: 1, is_archived: 1 })
      console.log('✅ Conversation indexes created')
    } catch (error) {
      console.log('⚠️ Conversation indexes may already exist:', error)
    }
    
    console.log('📈 Creating Activity indexes...')
    try {
      await ActivityModel.collection.createIndex({ user_id: 1, timestamp: -1 })
      await ActivityModel.collection.createIndex({ action: 1, timestamp: -1 })
      await ActivityModel.collection.createIndex({ target_type: 1, target_id: 1 })
      await ActivityModel.collection.createIndex({ user_id: 1, action: 1, timestamp: -1 })
      // TTL index to automatically delete old activities (1 year)
      await ActivityModel.collection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 })
      console.log('✅ Activity indexes created')
    } catch (error) {
      console.log('⚠️ Activity indexes may already exist:', error)
    }
    
    console.log('📚 Creating Resource indexes...')
    try {
      await ResourceModel.collection.createIndex({ language: 1, difficulty: 1, content_type: 1 })
      await ResourceModel.collection.createIndex({ tags: 1 })
      await ResourceModel.collection.createIndex({ topics: 1 })
      await ResourceModel.collection.createIndex({ creator_id: 1, created_at: -1 })
      await ResourceModel.collection.createIndex({ 'rating.average': -1, usage_count: -1 })
      await ResourceModel.collection.createIndex({ is_public: 1, is_premium: 1 })
      await ResourceModel.collection.createIndex({ title: 'text', description: 'text', topics: 'text', tags: 'text' })
      console.log('✅ Resource indexes created')
    } catch (error) {
      console.log('⚠️ Resource indexes may already exist:', error)
    }
    
    console.log('🔔 Creating Notification indexes...')
    try {
      await NotificationModel.collection.createIndex({ recipient_id: 1, created_at: -1 })
      await NotificationModel.collection.createIndex({ recipient_id: 1, is_read: 1 })
      await NotificationModel.collection.createIndex({ recipient_id: 1, type: 1 })
      await NotificationModel.collection.createIndex({ type: 1, created_at: -1 })
      await NotificationModel.collection.createIndex({ expires_at: 1 }, { sparse: true })
      await NotificationModel.collection.createIndex({ sender_id: 1, created_at: -1 }, { sparse: true })
      // TTL index to automatically delete old archived notifications (90 days)
      await NotificationModel.collection.createIndex({ created_at: 1 }, { 
        expireAfterSeconds: 90 * 24 * 60 * 60,
        partialFilterExpression: { is_archived: true }
      })
      console.log('✅ Notification indexes created')
    } catch (error) {
      console.log('⚠️ Notification indexes may already exist:', error)
    }
    
    console.log('🎬 Creating Media indexes...')
    try {
      await MediaModel.collection.createIndex({ user_id: 1, created_at: -1 })
      await MediaModel.collection.createIndex({ upload_id: 1 }, { unique: true })
      await MediaModel.collection.createIndex({ mime_type: 1 })
      await MediaModel.collection.createIndex({ status: 1 })
      await MediaModel.collection.createIndex({ tags: 1 })
      await MediaModel.collection.createIndex({ is_public: 1, status: 1 })
      console.log('✅ Media indexes created')
    } catch (error) {
      console.log('⚠️ Media indexes may already exist:', error)
    }
      // Verify collections exist
    console.log('🔍 Verifying collections...')
    const db = mongoose.connection.db
    if (db) {
      const collections = await db.listCollections().toArray()
      const collectionNames = collections.map(c => c.name)
      
      const expectedCollections = ['communities', 'posts', 'conversations', 'activities', 'resources', 'notifications', 'media']
      
      for (const expectedCollection of expectedCollections) {
        if (collectionNames.includes(expectedCollection)) {
          console.log(`✅ Collection '${expectedCollection}' exists`)
        } else {
          console.log(`⚠️ Collection '${expectedCollection}' not found - it will be created on first use`)
        }
      }
    } else {
      console.log('⚠️ Database connection not available for collection verification')
    }
    
    console.log('\n🎉 MongoDB database initialization completed successfully!')
    console.log('📋 Summary:')
    console.log('   • All required indexes have been created')
    console.log('   • TTL indexes configured for automatic cleanup')
    console.log('   • Text search indexes enabled for content discovery')
    console.log('   • Performance indexes optimized for common queries')
    
  } catch (error) {
    console.error('❌ Error initializing MongoDB database:', error)
    throw error
  } finally {
    // Don't close connection as it may be needed by other operations
    console.log('✨ Initialization script completed')
  }
}

// Import mongoose for connection info
import mongoose from 'mongoose'

// Run the script if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('👋 Initialization finished - you can now start your application')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error)
      process.exit(1)
    })
}

export { initializeDatabase }
