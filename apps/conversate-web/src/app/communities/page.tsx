'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Community } from '@/models/Community'
import AppHeader from '@/components/layout/AppHeader'
import CommunityFeatures from '@/components/features/CommunityFeatures'
import SocialFeatures from '@/components/features/SocialFeatures'
import GamificationSystem from '@/components/features/GamificationSystem'
import { CommunityFeatureCard } from '@/components/features/CommunityFeatureCard'
import { motion } from 'framer-motion'

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [userCommunities, setUserCommunities] = useState<string[]>([])

  const supabase = createClient()

  useEffect(() => {
    fetchCommunities()
    fetchUserCommunities()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    filterCommunities()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communities, searchQuery, selectedLanguage, selectedCategory])

  const fetchCommunities = async () => {
    try {
      // For now, we'll use mock data since MongoDB might not be connected
      const mockCommunities: Community[] = [
        {
          _id: '1',
          name: 'Spanish for Travel',
          description: 'Practice Spanish for your next vacation! Share travel tips and practice conversations.',
          language: 'Spanish',
          category: 'Travel',
          memberCount: 156,
          isActive: true,
          difficulty: 'Beginner',
          tags: ['travel', 'vacation', 'culture'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          name: 'French Business Network',
          description: 'Professional French practice for career advancement and business communication.',
          language: 'French',
          category: 'Business',
          memberCount: 89,
          isActive: true,
          difficulty: 'Intermediate',
          tags: ['business', 'professional', 'networking'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '3',
          name: 'Japanese Anime & Manga',
          description: 'Learn Japanese through anime, manga, and pop culture discussions.',
          language: 'Japanese',
          category: 'Entertainment',
          memberCount: 234,
          isActive: true,
          difficulty: 'Beginner',
          tags: ['anime', 'manga', 'culture', 'entertainment'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '4',
          name: 'German Tech Talk',
          description: 'Technical German practice for developers and IT professionals.',
          language: 'German',
          category: 'Technology',
          memberCount: 67,
          isActive: true,
          difficulty: 'Advanced',
          tags: ['technology', 'programming', 'IT'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      setCommunities(mockCommunities)
    } catch (error) {
      console.error('Error fetching communities:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCommunities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Mock user communities for now
        setUserCommunities(['1', '3'])
      }
    } catch (error) {
      console.error('Error fetching user communities:', error)
    }
  }

  const filterCommunities = () => {
    let filtered = communities

    if (searchQuery) {      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedLanguage) {
      filtered = filtered.filter(community => community.language === selectedLanguage)
    }

    if (selectedCategory) {
      filtered = filtered.filter(community => community.category === selectedCategory)
    }

    setFilteredCommunities(filtered)
  }

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to login
        window.location.href = '/login'
        return
      }

      // Check if user already joined 3 communities (free tier limit)
      if (userCommunities.length >= 3 && !userCommunities.includes(communityId)) {
        alert('Free users can join up to 3 communities. Upgrade to Pro for unlimited access!')
        return
      }

      // Mock joining logic - in real app, this would call our community service
      setUserCommunities(prev => 
        prev.includes(communityId) 
          ? prev.filter(id => id !== communityId)
          : [...prev, communityId]
      )

      // Update member count optimistically
      setCommunities(prev => prev.map(community => 
        community._id === communityId 
          ? { 
              ...community, 
              memberCount: userCommunities.includes(communityId) 
                ? community.memberCount - 1 
                : community.memberCount + 1 
            }
          : community
      ))

    } catch (error) {
      console.error('Error joining community:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen surface-secondary">
        <AppHeader />
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="body-regular content-secondary">Loading communities...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen surface-secondary">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="h1-bold content-primary mb-4">
            Discover Communities
          </h1>
          <p className="paragraph-regular content-secondary">
            Join communities that match your interests and practice with like-minded learners
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full px-4 py-3 pl-10 rounded-lg border border-primary surface-primary content-primary focus:border-focus focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none placeholder:content-tertiary"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 content-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Simple Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="language-filter" className="sr-only">Filter by language</label>
              <select
                id="language-filter"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 rounded-lg border border-primary surface-primary content-primary focus:border-focus focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="">All Languages</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="sr-only">Filter by category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-primary surface-primary content-primary focus:border-focus focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="business">Business</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap gap-4 body-regular content-secondary">
          <span>{filteredCommunities.length} communities found</span>
          <span>•</span>
          <span>{userCommunities.length}/3 communities joined</span>
          {userCommunities.length >= 3 && (
            <>
              <span>•</span>
              <span className="text-warning">
                Upgrade to Pro for unlimited communities
              </span>
            </>
          )}
        </div>

        {/* Communities Grid */}
        {filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <div key={community._id} className="card-wrapper p-6 space-y-4 hover:surface-secondary transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="h3-semibold content-primary">{community.name}</h3>
                    <p className="body-regular content-secondary line-clamp-2">
                      {community.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      community.language === 'english' ? 'bg-blue-100 text-blue-800' :
                      community.language === 'spanish' ? 'bg-red-100 text-red-800' :
                      community.language === 'french' ? 'bg-green-100 text-green-800' :
                      community.language === 'german' ? 'bg-yellow-100 text-yellow-800' :
                      community.language === 'japanese' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {community.language}
                    </span>
                    <span className="small-medium content-tertiary">
                      {community.memberCount} members
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="small-medium content-secondary">Active</span>
                    </div>
                    <span className="small-medium content-tertiary">•</span>
                    <span className="small-medium content-tertiary capitalize">
                      {community.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleJoinCommunity(community._id)}
                    disabled={userCommunities.includes(community._id)}
                    className={`px-4 py-2 rounded-lg body-medium font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      userCommunities.includes(community._id)
                        ? 'surface-secondary content-secondary cursor-not-allowed'
                        : 'bg-brand text-white hover:bg-primary/90'
                    }`}
                  >
                    {userCommunities.includes(community._id) ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 content-tertiary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="h3-semibold content-primary mb-2">No communities found</h3>
            <p className="paragraph-regular content-secondary">
              Try adjusting your search criteria or filters to find more communities.
            </p>
          </div>
        )}

        {/* Community Features - New Section */}
        <div className="mt-12">
          <h2 className="h2-semibold content-primary mb-6">
            Why Join a Community?
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <CommunityFeatureCard 
              title="Collaborative Learning"
              description="Engage in group activities, share resources, and learn from each other."
              icon="🤝"
            />
            <CommunityFeatureCard 
              title="Expert Guidance"
              description="Get tips and feedback from experienced learners and native speakers."
              icon="🧑‍🏫"
            />
            <CommunityFeatureCard 
              title="Cultural Exchange"
              description="Discover new cultures and perspectives through community interactions."
              icon="🌍"
            />
            <CommunityFeatureCard 
              title="Networking Opportunities"
              description="Connect with professionals and expand your career opportunities."
              icon="💼"
            />
            <CommunityFeatureCard 
              title="Fun and Engaging"
              description="Participate in challenges, games, and events to make learning enjoyable."
              icon="🎉"
            />
            <CommunityFeatureCard 
              title="Flexible Learning"
              description="Access resources and discussions anytime, anywhere, at your own pace."
              icon="🕒"
            />
          </motion.div>
        </div>

        {/* Community Challenges and Leaderboard */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CommunityFeatures userId="demo-user" />
          </motion.div>
        </div>

        {/* Enhanced Social Learning Hub */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SocialFeatures userId="demo-user" />
          </motion.div>
        </div>

        {/* Advanced Gamification System */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GamificationSystem userId="demo-user" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
