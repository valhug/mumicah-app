'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'
import { 
  BarChart3, 
  Clock, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  Globe,
  Award,
  Brain
} from 'lucide-react'
import { LearningProgress } from './LearningProgress'
import ConversationHistory from './ConversationHistory'
import AchievementSystem from './AchievementSystem'
import SmartSuggestions from './SmartSuggestions'
import AIAnalytics from './AIAnalytics'

interface DashboardWidgetsProps {
  userId?: string
  currentPersona?: any
  userProfile?: any
}

interface Widget {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
  gridSize: 'small' | 'medium' | 'large' | 'full'
  category: 'progress' | 'social' | 'analytics' | 'achievements' | 'ai'
  priority: number
  description: string
}

export default function DashboardWidgets({ 
  userId = 'demo-user', 
  currentPersona,
  userProfile 
}: DashboardWidgetsProps) {
  const [activeWidget, setActiveWidget] = useState<string>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Widget components - including new Priority 3 AI features
  const widgets: Widget[] = [
    {
      id: 'learning-progress',
      title: 'Learning Progress',
      icon: <TrendingUp className="h-4 w-4" />,
      component: <LearningProgress userId={userId} />,
      gridSize: 'large',
      category: 'progress',
      priority: 2,
      description: 'Track your language learning journey with detailed progress metrics'
    },
    {
      id: 'smart-suggestions',
      title: 'AI Smart Suggestions',
      icon: <Brain className="h-4 w-4" />,
      component: (
        <SmartSuggestions 
          userId={userId} 
          currentPersona={currentPersona}
          userProfile={userProfile}
        />
      ),
      gridSize: 'large',
      category: 'ai',
      priority: 3,
      description: 'Get personalized learning suggestions powered by AI'
    },
    {
      id: 'ai-analytics',
      title: 'AI Learning Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      component: <AIAnalytics userId={userId} />,
      gridSize: 'large',
      category: 'ai',
      priority: 3,
      description: 'Deep insights into your learning patterns and progress'
    },
    {
      id: 'conversation-history',
      title: 'Conversation History',
      icon: <MessageSquare className="h-4 w-4" />,
      component: <ConversationHistory userId={userId} />,
      gridSize: 'full',
      category: 'analytics',
      priority: 2,
      description: 'Review and analyze your conversation history with AI personas'
    },
    {
      id: 'achievement-system',
      title: 'Achievements',
      icon: <Award className="h-4 w-4" />,
      component: <AchievementSystem userId={userId} />,
      gridSize: 'full',
      category: 'achievements',
      priority: 2,
      description: 'Track your learning milestones and unlock new achievements'
    },
    {
      id: 'weekly-stats',
      title: 'Weekly Statistics',
      icon: <BarChart3 className="h-4 w-4" />,
      component: <WeeklyStatsWidget />,
      gridSize: 'medium',
      category: 'analytics',
      priority: 2,
      description: 'View detailed weekly learning statistics and trends'
    },
    {
      id: 'language-goals',
      title: 'Language Goals',
      icon: <Target className="h-4 w-4" />,
      component: <LanguageGoalsWidget />,
      gridSize: 'medium',
      category: 'progress',
      priority: 2,
      description: 'Set and track your language learning goals'
    },
    {
      id: 'community-activity',
      title: 'Community Activity',
      icon: <Users className="h-4 w-4" />,
      component: <CommunityActivityWidget />,
      gridSize: 'medium',
      category: 'social',
      priority: 4,
      description: 'Stay connected with the language learning community'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Widgets', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'progress', name: 'Progress', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'achievements', name: 'Achievements', icon: <Award className="h-4 w-4" /> },
    { id: 'social', name: 'Social', icon: <Users className="h-4 w-4" /> }
  ]

  const filteredWidgets = selectedCategory === 'all' 
    ? widgets 
    : widgets.filter(widget => widget.category === selectedCategory)

  if (activeWidget === 'overview') {
    return (
      <div className="space-y-6">
        {/* Widget Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Dashboard Widgets</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map(widget => (
              <Card 
                key={widget.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/30"
                onClick={() => setActiveWidget(widget.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {widget.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{widget.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{widget.category}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Open Widget
                </Button>
              </Card>
            ))}
          </div>
        </Card>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatCard
            title="Today's Practice"
            value="25 min"
            icon={<Clock className="h-4 w-4" />}
            trend="+5 min from yesterday"
            color="blue"
          />
          <QuickStatCard
            title="Current Streak"
            value="7 days"
            icon={<Zap className="h-4 w-4" />}
            trend="🔥 Keep it up!"
            color="orange"
          />
          <QuickStatCard
            title="Conversations"
            value="42"
            icon={<MessageSquare className="h-4 w-4" />}
            trend="+3 this week"
            color="green"
          />
          <QuickStatCard
            title="Languages"
            value="3"
            icon={<Globe className="h-4 w-4" />}
            trend="Japanese, Spanish, Korean"
            color="purple"
          />
        </div>
      </div>
    )
  }

  // Show specific widget
  const currentWidget = widgets.find(w => w.id === activeWidget)
  
  return (
    <div className="space-y-6">
      {/* Widget Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveWidget('overview')}
            >
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              {currentWidget?.icon}
              <h3 className="text-lg font-semibold">{currentWidget?.title}</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Widget Content */}
      {currentWidget?.component}
    </div>
  )
}

function QuickStatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  color: string
}) {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-600',
    orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-600',
    green: 'from-green-500/10 to-green-600/10 border-green-500/20 text-green-600',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-600'
  }

  return (
    <Card className={cn(
      "p-4 bg-gradient-to-br border",
      colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-background/50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </div>
    </Card>
  )
}

function WeeklyStatsWidget() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Weekly Statistics</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Minutes This Week</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Conversations</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Daily Breakdown</h4>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const minutes = [25, 30, 0, 45, 20, 0, 36][index]
            return (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground w-8">{day}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 bg-gradient-to-r from-primary to-orange-500 rounded-full",
                        minutes > 40 ? "w-full" : 
                        minutes > 30 ? "w-4/5" :
                        minutes > 20 ? "w-3/5" :
                        minutes > 10 ? "w-2/5" :
                        minutes > 0 ? "w-1/5" : "w-0"
                      )}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground w-8 text-right">
                  {minutes}m
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function LanguageGoalsWidget() {
  const goals = [
    { language: 'Japanese', target: 'Conversational', progress: 65, color: 'red' },
    { language: 'Spanish', target: 'Business Level', progress: 40, color: 'yellow' },
    { language: 'Korean', target: 'Basic', progress: 85, color: 'blue' }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Language Goals</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.language} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-foreground">{goal.language}</span>
                <span className="text-sm text-muted-foreground ml-2">→ {goal.target}</span>
              </div>
              <span className="text-sm font-medium text-primary">{goal.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={cn(
                  "h-2 bg-gradient-to-r rounded-full transition-all duration-300",
                  goal.color === 'red' && "from-red-500 to-pink-500",
                  goal.color === 'yellow' && "from-yellow-500 to-orange-500", 
                  goal.color === 'blue' && "from-blue-500 to-purple-500",
                  goal.progress >= 80 ? "w-4/5" :
                  goal.progress >= 60 ? "w-3/5" :
                  goal.progress >= 40 ? "w-2/5" :
                  goal.progress >= 20 ? "w-1/5" : "w-1/12"
                )}
              />
            </div>
          </div>
        ))}
        
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Target className="h-3 w-3 mr-2" />
          Set New Goal
        </Button>
      </div>
    </Card>
  )
}

function CommunityActivityWidget() {
  const activities = [
    { type: 'joined', text: 'Joined Spanish Learning Circle', time: '2h ago', icon: '👥' },
    { type: 'achievement', text: 'Unlocked "Week Warrior" badge', time: '1d ago', icon: '🏆' },
    { type: 'conversation', text: 'Great chat with Maya about travel', time: '2d ago', icon: '💬' },
    { type: 'goal', text: 'Completed weekly practice goal', time: '3d ago', icon: '🎯' }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Community Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-2 hover:bg-muted/30 rounded-lg transition-colors">
            <div className="text-lg">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{activity.text}</p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
        
        <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
          <Link href="/communities">
            <Users className="h-3 w-3 mr-2" />
            View Communities
          </Link>
        </Button>
      </div>
    </Card>
  )
}
