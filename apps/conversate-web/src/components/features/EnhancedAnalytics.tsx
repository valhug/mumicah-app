'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Award, Target, Clock, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface UserProgress {
  totalConversations: number
  totalWords: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  favoritePersona?: string
}

interface WeeklyStats {
  conversationsThisWeek: number
  minutesThisWeek: number
  wordsThisWeek: number
  progress: Array<{
    day: string
    conversations: number
    date: string
  }>
}

interface Goals {
  weeklyGoal: number
  monthlyGoal: number
  weeklyProgress: number
  monthlyProgress: number
}

interface Achievements {
  unlocked: string[]
  total: number
  next: {
    type: string
    name: string
    description: string
    target: number
    current: number
    progress: number
  } | null
}

interface RecentConversation {
  id: string
  personaId: string
  title: string
  duration: number
  wordsSpoken: number
  quality?: string
  date: string
  topics?: string[]
}

interface AnalyticsData {
  overview: UserProgress
  weekly: WeeklyStats
  goals: Goals
  achievements: Achievements
  recentConversations: RecentConversation[]
}

interface EnhancedAnalyticsProps {
  userId: string
}

export default function EnhancedAnalytics({ userId }: EnhancedAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Animation variants - simplified for TypeScript compatibility
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch user analytics from our database-backed analytics API
        const response = await fetch('/api/dashboard/analytics')
        const data = await response.json()
        
        if (data.success) {
          setAnalyticsData(data.data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load analytics data</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Overview Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                +{analyticsData.weekly.conversationsThisWeek} this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words Practiced</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalWords}</div>
              <p className="text-xs text-muted-foreground">
                +{analyticsData.weekly.wordsThisWeek} this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.overview.currentStreak === 0 ? 'Start your streak today!' : 'Keep it up!'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.weekly.minutesThisWeek}m</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Learning Goals */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Goals
            </CardTitle>
            <CardDescription>Track your progress towards your learning objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Weekly Conversations</h4>
                  <p className="text-sm text-muted-foreground">This week</p>
                </div>
                <Badge variant="outline">
                  {analyticsData.goals.weeklyProgress}/{analyticsData.goals.weeklyGoal}
                </Badge>
              </div>
              <Progress 
                value={(analyticsData.goals.weeklyProgress / analyticsData.goals.weeklyGoal) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Monthly Conversations</h4>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <Badge variant="outline">
                  {analyticsData.goals.monthlyProgress}/{analyticsData.goals.monthlyGoal}
                </Badge>
              </div>
              <Progress 
                value={(analyticsData.goals.monthlyProgress / analyticsData.goals.monthlyGoal) * 100} 
                className="h-2"
              />
            </div>
            {analyticsData.achievements.next && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Next Achievement</h4>
                    <p className="text-sm text-muted-foreground">{analyticsData.achievements.next.description}</p>
                  </div>
                  <Badge variant="outline">
                    {analyticsData.achievements.next.current}/{analyticsData.achievements.next.target}
                  </Badge>
                </div>
                <Progress 
                  value={analyticsData.achievements.next.progress} 
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements ({analyticsData.achievements.total} earned)
            </CardTitle>
            <CardDescription>Celebrate your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.achievements.unlocked.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData.achievements.unlocked.map((achievement) => (
                  <div key={achievement} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="text-2xl">🏆</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium capitalize">{achievement.replace('_', ' ')}</h4>
                        <Badge variant="secondary">Earned</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getAchievementDescription(achievement)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No achievements yet</h3>
                <p className="text-muted-foreground mb-4">Start chatting to earn your first achievement!</p>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start a Conversation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Conversations */}
      {analyticsData.recentConversations.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Recent Conversations
              </CardTitle>
              <CardDescription>Your latest practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{conversation.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {conversation.personaId} • {conversation.duration}min • {conversation.wordsSpoken} words
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(conversation.date).toLocaleDateString()}
                      </p>
                      {conversation.quality && (
                        <Badge variant="outline" className="mt-1">
                          {conversation.quality}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

// Helper function to get achievement descriptions
function getAchievementDescription(achievement: string): string {
  const descriptions: Record<string, string> = {
    first_conversation: 'Started your first conversation',
    conversationalist: 'Completed 10 conversations',
    chatterbox: 'Completed 50 conversations',
    wordsmith: 'Spoke 500 words',
    eloquent: 'Spoke 2000 words',
    consistent: 'Maintained a 3-day streak',
    dedicated: 'Maintained a 7-day streak',
    champion: 'Maintained a 30-day streak'
  }
  return descriptions[achievement] || 'Achievement unlocked!'
}
