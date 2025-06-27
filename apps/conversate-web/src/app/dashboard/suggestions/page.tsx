'use client'

import { useState } from 'react'
import { PageContainer } from '@mumicah/ui'
import { Card, Badge, Button } from '@mumicah/ui'
import { Lightbulb, MessageCircle, Brain, Target, Sparkles, ArrowRight } from 'lucide-react'
import SmartSuggestions from '@/components/features/SmartSuggestions'
import { useRouter } from 'next/navigation'

export default function SmartSuggestionsPage() {
  const router = useRouter()
  const [selectedPersona, setSelectedPersona] = useState({
    id: 'maya',
    name: 'Maya Chen',
    role: 'Patient Language Teacher',
    specialties: ['Grammar explanation', 'Pronunciation help', 'Cultural context']
  })

  const personas = [
    {
      id: 'maya',
      name: 'Maya Chen',
      role: 'Patient Language Teacher',
      specialties: ['Grammar explanation', 'Pronunciation help', 'Cultural context'],
      avatar: '👩‍🏫'
    },
    {
      id: 'alex',
      name: 'Alex Rivera',
      role: 'Casual Conversation Partner',
      specialties: ['Casual conversation', 'Slang and idioms', 'Real-world scenarios'],
      avatar: '👨‍💼'
    },
    {
      id: 'luna',
      name: 'Luna Nakamura',
      role: 'Cultural Guide',
      specialties: ['Cultural context', 'Traditional expressions', 'Business etiquette'],
      avatar: '👩‍🎓'
    }
  ]

  const userProfile = {
    id: 'demo-user',
    level: 'intermediate',
    nativeLanguage: 'English',
    targetLanguages: ['Spanish', 'French', 'Japanese'],
    learningGoals: ['conversation', 'travel', 'business']
  }

  const quickActions = [
    {
      title: 'Start Conversation Practice',
      description: 'Begin a conversation with your selected persona',
      icon: MessageCircle,
      action: () => router.push(`/chat?persona=${selectedPersona.id}`),
      color: 'bg-blue-500'
    },
    {
      title: 'Grammar Challenge',
      description: 'Practice specific grammar points identified by AI',
      icon: Target,
      action: () => console.log('Grammar challenge'),
      color: 'bg-green-500'
    },
    {
      title: 'Vocabulary Builder',
      description: 'Learn new words in context',
      icon: Brain,
      action: () => console.log('Vocabulary builder'),
      color: 'bg-purple-500'
    },
    {
      title: 'Cultural Deep Dive',
      description: 'Explore cultural nuances and traditions',
      icon: Sparkles,
      action: () => console.log('Cultural exploration'),
      color: 'bg-orange-500'
    }
  ]

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Learning Suggestions</h1>
            <p className="text-gray-600 mt-2">
              AI-powered recommendations tailored to your learning style and progress
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <Lightbulb className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>

        {/* Persona Selection */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Select Your Learning Partner
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personas.map((persona) => (
              <div
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPersona.id === persona.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{persona.avatar}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{persona.name}</h4>
                    <p className="text-sm text-gray-600">{persona.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {persona.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Quick Learning Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start text-left hover:shadow-md transition-all"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600 flex-1">{action.description}</p>
                  <ArrowRight className="h-4 w-4 text-gray-400 mt-2 self-end" />
                </Button>
              )
            })}
          </div>
        </Card>

        {/* Smart Suggestions Component */}
        <SmartSuggestions
          userId="demo-user"
          currentPersona={selectedPersona}
          userProfile={userProfile}
        />

        {/* AI Learning Insights */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Learning Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Your Learning Pattern</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-900">Best learning time</span>
                  <Badge variant="secondary">9 AM - 11 AM</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-900">Preferred learning style</span>
                  <Badge variant="secondary">Conversational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-purple-900">Optimal session length</span>
                  <Badge variant="secondary">15-20 minutes</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Recommended Focus Areas</h4>
              <div className="space-y-3">
                <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-orange-900">Pronunciation</span>
                    <span className="text-xs text-orange-700">High Priority</span>
                  </div>
                  <p className="text-xs text-orange-700">Focus on 'th' and 'r' sounds</p>
                </div>
                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-900">Grammar</span>
                    <span className="text-xs text-blue-700">Medium Priority</span>
                  </div>
                  <p className="text-xs text-blue-700">Practice past perfect tense</p>
                </div>
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-900">Vocabulary</span>
                    <span className="text-xs text-green-700">Low Priority</span>
                  </div>
                  <p className="text-xs text-green-700">Expand business terms</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
