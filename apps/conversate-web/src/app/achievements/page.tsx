'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Star, Award, Crown } from 'lucide-react'
import { Button } from '@mumicah/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { Badge, ProgressBar } from '@mumicah/ui'
import { AchievementDisplay } from '@/components/features/AchievementDisplay'
import { achievementService, type Achievement, type UserStats } from '@/services/achievement-service'
import Link from 'next/link'

// Mock user stats for demonstration
const mockUserStats: UserStats = {
  totalConversations: 25,
  vocabularyLearned: 145,
  currentStreak: 7,
  longestStreak: 12,
  perfectPronunciations: 23,
  grammarAccuracy: 92,
  culturalTopicsExplored: 12,
  totalPoints: 2340,
  level: 5
}

const achievementCategories = [
  {
    id: 'conversation',
    name: 'Conversation',
    icon: '💬',
    description: 'Master the art of conversation',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    icon: '📚',
    description: 'Expand your word knowledge',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'grammar',
    name: 'Grammar',
    icon: '✏️',
    description: 'Perfect your language structure',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'pronunciation',
    name: 'Pronunciation',
    icon: '🎯',
    description: 'Speak with clarity and confidence',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'streak',
    name: 'Consistency',
    icon: '🔥',
    description: 'Build lasting learning habits',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'cultural',
    name: 'Cultural',
    icon: '🌍',
    description: 'Explore cultures and traditions',
    color: 'from-pink-500 to-rose-500'
  }
]

const difficultyLevels = [
  { id: 'bronze', name: 'Bronze', icon: Award, color: 'from-amber-400 to-amber-600' },
  { id: 'silver', name: 'Silver', icon: Star, color: 'from-gray-400 to-gray-600' },
  { id: 'gold', name: 'Gold', icon: Trophy, color: 'from-yellow-400 to-yellow-600' },
  { id: 'platinum', name: 'Platinum', icon: Crown, color: 'from-purple-400 to-purple-600' }
]

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
  }

  const getTotalAchievements = () => {
    return achievementService.getUnlockedAchievements().length + achievementService.getAchievementsInProgress().length
  }

  const getUnlockedCount = () => {
    return achievementService.getUnlockedAchievements().length
  }

  const getProgressPercentage = () => {
    const total = getTotalAchievements()
    const unlocked = getUnlockedCount()
    return total > 0 ? Math.round((unlocked / total) * 100) : 0
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-card/50 backdrop-blur-xl border-b border-border"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
                  <p className="text-sm text-muted-foreground">
                    {getUnlockedCount()} of {getTotalAchievements()} unlocked ({getProgressPercentage()}%)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{achievementService.getTotalPoints()}</div>
                <div className="text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{mockUserStats.currentStreak}</div>
                <div className="text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{mockUserStats.level}</div>
                <div className="text-muted-foreground">Level</div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories and Filters */}
          <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="w-full justify-start"
                >
                  All Categories
                </Button>
                {achievementCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full justify-start gap-2"
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Difficulty Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedDifficulty === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDifficulty('all')}
                  className="w-full justify-start"
                >
                  All Levels
                </Button>
                {difficultyLevels.map((level) => {
                  const IconComponent = level.icon
                  return (
                    <Button
                      key={level.id}
                      variant={selectedDifficulty === level.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(level.id)}
                      className="w-full justify-start gap-2"
                    >
                      <IconComponent className="w-4 h-4" />
                      {level.name}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Achievement Categories Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievementCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {achievementService.getAchievementsByCategory(category.id as 'conversation' | 'vocabulary' | 'grammar' | 'pronunciation' | 'streak' | 'social' | 'cultural').filter(a => a.isUnlocked).length}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Achievement Display */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <AchievementDisplay
              userStats={mockUserStats}
              showOnlyRecent={false}
              maxDisplayed={50}
              onAchievementClick={handleAchievementClick}
              className="h-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedAchievement(null)}
        >
          <motion.div
            className="bg-background border rounded-xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">{selectedAchievement.icon}</div>
              <h3 className="text-2xl font-bold">{selectedAchievement.title}</h3>
              <p className="text-muted-foreground">{selectedAchievement.description}</p>
              
              <div className="flex items-center justify-center space-x-4">
                <Badge className="capitalize">
                  {selectedAchievement.category}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {selectedAchievement.difficulty}
                </Badge>
              </div>

              {selectedAchievement.isUnlocked ? (
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                    ✓ Unlocked
                  </Badge>
                  {selectedAchievement.unlockedAt && (
                    <p className="text-sm text-muted-foreground">
                      Achieved on {selectedAchievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-primary font-semibold">
                    +{selectedAchievement.reward.points} points earned
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Progress: {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                  </p>
                  <ProgressBar 
                    value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}
                    className="h-2"
                  />
                  <p className="text-primary font-semibold">
                    {selectedAchievement.reward.points} points when completed
                  </p>
                </div>
              )}

              <Button onClick={() => setSelectedAchievement(null)} className="w-full">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
