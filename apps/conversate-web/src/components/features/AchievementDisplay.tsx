'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@mumicah/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { Badge, ProgressBar } from '@mumicah/ui'
import { 
  Trophy, 
  Star, 
  Target, 
  Gift, 
  Lock,
  CheckCircle,
  Award,
  Zap,
  Crown,
  ExternalLink
} from 'lucide-react'
import { achievementService, type Achievement, type UserStats } from '@/services/achievement-service'
import Link from 'next/link'

interface AchievementDisplayProps {
  userStats: UserStats
  showOnlyRecent?: boolean
  maxDisplayed?: number
  onAchievementClick?: (achievement: Achievement) => void
  className?: string
}

export function AchievementDisplay({
  userStats,
  showOnlyRecent = false,
  maxDisplayed = 6,
  onAchievementClick,
  className = ''
}: AchievementDisplayProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unlocked' | 'progress' | 'next'>('all')
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Get previous achievements for comparison
    const previousAchievements = achievements

    // Update achievements based on user stats
    const updatedAchievements = achievementService.updateProgress(userStats)
    setAchievements(updatedAchievements)

    // Check for newly unlocked achievements
    if (previousAchievements.length > 0) {
      const newUnlocked = achievementService.checkNewlyUnlocked(previousAchievements)
      if (newUnlocked.length > 0) {
        setNewlyUnlocked(newUnlocked)
        setShowCelebration(true)
        
        // Auto-hide celebration after 5 seconds
        setTimeout(() => setShowCelebration(false), 5000)
      }
    }
  }, [userStats, achievements])

  const getDisplayedAchievements = (): Achievement[] => {
    let filtered: Achievement[] = []

    switch (selectedCategory) {
      case 'unlocked':
        filtered = achievementService.getUnlockedAchievements()
        break
      case 'progress':
        filtered = achievementService.getAchievementsInProgress()
        break
      case 'next':
        filtered = achievementService.getNextAchievements(maxDisplayed)
        break
      default:
        filtered = achievements
    }

    if (showOnlyRecent) {
      // Show recently unlocked or high-progress achievements
      filtered = filtered
        .filter(a => a.isUnlocked || a.progress > 0)
        .sort((a, b) => {
          if (a.isUnlocked && !b.isUnlocked) return -1
          if (!a.isUnlocked && b.isUnlocked) return 1
          return (b.progress / b.maxProgress) - (a.progress / a.maxProgress)
        })
    }

    return filtered.slice(0, maxDisplayed)
  }

  const getDifficultyColor = (difficulty: Achievement['difficulty']) => {
    switch (difficulty) {
      case 'bronze':
        return 'from-amber-400 to-amber-600'
      case 'silver':
        return 'from-gray-400 to-gray-600'
      case 'gold':
        return 'from-yellow-400 to-yellow-600'
      case 'platinum':
        return 'from-purple-400 to-purple-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getDifficultyIcon = (difficulty: Achievement['difficulty']) => {
    switch (difficulty) {
      case 'bronze':
        return <Award className="w-4 h-4" />
      case 'silver':
        return <Star className="w-4 h-4" />
      case 'gold':
        return <Trophy className="w-4 h-4" />
      case 'platinum':
        return <Crown className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'conversation':
        return '💬'
      case 'vocabulary':
        return '📚'
      case 'grammar':
        return '✏️'
      case 'pronunciation':
        return '🎯'
      case 'streak':
        return '🔥'
      case 'social':
        return '👥'
      case 'cultural':
        return '🌍'
      default:
        return '⭐'
    }
  }

  const progressPercentage = (achievement: Achievement) => {
    return Math.min(100, (achievement.progress / achievement.maxProgress) * 100)
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

  const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {showCelebration && newlyUnlocked.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              className="bg-background border rounded-lg p-6 max-w-md w-full"
              variants={celebrationVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h3 className="text-xl font-bold">Achievement Unlocked!</h3>
                {newlyUnlocked.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="text-2xl">{achievement.icon}</div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <Badge className={`bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} text-white`}>
                      +{achievement.reward.points} points
                    </Badge>
                  </div>
                ))}
                <Button onClick={() => setShowCelebration(false)}>
                  Awesome!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                {achievementService.getTotalPoints()} pts
              </div>
              {showOnlyRecent && (
                <Link href="/achievements">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="w-3 h-3" />
                    View All
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Category Filter */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'unlocked', 'progress', 'next'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category as 'all' | 'unlocked' | 'progress' | 'next')}
                  className="text-xs capitalize"
                >
                  {category === 'next' ? 'Up Next' : category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Achievement Cards */}
          <div className="space-y-3">
            {getDisplayedAchievements().map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className="group"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 border-l-4 ${
                    achievement.isUnlocked 
                      ? `border-l-green-500 bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 dark:hover:bg-green-900/20` 
                      : `border-l-gray-300 hover:border-l-primary hover:shadow-md`
                  }`}
                  onClick={() => onAchievementClick?.(achievement)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Achievement Icon */}
                      <div className={`p-2 rounded-lg ${
                        achievement.isUnlocked 
                          ? `bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} text-white`
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.isUnlocked ? (
                          <span className="text-lg">{achievement.icon}</span>
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>

                      {/* Achievement Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${
                              achievement.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {achievement.title}
                            </h4>
                            {achievement.isUnlocked && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(achievement.difficulty)}
                            <Badge variant="secondary" className="text-xs">
                              {achievement.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>

                        {/* Progress */}
                        {!achievement.isUnlocked && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <ProgressBar value={progressPercentage(achievement)} className="h-2" />
                          </div>
                        )}

                        {/* Rewards */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <span>{getCategoryIcon(achievement.category)}</span>
                              {achievement.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Gift className="w-3 h-3" />
                            {achievement.reward.points} pts
                          </div>
                        </div>

                        {/* Unlocked Date */}
                        {achievement.isUnlocked && achievement.unlockedAt && (
                          <div className="text-xs text-muted-foreground">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div 
            className="pt-4 border-t"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-primary">
                  {achievementService.getUnlockedAchievements().length}
                </div>
                <div className="text-xs text-muted-foreground">Unlocked</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-primary">
                  {achievementService.getAchievementsInProgress().length}
                </div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
