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
import { WelcomeSection } from '@mumicah/ui'

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
        <EnhancedAnalytics userId={currentUser.id} />
      </motion.div>

      {/* Conversation History */}
      <motion.div variants={itemVariants}>
        <ConversationHistory userId={currentUser.id} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      {/* Enhanced Dashboard with Widgets */}
      <motion.div variants={itemVariants}>
        <DashboardWidgets userId={currentUser.id} />
      </motion.div>

      {/* Legacy Components (can be removed once widgets are fully tested) */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Stats Overview */}
        <DashboardStats stats={userStats} />
        
        {/* Recent Activity */}
        <RecentActivity activities={recentActivity} />

        {/* Achievement Display */}
        <AchievementDisplay 
          userStats={sampleUserStats}
          showOnlyRecent={true}
          maxDisplayed={4}
          className="lg:col-span-1"
        />
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
