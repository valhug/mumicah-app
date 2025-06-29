'use client'

import { motion } from 'framer-motion'
import DashboardStats from '@/components/features/DashboardStats'
import RecentActivity from '@/components/features/RecentActivity'
import QuickActions from '@/components/features/QuickActions'
import DashboardWidgets from '@/components/features/DashboardWidgets'
import EnhancedAnalytics from '@/components/features/EnhancedAnalytics'
import ConversationHistory from '@/components/features/ConversationHistory'
import SharedPackageTest from '@/components/features/SharedPackageTest'
import { AchievementDisplay } from '@/components/features/AchievementDisplay'
import { SystemStatusDisplay } from '@/components/features/SystemStatusDisplay'
import { ProductionPolishDemo } from '@/components/features/ProductionPolishDemo'
import SocialFeatures from '@/components/features/SocialFeatures'
import GamificationSystem from '@/components/features/GamificationSystem'
import CommunityFeatures from '@/components/features/CommunityFeatures'
import { WelcomeSection } from '@mumicah/ui'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

interface DashboardClientProps {
  currentUser: {
    id: string
    email: string
    [key: string]: unknown
  }
  userStats: {
    conversations?: number
    vocabulary?: number
    streak?: number
    longestStreak?: number
    pronunciation?: number
    grammar?: number
    cultural?: number
    points?: number
    level?: number
    [key: string]: unknown
  } | null
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
    [key: string]: unknown
  }>
  displayName: string
}

export default function DashboardClient({ 
  currentUser, 
  userStats, 
  recentActivity, 
  displayName 
}: DashboardClientProps) {
  // Sample user stats for achievement system (in real app, this would come from userStats)
  const sampleUserStats = {
    totalConversations: userStats?.conversations || 5,
    vocabularyLearned: userStats?.vocabulary || 25,
    currentStreak: userStats?.streak || 3,
    longestStreak: userStats?.longestStreak || 7,
    perfectPronunciations: userStats?.pronunciation || 8,
    grammarAccuracy: userStats?.grammar || 85,
    culturalTopicsExplored: userStats?.cultural || 4,
    totalPoints: userStats?.points || 350,
    level: userStats?.level || 2
  }

  // Convert userStats to format expected by DashboardStats
  const dashboardStatsData = {
    lessons: {
      completed: userStats?.conversations || 5,
      total: 10,
      averageScore: userStats?.grammar || 85
    }
  }

  // Convert recentActivity to proper format
  const formattedActivities = recentActivity?.map((activity: { id: string; type: string; description: string; timestamp: Date }) => ({
    _id: activity.id,
    action: activity.type,
    description: activity.description,
    timestamp: activity.timestamp
  })) || []

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <WelcomeSection
          title={`Welcome back, ${displayName}!`}
          subtitle="Continue your language learning journey"
          status="active"
        />
      </motion.div>

      {/* Enhanced Analytics Dashboard */}
      <motion.div variants={itemVariants}>
        <ErrorBoundary 
          fallback={<div className="p-4 text-center text-muted-foreground">Analytics temporarily unavailable</div>}
        >
          <EnhancedAnalytics userId={currentUser.id} />
        </ErrorBoundary>
      </motion.div>

      {/* Conversation History */}
      <motion.div variants={itemVariants}>
        <ErrorBoundary 
          fallback={<div className="p-4 text-center text-muted-foreground">Conversation history temporarily unavailable</div>}
        >
          <ConversationHistory userId={currentUser.id} />
        </ErrorBoundary>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      {/* Enhanced Dashboard with Widgets */}
      <motion.div variants={itemVariants}>
        <DashboardWidgets userId={currentUser.id} />
      </motion.div>

      {/* Community Features */}
      <motion.div variants={itemVariants}>
        <CommunityFeatures userId={currentUser.id} className="max-w-none" />
      </motion.div>

      {/* Legacy Components (can be removed once widgets are fully tested) */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Stats Overview */}
        <DashboardStats stats={dashboardStatsData} />
        
        {/* Recent Activity */}
        <RecentActivity activities={formattedActivities} />

        {/* Achievement Display */}
        <AchievementDisplay 
          userStats={sampleUserStats}
          showOnlyRecent={true}
          maxDisplayed={4}
          className="lg:col-span-1"
        />
      </motion.div>

      {/* Production Polish Features Section */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Production Polish Demo */}
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-muted-foreground">Demo temporarily unavailable</div>}
            showDetails={process.env.NODE_ENV === 'development'}
          >
            <ProductionPolishDemo className="md:col-span-2 lg:col-span-3" />
          </ErrorBoundary>
        </div>
      </motion.div>

      {/* System Status & Feature Showcases */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* System Status & Compatibility */}
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-muted-foreground">System status temporarily unavailable</div>}
            showDetails={process.env.NODE_ENV === 'development'}
          >
            <SystemStatusDisplay />
          </ErrorBoundary>

          {/* Achievement Display with Toasts */}
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-muted-foreground">Achievements temporarily unavailable</div>}
          >
            <AchievementDisplay 
              userStats={sampleUserStats}
              showOnlyRecent={false}
              maxDisplayed={3}
              className="lg:col-span-1"
              onAchievementClick={(achievement) => {
                console.log('Achievement clicked:', achievement)
              }}
            />
          </ErrorBoundary>

          {/* Community Features with Error Handling */}
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-muted-foreground">Community features temporarily unavailable</div>}
          >
            <CommunityFeatures 
              userId={currentUser.id} 
              className="lg:col-span-1" 
            />
          </ErrorBoundary>
        </div>
      </motion.div>

      {/* Enhanced Social & Gamification Features */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Features */}
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-muted-foreground">Social features temporarily unavailable</div>}
          >
            <SocialFeatures 
              userId={currentUser.id}
              className="lg:col-span-1"
            />
          </ErrorBoundary>

          {/* Enhanced Gamification */}
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-muted-foreground">Gamification features temporarily unavailable</div>}
          >
            <GamificationSystem 
              userId={currentUser.id}
              className="lg:col-span-1"
            />
          </ErrorBoundary>
        </div>
      </motion.div>

      {/* Shared Package Test (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div variants={itemVariants}>
          <SharedPackageTest />
        </motion.div>
      )}
    </motion.div>
  )
}
