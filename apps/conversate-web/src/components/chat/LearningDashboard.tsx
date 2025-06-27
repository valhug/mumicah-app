'use client'

import { useState, useEffect } from 'react'

interface LearningMetrics {
  messagesExchanged: number
  vocabularyLearned: string[]
  culturalInsights: string[]
  corrections: string[]
  conversationTopics: string[]
  engagementScore: number
}

interface LearningDashboardProps {
  personaId: string
  className?: string
}

export function LearningDashboard({ personaId, className = '' }: LearningDashboardProps) {
  const [metrics, setMetrics] = useState<LearningMetrics>({
    messagesExchanged: 0,
    vocabularyLearned: [],
    culturalInsights: [],
    corrections: [],
    conversationTopics: [],
    engagementScore: 0
  })

  useEffect(() => {
    // Simulate loading learning metrics
    const mockMetrics: LearningMetrics = {
      messagesExchanged: 15,
      vocabularyLearned: ['practice', 'traditions', 'hobbies', 'conversation'],
      culturalInsights: [
        'Casual conversation in English often uses contractions',
        'Different cultures have unique greeting customs',
        'Art and storytelling vary across cultures'
      ],
      corrections: [
        'Use "I am" in formal writing instead of "I\'m"',
        'Consider cultural context when expressing ideas'
      ],
      conversationTopics: ['Greetings', 'Hobbies', 'Cultural traditions', 'Daily activities'],
      engagementScore: 85
    }
    
    setTimeout(() => setMetrics(mockMetrics), 500)
  }, [personaId])

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center">
          📊 Learning Progress
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-xs text-muted-foreground font-medium">Live</span>
        </div>
      </div>

      {/* Enhanced Overview Stats with Theme Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="text-2xl font-bold">{metrics.messagesExchanged}</div>
            <div className="text-sm text-blue-100">Messages</div>
            <div className="mt-2 text-xs text-blue-200 flex items-center">
              <span className="mr-1">+3 today</span>
              <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="text-2xl font-bold">{metrics.vocabularyLearned.length}</div>
            <div className="text-sm text-purple-100">Vocabulary</div>
            <div className="mt-2 text-xs text-purple-200 flex items-center">
              <span className="mr-1">+2 new words</span>
              <div className="w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="text-2xl font-bold">{metrics.culturalInsights.length}</div>
            <div className="text-sm text-amber-100">Insights</div>
            <div className="mt-2 text-xs text-amber-200 flex items-center">
              <span className="mr-1">Cultural tips</span>
              <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="text-2xl font-bold">{metrics.engagementScore}%</div>
            <div className="text-sm text-green-100">Engagement</div>
            <div className="mt-2 text-xs text-green-200 flex items-center">
              <span className="mr-1">Excellent!</span>
              <div className="w-1 h-1 bg-green-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bars with Theme Colors */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground font-medium">Daily Goal Progress</span>
            <span className="text-primary font-semibold">15/20 messages</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 shadow-inner">
            <div className="bg-primary h-2.5 rounded-full w-3/4 shadow-sm"></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground font-medium">Vocabulary Mastery</span>
            <span className="text-purple-600 font-semibold">4/10 words</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 shadow-inner">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2.5 rounded-full w-2/5 shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Learning Details with Theme Colors */}
      <div className="space-y-4">
        {/* Recent Vocabulary */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300">
          <h4 className="font-bold text-foreground mb-3 flex items-center">
            📚 Recent Vocabulary
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">New</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {metrics.vocabularyLearned.slice(0, 4).map((word, index) => (
              <div key={index} className="bg-secondary/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary/70">
                <span className="font-semibold text-foreground">{word}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Insights */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300">
          <h4 className="font-bold text-foreground mb-3 flex items-center">
            🌍 Cultural Learning
            <span className="ml-2 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">Insights</span>
          </h4>
          <div className="space-y-2">
            {metrics.culturalInsights.slice(0, 2).map((insight, index) => (
              <div key={index} className="bg-secondary/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary/70">
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Topics */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300">
          <h4 className="font-bold text-foreground mb-3 flex items-center">
            💬 Active Topics
            <span className="ml-2 text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">Live</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {metrics.conversationTopics.map((topic, index) => (
              <span
                key={index}
                className="bg-secondary/50 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary/70"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced LangChain Status with Theme Colors */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300">
        <h4 className="font-bold text-foreground mb-3 flex items-center">
          🔗 AI Features Active
          <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">Live</span>
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-foreground font-medium">Persona Consistency</span>
            </div>
            <span className="text-xs text-green-600 font-bold bg-green-500/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-foreground font-medium">Learning Analytics</span>
            </div>
            <span className="text-xs text-blue-600 font-bold bg-blue-500/20 px-2 py-1 rounded-full">Tracking</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-foreground font-medium">Cultural Context</span>
            </div>
            <span className="text-xs text-purple-600 font-bold bg-purple-500/20 px-2 py-1 rounded-full">Enhanced</span>
          </div>
        </div>
      </div>
    </div>
  )
}
