'use client'

import { Card } from '@mumicah/ui'
import { TrendingUp, Target, Award, Calendar, BarChart3 } from 'lucide-react'
import { LearningProgress } from '@/components/features/LearningProgress'

export default function ProgressPage() {
  const progressStats = {
    weeklyGoal: 5,
    weeklyProgress: 3,
    monthlyGoal: 20,
    monthlyProgress: 12,
    totalConversations: 42,
    currentStreak: 7,
    longestStreak: 12,
    averageSessionTime: 15
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Progress</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Weekly Goal</p>
              <p className="text-2xl font-bold text-blue-600">
                {progressStats.weeklyProgress}/{progressStats.weeklyGoal}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{progressStats.currentStreak}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Conversations</p>
              <p className="text-2xl font-bold text-green-600">{progressStats.totalConversations}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Session</p>
              <p className="text-2xl font-bold text-purple-600">{progressStats.averageSessionTime}m</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Conversations</span>
                <span>{progressStats.weeklyProgress}/{progressStats.weeklyGoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${
                    progressStats.weeklyProgress >= progressStats.weeklyGoal ? 'w-full' : 
                    progressStats.weeklyProgress / progressStats.weeklyGoal >= 0.8 ? 'w-4/5' :
                    progressStats.weeklyProgress / progressStats.weeklyGoal >= 0.6 ? 'w-3/5' :
                    progressStats.weeklyProgress / progressStats.weeklyGoal >= 0.4 ? 'w-2/5' :
                    progressStats.weeklyProgress / progressStats.weeklyGoal >= 0.2 ? 'w-1/5' : 'w-1/12'
                  }`}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {progressStats.weeklyGoal - progressStats.weeklyProgress} conversations to reach your weekly goal
            </p>
          </div>
        </Card>

        {/* Monthly Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Conversations</span>
                <span>{progressStats.monthlyProgress}/{progressStats.monthlyGoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-green-600 h-2 rounded-full transition-all duration-300 ${
                    progressStats.monthlyProgress >= progressStats.monthlyGoal ? 'w-full' : 
                    progressStats.monthlyProgress / progressStats.monthlyGoal >= 0.8 ? 'w-4/5' :
                    progressStats.monthlyProgress / progressStats.monthlyGoal >= 0.6 ? 'w-3/5' :
                    progressStats.monthlyProgress / progressStats.monthlyGoal >= 0.4 ? 'w-2/5' :
                    progressStats.monthlyProgress / progressStats.monthlyGoal >= 0.2 ? 'w-1/5' : 'w-1/12'
                  }`}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {progressStats.monthlyGoal - progressStats.monthlyProgress} conversations to reach your monthly goal
            </p>
          </div>
        </Card>
      </div>

      {/* Enhanced Learning Progress Component */}
      <LearningProgress userId="demo-user" />

      {/* Achievements Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl">🏆</div>
            <div>
              <p className="font-medium">Week Warrior</p>
              <p className="text-sm text-gray-600">Completed 7-day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl">💬</div>
            <div>
              <p className="font-medium">Conversationalist</p>
              <p className="text-sm text-gray-600">Had 10 conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="text-2xl">📚</div>
            <div>
              <p className="font-medium">Vocabulary Builder</p>
              <p className="text-sm text-gray-600">Learned 50 new words</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
