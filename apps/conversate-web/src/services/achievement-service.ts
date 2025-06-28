'use client'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  type: AchievementType
  requirements: AchievementRequirement[]
  reward: {
    points: number
    badge?: string
    unlocks?: string[]
  }
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum'
  isUnlocked: boolean
  progress: number
  maxProgress: number
  unlockedAt?: Date
}

export type AchievementCategory = 
  | 'conversation' 
  | 'vocabulary' 
  | 'grammar' 
  | 'pronunciation' 
  | 'streak' 
  | 'social' 
  | 'cultural'

export type AchievementType = 
  | 'milestone' 
  | 'streak' 
  | 'collection' 
  | 'perfect' 
  | 'social' 
  | 'exploration'

export interface AchievementRequirement {
  id: string
  type: 'conversation_count' | 'vocabulary_learned' | 'streak_days' | 'perfect_pronunciation' | 'grammar_accuracy' | 'cultural_topics'
  target: number
  current: number
}

export interface UserStats {
  totalConversations: number
  vocabularyLearned: number
  currentStreak: number
  longestStreak: number
  perfectPronunciations: number
  grammarAccuracy: number
  culturalTopicsExplored: number
  totalPoints: number
  level: number
}

export class AchievementService {
  private achievements: Achievement[] = [
    // Conversation Achievements
    {
      id: 'first_conversation',
      title: 'Premier Échange',
      description: 'Complete your first conversation',
      icon: '💬',
      category: 'conversation',
      type: 'milestone',
      requirements: [
        { id: 'conversations', type: 'conversation_count', target: 1, current: 0 }
      ],
      reward: { points: 50, badge: 'first_chat' },
      difficulty: 'bronze',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'chat_enthusiast',
      title: 'Passionné de Conversation',
      description: 'Complete 10 conversations',
      icon: '🗣️',
      category: 'conversation',
      type: 'milestone',
      requirements: [
        { id: 'conversations', type: 'conversation_count', target: 10, current: 0 }
      ],
      reward: { points: 200, badge: 'chat_enthusiast', unlocks: ['advanced_personas'] },
      difficulty: 'silver',
      isUnlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'conversation_master',
      title: 'Maître de la Conversation',
      description: 'Complete 50 conversations with different personas',
      icon: '🎭',
      category: 'conversation',
      type: 'milestone',
      requirements: [
        { id: 'conversations', type: 'conversation_count', target: 50, current: 0 }
      ],
      reward: { points: 500, badge: 'conversation_master', unlocks: ['expert_mode'] },
      difficulty: 'gold',
      isUnlocked: false,
      progress: 0,
      maxProgress: 50
    },

    // Vocabulary Achievements
    {
      id: 'word_collector',
      title: 'Collectionneur de Mots',
      description: 'Learn 25 new vocabulary words',
      icon: '📚',
      category: 'vocabulary',
      type: 'collection',
      requirements: [
        { id: 'vocabulary', type: 'vocabulary_learned', target: 25, current: 0 }
      ],
      reward: { points: 150, badge: 'word_collector' },
      difficulty: 'bronze',
      isUnlocked: false,
      progress: 0,
      maxProgress: 25
    },
    {
      id: 'vocabulary_enthusiast',
      title: 'Passionné de Vocabulaire',
      description: 'Learn 100 new vocabulary words',
      icon: '📖',
      category: 'vocabulary',
      type: 'collection',
      requirements: [
        { id: 'vocabulary', type: 'vocabulary_learned', target: 100, current: 0 }
      ],
      reward: { points: 400, badge: 'vocabulary_enthusiast', unlocks: ['vocabulary_challenges'] },
      difficulty: 'silver',
      isUnlocked: false,
      progress: 0,
      maxProgress: 100
    },

    // Streak Achievements
    {
      id: 'consistent_learner',
      title: 'Apprenant Régulier',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'streak',
      type: 'streak',
      requirements: [
        { id: 'streak', type: 'streak_days', target: 7, current: 0 }
      ],
      reward: { points: 200, badge: 'consistent_learner' },
      difficulty: 'bronze',
      isUnlocked: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: 'dedication_champion',
      title: 'Champion de la Persévérance',
      description: 'Maintain a 30-day learning streak',
      icon: '🏆',
      category: 'streak',
      type: 'streak',
      requirements: [
        { id: 'streak', type: 'streak_days', target: 30, current: 0 }
      ],
      reward: { points: 750, badge: 'dedication_champion', unlocks: ['streak_multiplier'] },
      difficulty: 'gold',
      isUnlocked: false,
      progress: 0,
      maxProgress: 30
    },

    // Pronunciation Achievements
    {
      id: 'pronunciation_perfectionist',
      title: 'Perfectionniste de la Prononciation',
      description: 'Get perfect pronunciation score 10 times',
      icon: '🎯',
      category: 'pronunciation',
      type: 'perfect',
      requirements: [
        { id: 'perfect_pronunciation', type: 'perfect_pronunciation', target: 10, current: 0 }
      ],
      reward: { points: 300, badge: 'pronunciation_perfectionist' },
      difficulty: 'silver',
      isUnlocked: false,
      progress: 0,
      maxProgress: 10
    },

    // Cultural Achievements
    {
      id: 'cultural_explorer',
      title: 'Explorateur Culturel',
      description: 'Discuss 5 different cultural topics',
      icon: '🌍',
      category: 'cultural',
      type: 'exploration',
      requirements: [
        { id: 'cultural_topics', type: 'cultural_topics', target: 5, current: 0 }
      ],
      reward: { points: 250, badge: 'cultural_explorer', unlocks: ['cultural_deep_dive'] },
      difficulty: 'silver',
      isUnlocked: false,
      progress: 0,
      maxProgress: 5
    },

    // Grammar Achievements
    {
      id: 'grammar_guru',
      title: 'Gourou de la Grammaire',
      description: 'Maintain 90% grammar accuracy over 20 conversations',
      icon: '✏️',
      category: 'grammar',
      type: 'perfect',
      requirements: [
        { id: 'grammar_accuracy', type: 'grammar_accuracy', target: 90, current: 0 }
      ],
      reward: { points: 400, badge: 'grammar_guru', unlocks: ['advanced_grammar'] },
      difficulty: 'gold',
      isUnlocked: false,
      progress: 0,
      maxProgress: 90
    }
  ]

  // Update user progress towards achievements
  updateProgress(userStats: UserStats): Achievement[] {
    const updatedAchievements = this.achievements.map(achievement => {
      const updatedAchievement = { ...achievement }
      
      achievement.requirements.forEach(requirement => {
        switch (requirement.type) {
          case 'conversation_count':
            requirement.current = userStats.totalConversations
            break
          case 'vocabulary_learned':
            requirement.current = userStats.vocabularyLearned
            break
          case 'streak_days':
            requirement.current = userStats.currentStreak
            break
          case 'perfect_pronunciation':
            requirement.current = userStats.perfectPronunciations
            break
          case 'grammar_accuracy':
            requirement.current = userStats.grammarAccuracy
            break
          case 'cultural_topics':
            requirement.current = userStats.culturalTopicsExplored
            break
        }
      })

      // Calculate overall progress
      const totalProgress = achievement.requirements.reduce((sum, req) => {
        return sum + Math.min(req.current, req.target)
      }, 0)
      
      const totalTarget = achievement.requirements.reduce((sum, req) => {
        return sum + req.target
      }, 0)

      updatedAchievement.progress = totalProgress
      updatedAchievement.maxProgress = totalTarget

      // Check if achievement is unlocked
      const isComplete = achievement.requirements.every(req => req.current >= req.target)
      if (isComplete && !achievement.isUnlocked) {
        updatedAchievement.isUnlocked = true
        updatedAchievement.unlockedAt = new Date()
      }

      return updatedAchievement
    })

    return updatedAchievements
  }

  // Get achievements by category
  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category)
  }

  // Get unlocked achievements
  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(achievement => achievement.isUnlocked)
  }

  // Get achievements in progress
  getAchievementsInProgress(): Achievement[] {
    return this.achievements.filter(achievement => 
      !achievement.isUnlocked && achievement.progress > 0
    )
  }

  // Get next achievable achievements
  getNextAchievements(limit: number = 3): Achievement[] {
    const inProgress = this.getAchievementsInProgress()
    const notStarted = this.achievements.filter(achievement => 
      !achievement.isUnlocked && achievement.progress === 0
    )

    // Sort by progress (closer to completion first)
    inProgress.sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
    
    // Sort not started by difficulty
    const difficultyOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4 }
    notStarted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])

    return [...inProgress, ...notStarted].slice(0, limit)
  }

  // Calculate total points earned
  getTotalPoints(): number {
    return this.achievements
      .filter(achievement => achievement.isUnlocked)
      .reduce((total, achievement) => total + achievement.reward.points, 0)
  }

  // Calculate user level based on points
  calculateLevel(points: number): number {
    // Level progression: 100 points per level, with increasing requirements
    if (points < 100) return 1
    if (points < 300) return 2
    if (points < 600) return 3
    if (points < 1000) return 4
    if (points < 1500) return 5
    if (points < 2100) return 6
    if (points < 2800) return 7
    if (points < 3600) return 8
    if (points < 4500) return 9
    
    // Level 10+: every 1000 points
    return Math.floor((points - 4500) / 1000) + 10
  }

  // Get points needed for next level
  getPointsForNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints)
    const nextLevelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]
    
    if (currentLevel < 10) {
      return nextLevelThresholds[currentLevel] - currentPoints
    }
    
    // For level 10+
    const nextLevelPoints = 4500 + (currentLevel - 9) * 1000
    return nextLevelPoints - currentPoints
  }

  // Check for newly unlocked achievements
  checkNewlyUnlocked(previousAchievements: Achievement[]): Achievement[] {
    const currentAchievements = this.achievements
    const newlyUnlocked: Achievement[] = []

    currentAchievements.forEach(current => {
      const previous = previousAchievements.find(prev => prev.id === current.id)
      if (current.isUnlocked && (!previous || !previous.isUnlocked)) {
        newlyUnlocked.push(current)
      }
    })

    return newlyUnlocked
  }

  // Get achievement statistics
  getAchievementStats(): {
    total: number
    unlocked: number
    bronze: number
    silver: number
    gold: number
    platinum: number
    categories: Record<AchievementCategory, { total: number; unlocked: number }>
  } {
    const stats = {
      total: this.achievements.length,
      unlocked: this.achievements.filter(a => a.isUnlocked).length,
      bronze: this.achievements.filter(a => a.difficulty === 'bronze' && a.isUnlocked).length,
      silver: this.achievements.filter(a => a.difficulty === 'silver' && a.isUnlocked).length,
      gold: this.achievements.filter(a => a.difficulty === 'gold' && a.isUnlocked).length,
      platinum: this.achievements.filter(a => a.difficulty === 'platinum' && a.isUnlocked).length,
      categories: {} as Record<AchievementCategory, { total: number; unlocked: number }>
    }

    // Category statistics
    const categories: AchievementCategory[] = ['conversation', 'vocabulary', 'grammar', 'pronunciation', 'streak', 'social', 'cultural']
    
    categories.forEach(category => {
      const categoryAchievements = this.achievements.filter(a => a.category === category)
      stats.categories[category] = {
        total: categoryAchievements.length,
        unlocked: categoryAchievements.filter(a => a.isUnlocked).length
      }
    })

    return stats
  }
}

// Singleton instance
export const achievementService = new AchievementService()
