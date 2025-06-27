'use client'

import { useState, useEffect } from 'react'
import { Card } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { Lightbulb, MessageCircle, Brain, Target } from 'lucide-react'
import { aiConversationService } from '@/services/ai-conversation.service'

interface SmartSuggestionsProps {
  userId: string
  currentPersona?: any
  userProfile?: any
  className?: string
}

interface Suggestion {
  id: string
  type: 'conversation' | 'grammar' | 'vocabulary' | 'culture'
  title: string
  description: string
  confidence: number
  persona?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const suggestionIcons = {
  conversation: MessageCircle,
  grammar: Target,
  vocabulary: Brain,
  culture: Lightbulb
}

const suggestionColors = {
  conversation: 'bg-blue-500',
  grammar: 'bg-green-500',
  vocabulary: 'bg-purple-500',
  culture: 'bg-orange-500'
}

export default function SmartSuggestions({ 
  userId, 
  currentPersona, 
  userProfile,
  className = '' 
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    generateSmartSuggestions()
  }, [userId, currentPersona])

  const generateSmartSuggestions = async () => {
    setLoading(true)
    try {
      // Get recent conversation topics (mock for now)
      const recentTopics = ['travel', 'food', 'work']
      
      if (currentPersona) {
        // Get persona-specific suggestions
        const personaSuggestions = await aiConversationService.generateConversationSuggestions({
          persona: currentPersona,
          userProfile: userProfile || {
            id: userId,
            level: 'intermediate',
            targetLanguages: ['Spanish', 'French'],
            learningGoals: ['conversation', 'travel']
          },
          recentTopics
        })

        // Enhanced suggestions with AI analysis
        const enhancedSuggestions: Suggestion[] = [
          // Conversation suggestions
          ...personaSuggestions.map((suggestion, index) => ({
            id: `conv-${index}`,
            type: 'conversation' as const,
            title: `Chat: ${suggestion}`,
            description: `Practice with ${currentPersona.name} about this topic`,
            confidence: 0.85 + (Math.random() * 0.1),
            persona: currentPersona.name,
            difficulty: 'intermediate' as const
          })),
          
          // Grammar suggestions based on user level
          {
            id: 'grammar-1',
            type: 'grammar',
            title: 'Past Perfect Tense Practice',
            description: 'Master complex past actions with interactive examples',
            confidence: 0.82,
            difficulty: 'intermediate'
          },
          {
            id: 'grammar-2',
            type: 'grammar',
            title: 'Subjunctive Mood Challenge',
            description: 'Practice expressing wishes and hypothetical situations',
            confidence: 0.78,
            difficulty: 'advanced'
          },
          
          // Vocabulary expansion
          {
            id: 'vocab-1',
            type: 'vocabulary',
            title: 'Business Vocabulary Boost',
            description: 'Learn professional terms for workplace conversations',
            confidence: 0.88,
            difficulty: 'intermediate'
          },
          {
            id: 'vocab-2',
            type: 'vocabulary',
            title: 'Idiomatic Expressions',
            description: 'Sound more natural with common phrases and sayings',
            confidence: 0.75,
            difficulty: 'advanced'
          },
          
          // Cultural insights
          {
            id: 'culture-1',
            type: 'culture',
            title: 'Cultural Etiquette Tips',
            description: 'Navigate social situations with cultural awareness',
            confidence: 0.90,
            difficulty: 'beginner'
          },
          {
            id: 'culture-2',
            type: 'culture',
            title: 'Holiday Traditions',
            description: 'Explore celebrations and customs around the world',
            confidence: 0.85,
            difficulty: 'intermediate'
          }
        ]

        setSuggestions(enhancedSuggestions)
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSuggestions = selectedType === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.type === selectedType)

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Navigate to chat or specific learning activity
    if (suggestion.type === 'conversation' && currentPersona) {
      window.location.href = `/chat?persona=${currentPersona.id}&topic=${encodeURIComponent(suggestion.title)}`
    } else {
      // For other types, could navigate to dedicated learning modules
      console.log('Selected suggestion:', suggestion)
    }
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
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
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Smart Learning Suggestions</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          AI-Powered
        </Badge>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['all', 'conversation', 'grammar', 'vocabulary', 'culture'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {filteredSuggestions.slice(0, 5).map(suggestion => {
          const Icon = suggestionIcons[suggestion.type]
          const colorClass = suggestionColors[suggestion.type]
          
          return (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass} text-white flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={suggestion.difficulty === 'beginner' ? 'default' : 
                               suggestion.difficulty === 'intermediate' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {suggestion.difficulty}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% match
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {suggestion.description}
                  </p>
                  
                  {suggestion.persona && (
                    <div className="text-xs text-blue-600">
                      Recommended by {suggestion.persona}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No suggestions available for this category.</p>
        </div>
      )}
    </Card>
  )
}
