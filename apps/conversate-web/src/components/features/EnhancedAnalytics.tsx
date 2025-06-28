'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Award, Target, Clock, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface UserProgress {
  totalConversations: number
  totalWords: number
  streakDays: number
  favoritePersona?: string
}

interface WeeklyStats {
  conversationsThisWeek: number
  minutesThisWeek: number
  wordsThisWeek: number
}

interface LearningGoal {
  id: string
  title: string
  target: number
  current: number
  type: 'conversations' | 'words' | 'minutes' | 'streak'
  deadline: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'rare' | 'legendary'
}

interface EnhancedAnalyticsProps {
  userId: string
}

export default function EnhancedAnalytics({ userId }: EnhancedAnalyticsProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch user analytics from our dedicated analytics API
        const response = await fetch(`/api/analytics?userId=${userId}`)
        const data = await response.json()
        
        if (data.success) {
          setUserProgress(data.data.userProgress)
          setWeeklyStats(data.data.weeklyStats)
          setGoals(data.data.goals)
          setAchievements(data.data.achievements)
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

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800'
      case 'rare': return 'bg-blue-100 text-blue-800'
      case 'legendary': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress?.totalConversations || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{weeklyStats?.conversationsThisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Practiced</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress?.totalWords || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{weeklyStats?.wordsThisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress?.streakDays || 0}</div>
            <p className="text-xs text-muted-foreground">
              {userProgress?.streakDays === 0 ? 'Start your streak today!' : 'Keep it up!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats?.minutesThisWeek || 0}m</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Goals
          </CardTitle>
          <CardDescription>Track your progress towards your learning objectives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-muted-foreground">{goal.deadline}</p>
                </div>
                <Badge variant="outline">
                  {goal.current}/{goal.target}
                </Badge>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2"
              />
            </div>
          ))}
          <Button variant="outline" className="w-full mt-4">
            <Target className="h-4 w-4 mr-2" />
            Set New Goal
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Celebrate your learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
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
    </div>
  )
}
