'use client'

import { PersonaId } from '@/types/conversation'

export interface DifficultyLevel {
  id: string
  name: string
  description: string
  complexity: number // 1-10 scale
  vocabularyRange: 'basic' | 'intermediate' | 'advanced' | 'expert'
  grammarComplexity: 'simple' | 'moderate' | 'complex' | 'advanced'
  topicDepth: 'surface' | 'moderate' | 'deep' | 'philosophical'
  speakingSpeed: 'slow' | 'normal' | 'fast'
  culturalReferences: 'minimal' | 'moderate' | 'rich' | 'native'
}

export interface UserProfile {
  id: string
  currentLevel: string
  strengths: string[]
  weaknesses: string[]
  learningGoals: string[]
  conversationHistory: ConversationMetrics[]
  preferredDifficulty: string
  adaptiveSettings: {
    autoAdjust: boolean
    preferredChallengeLevel: 'comfortable' | 'challenging' | 'intensive'
  }
}

export interface ConversationMetrics {
  sessionId: string
  difficultyUsed: string
  comprehensionScore: number // 0-100
  responseTime: number // seconds
  vocabularyUsage: number // new words used correctly
  grammarAccuracy: number // 0-100
  engagementLevel: number // 0-100
  userFeedback?: 'too_easy' | 'just_right' | 'too_hard'
}

export interface AdjustmentRecommendation {
  newDifficulty: string
  reason: string
  confidence: number // 0-100
  adjustments: {
    vocabularyLevel?: 'increase' | 'decrease' | 'maintain'
    grammarComplexity?: 'increase' | 'decrease' | 'maintain'
    topicDepth?: 'increase' | 'decrease' | 'maintain'
    speakingSpeed?: 'increase' | 'decrease' | 'maintain'
  }
}

export class DifficultyAdjustmentService {
  private difficultyLevels: DifficultyLevel[] = [
    {
      id: 'beginner_1',
      name: 'Débutant - Premiers Pas',
      description: 'Perfect for your first French conversations',
      complexity: 1,
      vocabularyRange: 'basic',
      grammarComplexity: 'simple',
      topicDepth: 'surface',
      speakingSpeed: 'slow',
      culturalReferences: 'minimal'
    },
    {
      id: 'beginner_2',
      name: 'Débutant - En Progression',
      description: 'Building confidence with basic conversations',
      complexity: 2,
      vocabularyRange: 'basic',
      grammarComplexity: 'simple',
      topicDepth: 'surface',
      speakingSpeed: 'slow',
      culturalReferences: 'minimal'
    },
    {
      id: 'beginner_3',
      name: 'Débutant - Solide',
      description: 'Comfortable with everyday topics',
      complexity: 3,
      vocabularyRange: 'basic',
      grammarComplexity: 'moderate',
      topicDepth: 'moderate',
      speakingSpeed: 'slow',
      culturalReferences: 'moderate'
    },
    {
      id: 'intermediate_1',
      name: 'Intermédiaire - Émergent',
      description: 'Ready for more varied conversations',
      complexity: 4,
      vocabularyRange: 'intermediate',
      grammarComplexity: 'moderate',
      topicDepth: 'moderate',
      speakingSpeed: 'normal',
      culturalReferences: 'moderate'
    },
    {
      id: 'intermediate_2',
      name: 'Intermédiaire - Développé',
      description: 'Discussing complex topics with confidence',
      complexity: 5,
      vocabularyRange: 'intermediate',
      grammarComplexity: 'moderate',
      topicDepth: 'moderate',
      speakingSpeed: 'normal',
      culturalReferences: 'moderate'
    },
    {
      id: 'intermediate_3',
      name: 'Intermédiaire - Autonome',
      description: 'Handling sophisticated conversations',
      complexity: 6,
      vocabularyRange: 'intermediate',
      grammarComplexity: 'complex',
      topicDepth: 'deep',
      speakingSpeed: 'normal',
      culturalReferences: 'rich'
    },
    {
      id: 'advanced_1',
      name: 'Avancé - Compétent',
      description: 'Nuanced discussions and cultural insights',
      complexity: 7,
      vocabularyRange: 'advanced',
      grammarComplexity: 'complex',
      topicDepth: 'deep',
      speakingSpeed: 'normal',
      culturalReferences: 'rich'
    },
    {
      id: 'advanced_2',
      name: 'Avancé - Maîtrise',
      description: 'Near-native level conversations',
      complexity: 8,
      vocabularyRange: 'advanced',
      grammarComplexity: 'advanced',
      topicDepth: 'deep',
      speakingSpeed: 'fast',
      culturalReferences: 'rich'
    },
    {
      id: 'expert',
      name: 'Expert - Native-like',
      description: 'Professional and academic level French',
      complexity: 9,
      vocabularyRange: 'expert',
      grammarComplexity: 'advanced',
      topicDepth: 'philosophical',
      speakingSpeed: 'fast',
      culturalReferences: 'native'
    },
    {
      id: 'native',
      name: 'Natif - Perfectionnement',
      description: 'Indistinguishable from native speakers',
      complexity: 10,
      vocabularyRange: 'expert',
      grammarComplexity: 'advanced',
      topicDepth: 'philosophical',
      speakingSpeed: 'fast',
      culturalReferences: 'native'
    }
  ]

  // Analyze user performance and recommend difficulty adjustment
  analyzeDifficultyFit(
    userProfile: UserProfile,
    recentMetrics: ConversationMetrics[]
  ): AdjustmentRecommendation {
    if (recentMetrics.length === 0) {
      return this.getDefaultRecommendation(userProfile.currentLevel)
    }

    // Calculate average scores from recent sessions
    const avgComprehension = this.calculateAverage(recentMetrics, 'comprehensionScore')
    const avgResponseTime = this.calculateAverage(recentMetrics, 'responseTime')
    const avgGrammarAccuracy = this.calculateAverage(recentMetrics, 'grammarAccuracy')
    const avgEngagement = this.calculateAverage(recentMetrics, 'engagementLevel')

    // Analyze user feedback
    const feedbackCounts = this.analyzeFeedback(recentMetrics)

    // Determine if adjustment is needed
    const recommendation = this.generateRecommendation(
      userProfile,
      {
        comprehension: avgComprehension,
        responseTime: avgResponseTime,
        grammarAccuracy: avgGrammarAccuracy,
        engagement: avgEngagement,
        feedback: feedbackCounts
      }
    )

    return recommendation
  }

  private calculateAverage(metrics: ConversationMetrics[], field: keyof ConversationMetrics): number {
    const values = metrics.map(m => m[field] as number).filter(v => typeof v === 'number')
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  }

  private analyzeFeedback(metrics: ConversationMetrics[]): Record<string, number> {
    const feedback = {
      too_easy: 0,
      just_right: 0,
      too_hard: 0
    }

    metrics.forEach(metric => {
      if (metric.userFeedback) {
        feedback[metric.userFeedback]++
      }
    })

    return feedback
  }

  private generateRecommendation(
    userProfile: UserProfile,
    averages: {
      comprehension: number
      responseTime: number
      grammarAccuracy: number
      engagement: number
      feedback: Record<string, number>
    }
  ): AdjustmentRecommendation {
    const currentLevel = this.getDifficultyLevel(userProfile.currentLevel)
    if (!currentLevel) {
      return this.getDefaultRecommendation('beginner_1')
    }

    let adjustmentDirection = 0 // -1 decrease, 0 maintain, 1 increase
    let confidence = 50
    let reason = 'Maintaining current difficulty'

    // Analyze performance indicators
    if (averages.comprehension > 85 && averages.grammarAccuracy > 80 && averages.engagement > 70) {
      if (averages.responseTime < 3) {
        adjustmentDirection = 1
        confidence = 80
        reason = 'Excellent performance indicates readiness for increased difficulty'
      }
    } else if (averages.comprehension < 60 || averages.grammarAccuracy < 50) {
      adjustmentDirection = -1
      confidence = 75
      reason = 'Lower comprehension suggests need for easier content'
    }

    // Factor in user feedback
    const totalFeedback = Object.values(averages.feedback).reduce((sum, count) => sum + count, 0)
    if (totalFeedback > 0) {
      const easyPercent = averages.feedback.too_easy / totalFeedback
      const hardPercent = averages.feedback.too_hard / totalFeedback

      if (easyPercent > 0.6) {
        adjustmentDirection = 1
        confidence = Math.max(confidence, 85)
        reason = 'User feedback indicates content is too easy'
      } else if (hardPercent > 0.6) {
        adjustmentDirection = -1
        confidence = Math.max(confidence, 85)
        reason = 'User feedback indicates content is too difficult'
      }
    }

    // Apply user preferences
    if (userProfile.adaptiveSettings.preferredChallengeLevel === 'intensive' && adjustmentDirection >= 0) {
      adjustmentDirection = Math.max(adjustmentDirection, 1)
      reason += ' (adjusted for intensive preference)'
    } else if (userProfile.adaptiveSettings.preferredChallengeLevel === 'comfortable' && adjustmentDirection <= 0) {
      adjustmentDirection = Math.min(adjustmentDirection, -1)
      reason += ' (adjusted for comfortable preference)'
    }

    // Determine new difficulty level
    const currentComplexity = currentLevel.complexity
    const newComplexity = Math.max(1, Math.min(10, currentComplexity + adjustmentDirection))
    const newLevel = this.difficultyLevels.find(level => level.complexity === newComplexity)

    return {
      newDifficulty: newLevel?.id || userProfile.currentLevel,
      reason,
      confidence,
      adjustments: this.generateSpecificAdjustments(averages, adjustmentDirection)
    }
  }

  private generateSpecificAdjustments(
    averages: {
      comprehension: number
      responseTime: number
      grammarAccuracy: number
      engagement: number
      feedback: Record<string, number>
    },
    direction: number
  ): AdjustmentRecommendation['adjustments'] {
    const adjustments: AdjustmentRecommendation['adjustments'] = {}

    if (direction > 0) {
      // Increase difficulty
      if (averages.comprehension > 90) {
        adjustments.vocabularyLevel = 'increase'
        adjustments.topicDepth = 'increase'
      }
      if (averages.grammarAccuracy > 85) {
        adjustments.grammarComplexity = 'increase'
      }
      if (averages.responseTime < 2) {
        adjustments.speakingSpeed = 'increase'
      }
    } else if (direction < 0) {
      // Decrease difficulty
      if (averages.comprehension < 70) {
        adjustments.vocabularyLevel = 'decrease'
        adjustments.topicDepth = 'decrease'
      }
      if (averages.grammarAccuracy < 60) {
        adjustments.grammarComplexity = 'decrease'
      }
      if (averages.responseTime > 8) {
        adjustments.speakingSpeed = 'decrease'
      }
    }

    return adjustments
  }

  private getDefaultRecommendation(currentLevel: string): AdjustmentRecommendation {
    return {
      newDifficulty: currentLevel,
      reason: 'No recent data available for adjustment',
      confidence: 50,
      adjustments: {}
    }
  }

  // Get difficulty level by ID
  getDifficultyLevel(id: string): DifficultyLevel | undefined {
    return this.difficultyLevels.find(level => level.id === id)
  }

  // Get all difficulty levels
  getAllDifficultyLevels(): DifficultyLevel[] {
    return this.difficultyLevels
  }

  // Get appropriate difficulty levels for a persona
  getPersonaDifficultyLevels(persona: PersonaId): DifficultyLevel[] {
    // Maya (teacher) - all levels available
    if (persona === 'maya') {
      return this.difficultyLevels
    }
    
    // Alex (friend) - casual levels (beginner to intermediate)
    if (persona === 'alex') {
      return this.difficultyLevels.filter(level => level.complexity <= 6)
    }
    
    // Luna (cultural guide) - intermediate to advanced levels
    if (persona === 'luna') {
      return this.difficultyLevels.filter(level => level.complexity >= 4)
    }

    return this.difficultyLevels
  }

  // Generate conversation parameters based on difficulty
  generateConversationParameters(difficultyId: string): {
    vocabularyComplexity: number
    grammarComplexity: number
    topicSophistication: number
    culturalDepth: number
    responseSpeed: number
  } {
    const level = this.getDifficultyLevel(difficultyId)
    if (!level) {
      return {
        vocabularyComplexity: 3,
        grammarComplexity: 3,
        topicSophistication: 3,
        culturalDepth: 3,
        responseSpeed: 3
      }
    }

    return {
      vocabularyComplexity: level.complexity,
      grammarComplexity: level.complexity,
      topicSophistication: level.complexity,
      culturalDepth: level.complexity,
      responseSpeed: level.complexity
    }
  }

  // Suggest next difficulty progression
  suggestProgression(currentLevel: string, userStrengths: string[]): {
    nextLevel: string
    focusAreas: string[]
    timeEstimate: string
  } {
    const current = this.getDifficultyLevel(currentLevel)
    if (!current) {
      return {
        nextLevel: 'beginner_1',
        focusAreas: ['basic vocabulary', 'simple grammar'],
        timeEstimate: '2-4 weeks'
      }
    }

    const nextComplexity = Math.min(10, current.complexity + 1)
    const nextLevel = this.difficultyLevels.find(level => level.complexity === nextComplexity)

    if (!nextLevel) {
      return {
        nextLevel: currentLevel,
        focusAreas: ['conversation fluency', 'cultural mastery'],
        timeEstimate: 'ongoing'
      }
    }

    // Determine focus areas based on current weaknesses
    const focusAreas: string[] = []
    
    if (!userStrengths.includes('vocabulary')) {
      focusAreas.push('vocabulary expansion')
    }
    if (!userStrengths.includes('grammar')) {
      focusAreas.push('grammar mastery')
    }
    if (!userStrengths.includes('pronunciation')) {
      focusAreas.push('pronunciation refinement')
    }
    if (!userStrengths.includes('cultural_knowledge')) {
      focusAreas.push('cultural understanding')
    }

    // Estimate time based on complexity increase
    const complexityGap = nextLevel.complexity - current.complexity
    const timeEstimate = complexityGap === 1 ? '2-4 weeks' : 
                        complexityGap === 2 ? '1-2 months' : '2-3 months'

    return {
      nextLevel: nextLevel.id,
      focusAreas: focusAreas.length > 0 ? focusAreas : ['conversation practice'],
      timeEstimate
    }
  }
}

// Singleton instance
export const difficultyAdjustmentService = new DifficultyAdjustmentService()
