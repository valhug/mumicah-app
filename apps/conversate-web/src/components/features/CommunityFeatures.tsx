'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@mumicah/ui'
import { 
  Trophy, 
  Target, 
  Calendar, 
  Users, 
  Star,
  Clock,
  Award,
  Flame,
  Medal,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  reward: number
  participantCount: number
  deadline: Date
  completed: boolean
  progress: number
  requirements: string[]
  icon: string
  category: 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'pronunciation'
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  points: number
  streak: number
  isCurrentUser?: boolean
}

interface CommunityFeaturesProps {
  userId?: string
  className?: string
}

export default function CommunityFeatures({ userId, className = '' }: CommunityFeaturesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [userStats, setUserStats] = useState({
    totalPoints: 1250,
    currentStreak: 7,
    completedChallenges: 23,
    rank: 15
  })

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Daily Vocabulary Builder',
          description: 'Learn 5 new words and use them in sentences',
          type: 'daily',
          language: 'Spanish',
          difficulty: 'intermediate',
          reward: 50,
          participantCount: 342,
          deadline: new Date(Date.now() + 8 * 60 * 60 * 1000),
          completed: false,
          progress: 60,
          requirements: ['Learn 5 new words', 'Create example sentences', 'Record pronunciation'],
          icon: '📚',
          category: 'vocabulary'
        },
        {
          id: '2',
          title: 'Grammar Master Challenge',
          description: 'Master past perfect tense in 3 different contexts',
          type: 'weekly',
          language: 'English',
          difficulty: 'advanced',
          reward: 150,
          participantCount: 89,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          completed: true,
          progress: 100,
          requirements: ['Complete 3 exercises', 'Write 2 paragraphs', 'Pass quiz'],
          icon: '🎯',
          category: 'grammar'
        },
        {
          id: '3',
          title: 'Cultural Explorer',
          description: 'Discover 3 Japanese traditions and their significance',
          type: 'weekly',
          language: 'Japanese',
          difficulty: 'beginner',
          reward: 100,
          participantCount: 156,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          completed: false,
          progress: 33,
          requirements: ['Research 3 traditions', 'Watch cultural videos', 'Share insights'],
          icon: '🏮',
          category: 'culture'
        },
        {
          id: '4',
          title: 'Conversation Marathon',
          description: 'Have meaningful conversations with 5 different people',
          type: 'monthly',
          language: 'French',
          difficulty: 'intermediate',
          reward: 300,
          participantCount: 67,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          completed: false,
          progress: 40,
          requirements: ['5 conversations (10+ min each)', 'Different topics', 'Rate interactions'],
          icon: '💬',
          category: 'conversation'
        },
        {
          id: '5',
          title: 'Pronunciation Perfect',
          description: 'Master the rolling R sound in Spanish',
          type: 'special',
          language: 'Spanish',
          difficulty: 'intermediate',
          reward: 200,
          participantCount: 234,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          completed: false,
          progress: 0,
          requirements: ['Practice exercises', 'Record samples', 'Get feedback'],
          icon: '🎵',
          category: 'pronunciation'
        }
      ]

      const mockLeaderboard: LeaderboardEntry[] = [
        { rank: 1, name: 'Sarah Kim', avatar: '👩🏻', points: 2350, streak: 28 },
        { rank: 2, name: 'Alex Chen', avatar: '👨🏻', points: 2150, streak: 21 },
        { rank: 3, name: 'Maria Santos', avatar: '👩🏽', points: 1980, streak: 15 },
        { rank: 4, name: 'David Johnson', avatar: '👨🏻', points: 1875, streak: 19 },
        { rank: 5, name: 'Yuki Tanaka', avatar: '👩🏻', points: 1750, streak: 12 },
        { rank: 15, name: 'You', avatar: '👤', points: 1250, streak: 7, isCurrentUser: true },
      ]

      setChallenges(mockChallenges)
      setLeaderboard(mockLeaderboard)
    } catch (error) {
      console.error('Error loading community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChallenges = selectedType === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.type === selectedType)

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId)
    // In real implementation, this would join the challenge
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="h-4 w-4" />
      case 'weekly': return <Target className="h-4 w-4" />
      case 'monthly': return <Trophy className="h-4 w-4" />
      case 'special': return <Star className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const formatTimeLeft = (deadline: Date) => {
    const now = new Date()
    const timeLeft = deadline.getTime() - now.getTime()
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} days left`
    if (hours > 0) return `${hours} hours left`
    return 'Ending soon'
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Your Progress
          </h3>
          <Badge variant="default" className="flex items-center gap-1">
            <Medal className="h-3 w-3" />
            Rank #{userStats.rank}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
              <Flame className="h-5 w-5" />
              {userStats.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{userStats.completedChallenges}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">#{userStats.rank}</div>
            <div className="text-sm text-gray-600">Global Rank</div>
          </div>
        </div>
      </Card>

      {/* Challenges */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Community Challenges</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredChallenges.length} active
          </Badge>
        </div>

        {/* Challenge Type Filter */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {['all', 'daily', 'weekly', 'monthly', 'special'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map(challenge => (
            <div
              key={challenge.id}
              className={`p-4 border rounded-lg hover:shadow-sm transition-all ${
                challenge.completed ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{challenge.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getTypeIcon(challenge.type)}
                      <span className="capitalize">{challenge.type}</span>
                      <span>•</span>
                      <span>{challenge.language}</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={challenge.difficulty === 'beginner' ? 'default' : 
                           challenge.difficulty === 'intermediate' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {challenge.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {challenge.description}
              </p>

              {/* Progress Bar */}
              {challenge.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        challenge.completed ? 'bg-green-600' : 'bg-blue-600'
                      } ${challenge.progress >= 100 ? 'w-full' : 
                           challenge.progress >= 75 ? 'w-3/4' :
                           challenge.progress >= 50 ? 'w-1/2' :
                           challenge.progress >= 25 ? 'w-1/4' : 'w-1/12'}`}
                    ></div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Requirements:</div>
                <ul className="space-y-1">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        challenge.completed || (challenge.progress > (index + 1) * (100 / challenge.requirements.length))
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {challenge.completed || (challenge.progress > (index + 1) * (100 / challenge.requirements.length)) ? '✓' : index + 1}
                      </div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {challenge.participantCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {challenge.reward} pts
                  </span>
                </div>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeLeft(challenge.deadline)}
                </span>
              </div>

              <div className="flex gap-2">
                {challenge.completed ? (
                  <Button variant="outline" className="flex-1" disabled>
                    ✅ Completed
                  </Button>
                ) : challenge.progress > 0 ? (
                  <Button className="flex-1">
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="flex-1"
                  >
                    Join Challenge
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Community Leaderboard</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            This Week
          </Badge>
        </div>

        <div className="space-y-3">
          {leaderboard.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                  entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                  entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {entry.rank <= 3 ? (
                    entry.rank === 1 ? '🥇' :
                    entry.rank === 2 ? '🥈' : '🥉'
                  ) : entry.rank}
                </div>
                <div className="text-lg">{entry.avatar}</div>
                <div>
                  <div className={`font-medium ${entry.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                    {entry.name}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {entry.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
              <div className={`font-bold ${entry.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                {entry.points} pts
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
