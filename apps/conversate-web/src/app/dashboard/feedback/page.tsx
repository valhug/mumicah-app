'use client'

import { useState } from 'react'
import { PageContainer } from '@mumicah/ui'
import { Card, Badge, Button } from '@mumicah/ui'
import { BookOpen, MessageSquare, Volume2, CheckCircle, Mic, Type } from 'lucide-react'
import LanguageFeedback from '@/components/features/LanguageFeedback'

export default function LanguageFeedbackPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [inputMode, setInputMode] = useState<'type' | 'voice'>('type')

  const sampleMessages = [
    {
      text: "I are going to the store tomorrow",
      description: "Grammar error example - subject-verb agreement"
    },
    {
      text: "I have alot of work to do today",
      description: "Spelling error example - 'a lot' vs 'alot'"
    },
    {
      text: "The weather is very good today?!",
      description: "Punctuation suggestion - excessive punctuation"
    },
    {
      text: "Can you help me with pronunciation of 'through'?",
      description: "Pronunciation help request"
    }
  ]

  const languages = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { id: 'french', name: 'French', flag: '🇫🇷' },
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵' }
  ]

  const feedbackStats = [
    {
      title: 'Grammar Accuracy',
      value: '87%',
      improvement: '+12%',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Vocabulary Level',
      value: 'B2',
      improvement: 'Intermediate+',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Pronunciation Score',
      value: '82%',
      improvement: '+8%',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Fluency Rating',
      value: '4.2/5',
      improvement: '+0.3',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ]

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Language Feedback</h1>
            <p className="text-gray-600 mt-2">
              Get instant AI-powered feedback on your grammar, pronunciation, and vocabulary
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <BookOpen className="h-3 w-3 mr-1" />
            Real-time Analysis
          </Badge>
        </div>

        {/* Language Selection */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Select Target Language</h3>
          <div className="flex gap-3">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => setSelectedLanguage(language.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedLanguage === language.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {feedbackStats.map((stat, index) => (
            <Card key={index} className={`p-4 ${stat.bg}`}>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.improvement}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Input Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Test Your Message</h3>
            <div className="flex gap-2">
              <Button
                variant={inputMode === 'type' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('type')}
                className="flex items-center gap-2"
              >
                <Type className="h-4 w-4" />
                Type
              </Button>
              <Button
                variant={inputMode === 'voice' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('voice')}
                className="flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Voice
              </Button>
            </div>
          </div>

          {inputMode === 'type' ? (
            <div className="space-y-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here to get instant feedback..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {inputMessage.length}/500 characters
                </span>
                <Button
                  onClick={() => setInputMessage('')}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Mic className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Voice input feature coming soon!</p>
              <Button variant="outline" disabled>
                Start Recording
              </Button>
            </div>
          )}

          {/* Sample Messages */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Try these sample messages:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleMessages.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(sample.text)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">"{sample.text}"</p>
                  <p className="text-xs text-gray-600">{sample.description}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Language Feedback Component */}
        <LanguageFeedback
          message={inputMessage}
          language={selectedLanguage}
          onFeedbackApplied={(correctedMessage) => setInputMessage(correctedMessage)}
        />

        {/* Tips and Best Practices */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Tips for Better Feedback
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Writing Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Write complete sentences for better grammar analysis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Include context to help AI understand your intent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Try different sentence structures and vocabulary
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Ask specific questions about language rules
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">What AI Analyzes</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Grammar accuracy and common errors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Spelling and punctuation mistakes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Vocabulary level and suggestions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Style and tone improvements
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
