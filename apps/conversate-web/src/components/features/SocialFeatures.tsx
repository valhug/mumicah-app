'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@mumicah/ui'
import { Progress } from '@/components/ui/progress'
import { cn } from '@mumicah/shared'
import { 
  UserPlus, 
  Users, 
  Share2, 
  MessageCircle, 
  Heart,
  Trophy,
  Target,
  Calendar,
  Flame,
  Clock,
  Zap,
  ChevronRight,
  BookOpen,
  Globe,
  Bell
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/common/Toast'

interface Friend {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  currentStreak: number
  totalPoints: number
  level: number
  lastSeen?: Date
  mutualFriends: number
  studyingLanguage: string
  isOnline: boolean
}

interface StudyGroup {
  id: string
  name: string
  description: string
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  memberCount: number
  maxMembers: number
  isPrivate: boolean
  tags: string[]
  nextSession?: Date
  weeklyGoal: number
  weeklyProgress: number
  isMember: boolean
  creator: {
    name: string
    avatar: string
  }
  recentActivity: {
    type: 'join' | 'achievement' | 'session' | 'milestone'
    user: string
    text: string
    timestamp: Date
  }[]
}

interface SharedAchievement {
  id: string
  achievementId: string
  title: string
  description: string
  icon: string
  sharedBy: {
    name: string
    avatar: string
  }
  timestamp: Date
  likes: number
  comments: number
  hasLiked: boolean
  difficulty: 'common' | 'rare' | 'epic' | 'legendary'
}

interface CollaborativeChallenge {
  id: string
  title: string
  description: string
  type: 'team' | 'buddy' | 'community'
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  teamSize: number
  currentTeamMembers: number
  totalParticipants: number
  maxParticipants: number
  prize: string
  deadline: Date
  requirements: string[]
  teamProgress: number
  globalProgress: number
  isParticipating: boolean
  teamMembers?: {
    name: string
    avatar: string
    contribution: number
  }[]
}

interface SocialFeaturesProps {
  userId?: string
  className?: string
}

export default function SocialFeatures({ userId = 'demo', className = '' }: SocialFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'shared' | 'collaborative'>('friends')
  const [friends, setFriends] = useState<Friend[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [sharedAchievements, setSharedAchievements] = useState<SharedAchievement[]>([])
  const [collaborativeChallenges, setCollaborativeChallenges] = useState<CollaborativeChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const { success } = useToast()

  useEffect(() => {
    loadSocialData()
  }, [userId])

  const loadSocialData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Mock friends data
      const mockFriends: Friend[] = [
        {
          id: '1',
          name: 'Sarah Kim',
          avatar: '👩🏻‍🎓',
          status: 'online',
          currentStreak: 15,
          totalPoints: 2350,
          level: 12,
          mutualFriends: 3,
          studyingLanguage: 'Spanish',
          isOnline: true
        },
        {
          id: '2',
          name: 'Alex Chen',
          avatar: '👨🏻‍💻',
          status: 'away',
          currentStreak: 8,
          totalPoints: 1890,
          level: 9,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
          mutualFriends: 5,
          studyingLanguage: 'French',
          isOnline: false
        },
        {
          id: '3',
          name: 'Maria Santos',
          avatar: '👩🏽‍🏫',
          status: 'online',
          currentStreak: 22,
          totalPoints: 3100,
          level: 15,
          mutualFriends: 2,
          studyingLanguage: 'Japanese',
          isOnline: true
        },
        {
          id: '4',
          name: 'David Johnson',
          avatar: '👨🏼‍🎨',
          status: 'offline',
          currentStreak: 5,
          totalPoints: 1200,
          level: 7,
          lastSeen: new Date(Date.now() - 8 * 60 * 60 * 1000),
          mutualFriends: 1,
          studyingLanguage: 'German',
          isOnline: false
        }
      ]

      // Mock study groups data
      const mockGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'Spanish Conversation Circle',
          description: 'Practice conversational Spanish with native speakers and advanced learners',
          language: 'Spanish',
          difficulty: 'intermediate',
          memberCount: 24,
          maxMembers: 30,
          isPrivate: false,
          tags: ['conversation', 'culture', 'grammar'],
          nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          weeklyGoal: 180, // minutes
          weeklyProgress: 145,
          isMember: true,
          creator: {
            name: 'Carlos Rodriguez',
            avatar: '👨🏽‍🏫'
          },
          recentActivity: [
            {
              type: 'achievement',
              user: 'Sarah Kim',
              text: 'unlocked "Conversation Master" achievement',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            {
              type: 'join',
              user: 'Alex Chen',
              text: 'joined the group',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
            },
            {
              type: 'session',
              user: 'Group',
              text: 'completed weekly practice session',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: '2',
          name: 'Japanese Kanji Masters',
          description: 'Master Kanji characters through collaborative learning and peer support',
          language: 'Japanese',
          difficulty: 'advanced',
          memberCount: 15,
          maxMembers: 20,
          isPrivate: true,
          tags: ['kanji', 'writing', 'memorization'],
          nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000),
          weeklyGoal: 240,
          weeklyProgress: 198,
          isMember: false,
          creator: {
            name: 'Yuki Tanaka',
            avatar: '👩🏻‍🎓'
          },
          recentActivity: [
            {
              type: 'milestone',
              user: 'Group',
              text: 'reached 500 Kanji learned milestone',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: '3',
          name: 'French Pronunciation Boot Camp',
          description: 'Intensive pronunciation practice with peer feedback and coaching',
          language: 'French',
          difficulty: 'beginner',
          memberCount: 8,
          maxMembers: 12,
          isPrivate: false,
          tags: ['pronunciation', 'phonetics', 'speaking'],
          weeklyGoal: 120,
          weeklyProgress: 75,
          isMember: false,
          creator: {
            name: 'Marie Dubois',
            avatar: '👩🏼‍🏫'
          },
          recentActivity: [
            {
              type: 'join',
              user: 'Emma Wilson',
              text: 'joined the group',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
            }
          ]
        }
      ]

      // Mock shared achievements
      const mockShared: SharedAchievement[] = [
        {
          id: '1',
          achievementId: 'streak_master',
          title: 'Streak Master',
          description: 'Maintained a 30-day learning streak',
          icon: '🔥',
          sharedBy: {
            name: 'Sarah Kim',
            avatar: '👩🏻‍🎓'
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 12,
          comments: 4,
          hasLiked: false,
          difficulty: 'epic'
        },
        {
          id: '2',
          achievementId: 'polyglot',
          title: 'Polyglot',
          description: 'Practiced conversations in 5 different languages',
          icon: '🌍',
          sharedBy: {
            name: 'Alex Chen',
            avatar: '👨🏻‍💻'
          },
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          likes: 18,
          comments: 7,
          hasLiked: true,
          difficulty: 'legendary'
        },
        {
          id: '3',
          achievementId: 'culture_explorer',
          title: 'Culture Explorer',
          description: 'Learned about 10 different cultural traditions',
          icon: '🏮',
          sharedBy: {
            name: 'Maria Santos',
            avatar: '👩🏽‍🏫'
          },
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          likes: 9,
          comments: 2,
          hasLiked: false,
          difficulty: 'rare'
        }
      ]

      // Mock collaborative challenges
      const mockCollaborative: CollaborativeChallenge[] = [
        {
          id: '1',
          title: 'Global Vocabulary Challenge',
          description: 'Teams compete to learn the most vocabulary words across all languages',
          type: 'team',
          language: 'All Languages',
          difficulty: 'intermediate',
          teamSize: 5,
          currentTeamMembers: 3,
          totalParticipants: 240,
          maxParticipants: 500,
          prize: '5000 XP + Exclusive Team Badge',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          requirements: ['Learn 50 new words per team member', 'Use words in conversations', 'Create example sentences'],
          teamProgress: 68,
          globalProgress: 45,
          isParticipating: true,
          teamMembers: [
            { name: 'You', avatar: '👤', contribution: 15 },
            { name: 'Sarah Kim', avatar: '👩🏻‍🎓', contribution: 22 },
            { name: 'Alex Chen', avatar: '👨🏻‍💻', contribution: 18 }
          ]
        },
        {
          id: '2',
          title: 'Culture Exchange Buddy System',
          description: 'Partner with someone learning your native language for mutual learning',
          type: 'buddy',
          language: 'Multiple',
          difficulty: 'beginner',
          teamSize: 2,
          currentTeamMembers: 0,
          totalParticipants: 156,
          maxParticipants: 300,
          prize: '2000 XP + Cultural Ambassador Badge',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          requirements: ['Exchange 10 conversations', 'Share cultural insights', 'Help with pronunciation'],
          teamProgress: 0,
          globalProgress: 32,
          isParticipating: false
        },
        {
          id: '3',
          title: 'Community Translation Project',
          description: 'Work together to translate educational content for new learners',
          type: 'community',
          language: 'Spanish',
          difficulty: 'advanced',
          teamSize: 1,
          currentTeamMembers: 1,
          totalParticipants: 45,
          maxParticipants: 100,
          prize: '3000 XP + Translator Badge',
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          requirements: ['Translate 5 articles', 'Review peer translations', 'Ensure cultural accuracy'],
          teamProgress: 20,
          globalProgress: 28,
          isParticipating: true
        }
      ]

      setFriends(mockFriends)
      setStudyGroups(mockGroups)
      setSharedAchievements(mockShared)
      setCollaborativeChallenges(mockCollaborative)
    } catch (error) {
      console.error('Error loading social data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = async () => {
    try {
      // Mock friend request
      success('Friend Request Sent', `Friend request sent successfully!`)
    } catch (error) {
      console.error('Error adding friend:', error)
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    try {
      setStudyGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, isMember: true, memberCount: group.memberCount + 1 }
          : group
      ))
      success('Joined Study Group', `Welcome to the group! Start learning together.`)
    } catch (error) {
      console.error('Error joining group:', error)
    }
  }

  const handleLikeAchievement = async (achievementId: string) => {
    try {
      setSharedAchievements(prev => prev.map(achievement => 
        achievement.id === achievementId 
          ? { 
              ...achievement, 
              hasLiked: !achievement.hasLiked,
              likes: achievement.hasLiked ? achievement.likes - 1 : achievement.likes + 1
            }
          : achievement
      ))
    } catch (error) {
      console.error('Error liking achievement:', error)
    }
  }

  const handleJoinCollaborativeChallenge = async (challengeId: string) => {
    try {
      setCollaborativeChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, isParticipating: true, totalParticipants: challenge.totalParticipants + 1 }
          : challenge
      ))
      success('Joined Challenge', `You're now part of the collaborative challenge!`)
    } catch (error) {
      console.error('Error joining challenge:', error)
    }
  }

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'common': return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      case 'rare': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'epic': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'legendary': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) return 'Just now'
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  const formatTimeLeft = (deadline: Date) => {
    const now = new Date()
    const timeLeft = deadline.getTime() - now.getTime()
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
    
    if (daysLeft === 1) return '1 day left'
    if (daysLeft > 1) return `${daysLeft} days left`
    return 'Ending soon'
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Social Learning Hub
          </h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Connected
          </Badge>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'friends', label: 'Friends', icon: UserPlus, count: friends.length },
            { id: 'groups', label: 'Study Groups', icon: Users, count: studyGroups.length },
            { id: 'shared', label: 'Shared Achievements', icon: Share2, count: sharedAchievements.length },
            { id: 'collaborative', label: 'Team Challenges', icon: Trophy, count: collaborativeChallenges.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'friends' | 'groups' | 'shared' | 'collaborative')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
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

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                Learning Friends
              </h3>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="p-4 border rounded-lg hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-2xl">{friend.avatar}</div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{friend.name}</h4>
                        <p className="text-sm text-gray-600">Learning {friend.studyingLanguage}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Level {friend.level}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                        <Flame className="w-3 h-3" />
                        <span className="text-sm font-medium">{friend.currentStreak}</span>
                      </div>
                      <div className="text-xs text-gray-600">Day Streak</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Trophy className="w-3 h-3" />
                        <span className="text-sm font-medium">{friend.totalPoints}</span>
                      </div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddFriend()}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Challenge
                    </Button>
                  </div>

                  {friend.mutualFriends > 0 && (
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {friend.mutualFriends} mutual friends
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'groups' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Study Groups
              </h3>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="space-y-4">
              {studyGroups.map(group => (
                <div
                  key={group.id}
                  className={`p-6 border rounded-lg transition-all ${
                    group.isMember ? 'bg-blue-50 border-blue-200' : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        {group.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                        <Badge
                          variant={group.difficulty === 'beginner' ? 'default' : 
                                   group.difficulty === 'intermediate' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {group.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {group.memberCount}/{group.maxMembers} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {group.language}
                        </span>
                        {group.nextSession && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Next: {group.nextSession.toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Weekly Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Weekly Goal Progress</span>
                          <span className="font-medium">{group.weeklyProgress}/{group.weeklyGoal} min</span>
                        </div>
                        <Progress 
                          value={(group.weeklyProgress / group.weeklyGoal) * 100} 
                          className="h-2"
                        />
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {group.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl mb-2">{group.creator.avatar}</div>
                      <div className="text-xs text-gray-500">by {group.creator.name}</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h5>
                    <div className="space-y-1">
                      {group.recentActivity.slice(0, 2).map((activity, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                          {activity.type === 'achievement' && <Trophy className="w-3 h-3 text-yellow-500" />}
                          {activity.type === 'join' && <UserPlus className="w-3 h-3 text-green-500" />}
                          {activity.type === 'session' && <BookOpen className="w-3 h-3 text-blue-500" />}
                          {activity.type === 'milestone' && <Target className="w-3 h-3 text-purple-500" />}
                          <span><strong>{activity.user}</strong> {activity.text}</span>
                          <span className="text-gray-400">• {formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {group.isMember ? (
                      <>
                        <Button variant="default" size="sm" className="flex-1">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Open Group
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={group.memberCount >= group.maxMembers}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          {group.memberCount >= group.maxMembers ? 'Full' : 'Join Group'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Shared Achievements Tab */}
      {activeTab === 'shared' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-green-600" />
                Shared Achievements
              </h3>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Yours
              </Button>
            </div>

            <div className="space-y-4">
              {sharedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="p-4 border rounded-lg hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <Badge className={cn("text-xs", getDifficultyColor(achievement.difficulty))}>
                          {achievement.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{achievement.sharedBy.avatar}</span>
                          <span><strong>{achievement.sharedBy.name}</strong></span>
                        </div>
                        <span>•</span>
                        <span>{formatTimeAgo(achievement.timestamp)}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikeAchievement(achievement.id)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            achievement.hasLiked 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <Heart className={cn("w-4 h-4", achievement.hasLiked && "fill-current")} />
                          {achievement.likes}
                        </button>
                        
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {achievement.comments}
                        </button>
                        
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Collaborative Challenges Tab */}
      {activeTab === 'collaborative' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Team Challenges
              </h3>
              <Button variant="outline" size="sm">
                <Trophy className="w-4 h-4 mr-2" />
                Create Challenge
              </Button>
            </div>

            <div className="space-y-6">
              {collaborativeChallenges.map(challenge => (
                <div
                  key={challenge.id}
                  className={`p-6 border rounded-lg transition-all ${
                    challenge.isParticipating ? 'bg-amber-50 border-amber-200' : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                        <Badge
                          variant={challenge.type === 'team' ? 'default' : 
                                   challenge.type === 'buddy' ? 'secondary' : 'outline'}
                          className="text-xs capitalize"
                        >
                          {challenge.type}
                        </Badge>
                        <Badge
                          variant={challenge.difficulty === 'beginner' ? 'default' : 
                                   challenge.difficulty === 'intermediate' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{challenge.totalParticipants}/{challenge.maxParticipants}</div>
                          <div className="text-xs text-gray-600">Participants</div>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{challenge.globalProgress}%</div>
                          <div className="text-xs text-gray-600">Global Progress</div>
                        </div>
                        
                        {challenge.isParticipating && (
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">{challenge.teamProgress}%</div>
                            <div className="text-xs text-gray-600">Team Progress</div>
                          </div>
                        )}
                        
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="text-xs text-gray-600">{formatTimeLeft(challenge.deadline)}</div>
                        </div>
                      </div>

                      {/* Team Members (if participating) */}
                      {challenge.isParticipating && challenge.teamMembers && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Team Members ({challenge.currentTeamMembers}/{challenge.teamSize})
                          </h5>
                          <div className="flex items-center gap-3">
                            {challenge.teamMembers.map((member, index) => (
                              <div key={index} className="text-center">
                                <div className="text-lg mb-1">{member.avatar}</div>
                                <div className="text-xs text-gray-600">{member.name}</div>
                                <div className="text-xs text-green-600 font-medium">{member.contribution} pts</div>
                              </div>
                            ))}
                            {challenge.currentTeamMembers < challenge.teamSize && (
                              <div className="text-center p-2 border-2 border-dashed border-gray-300 rounded-lg">
                                <UserPlus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <div className="text-xs text-gray-500">Need {challenge.teamSize - challenge.currentTeamMembers} more</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Requirements */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h5>
                        <ul className="space-y-1">
                          {challenge.requirements.map((req, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
                                {index + 1}
                              </div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-sm text-orange-600 font-medium mb-4">
                        🏆 Prize: {challenge.prize}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {challenge.isParticipating ? (
                      <>
                        <Button variant="default" size="sm" className="flex-1">
                          <Zap className="w-3 h-3 mr-1" />
                          Continue Challenge
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="w-3 h-3 mr-1" />
                          Team Chat
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleJoinCollaborativeChallenge(challenge.id)}
                          disabled={challenge.totalParticipants >= challenge.maxParticipants}
                        >
                          <Trophy className="w-3 h-3 mr-1" />
                          {challenge.totalParticipants >= challenge.maxParticipants ? 'Full' : 'Join Challenge'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
