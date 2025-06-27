'use client'

import { useState } from 'react'
import { PageContainer } from '@mumicah/ui'
import { Card, Badge } from '@mumicah/ui'
import { Brain, TrendingUp, Target, Zap } from 'lucide-react'
import AIAnalytics from '@/components/features/AIAnalytics'
import SmartSuggestions from '@/components/features/SmartSuggestions'

export default function AIInsightsPage() {
  const [selectedPersona, setSelectedPersona] = useState({
    id: 'maya',
    name: 'Maya Chen',
    role: 'Patient Language Teacher'
  })

  const userProfile = {
    id: 'demo-user',
    level: 'intermediate',
    nativeLanguage: 'English',
    targetLanguages: ['Spanish', 'French', 'Japanese'],
    learningGoals: ['conversation', 'travel', 'business']
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Learning Insights</h1>
            <p className="text-gray-600 mt-2">
              Discover personalized insights powered by advanced AI to accelerate your language learning
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            Priority 3: Advanced AI
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">AI Analysis</h3>
                <p className="text-sm text-blue-700">Deep learning insights</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 text-white rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Progress Tracking</h3>
                <p className="text-sm text-green-700">Real-time monitoring</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 text-white rounded-lg">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Smart Goals</h3>
                <p className="text-sm text-purple-700">Personalized targets</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 text-white rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">Quick Actions</h3>
                <p className="text-sm text-orange-700">AI recommendations</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Analytics */}
          <AIAnalytics 
            userId="demo-user"
            className="col-span-1"
          />

          {/* Smart Suggestions */}
          <SmartSuggestions
            userId="demo-user"
            currentPersona={selectedPersona}
            userProfile={userProfile}
            className="col-span-1"
          />
        </div>

        {/* Additional AI Features */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">AI-Powered Learning Path</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Master Past Perfect Tense</h4>
                    <p className="text-sm text-gray-600">AI detected this as your next learning priority</p>
                  </div>
                </div>
                <Badge variant="secondary">92% confidence</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Expand Business Vocabulary</h4>
                    <p className="text-sm text-gray-600">Build on your current strengths</p>
                  </div>
                </div>
                <Badge variant="secondary">88% confidence</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Cultural Context Training</h4>
                    <p className="text-sm text-gray-600">Enhance natural conversation flow</p>
                  </div>
                </div>
                <Badge variant="secondary">85% confidence</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
