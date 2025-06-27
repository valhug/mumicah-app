'use client'

import { useState, useEffect } from 'react'
import { Card } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  ChevronRight,
  Award
} from 'lucide-react'

interface AIAnalyticsProps {
  userId: string
  className?: string
}

interface LearningInsight {
  id: string
  type: 'improvement' | 'strength' | 'recommendation' | 'milestone'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timeframe: string
  action?: string
}

interface LearningMetrics {
  vocabularyGrowth: {
    thisWeek: number
    lastWeek: number
    trend: 'up' | 'down' | 'stable'
  }
  grammarAccuracy: {
    current: number
    target: number
    improvement: number
  }
  conversationFluency: {
    score: number
    factors: string[]
  }
  learningVelocity: {
    pointsPerHour: number
    weeklyGoal: number
    prediction: string
  }
}

export default function AIAnalytics({ userId, className = '' }: AIAnalyticsProps) {
  const [insights, setInsights] = useState<LearningInsight[]>([])
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'insights' | 'metrics'>('insights')

  useEffect(() => {
    generateAIAnalytics()
  }, [userId])

  const generateAIAnalytics = async () => {
    setLoading(true)
    try {
      // Simulate AI analysis (in real implementation, this would call the AI service)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock AI-generated insights
      const aiInsights: LearningInsight[] = [
        {
          id: '1',
          type: 'improvement',
          title: 'Grammar Breakthrough Detected',
          description: 'Your use of past perfect tense improved by 40% this week. The AI noticed consistent patterns in your recent conversations.',
          confidence: 0.92,
          impact: 'high',
          timeframe: 'This week',
          action: 'Continue practicing complex tenses'
        },
        {
          id: '2',
          type: 'strength',
          title: 'Vocabulary Champion',
          description: 'You\'ve mastered 15 new business-related terms. Your contextual usage shows excellent comprehension.',
          confidence: 0.88,
          impact: 'medium',
          timeframe: '2 weeks',
          action: 'Try advanced synonyms'
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Cultural Context Opportunity',
          description: 'AI analysis suggests focusing on cultural nuances. Your grammar is strong, but cultural awareness could enhance your conversations.',
          confidence: 0.85,
          impact: 'high',
          timeframe: 'Next month',
          action: 'Chat with Luna about traditions'
        },
        {
          id: '4',
          type: 'milestone',
          title: 'Conversation Milestone Achieved',
          description: 'Congratulations! You\'ve maintained 5+ minute conversations consistently. This indicates strong fluency development.',
          confidence: 0.95,
          impact: 'high',
          timeframe: 'Today',
          action: 'Try advanced topics'
        },
        {
          id: '5',
          type: 'improvement',
          title: 'Pronunciation Pattern',
          description: 'AI detected hesitation with "th" sounds. Voice analysis shows 23% improvement potential with targeted practice.',
          confidence: 0.78,
          impact: 'medium',
          timeframe: 'This week',
          action: 'Use voice practice exercises'
        }
      ]

      // Mock metrics
      const learningMetrics: LearningMetrics = {
        vocabularyGrowth: {
          thisWeek: 24,
          lastWeek: 18,
          trend: 'up'
        },
        grammarAccuracy: {
          current: 85,
          target: 90,
          improvement: 12
        },
        conversationFluency: {
          score: 78,
          factors: ['Vocabulary richness', 'Grammar accuracy', 'Cultural awareness', 'Response time']
        },
        learningVelocity: {
          pointsPerHour: 45,
          weeklyGoal: 500,
          prediction: 'On track to exceed weekly goal by 15%'
        }
      }

      setInsights(aiInsights)
      setMetrics(learningMetrics)
    } catch (error) {
      console.error('Error generating AI analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return TrendingUp
      case 'strength': return Award
      case 'recommendation': return Target
      case 'milestone': return Zap
      default: return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'text-green-600 bg-green-100'
      case 'strength': return 'text-blue-600 bg-blue-100'
      case 'recommendation': return 'text-orange-600 bg-orange-100'
      case 'milestone': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">AI Learning Analytics</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          <Brain className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {['insights', 'metrics'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {selectedTab === 'insights' && (
        <div className="space-y-4">
          {insights.map(insight => {
            const Icon = getInsightIcon(insight.type)
            const colorClass = getInsightColor(insight.type)
            
            return (
              <div
                key={insight.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={insight.impact === 'high' ? 'default' : 
                                 insight.impact === 'medium' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {insight.impact} impact
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {insight.timeframe}
                      </span>
                      
                      {insight.action && (
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          {insight.action}
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedTab === 'metrics' && metrics && (
        <div className="space-y-6">
          {/* Vocabulary Growth */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Vocabulary Growth</h4>
              <TrendingUp className={`h-4 w-4 ${
                metrics.vocabularyGrowth.trend === 'up' ? 'text-green-600' :
                metrics.vocabularyGrowth.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">This week: <strong>{metrics.vocabularyGrowth.thisWeek}</strong> words</span>
              <span className="text-gray-600">Last week: {metrics.vocabularyGrowth.lastWeek} words</span>
              <Badge variant="secondary" className="text-xs">
                {((metrics.vocabularyGrowth.thisWeek - metrics.vocabularyGrowth.lastWeek) / metrics.vocabularyGrowth.lastWeek * 100).toFixed(0)}% improvement
              </Badge>
            </div>
          </div>

          {/* Grammar Accuracy */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Grammar Accuracy</h4>
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: {metrics.grammarAccuracy.current}%</span>
                <span>Target: {metrics.grammarAccuracy.target}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`bg-green-600 h-2 rounded-full transition-all duration-300 w-[${Math.round((metrics.grammarAccuracy.current / metrics.grammarAccuracy.target) * 100)}%]`}>
                </div>
              </div>
              <span className="text-xs text-green-600">
                +{metrics.grammarAccuracy.improvement}% this month
              </span>
            </div>
          </div>

          {/* Conversation Fluency */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Conversation Fluency</h4>
              <div className="text-2xl font-bold text-purple-600">{metrics.conversationFluency.score}</div>
            </div>
            <div className="space-y-1">
              {metrics.conversationFluency.factors.map((factor, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  {factor}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Velocity */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Learning Velocity</h4>
              <Zap className="h-4 w-4 text-orange-600" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Points per hour: <strong>{metrics.learningVelocity.pointsPerHour}</strong></span>
                <span>Weekly goal: {metrics.learningVelocity.weeklyGoal}</span>
              </div>
              <p className="text-xs text-orange-600">
                🎯 {metrics.learningVelocity.prediction}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
