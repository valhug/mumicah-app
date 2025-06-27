'use client'

import { useState, useEffect } from 'react'
import { Card } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { Button } from '@mumicah/ui'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target,
  Zap,
  Award,
  Clock,
  Star
} from 'lucide-react'

interface CommunityChallengesProps {
  userId?: string
  className?: string
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'weekly' | 'monthly' | 'daily' | 'special'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  participants: number
  maxParticipants: number
  prize: string
  startDate: Date
  endDate: Date
  progress?: number
  isParticipating: boolean
  language: string
}

export default function CommunityChallenges({ userId, className = '' }: CommunityChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [userStats, setUserStats] = useState({
    completedChallenges: 12,
    currentStreak: 5,
    totalPoints: 2450,
    rank: 'Gold'
  })

  useEffect(() => {
    loadChallenges()
  }, [userId])

  const loadChallenges = async () => {
    setLoading(true)
    try {
      // Mock challenges data
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Weekly Vocabulary Sprint',
          description: 'Learn 50 new words in Spanish this week',
          type: 'weekly',
          difficulty: 'intermediate',
          participants: 234,
          maxParticipants: 500,
          prize: '500 XP + Special Badge',
          startDate: new Date('2025-06-22'),
          endDate: new Date('2025-06-28'),
          progress: 68,
          isParticipating: true,
          language: 'Spanish'
        },
        {
          id: '2',
          title: 'Grammar Master Challenge',
          description: 'Complete 20 grammar exercises with 90% accuracy',
          type: 'weekly',
          difficulty: 'advanced',
          participants: 156,
          maxParticipants: 300,
          prize: '1000 XP + Grammar Pro Badge',
          startDate: new Date('2025-06-22'),
          endDate: new Date('2025-06-28'),
          progress: 0,
          isParticipating: false,
          language: 'French'
        },
        {
          id: '3',
          title: 'Daily Conversation Streak',
          description: 'Have a 10-minute conversation every day for 7 days',
          type: 'daily',
          difficulty: 'beginner',
          participants: 189,
          maxParticipants: 1000,
          prize: '300 XP + Social Butterfly Badge',
          startDate: new Date('2025-06-20'),
          endDate: new Date('2025-06-27'),
          progress: 42,
          isParticipating: true,
          language: 'English'
        },
        {
          id: '4',
          title: 'Cultural Explorer Monthly',
          description: 'Learn about 5 different cultural traditions',
          type: 'monthly',
          difficulty: 'intermediate',
          participants: 78,
          maxParticipants: 200,
          prize: '2000 XP + Culture Expert Badge',
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-06-30'),
          progress: 20,
          isParticipating: false,
          language: 'Japanese'
        },
        {
          id: '5',
          title: 'Pronunciation Perfect Week',
          description: 'Practice pronunciation for 30 minutes daily',
          type: 'special',
          difficulty: 'advanced',
          participants: 67,
          maxParticipants: 150,
          prize: '1500 XP + Perfect Pronunciation Badge',
          startDate: new Date('2025-06-24'),
          endDate: new Date('2025-06-30'),
          progress: 0,
          isParticipating: false,
          language: 'Chinese'
        }
      ]

      setChallenges(mockChallenges)
    } catch (error) {
      console.error('Error loading challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinChallenge = async (challengeId: string) => {
    try {
      // Mock join functionality
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              isParticipating: true, 
              participants: challenge.participants + 1 
            }
          : challenge
      ))
    } catch (error) {
      console.error('Error joining challenge:', error)
    }
  }

  const leaveChallenge = async (challengeId: string) => {
    try {
      // Mock leave functionality
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              isParticipating: false, 
              participants: challenge.participants - 1 
            }
          : challenge
      ))
    } catch (error) {
      console.error('Error leaving challenge:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'default'
      case 'intermediate': return 'secondary'  
      case 'advanced': return 'destructive'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return Calendar
      case 'weekly': return Target
      case 'monthly': return Award
      case 'special': return Star
      default: return Trophy
    }
  }

  const filteredChallenges = selectedType === 'all' 
    ? challenges 
    : challenges.filter(c => c.type === selectedType)

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Challenge Stats</h2>
          <Badge variant="default" className="text-sm">
            <Trophy className="h-4 w-4 mr-1" />
            {userStats.rank} Rank
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.completedChallenges}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{challenges.filter(c => c.isParticipating).length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'daily', 'weekly', 'monthly', 'special'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => {
          const TypeIcon = getTypeIcon(challenge.type)
          const isActive = challenge.isParticipating
          const progressPercentage = Math.round((challenge.participants / challenge.maxParticipants) * 100)
          
          return (
            <Card key={challenge.id} className={`p-6 hover:shadow-lg transition-shadow ${
              isActive ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-blue-100 text-blue-600`}>
                  <TypeIcon className="h-5 w-5" />
                </div>
                <Badge variant={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Language:</span>
                  <Badge variant="outline">{challenge.language}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Participants:</span>
                  <span>{challenge.participants}/{challenge.maxParticipants}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participation:</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-blue-600 h-2 rounded-full transition-all duration-300 w-[${progressPercentage}%]`}
                    ></div>
                  </div>
                </div>
                
                {challenge.progress !== undefined && isActive && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your Progress:</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-green-600 h-2 rounded-full transition-all duration-300 w-[${challenge.progress}%]`}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Ends:
                  </span>
                  <span>{challenge.endDate.toLocaleDateString()}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Prize: </span>
                  <span className="font-medium text-orange-600">{challenge.prize}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isActive ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => leaveChallenge(challenge.id)}
                      className="flex-1"
                    >
                      Leave Challenge
                    </Button>
                    {challenge.progress !== undefined && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => joinChallenge(challenge.id)}
                    className="flex-1"
                    disabled={challenge.participants >= challenge.maxParticipants}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    {challenge.participants >= challenge.maxParticipants ? 'Full' : 'Join Challenge'}
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
          <p className="text-gray-600">Try selecting a different challenge type.</p>
        </div>
      )}
    </div>
  )
}
