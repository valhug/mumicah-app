'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Community } from '@/models/Community'
import { CommunityCard } from '@/components/features/CommunityCard'
import { CommunityFilters } from '@/components/features/CommunityFilters'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import AppHeader from '@/components/layout/AppHeader'

interface CommunityPageProps {}

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
  }, [])

  useEffect(() => {
    filterCommunities()
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Communities
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join communities that match your interests and practice with like-minded learners
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search communities by name, description, or tags..."
          />
          
          <CommunityFilters
            selectedLanguage={selectedLanguage}
            selectedCategory={selectedCategory}
            onLanguageChange={setSelectedLanguage}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>{filteredCommunities.length} communities found</span>
          <span>•</span>
          <span>{userCommunities.length}/3 communities joined</span>
          {userCommunities.length >= 3 && (
            <>
              <span>•</span>
              <span className="text-orange-600 dark:text-orange-400">
                Upgrade to Pro for unlimited communities
              </span>
            </>
          )}
        </div>

        {/* Communities Grid */}
        {filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community._id}
                community={community}
                isJoined={userCommunities.includes(community._id)}
                onJoin={() => handleJoinCommunity(community._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No communities found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or filters to find more communities.
              </p>
            </div>          </div>
        )}
      </div>
    </div>
  )
}
