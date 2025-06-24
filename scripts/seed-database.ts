import { config } from 'dotenv'

// Load environment variables from .env.local FIRST
config({ path: '.env.local' })

import { connectMongoDB } from '../src/lib/mongodb'
import { CommunityModel, PostModel, ResourceModel } from '../src/models'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    await connectMongoDB()
    console.log('✅ Connected to MongoDB')
    
    // Seed sample communities
    console.log('🏘️ Seeding sample communities...')
    
    const sampleCommunities = [
      {
        name: 'Spanish Beginners',
        description: 'A welcoming community for those just starting their Spanish learning journey. Practice basic conversations and get help with grammar.',
        language: 'es',
        level: 'beginner',
        creator_id: 'sample-user-1',
        moderators: [],
        member_count: 150,
        is_private: false,
        rules: [
          'Be respectful to all members',
          'Only Spanish content and English for explanations',
          'Help others when you can',
          'No spam or promotional content'
        ],
        tags: ['spanish', 'beginner', 'grammar', 'conversation'],
        settings: {
          allow_media: true,
          require_approval: false,
          auto_approve_members: true
        }
      },
      {
        name: 'French Conversation Club',
        description: 'Practice your French speaking and writing skills with fellow learners. Weekly conversation topics and pronunciation tips.',
        language: 'fr',
        level: 'intermediate',
        creator_id: 'sample-user-2',
        moderators: ['sample-user-3'],
        member_count: 89,
        is_private: false,
        rules: [
          'French only in main discussions',
          'Constructive feedback only',
          'Weekly topic participation encouraged',
          'Share useful resources'
        ],
        tags: ['french', 'conversation', 'pronunciation', 'intermediate'],
        settings: {
          allow_media: true,
          require_approval: false,
          auto_approve_members: true
        }
      },
      {
        name: 'Japanese Kanji Masters',
        description: 'Advanced Japanese learners focused on mastering kanji characters, reading comprehension, and formal writing.',
        language: 'ja',
        level: 'advanced',
        creator_id: 'sample-user-4',
        moderators: ['sample-user-5', 'sample-user-6'],
        member_count: 34,
        is_private: false,
        rules: [
          'Advanced level discussions only',
          'Share kanji learning strategies',
          'Provide context for difficult characters',
          'Respectful corrections welcomed'
        ],
        tags: ['japanese', 'kanji', 'advanced', 'writing'],
        settings: {
          allow_media: true,
          require_approval: true,
          auto_approve_members: false
        }
      },
      {
        name: 'German Grammar Workshop',
        description: 'Master German grammar with structured lessons, exercises, and peer support. Perfect for intermediate learners.',
        language: 'de',
        level: 'intermediate',
        creator_id: 'sample-user-7',
        moderators: [],
        member_count: 67,
        is_private: false,
        rules: [
          'Focus on grammar topics',
          'Provide examples with explanations',
          'Ask questions freely',
          'Share useful grammar resources'
        ],
        tags: ['german', 'grammar', 'intermediate', 'exercises'],
        settings: {
          allow_media: true,
          require_approval: false,
          auto_approve_members: true
        }
      },
      {
        name: 'English Pronunciation Lab',
        description: 'Perfect your English pronunciation with audio exercises, feedback, and tips from native speakers.',
        language: 'en',
        level: 'mixed',
        creator_id: 'sample-user-8',
        moderators: ['sample-user-9'],
        member_count: 203,
        is_private: false,
        rules: [
          'Share audio recordings when possible',
          'Provide specific pronunciation feedback',
          'Use phonetic symbols when helpful',
          'Be patient with learners'
        ],
        tags: ['english', 'pronunciation', 'audio', 'speaking'],
        settings: {
          allow_media: true,
          require_approval: false,
          auto_approve_members: true
        }
      }
    ]
    
    // Check if communities already exist and seed if needed
    for (const communityData of sampleCommunities) {
      const existingCommunity = await CommunityModel.findOne({ 
        name: communityData.name,
        creator_id: communityData.creator_id 
      })
      
      if (!existingCommunity) {
        const community = await CommunityModel.create(communityData)
        console.log(`✅ Created community: ${community.name}`)
      } else {
        console.log(`⚠️ Community already exists: ${communityData.name}`)
      }
    }
    
    // Seed sample resources
    console.log('📚 Seeding sample resources...')
    
    const sampleResources = [
      {
        title: 'Spanish Verb Conjugation Guide',
        description: 'Complete guide to Spanish verb conjugations with examples and practice exercises.',
        content_type: 'pdf',
        language: 'es',
        target_language: 'en',
        difficulty: 'beginner',
        topics: ['verbs', 'conjugation', 'grammar'],
        tags: ['spanish', 'verbs', 'grammar', 'pdf'],
        url: 'https://example.com/spanish-verbs.pdf',
        creator_id: 'sample-user-1',
        is_public: true,
        is_premium: false,
        usage_count: 45,
        rating: { average: 4.5, count: 12 },
        reviews: []
      },
      {
        title: 'French Pronunciation Audio Course',
        description: 'Audio lessons covering French phonetics, liaison rules, and accent training.',
        content_type: 'audio',
        language: 'fr',
        target_language: 'en',
        difficulty: 'intermediate',
        topics: ['pronunciation', 'phonetics', 'accent'],
        tags: ['french', 'audio', 'pronunciation'],
        url: 'https://example.com/french-pronunciation.mp3',
        file_data: {
          duration: 3600, // 1 hour
          mime_type: 'audio/mpeg'
        },
        creator_id: 'sample-user-2',
        is_public: true,
        is_premium: true,
        usage_count: 23,
        rating: { average: 4.8, count: 8 },
        reviews: []
      },
      {
        title: 'Kanji Learning Flashcards',
        description: 'Interactive flashcards for the most common 1000 kanji characters with stroke order and examples.',
        content_type: 'flashcards',
        language: 'ja',
        target_language: 'en',
        difficulty: 'intermediate',
        topics: ['kanji', 'characters', 'writing'],
        tags: ['japanese', 'kanji', 'flashcards', 'interactive'],
        url: 'https://example.com/kanji-flashcards',
        creator_id: 'sample-user-4',
        is_public: true,
        is_premium: false,
        usage_count: 89,
        rating: { average: 4.7, count: 15 },
        reviews: []
      },
      {
        title: 'German Case System Explained',
        description: 'Video series explaining the German case system with examples and practice exercises.',
        content_type: 'video',
        language: 'de',
        target_language: 'en',
        difficulty: 'intermediate',
        topics: ['grammar', 'cases', 'nominative', 'accusative'],
        tags: ['german', 'grammar', 'cases', 'video'],
        url: 'https://example.com/german-cases.mp4',
        file_data: {
          duration: 2400, // 40 minutes
          mime_type: 'video/mp4'
        },
        creator_id: 'sample-user-7',
        is_public: true,
        is_premium: true,
        usage_count: 67,
        rating: { average: 4.6, count: 18 },
        reviews: []
      },
      {
        title: 'Business English Vocabulary Quiz',
        description: 'Interactive quiz covering essential business English vocabulary and expressions.',
        content_type: 'quiz',
        language: 'en',
        difficulty: 'advanced',
        topics: ['business', 'vocabulary', 'professional'],
        tags: ['english', 'business', 'vocabulary', 'quiz'],
        url: 'https://example.com/business-english-quiz',
        creator_id: 'sample-user-8',
        is_public: true,
        is_premium: false,
        usage_count: 134,
        rating: { average: 4.3, count: 22 },
        reviews: []
      }
    ]
    
    for (const resourceData of sampleResources) {
      const existingResource = await ResourceModel.findOne({ 
        title: resourceData.title,
        creator_id: resourceData.creator_id 
      })
      
      if (!existingResource) {
        const resource = await ResourceModel.create(resourceData)
        console.log(`✅ Created resource: ${resource.title}`)
      } else {
        console.log(`⚠️ Resource already exists: ${resourceData.title}`)
      }
    }
    
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('📋 Summary:')
    console.log(`   • ${sampleCommunities.length} sample communities available`)
    console.log(`   • ${sampleResources.length} sample resources available`)
    console.log('   • Communities cover multiple languages and levels')
    console.log('   • Resources include various content types and difficulties')
    console.log('\n💡 Next steps:')
    console.log('   • Start your application and explore the communities')
    console.log('   • Create user accounts to join communities')
    console.log('   • Try posting in communities and using resources')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    console.log('✨ Seeding script completed')
  }
}

// Run the script if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('👋 Seeding finished - your database now has sample data')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
