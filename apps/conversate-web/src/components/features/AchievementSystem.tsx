'use client'

import { useState, useEffect } from 'react'
import { Card, Badge, Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'
import { Award, Trophy, Star, Target, Flame, MessageSquare, Zap, Heart, Crown, Gift } from 'lucide-react'

interface AchievementSystemProps {
  userId?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'conversation' | 'streak' | 'learning' | 'social' | 'milestone' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  isUnlocked: boolean
  unlockedAt?: Date
  progress: number
  maxProgress: number
  criteria: string
}

interface AchievementCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  achievements: Achievement[]
}

// Demo achievements data
const DEMO_ACHIEVEMENTS: Achievement[] = [
  // Conversation Achievements
  {
    id: 'first-chat',
    title: 'First Steps',
    description: 'Complete your very first conversation',
    icon: '🌱',
    category: 'conversation',
    rarity: 'common',
    points: 10,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-15T10:00:00'),
    progress: 1,
    maxProgress: 1,
    criteria: 'Have 1 conversation'
  },
  {
    id: 'chat-master',
    title: 'Conversation Master',
    description: 'Complete 50 meaningful conversations',
    icon: '💬',
    category: 'conversation',
    rarity: 'rare',
    points: 100,
    isUnlocked: false,
    progress: 23,
    maxProgress: 50,
    criteria: 'Have 50 conversations'
  },
  {
    id: 'polyglot',
    title: 'Polyglot',
    description: 'Practice with personas in 5 different languages',
    icon: '🌍',
    category: 'conversation',
    rarity: 'epic',
    points: 250,
    isUnlocked: false,
    progress: 3,
    maxProgress: 5,
    criteria: 'Practice 5 different languages'
  },

  // Streak Achievements
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day conversation streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    points: 75,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-20T15:30:00'),
    progress: 7,
    maxProgress: 7,
    criteria: 'Maintain 7-day streak'
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Achieve a 30-day learning streak',
    icon: '🏆',
    category: 'streak',
    rarity: 'epic',
    points: 300,
    isUnlocked: false,
    progress: 7,
    maxProgress: 30,
    criteria: 'Maintain 30-day streak'
  },
  {
    id: 'streak-legend',
    title: 'Streak Legend',
    description: 'Reach the legendary 100-day streak',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    points: 1000,
    isUnlocked: false,
    progress: 7,
    maxProgress: 100,
    criteria: 'Maintain 100-day streak'
  },

  // Learning Achievements
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Master 25 new vocabulary words',
    icon: '⚡',
    category: 'learning',
    rarity: 'common',
    points: 50,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-18T12:15:00'),
    progress: 25,
    maxProgress: 25,
    criteria: 'Learn 25 vocabulary words'
  },
  {
    id: 'grammar-guru',
    title: 'Grammar Guru',
    description: 'Achieve 95% accuracy in grammar exercises',
    icon: '📚',
    category: 'learning',
    rarity: 'rare',
    points: 150,
    isUnlocked: false,
    progress: 87,
    maxProgress: 95,
    criteria: 'Achieve 95% grammar accuracy'
  },

  // Social Achievements
  {
    id: 'helpful-friend',
    title: 'Helpful Friend',
    description: 'Rate 10 conversations as helpful',
    icon: '❤️',
    category: 'social',
    rarity: 'common',
    points: 30,
    isUnlocked: false,
    progress: 6,
    maxProgress: 10,
    criteria: 'Rate 10 conversations helpful'
  },

  // Milestone Achievements
  {
    id: 'hundred-hours',
    title: 'Century Scholar',
    description: 'Complete 100 hours of conversation practice',
    icon: '🎯',
    category: 'milestone',
    rarity: 'epic',
    points: 500,
    isUnlocked: false,
    progress: 45,
    maxProgress: 100,
    criteria: 'Practice for 100 hours'
  },

  // Special Achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Practice before 7 AM for 5 days',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    points: 80,
    isUnlocked: false,
    progress: 2,
    maxProgress: 5,
    criteria: 'Practice before 7 AM for 5 days'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Practice after 10 PM for 7 days',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    points: 80,
    isUnlocked: false,
    progress: 0,
    maxProgress: 7,
    criteria: 'Practice after 10 PM for 7 days'
  }
]

export default function AchievementSystem({ userId }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  useEffect(() => {
    // Simulate API call
    const loadAchievements = async () => {
      setIsLoading(true)
      // Replace with actual API call: await AchievementService.getUserAchievements(userId)
      await new Promise(resolve => setTimeout(resolve, 800))
      setAchievements(DEMO_ACHIEVEMENTS)
      setIsLoading(false)
    }

    loadAchievements()
  }, [userId])

  const categories: AchievementCategory[] = [
    {
      id: 'conversation',
      name: 'Conversation',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'blue',
      achievements: achievements.filter(a => a.category === 'conversation')
    },
    {
      id: 'streak',
      name: 'Streaks',
      icon: <Flame className="h-4 w-4" />,
      color: 'orange',
      achievements: achievements.filter(a => a.category === 'streak')
    },
    {
      id: 'learning',
      name: 'Learning',
      icon: <Star className="h-4 w-4" />,
      color: 'purple',
      achievements: achievements.filter(a => a.category === 'learning')
    },
    {
      id: 'social',
      name: 'Social',
      icon: <Heart className="h-4 w-4" />,
      color: 'pink',
      achievements: achievements.filter(a => a.category === 'social')
    },
    {
      id: 'milestone',
      name: 'Milestones',
      icon: <Target className="h-4 w-4" />,
      color: 'green',
      achievements: achievements.filter(a => a.category === 'milestone')
    },
    {
      id: 'special',
      name: 'Special',
      icon: <Gift className="h-4 w-4" />,
      color: 'yellow',
      achievements: achievements.filter(a => a.category === 'special')
    }
  ]

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity
    const unlockedMatch = !showUnlockedOnly || achievement.isUnlocked
    
    return categoryMatch && rarityMatch && unlockedMatch
  })

  const stats = {
    totalUnlocked: achievements.filter(a => a.isUnlocked).length,
    totalPoints: achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0),
    completionRate: Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100),
    rarityBreakdown: {
      legendary: achievements.filter(a => a.rarity === 'legendary' && a.isUnlocked).length,
      epic: achievements.filter(a => a.rarity === 'epic' && a.isUnlocked).length,
      rare: achievements.filter(a => a.rarity === 'rare' && a.isUnlocked).length,
      common: achievements.filter(a => a.rarity === 'common' && a.isUnlocked).length
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10 text-yellow-600'
      case 'epic': return 'border-purple-500 bg-purple-500/10 text-purple-600'
      case 'rare': return 'border-blue-500 bg-blue-500/10 text-blue-600'
      case 'common': return 'border-gray-500 bg-gray-500/10 text-gray-600'
      default: return 'border-gray-500 bg-gray-500/10 text-gray-600'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-3 w-3" />
      case 'epic': return <Trophy className="h-3 w-3" />
      case 'rare': return <Star className="h-3 w-3" />
      case 'common': return <Award className="h-3 w-3" />
      default: return <Award className="h-3 w-3" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Achievement System</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-muted/30 rounded-lg h-32" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Achievement Stats Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Achievement System</h3>
          <Badge variant="secondary">{stats.totalUnlocked}/{achievements.length} unlocked</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-lg border border-primary/20">
            <div className="text-2xl font-bold text-primary">{stats.totalUnlocked}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg border border-amber-500/20">
            <div className="text-2xl font-bold text-amber-600">{stats.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-600">{stats.rarityBreakdown.legendary + stats.rarityBreakdown.epic}</div>
            <div className="text-sm text-muted-foreground">Rare+ Unlocked</div>
          </div>
        </div>

        {/* Rarity Breakdown */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
            <Crown className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">{stats.rarityBreakdown.legendary}</span>
            <span className="text-xs text-muted-foreground">Legendary</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded border border-purple-500/20">
            <Trophy className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">{stats.rarityBreakdown.epic}</span>
            <span className="text-xs text-muted-foreground">Epic</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{stats.rarityBreakdown.rare}</span>
            <span className="text-xs text-muted-foreground">Rare</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-500/10 rounded border border-gray-500/20">
            <Award className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">{stats.rarityBreakdown.common}</span>
            <span className="text-xs text-muted-foreground">Common</span>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Rarity</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRarity === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRarity('all')}
              >
                All
              </Button>
              {['legendary', 'epic', 'rare', 'common'].map(rarity => (
                <Button
                  key={rarity}
                  variant={selectedRarity === rarity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRarity(rarity)}
                  className="flex items-center gap-1 capitalize"
                >
                  {getRarityIcon(rarity)}
                  {rarity}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Show Unlocked Only Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-unlocked"
            checked={showUnlockedOnly}
            onChange={(e) => setShowUnlockedOnly(e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="show-unlocked" className="text-sm text-muted-foreground cursor-pointer">
            Show unlocked achievements only
          </label>
        </div>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={cn(
              "p-6 relative overflow-hidden transition-all duration-200",
              achievement.isUnlocked 
                ? "bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20 hover:shadow-lg" 
                : "opacity-60 hover:opacity-80"
            )}
          >
            {/* Rarity Corner Badge */}
            <div className={cn(
              "absolute top-0 right-0 px-2 py-1 text-xs font-medium flex items-center gap-1 rounded-bl-lg",
              getRarityColor(achievement.rarity)
            )}>
              {getRarityIcon(achievement.rarity)}
              {achievement.rarity}
            </div>

            {/* Achievement Icon */}
            <div className="text-4xl mb-3 flex items-center justify-center h-16">
              {achievement.isUnlocked ? achievement.icon : '🔒'}
            </div>

            {/* Achievement Info */}
            <div className="text-center mb-4">
              <h4 className="font-semibold text-foreground mb-1">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              
              {achievement.isUnlocked ? (
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Zap className="h-3 w-3 mr-1" />
                    +{achievement.points} XP
                  </Badge>
                  {achievement.unlockedAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(achievement.unlockedAt)}
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-xs">
                  +{achievement.points} XP when unlocked
                </Badge>
              )}
            </div>

            {/* Progress Bar (for unlocked achievements) */}
            {!achievement.isUnlocked && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-muted-foreground">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-300",
                      achievement.progress >= achievement.maxProgress ? "w-full" : 
                      achievement.progress >= achievement.maxProgress * 0.8 ? "w-4/5" :
                      achievement.progress >= achievement.maxProgress * 0.6 ? "w-3/5" :
                      achievement.progress >= achievement.maxProgress * 0.4 ? "w-2/5" :
                      achievement.progress >= achievement.maxProgress * 0.2 ? "w-1/5" : "w-1/12"
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">{achievement.criteria}</p>
              </div>
            )}

            {/* Unlocked Achievement Glow Effect */}
            {achievement.isUnlocked && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-50 pointer-events-none" />
            )}
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="p-8 text-center">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No achievements found</h4>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or start practicing to unlock achievements!
          </p>
          <Button asChild>
            <a href="/chat">Start Learning</a>
          </Button>
        </Card>
      )}
    </div>
  )
}
