'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@mumicah/ui'
import { 
  Users, 
  Calendar, 
  Clock, 
  Globe, 
  Video,
  BookOpen,
  Plus,
  Star,
  MessageCircle
} from 'lucide-react'

interface StudyGroup {
  id: string
  name: string
  description: string
  language: string
  level: string
  topic: string
  memberCount: number
  maxMembers: number
  meetingTime: string
  timezone: string
  frequency: string
  nextSession: Date
  hostName: string
  hostAvatar: string
  tags: string[]
  isPrivate: boolean
  rating: number
  joined: boolean
}

interface StudyGroupsProps {
  userId?: string
  className?: string
}

export default function StudyGroups({ userId, className = '' }: StudyGroupsProps) {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'joined' | 'available'>('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadStudyGroups()
  }, [])

  const loadStudyGroups = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      const mockGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'Spanish Conversation Circle',
          description: 'Practice everyday Spanish conversations in a supportive environment. Perfect for intermediate learners!',
          language: 'Spanish',
          level: 'Intermediate',
          topic: 'Conversation Practice',
          memberCount: 8,
          maxMembers: 12,
          meetingTime: '18:00',
          timezone: 'UTC',
          frequency: 'Weekly',
          nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          hostName: 'Maria Rodriguez',
          hostAvatar: '👩🏻',
          tags: ['Conversation', 'Culture', 'Intermediate'],
          isPrivate: false,
          rating: 4.8,
          joined: true
        },
        {
          id: '2',
          name: 'Japanese Grammar Deep Dive',
          description: 'Intensive study sessions focusing on complex Japanese grammar patterns. Homework and practice included.',
          language: 'Japanese',
          level: 'Advanced',
          topic: 'Grammar',
          memberCount: 5,
          maxMembers: 8,
          meetingTime: '14:00',
          timezone: 'JST',
          frequency: 'Bi-weekly',
          nextSession: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          hostName: 'Kenji Yamamoto',
          hostAvatar: '👨🏻',
          tags: ['Grammar', 'Advanced', 'Structured'],
          isPrivate: false,
          rating: 4.9,
          joined: false
        },
        {
          id: '3',
          name: 'French Movie Club',
          description: 'Watch and discuss French films to improve listening skills and cultural understanding.',
          language: 'French',
          level: 'Intermediate',
          topic: 'Culture & Media',
          memberCount: 10,
          maxMembers: 15,
          meetingTime: '20:00',
          timezone: 'CET',
          frequency: 'Weekly',
          nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          hostName: 'Claire Dubois',
          hostAvatar: '👩🏻',
          tags: ['Movies', 'Culture', 'Listening'],
          isPrivate: false,
          rating: 4.7,
          joined: true
        },
        {
          id: '4',
          name: 'Business English Mastery',
          description: 'Professional English skills for workplace success. Cover presentations, meetings, and email writing.',
          language: 'English',
          level: 'Advanced',
          topic: 'Business',
          memberCount: 12,
          maxMembers: 15,
          meetingTime: '19:00',
          timezone: 'EST',
          frequency: 'Weekly',
          nextSession: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          hostName: 'David Thompson',
          hostAvatar: '👨🏻',
          tags: ['Business', 'Professional', 'Writing'],
          isPrivate: false,
          rating: 4.8,
          joined: false
        },
        {
          id: '5',
          name: 'Beginner Korean Study Buddy',
          description: 'Start your Korean journey with fellow beginners. Learn Hangul, basic phrases, and Korean culture.',
          language: 'Korean',
          level: 'Beginner',
          topic: 'Basics',
          memberCount: 6,
          maxMembers: 10,
          meetingTime: '16:00',
          timezone: 'KST',
          frequency: 'Twice Weekly',
          nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          hostName: 'Min-jun Park',
          hostAvatar: '👨🏻',
          tags: ['Beginner', 'Hangul', 'Culture'],
          isPrivate: false,
          rating: 4.6,
          joined: false
        },
        {
          id: '6',
          name: 'Portuguese Pronunciation Workshop',
          description: 'Focus on Brazilian Portuguese pronunciation and accent improvement through guided practice.',
          language: 'Portuguese',
          level: 'Intermediate',
          topic: 'Pronunciation',
          memberCount: 4,
          maxMembers: 6,
          meetingTime: '21:00',
          timezone: 'BRT',
          frequency: 'Weekly',
          nextSession: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          hostName: 'Ana Silva',
          hostAvatar: '👩🏽',
          tags: ['Pronunciation', 'Brazilian', 'Small Group'],
          isPrivate: true,
          rating: 4.9,
          joined: false
        }
      ]

      setGroups(mockGroups)
    } catch (error) {
      console.error('Error loading study groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesFilter = filter === 'all' || 
      (filter === 'joined' && group.joined) ||
      (filter === 'available' && !group.joined)
    
    const matchesLanguage = selectedLanguage === 'all' || group.language === selectedLanguage

    return matchesFilter && matchesLanguage
  })

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, joined: true, memberCount: group.memberCount + 1 } : group
    ))
  }

  const handleLeaveGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, joined: false, memberCount: group.memberCount - 1 } : group
    ))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-56 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Study Groups</h3>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'joined', 'available'].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterOption === 'all' ? 'All Groups' :
               filterOption === 'joined' ? 'My Groups' : 'Available'}
            </button>
          ))}
        </div>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border border-gray-200 rounded px-3 py-1 text-sm"
          aria-label="Filter by language"
        >
          <option value="all">All Languages</option>
          <option value="Spanish">Spanish</option>
          <option value="Japanese">Japanese</option>
          <option value="French">French</option>
          <option value="English">English</option>
          <option value="Korean">Korean</option>
          <option value="Portuguese">Portuguese</option>
        </select>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map(group => (
          <div
            key={group.id}
            className={`p-4 border rounded-lg hover:shadow-sm transition-all ${
              group.joined ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{group.name}</h4>
                  {group.isPrivate && (
                    <Badge variant="outline" className="text-xs">
                      Private
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {group.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {group.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {group.rating}
                  </span>
                </div>
              </div>
              {group.joined && (
                <Badge variant="default" className="text-xs">
                  Joined
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {group.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Next: {formatDate(group.nextSession)} at {group.meetingTime} {group.timezone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{group.frequency}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{group.memberCount}/{group.maxMembers} members</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="text-lg">{group.hostAvatar}</div>
              <span className="text-sm text-gray-600">Hosted by {group.hostName}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {group.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {group.joined ? (
                <>
                  <Button
                    size="sm"
                    className="flex-1 flex items-center gap-1"
                  >
                    <Video className="h-3 w-3" />
                    Join Session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLeaveGroup(group.id)}
                  >
                    Leave
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={group.memberCount >= group.maxMembers}
                    className="flex-1"
                  >
                    {group.memberCount >= group.maxMembers ? 'Full' : 'Join Group'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No study groups found matching your criteria.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="mt-2"
          >
            Create your own group
          </Button>
        </div>
      )}

      {/* Create Group Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create Study Group</h3>
            <p className="text-gray-600 mb-4">
              This feature will allow you to create and manage your own study groups.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
