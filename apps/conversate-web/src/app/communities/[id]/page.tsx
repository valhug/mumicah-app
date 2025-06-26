'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Community } from '@/models/Community'
import { 
  AppContainer,
  ContentContainer,
  PageHeader,
  ContentCard,
  CardContent,
  Badge,
  Button,
  LoadingSpinner,
  EmptyState
} from '@mumicah/ui'
import AppHeader from '@/components/layout/AppHeader'

export default function CommunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchCommunity(params.id as string)
    }
  }, [params.id])

  const fetchCommunity = async (id: string) => {
    try {
      // Mock community data for now
      const mockCommunity: Community = {
        _id: id,
        name: 'Spanish for Travel',
        description: 'Practice Spanish for your next vacation! Share travel tips, practice conversations, and learn about Spanish-speaking cultures. Whether you\'re planning a trip to Spain, Mexico, or any other Spanish-speaking country, this community will help you communicate confidently during your travels.',
        language: 'Spanish',
        category: 'Travel',
        memberCount: 156,
        isActive: true,
        difficulty: 'Beginner',
        tags: ['travel', 'vacation', 'culture', 'conversation', 'beginner-friendly'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }
      
      setCommunity(mockCommunity)
      
      // Check if user is already a member
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Mock check - in real app this would query the database
        setIsJoined(['1', '3'].includes(id))
      }
    } catch (error) {
      console.error('Error fetching community:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinCommunity = async () => {
    try {
      setIsJoining(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Mock joining logic
      setIsJoined(!isJoined)
      setCommunity(prev => 
        prev ? {
          ...prev,
          memberCount: isJoined ? prev.memberCount - 1 : prev.memberCount + 1
        } : null
      )
    } catch (error) {
      console.error('Error joining community:', error)
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Community Not Found
          </h1>
          <button
            onClick={() => router.push('/communities')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Communities
          </button>
        </div>
      </div>
    )
  }

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Japanese': '🇯🇵',
      'Korean': '🇰🇷',
      'Chinese': '🇨🇳',
      'Arabic': '🇸🇦',
      'Russian': '🇷🇺'
    }
    return flags[language] || '🌍'
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/communities')}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Communities
        </button>

        {/* Community Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-6xl">{getLanguageFlag(community.language)}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {community.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                    <span className="text-lg">{community.language}</span>
                    {community.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(community.difficulty)}`}>
                        {community.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleJoinCommunity}
                disabled={isJoining}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  isJoined
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isJoining ? 'Processing...' : isJoined ? 'Leave Community' : 'Join Community'}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>{community.memberCount} members</span>
              </div>
              {community.category && (
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{community.category}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${community.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span>{community.isActive ? 'Active community' : 'Quiet community'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {community.description}
              </p>
            </div>

            {/* Tags */}
            {community.tags && community.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Content Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.937l-3.42 1.14A1 1 0 014.73 19.24l1.14-3.42A8.955 8.955 0 013 12a8 8 0 118 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start the conversation!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {isJoined 
                ? 'This community is ready for your first post. Share something with your fellow learners!'
                : 'Join this community to start participating in discussions and practice your language skills.'
              }
            </p>
            {isJoined ? (
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium">
                Create Post
              </button>
            ) : (
              <button
                onClick={handleJoinCommunity}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                Join to Participate
              </button>
            )}
          </div>        </div>
      </div>
    </div>
  )
}
