import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseUserService } from '@/services/database-user.service'
import { UserConversationService } from '@/services/user-conversation.service'

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'week' // week, month, all

    const dbService = new DatabaseUserService()
    const conversationService = new UserConversationService()
    const userId = session.user.id

    // Fetch comprehensive analytics
    const [
      userProgress,
      userAnalytics,
      conversationAnalytics,
      conversationHistory
    ] = await Promise.all([
      dbService.getUserProgress(userId),
      dbService.getUserAnalytics(userId),
      conversationService.getConversationAnalytics(userId),
      conversationService.getUserConversationHistory(userId, { limit: 10 })
    ])

    // Calculate streak information
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Check if user was active yesterday to maintain streak
    const lastActive = userProgress?.lastActiveDate || new Date(0)
    const isStreakActive = lastActive >= yesterday

    // Calculate weekly progress
    const weeklyProgress = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      // Count conversations for this day (simplified - would need proper date filtering)
      const dayConversations = conversationHistory.filter(conv => {
        const convDate = new Date(conv.createdAt)
        return convDate.toDateString() === date.toDateString()
      }).length

      weeklyProgress.push({
        day: dayName,
        conversations: dayConversations,
        date: date.toISOString().split('T')[0]
      })
    }

    // Calculate achievements based on progress
    const achievements = []
    const totalConversations = userProgress?.totalConversations || 0
    const totalWords = userProgress?.totalWords || 0
    const streakDays = userProgress?.streakDays || 0

    if (totalConversations >= 1) achievements.push('first_conversation')
    if (totalConversations >= 10) achievements.push('conversationalist')
    if (totalConversations >= 50) achievements.push('chatterbox')
    if (totalWords >= 500) achievements.push('wordsmith')
    if (totalWords >= 2000) achievements.push('eloquent')
    if (streakDays >= 3) achievements.push('consistent')
    if (streakDays >= 7) achievements.push('dedicated')
    if (streakDays >= 30) achievements.push('champion')

    // Prepare comprehensive analytics response with safe fallbacks
    const analytics = {
      overview: {
        totalConversations: totalConversations,
        totalWords: totalWords,
        totalMinutes: userProgress?.totalMinutes || 0,
        currentStreak: isStreakActive ? streakDays : 0,
        longestStreak: streakDays,
        favoritePersona: userProgress?.favoritePersona || 'maya'
      },
      goals: {
        weeklyGoal: userProgress?.weeklyGoal || 5,
        monthlyGoal: userProgress?.monthlyGoal || 20,
        weeklyProgress: Math.min(userAnalytics?.weeklyStats?.conversationsThisWeek || 0, userProgress?.weeklyGoal || 5),
        monthlyProgress: Math.min(userAnalytics?.monthlyStats?.conversationsThisMonth || 0, userProgress?.monthlyGoal || 20)
      },
      weekly: {
        conversationsThisWeek: userAnalytics?.weeklyStats?.conversationsThisWeek || 0,
        wordsThisWeek: userAnalytics?.weeklyStats?.wordsThisWeek || 0,
        minutesThisWeek: userAnalytics?.weeklyStats?.minutesThisWeek || 0,
        progress: weeklyProgress
      },
      monthly: {
        conversationsThisMonth: userAnalytics?.monthlyStats?.conversationsThisMonth || 0,
        wordsThisMonth: userAnalytics?.monthlyStats?.wordsThisMonth || 0,
        minutesThisMonth: userAnalytics?.monthlyStats?.minutesThisMonth || 0
      },
      performance: {
        averageConversationLength: conversationAnalytics?.averageDuration || 0,
        mostUsedPersona: conversationAnalytics?.mostUsedPersona || null,
        qualityDistribution: conversationAnalytics?.conversationQualityDistribution || {},
        weeklyTrend: conversationAnalytics?.weeklyProgress || []
      },
      achievements: {
        unlocked: achievements,
        total: achievements.length,
        next: getNextAchievement(totalConversations, totalWords, streakDays)
      },
      recentConversations: (conversationHistory || []).slice(0, 5).map(conv => ({
        id: conv.id,
        personaId: conv.personaId,
        title: conv.title || 'Untitled Conversation',
        duration: conv.metadata?.duration || 0,
        wordsSpoken: conv.metadata?.totalWords || 0,
        quality: conv.metadata?.quality,
        date: conv.createdAt,
        topics: conv.metadata?.topics || []
      }))
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      metadata: {
        userId,
        timeframe,
        generatedAt: new Date().toISOString(),
        isStreakActive
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Helper function to determine next achievement
function getNextAchievement(conversations: number, words: number, streak: number): {
  type: string
  name: string
  description: string
  target: number
  current: number
  progress: number
} | null {
  // Define achievement thresholds
  const conversationTargets = [1, 10, 25, 50, 100]
  const wordTargets = [100, 500, 1000, 2000, 5000]
  const streakTargets = [3, 7, 14, 30, 100]

  // Find next conversation achievement
  const nextConversationTarget = conversationTargets.find(target => conversations < target)
  const nextWordTarget = wordTargets.find(target => words < target)
  const nextStreakTarget = streakTargets.find(target => streak < target)

  // Return the closest achievement
  if (nextConversationTarget) {
    return {
      type: 'conversations',
      name: `${nextConversationTarget} Conversations`,
      description: `Complete ${nextConversationTarget} conversations`,
      target: nextConversationTarget,
      current: conversations,
      progress: Math.round((conversations / nextConversationTarget) * 100)
    }
  }

  if (nextWordTarget) {
    return {
      type: 'words',
      name: `${nextWordTarget} Words`,
      description: `Speak ${nextWordTarget} words`,
      target: nextWordTarget,
      current: words,
      progress: Math.round((words / nextWordTarget) * 100)
    }
  }

  if (nextStreakTarget) {
    return {
      type: 'streak',
      name: `${nextStreakTarget} Day Streak`,
      description: `Maintain a ${nextStreakTarget} day learning streak`,
      target: nextStreakTarget,
      current: streak,
      progress: Math.round((streak / nextStreakTarget) * 100)
    }
  }

  return null
}
