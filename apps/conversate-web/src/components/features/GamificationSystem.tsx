'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@mumicah/ui'
import { Progress } from '@/components/ui/progress'
import { cn } from '@mumicah/shared'
import { 
  Trophy, 
  Crown, 
  Flame, 
  Star, 
  Calendar,
  Users,
  Target,
  Zap,
  Gift,
  Clock,
  Medal,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Globe,
  Swords,
  Shield
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/common/Toast'

interface SeasonalEvent {
  id: string
  title: string
  description: string
  theme: 'spring' | 'summer' | 'autumn' | 'winter' | 'holiday' | 'special'
  startDate: Date
  endDate: Date
  isActive: boolean
  rewards: {
    bronze: string
    silver: string
    gold: string
    platinum: string
  }
  requirements: {
    bronze: number
    silver: number
    gold: number
    platinum: number
  }
  userProgress: number
  participants: number
  icon: string
  backgroundGradient: string
  specialRules?: string[]
}

interface Tournament {
  id: string
  title: string
  description: string
  type: 'bracket' | 'ladder' | 'round_robin' | 'battle_royale'
  skill: 'vocabulary' | 'grammar' | 'conversation' | 'pronunciation' | 'culture'
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed'
  entryFee: number
  prizePool: string
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  duration: string // e.g., "3 days", "1 week"
  status: 'upcoming' | 'active' | 'completed'
  userRank?: number
  isRegistered: boolean
  rounds?: {
    current: number
    total: number
    nextMatch?: Date
  }
  leaderboard: {
    rank: number
    name: string
    avatar: string
    score: number
    isCurrentUser?: boolean
  }[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'seasonal' | 'tournament' | 'milestone' | 'streak' | 'social' | 'rare'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  points: number
  isUnlocked: boolean
  unlockedAt?: Date
  progress?: {
    current: number
    target: number
  }
  requirements: string[]
  seasonalEvent?: string
  tournamentId?: string
}

interface GamificationSystemProps {
  userId?: string
  className?: string
}

export default function GamificationSystem({ userId = 'demo', className = '' }: GamificationSystemProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'tournaments' | 'achievements'>('events')
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const { success } = useToast()

  useEffect(() => {
    loadGamificationData()
  }, [userId])

  const loadGamificationData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock seasonal events
      const mockEvents: SeasonalEvent[] = [
        {
          id: '1',
          title: 'Summer Language Festival',
          description: 'Celebrate the joy of learning with special summer challenges!',
          theme: 'summer',
          startDate: new Date('2025-06-21'),
          endDate: new Date('2025-09-21'),
          isActive: true,
          rewards: {
            bronze: '500 XP + Summer Badge',
            silver: '1000 XP + Sun Seeker Badge',
            gold: '2000 XP + Festival Champion Badge',
            platinum: '5000 XP + Legendary Summer Crown'
          },
          requirements: {
            bronze: 10,
            silver: 25,
            gold: 50,
            platinum: 100
          },
          userProgress: 32,
          participants: 2567,
          icon: '☀️',
          backgroundGradient: 'from-yellow-400 via-orange-500 to-red-500',
          specialRules: [
            'Double XP for outdoor conversation topics',
            'Special avatar decorations available',
            'Exclusive summer personas unlocked'
          ]
        },
        {
          id: '2',
          title: 'Global Unity Challenge',
          description: 'Connect with learners worldwide in this special international event',
          theme: 'special',
          startDate: new Date('2025-07-01'),
          endDate: new Date('2025-07-31'),
          isActive: true,
          rewards: {
            bronze: '300 XP + Unity Badge',
            silver: '750 XP + Ambassador Badge',
            gold: '1500 XP + Global Citizen Badge',
            platinum: '3000 XP + World Harmony Crown'
          },
          requirements: {
            bronze: 5,
            silver: 15,
            gold: 30,
            platinum: 60
          },
          userProgress: 12,
          participants: 4821,
          icon: '🌍',
          backgroundGradient: 'from-blue-400 via-green-500 to-blue-600',
          specialRules: [
            'Connect with learners from 10+ countries',
            'Learn greetings in 5 different languages',
            'Share cultural traditions'
          ]
        },
        {
          id: '3',
          title: 'Autumn Wisdom Quest',
          description: 'Discover the depth of language learning as we transition to autumn',
          theme: 'autumn',
          startDate: new Date('2025-09-21'),
          endDate: new Date('2025-12-21'),
          isActive: false,
          rewards: {
            bronze: '400 XP + Autumn Leaf Badge',
            silver: '900 XP + Wisdom Seeker Badge',
            gold: '1800 XP + Autumn Scholar Badge',
            platinum: '4000 XP + Harvest Crown'
          },
          requirements: {
            bronze: 8,
            silver: 20,
            gold: 40,
            platinum: 80
          },
          userProgress: 0,
          participants: 0,
          icon: '🍂',
          backgroundGradient: 'from-orange-400 via-red-500 to-yellow-600'
        }
      ]

      // Mock tournaments
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          title: 'Spanish Vocabulary Championship',
          description: 'Test your Spanish vocabulary knowledge against the best learners',
          type: 'bracket',
          skill: 'vocabulary',
          language: 'Spanish',
          difficulty: 'intermediate',
          entryFee: 100,
          prizePool: '10,000 XP + Exclusive Vocabulary Master Badge',
          maxParticipants: 64,
          currentParticipants: 48,
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          duration: '3 days',
          status: 'upcoming',
          isRegistered: true,
          rounds: {
            current: 0,
            total: 6,
            nextMatch: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
          },
          leaderboard: [
            { rank: 1, name: 'Elena Rodriguez', avatar: '👩🏽‍🎓', score: 2850 },
            { rank: 2, name: 'Carlos Martinez', avatar: '👨🏽‍💻', score: 2720 },
            { rank: 3, name: 'You', avatar: '👤', score: 2650, isCurrentUser: true },
            { rank: 4, name: 'Sofia Chen', avatar: '👩🏻‍🏫', score: 2580 },
            { rank: 5, name: 'Diego Santos', avatar: '👨🏽‍🎨', score: 2420 }
          ]
        },
        {
          id: '2',
          title: 'Global Grammar Gauntlet',
          description: 'Master grammar rules across multiple languages in this intense competition',
          type: 'ladder',
          skill: 'grammar',
          language: 'Multiple',
          difficulty: 'advanced',
          entryFee: 150,
          prizePool: '15,000 XP + Grammar Grandmaster Title',
          maxParticipants: 100,
          currentParticipants: 87,
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          duration: '1 week',
          status: 'upcoming',
          isRegistered: false,
          leaderboard: [
            { rank: 1, name: 'Dr. Linguistics', avatar: '👨🏼‍🏫', score: 3200 },
            { rank: 2, name: 'Grammar Queen', avatar: '👩🏻‍🎓', score: 3150 },
            { rank: 3, name: 'Syntax Master', avatar: '👨🏽‍💻', score: 3050 }
          ]
        },
        {
          id: '3',
          title: 'Conversation Champions League',
          description: 'Real-time conversation battles with native speakers and advanced learners',
          type: 'round_robin',
          skill: 'conversation',
          language: 'French',
          difficulty: 'mixed',
          entryFee: 200,
          prizePool: '20,000 XP + Conversation Crown + Exclusive Persona',
          maxParticipants: 32,
          currentParticipants: 29,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          duration: '2 weeks',
          status: 'upcoming',
          isRegistered: false,
          leaderboard: [
            { rank: 1, name: 'Marie Dubois', avatar: '👩🏼‍🏫', score: 3800 },
            { rank: 2, name: 'Jean-Luc Picard', avatar: '👨🏼‍🚀', score: 3650 },
            { rank: 3, name: 'Amelie Poulain', avatar: '👩🏻‍🎨', score: 3500 }
          ]
        },
        {
          id: '4',
          title: 'Pronunciation Perfection Battle',
          description: 'Show off your pronunciation skills in live challenges',
          type: 'battle_royale',
          skill: 'pronunciation',
          language: 'Japanese',
          difficulty: 'beginner',
          entryFee: 75,
          prizePool: '7,500 XP + Perfect Pronunciation Badge',
          maxParticipants: 50,
          currentParticipants: 42,
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: '6 hours',
          status: 'active',
          userRank: 8,
          isRegistered: true,
          rounds: {
            current: 3,
            total: 5,
            nextMatch: new Date(Date.now() + 30 * 60 * 1000)
          },
          leaderboard: [
            { rank: 1, name: 'Yuki Tanaka', avatar: '👩🏻‍🎓', score: 4200 },
            { rank: 2, name: 'Hiroshi Sato', avatar: '👨🏻‍💼', score: 4100 },
            { rank: 3, name: 'Akira Yamamoto', avatar: '👨🏻‍🎨', score: 3950 },
            { rank: 8, name: 'You', avatar: '👤', score: 3400, isCurrentUser: true }
          ]
        }
      ]

      // Mock achievements
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'Summer Festival Champion',
          description: 'Completed all Summer Festival challenges',
          icon: '👑',
          category: 'seasonal',
          rarity: 'legendary',
          points: 5000,
          isUnlocked: false,
          progress: { current: 32, target: 100 },
          requirements: ['Complete 100 summer challenges', 'Earn Festival Gold tier', 'Help 10 friends'],
          seasonalEvent: '1'
        },
        {
          id: '2',
          title: 'Tournament Victor',
          description: 'Won first place in any tournament',
          icon: '🏆',
          category: 'tournament',
          rarity: 'epic',
          points: 2000,
          isUnlocked: false,
          requirements: ['Win any tournament', 'Maintain 90%+ accuracy', 'Show good sportsmanship'],
          tournamentId: '1'
        },
        {
          id: '3',
          title: 'Global Unity Ambassador',
          description: 'Connected with learners from 10 different countries',
          icon: '🌍',
          category: 'seasonal',
          rarity: 'rare',
          points: 1500,
          isUnlocked: false,
          progress: { current: 12, target: 60 },
          requirements: ['Connect with 10+ countries', 'Share cultural insights', 'Help newcomers'],
          seasonalEvent: '2'
        },
        {
          id: '4',
          title: 'Mythic Learner',
          description: 'Achieved the impossible - mastered all aspects of language learning',
          icon: '⭐',
          category: 'milestone',
          rarity: 'mythic',
          points: 10000,
          isUnlocked: false,
          progress: { current: 3, target: 10 },
          requirements: [
            'Win 5 tournaments',
            'Complete 10 seasonal events',
            'Maintain 365-day streak',
            'Help 100 learners',
            'Master 5 languages'
          ]
        },
        {
          id: '5',
          title: 'Pronunciation Perfect',
          description: 'Achieved perfect pronunciation scores in 3 languages',
          icon: '🎤',
          category: 'tournament',
          rarity: 'epic',
          points: 2500,
          isUnlocked: true,
          unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          requirements: ['Perfect pronunciation in 3 languages', 'Win pronunciation tournament'],
          tournamentId: '4'
        }
      ]

      setSeasonalEvents(mockEvents)
      setTournaments(mockTournaments)
      setAchievements(mockAchievements)
    } catch (error) {
      console.error('Error loading gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinEvent = async () => {
    try {
      success('Joined Event!', `You're now participating in this seasonal event`)
    } catch (error) {
      console.error('Error joining event:', error)
    }
  }

  const handleRegisterTournament = async (tournamentId: string) => {
    try {
      setTournaments(prev => prev.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, isRegistered: true, currentParticipants: tournament.currentParticipants + 1 }
          : tournament
      ))
      success('Tournament Registration', `Successfully registered for tournament!`)
    } catch (error) {
      console.error('Error registering for tournament:', error)
    }
  }

  const getTournamentTypeIcon = (type: Tournament['type']) => {
    switch (type) {
      case 'bracket': return <Trophy className="w-4 h-4" />
      case 'ladder': return <TrendingUp className="w-4 h-4" />
      case 'round_robin': return <Target className="w-4 h-4" />
      case 'battle_royale': return <Swords className="w-4 h-4" />
      default: return <Trophy className="w-4 h-4" />
    }
  }

  const getSkillIcon = (skill: Tournament['skill']) => {
    switch (skill) {
      case 'vocabulary': return <BookOpen className="w-4 h-4" />
      case 'grammar': return <Shield className="w-4 h-4" />
      case 'conversation': return <Users className="w-4 h-4" />
      case 'pronunciation': return <Sparkles className="w-4 h-4" />
      case 'culture': return <Globe className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      case 'rare': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'epic': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'legendary': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'mythic': return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-transparent bg-clip-text'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const formatTimeLeft = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days > 1) return `${days} days`
    return 'Ended'
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Enhanced Gamification
          </h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Level Up Your Learning
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'events', label: 'Seasonal Events', icon: Calendar, count: seasonalEvents.filter(e => e.isActive).length },
            { id: 'tournaments', label: 'Tournaments', icon: Trophy, count: tournaments.filter(t => t.status === 'active' || t.status === 'upcoming').length },
            { id: 'achievements', label: 'Special Achievements', icon: Crown, count: achievements.filter(a => a.category === 'seasonal' || a.category === 'tournament').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'events' | 'tournaments' | 'achievements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Seasonal Events Tab */}
      {activeTab === 'events' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {seasonalEvents.map(event => (
            <Card key={event.id} className="overflow-hidden">
              <div className={`h-32 bg-gradient-to-r ${event.backgroundGradient} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-between p-6">
                  <div>
                    <div className="text-4xl mb-2">{event.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                    <p className="text-white/90">{event.description}</p>
                  </div>
                  <div className="text-right text-white">
                    <div className="text-sm opacity-90">
                      {event.isActive ? `${formatTimeLeft(event.endDate)} left` : 'Coming Soon'}
                    </div>
                    <div className="text-2xl font-bold">{event.participants.toLocaleString()}</div>
                    <div className="text-sm">participants</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm text-gray-600">{event.userProgress}/100 challenges</span>
                  </div>
                  <Progress value={event.userProgress} className="h-3" />
                </div>

                {/* Rewards Tiers */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-500" />
                    Reward Tiers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(event.rewards).map(([tier, reward]) => {
                      const requirement = event.requirements[tier as keyof typeof event.requirements]
                      const isUnlocked = event.userProgress >= requirement
                      const tierColors = {
                        bronze: 'from-amber-600 to-yellow-600',
                        silver: 'from-gray-400 to-gray-600',
                        gold: 'from-yellow-400 to-yellow-600',
                        platinum: 'from-purple-400 to-purple-600'
                      }
                      
                      return (
                        <div
                          key={tier}
                          className={`p-3 rounded-lg border text-center ${
                            isUnlocked 
                              ? 'bg-gradient-to-br ' + tierColors[tier as keyof typeof tierColors] + ' text-white'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-xs font-medium uppercase mb-1">
                            {tier}
                          </div>
                          <div className="text-xs mb-2">
                            {requirement} challenges
                          </div>
                          <div className="text-xs">
                            {reward}
                          </div>
                          {isUnlocked && (
                            <div className="mt-2">
                              <Medal className="w-4 h-4 mx-auto" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Special Rules */}
                {event.specialRules && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-500" />
                      Special Rules
                    </h4>
                    <ul className="space-y-2">
                      {event.specialRules.map((rule, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {event.isActive ? (
                    <>
                      <Button 
                        onClick={() => handleJoinEvent()}
                        className="flex-1"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Continue Event
                      </Button>
                      <Button variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Leaderboard
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" disabled className="flex-1">
                      <Clock className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {tournaments.map(tournament => (
            <Card key={tournament.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                    <Badge
                      variant={tournament.status === 'active' ? 'default' : 
                               tournament.status === 'upcoming' ? 'secondary' : 'outline'}
                      className="capitalize"
                    >
                      {tournament.status}
                    </Badge>
                    {tournament.userRank && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Rank #{tournament.userRank}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{tournament.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getTournamentTypeIcon(tournament.type)}
                      <span className="capitalize">{tournament.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getSkillIcon(tournament.skill)}
                      <span className="capitalize">{tournament.skill}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{tournament.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{tournament.duration}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                      <div className="text-xs text-gray-600">Participants</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{tournament.entryFee}</div>
                      <div className="text-xs text-gray-600">Entry Fee (XP)</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600 capitalize">{tournament.difficulty}</div>
                      <div className="text-xs text-gray-600">Difficulty</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{formatTimeLeft(tournament.startDate)}</div>
                      <div className="text-xs text-gray-600">Starts</div>
                    </div>
                  </div>

                  {/* Tournament Progress */}
                  {tournament.rounds && tournament.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Tournament Progress</span>
                        <span className="text-sm text-gray-600">Round {tournament.rounds.current}/{tournament.rounds.total}</span>
                      </div>
                      <Progress 
                        value={(tournament.rounds.current / tournament.rounds.total) * 100} 
                        className="h-2"
                      />
                      {tournament.rounds.nextMatch && (
                        <div className="text-xs text-gray-500 mt-1">
                          Next match: {tournament.rounds.nextMatch.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-amber-600 font-medium mb-4">
                    🏆 Prize Pool: {tournament.prizePool}
                  </div>
                </div>
              </div>

              {/* Leaderboard Preview */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Current Leaderboard
                </h4>
                <div className="space-y-2">
                  {tournament.leaderboard.slice(0, 3).map(player => (
                    <div
                      key={player.rank}
                      className={`flex items-center justify-between p-2 rounded ${
                        player.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          player.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {player.rank <= 3 ? (
                            player.rank === 1 ? '🥇' :
                            player.rank === 2 ? '🥈' : '🥉'
                          ) : player.rank}
                        </div>
                        <span className="text-lg">{player.avatar}</span>
                        <span className={`font-medium ${player.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                          {player.name}
                        </span>
                      </div>
                      <div className="font-bold text-gray-900">
                        {player.score} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {tournament.isRegistered ? (
                  <>
                    <Button variant="default" className="flex-1">
                      <Zap className="w-4 h-4 mr-2" />
                      {tournament.status === 'active' ? 'Enter Battle' : 'Prepare'}
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleRegisterTournament(tournament.id)}
                      className="flex-1"
                      disabled={tournament.currentParticipants >= tournament.maxParticipants}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      {tournament.currentParticipants >= tournament.maxParticipants ? 'Tournament Full' : 'Register'}
                    </Button>
                    <Button variant="outline">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Special Achievements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-6 border rounded-lg transition-all ${
                    achievement.isUnlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-sm' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="text-right">
                      <Badge className={cn("text-xs mb-2", getRarityColor(achievement.rarity))}>
                        {achievement.rarity}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        +{achievement.points} XP
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

                  {/* Progress */}
                  {achievement.progress && !achievement.isUnlocked && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-600">
                          {achievement.progress.current}/{achievement.progress.target}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress.current / achievement.progress.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="space-y-1">
                    {achievement.requirements.map((req, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          achievement.isUnlocked ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        {req}
                      </div>
                    ))}
                  </div>

                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="mt-4 text-xs text-green-600 font-medium">
                      ✅ Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
