'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@mumicah/ui'
import { Card, CardContent } from '@mumicah/ui'
import { Button } from '@mumicah/ui'
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'
import { type ConversationMetrics } from '@/services/difficulty-adjustment-service'

type SimpleDifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

interface DifficultyIndicatorProps {
  userPerformance: ConversationMetrics
  onDifficultyChange?: (newDifficulty: SimpleDifficultyLevel) => void
  className?: string
}

export function DifficultyIndicator({
  userPerformance,
  onDifficultyChange,
  className = ''
}: DifficultyIndicatorProps) {
  const [currentDifficulty, setCurrentDifficulty] = useState<SimpleDifficultyLevel>('intermediate')
  const [suggestion, setSuggestion] = useState<{
    type: 'increase' | 'decrease' | 'maintain'
    reason: string
  } | null>(null)

  useEffect(() => {
    // For now, use a simplified difficulty assessment
    const avgScore = (userPerformance.grammarAccuracy + userPerformance.engagementLevel + userPerformance.comprehensionScore) / 3
    
    let suggestionType: 'increase' | 'decrease' | 'maintain' = 'maintain'
    let reason = 'Perfect difficulty level for you!'

    if (avgScore >= 80 && userPerformance.responseTime <= 10) {
      suggestionType = 'increase'
      reason = 'Great performance! Ready for more challenge?'
    } else if (avgScore < 60 || userPerformance.responseTime > 20) {
      suggestionType = 'decrease'
      reason = "Let's make it easier to build confidence"
    }
    
    setSuggestion({
      type: suggestionType,
      reason
    })
  }, [userPerformance, currentDifficulty])

  const getDifficultyColor = (difficulty: SimpleDifficultyLevel) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  const getSuggestionIcon = () => {
    switch (suggestion?.type) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-orange-500" />
      case 'maintain':
        return <Target className="w-4 h-4 text-blue-500" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const handleDifficultyAdjust = () => {
    if (suggestion && suggestion.type !== 'maintain') {
      let newDifficulty: SimpleDifficultyLevel = currentDifficulty
      
      if (suggestion.type === 'increase') {
        newDifficulty = currentDifficulty === 'beginner' ? 'intermediate' : 'advanced'
      } else {
        newDifficulty = currentDifficulty === 'advanced' ? 'intermediate' : 'beginner'
      }
      
      setCurrentDifficulty(newDifficulty)
      onDifficultyChange?.(newDifficulty)
      setSuggestion({
        type: 'maintain',
        reason: "Difficulty updated! Let's practice at this level."
      })
    }
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Difficulty Level</span>
                  <Badge variant="outline" className={getDifficultyColor(currentDifficulty)}>
                    {currentDifficulty}
                  </Badge>
                </div>
                {suggestion && (
                  <div className="flex items-center space-x-1 mt-1">
                    {getSuggestionIcon()}
                    <span className="text-xs text-muted-foreground">
                      {suggestion.reason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {suggestion && suggestion.type !== 'maintain' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDifficultyAdjust}
                className="gap-1"
              >
                {suggestion.type === 'increase' ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    Increase
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    Decrease
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Performance Indicators */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                {Math.round(userPerformance.grammarAccuracy)}%
              </div>
              <div className="text-muted-foreground">Grammar</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                {Math.round(userPerformance.responseTime)}s
              </div>
              <div className="text-muted-foreground">Response</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                {userPerformance.engagementLevel}%
              </div>
              <div className="text-muted-foreground">Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
