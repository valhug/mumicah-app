import { config } from 'dotenv'

// Load environment variables from .env.local FIRST
config({ path: '.env.local' })

import { connectMongoDB } from '../src/lib/mongodb'
import { 
  ActivityModel,
  NotificationModel,
  MediaModel,
  ConversationModel 
} from '../src/models'

async function cleanupDatabase() {
  try {
    console.log('🧹 Starting database cleanup...')
    
    await connectMongoDB()
    console.log('✅ Connected to MongoDB')
    
    // Clean up expired notifications
    console.log('🔔 Cleaning up expired notifications...')
    const expiredNotifications = await (NotificationModel as any).cleanupExpired()
    console.log(`✅ Removed ${expiredNotifications.deletedCount || 0} expired notifications`)
    
    // Clean up orphaned media files
    console.log('🎬 Cleaning up orphaned media files...')
    const orphanedMedia = await (MediaModel as any).cleanupOrphanedMedia(7) // 7 days old
    console.log(`✅ Removed ${orphanedMedia.deletedCount || 0} orphaned media files`)
    
    // Clean up old activities (older than 1 year)
    console.log('📈 Cleaning up old activities...')
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const oldActivities = await ActivityModel.deleteMany({
      timestamp: { $lt: oneYearAgo }
    })
    console.log(`✅ Removed ${oldActivities.deletedCount || 0} old activities`)
    
    // Clean up empty conversations (no messages)
    console.log('💬 Cleaning up empty conversations...')
    const emptyConversations = await ConversationModel.deleteMany({
      $or: [
        { messages: { $size: 0 } },
        { messages: { $exists: false } }
      ],
      created_at: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Older than 1 day
    })
    console.log(`✅ Removed ${emptyConversations.deletedCount || 0} empty conversations`)
    
    // Clean up archived notifications older than 90 days
    console.log('📮 Cleaning up old archived notifications...')
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const archivedNotifications = await NotificationModel.deleteMany({
      is_archived: true,
      created_at: { $lt: ninetyDaysAgo }
    })
    console.log(`✅ Removed ${archivedNotifications.deletedCount || 0} old archived notifications`)
    
    // Generate cleanup statistics
    console.log('📊 Generating cleanup statistics...')
    
    const stats = {
      notifications: {
        total: await NotificationModel.countDocuments(),
        unread: await NotificationModel.countDocuments({ is_read: false }),
        archived: await NotificationModel.countDocuments({ is_archived: true })
      },
      media: {
        total: await MediaModel.countDocuments(),
        ready: await MediaModel.countDocuments({ status: 'ready' }),
        processing: await MediaModel.countDocuments({ status: 'processing' }),
        error: await MediaModel.countDocuments({ status: 'error' })
      },
      activities: {
        total: await ActivityModel.countDocuments(),
        lastWeek: await ActivityModel.countDocuments({
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        lastMonth: await ActivityModel.countDocuments({
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        })
      },
      conversations: {
        total: await ConversationModel.countDocuments(),
        active: await ConversationModel.countDocuments({
          last_message_at: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }),
        archived: await ConversationModel.countDocuments({ is_archived: true })
      }
    }
    
    console.log('\n🎉 Database cleanup completed successfully!')
    console.log('📋 Database Statistics:')
    console.log(`   📧 Notifications: ${stats.notifications.total} total (${stats.notifications.unread} unread, ${stats.notifications.archived} archived)`)
    console.log(`   🎬 Media Files: ${stats.media.total} total (${stats.media.ready} ready, ${stats.media.processing} processing, ${stats.media.error} error)`)
    console.log(`   📈 Activities: ${stats.activities.total} total (${stats.activities.lastWeek} last week, ${stats.activities.lastMonth} last month)`)
    console.log(`   💬 Conversations: ${stats.conversations.total} total (${stats.conversations.active} active, ${stats.conversations.archived} archived)`)
    
    console.log('\n💡 Cleanup Summary:')
    console.log(`   • Expired notifications: ${expiredNotifications.deletedCount || 0} removed`)
    console.log(`   • Orphaned media files: ${orphanedMedia.deletedCount || 0} removed`)
    console.log(`   • Old activities: ${oldActivities.deletedCount || 0} removed`)
    console.log(`   • Empty conversations: ${emptyConversations.deletedCount || 0} removed`)
    console.log(`   • Archived notifications: ${archivedNotifications.deletedCount || 0} removed`)
    
    return stats
    
  } catch (error) {
    console.error('❌ Error during database cleanup:', error)
    throw error
  } finally {
    console.log('✨ Cleanup script completed')
  }
}

// Run the script if called directly
if (require.main === module) {
  cleanupDatabase()
    .then(() => {
      console.log('👋 Cleanup finished - your database is now optimized')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error)
      process.exit(1)
    })
}

export { cleanupDatabase }
