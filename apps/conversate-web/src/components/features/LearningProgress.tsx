'use client'

import { useState, useEffect } from 'react'
import { Card, Badge, Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'
import { TrendingUp, Target, Award, Flame, Clock } from 'lucide-react'

interface LearningProgressProps {
  userId?: string
}

interface ProgressData {
  currentStreak: number
  longestStreak: number
  totalConversations: number
  minutesToday: number
  weeklyGoal: number
  weeklyProgress: number
  level: number
  experiencePoints: number
  nextLevelXP: number
  achievements: Achievement[]
  weeklyActivity: DayActivity[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface DayActivity {
  day: string
  minutes: number
  conversations: number
  isToday: boolean
}

// Demo data - replace with real API calls
const DEMO_PROGRESS: ProgressData = {
  currentStreak: 7,
  longestStreak: 15,
  totalConversations: 42,
  minutesToday: 25,
  weeklyGoal: 150, // minutes
  weeklyProgress: 98, // minutes
  level: 8,
  experiencePoints: 2350,
  nextLevelXP: 3000,
  achievements: [
    {
      id: 'first_conversation',
      title: 'First Steps',
      description: 'Completed your first conversation',
      icon: '🎯',
      unlockedAt: new Date('2025-06-20'),
      rarity: 'common'
    },
    {
      id: 'week_streak',
      title: 'Consistency Master',
      description: 'Maintained a 7-day learning streak',
      icon: '🔥',
      unlockedAt: new Date('2025-06-25'),
      rarity: 'rare'
    },
    {
      id: 'cultural_explorer',
      title: 'Cultural Explorer',
      description: 'Chatted with Luna about 5 different cultures',
      icon: '🌍',
      unlockedAt: new Date('2025-06-24'),
      rarity: 'epic'
    }
  ],
  weeklyActivity: [
    { day: 'Mon', minutes: 20, conversations: 2, isToday: false },
    { day: 'Tue', minutes: 15, conversations: 1, isToday: false },
    { day: 'Wed', minutes: 18, conversations: 2, isToday: false },
    { day: 'Thu', minutes: 22, conversations: 3, isToday: false },
    { day: 'Fri', minutes: 8, conversations: 1, isToday: false },
    { day: 'Sat', minutes: 0, conversations: 0, isToday: false },
    { day: 'Sun', minutes: 25, conversations: 2, isToday: true }
  ]
}

export function LearningProgress({ userId }: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData>(DEMO_PROGRESS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // TODO: Fetch real progress data
    // const fetchProgress = async () => {
    //   setIsLoading(true)
    //   try {
    //     const data = await getUserProgress(userId)
    //     setProgress(data)
    //   } catch (error) {
    //     console.error('Failed to fetch progress:', error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    // fetchProgress()
  }, [userId])

  const experiencePercentage = (progress.experiencePoints / progress.nextLevelXP) * 100
  const weeklyPercentage = (progress.weeklyProgress / progress.weeklyGoal) * 100

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Learning Journey</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Level {progress.level}
          </Badge>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Experience Points</span>
            <span className="text-sm text-muted-foreground">
              {progress.experiencePoints} / {progress.nextLevelXP} XP
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={cn(
                "bg-gradient-to-r from-primary to-orange-500 h-3 rounded-full transition-all duration-500 ease-out",
                `w-[${experiencePercentage}%]`
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {progress.nextLevelXP - progress.experiencePoints} XP to next level
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Streak */}
          <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{progress.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>

          {/* Today's Minutes */}
          <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{progress.minutesToday}</div>
            <div className="text-xs text-muted-foreground">Minutes Today</div>
          </div>

          {/* Total Conversations */}
          <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{progress.totalConversations}</div>
            <div className="text-xs text-muted-foreground">Conversations</div>
          </div>

          {/* Longest Streak */}
          <div className="text-center p-4 bg-background/50 rounded-xl border border-border">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{progress.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
      </Card>

      {/* Weekly Goal Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Weekly Goal
          </h3>
          <Badge 
            variant={weeklyPercentage >= 100 ? "default" : "secondary"}
            className={weeklyPercentage >= 100 ? "bg-green-500" : ""}
          >
            {Math.round(weeklyPercentage)}%
          </Badge>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {progress.weeklyProgress} / {progress.weeklyGoal} minutes
            </span>
            {weeklyPercentage >= 100 && (
              <span className="text-sm text-green-600 font-medium">🎉 Goal Achieved!</span>
            )}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-500 ease-out",
                weeklyPercentage >= 100 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                  : "bg-gradient-to-r from-primary to-orange-500",
                `w-[${Math.min(weeklyPercentage, 100)}%]`
              )}
            />
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="flex justify-between items-end h-20 gap-2">
          {progress.weeklyActivity.map((day, index) => {
            const height = Math.max((day.minutes / 30) * 100, 5) // Min 5% height
            const heightClass = height > 80 ? 'h-full' : height > 60 ? 'h-4/5' : height > 40 ? 'h-3/5' : height > 20 ? 'h-2/5' : 'h-1/5'
            
            return (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div 
                  className={cn(
                    "w-full rounded-t transition-all duration-300 mb-2",
                    heightClass,
                    day.isToday 
                      ? "bg-gradient-to-t from-primary to-orange-500" 
                      : day.minutes > 0 
                        ? "bg-gradient-to-t from-primary/70 to-orange-500/70"
                        : "bg-muted"
                  )}
                />
                <span className={cn(
                  "text-xs",
                  day.isToday ? "font-bold text-primary" : "text-muted-foreground"
                )}>
                  {day.day}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Recent Achievements
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <a href="/dashboard/achievements">View All</a>
          </Button>
        </div>

        <div className="space-y-3">
          {progress.achievements.slice(0, 3).map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  achievement.rarity === 'legendary' && "border-yellow-500 text-yellow-600",
                  achievement.rarity === 'epic' && "border-purple-500 text-purple-600", 
                  achievement.rarity === 'rare' && "border-blue-500 text-blue-600",
                  achievement.rarity === 'common' && "border-gray-500 text-gray-600"
                )}
              >
                {achievement.rarity}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
