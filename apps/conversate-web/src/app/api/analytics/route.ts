import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Import the user preferences from our chat route for now
// This will be replaced with database storage later
const userPreferences: Record<string, {
  targetLanguage: string
  nativeLanguage: string
  proficiencyLevel: string
  totalConversations: number
  totalWords: number
  streakDays: number
  favoritePersona?: string
  conversationHistory: Array<{
    id: string
    timestamp: Date
    persona: string
    messageCount: number
    duration: number
  }>
}> = {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')

    // Get user session
    const session = await getServerSession(authOptions)
    const userId = requestedUserId || session?.user?.id || 'guest'

    // Get user analytics
    const userProfile = userPreferences[userId] || {
      targetLanguage: 'Spanish',
      nativeLanguage: 'English',
      proficiencyLevel: 'intermediate',
      totalConversations: 0,
      totalWords: 0,
      streakDays: 0,
      favoritePersona: 'maya',
      conversationHistory: []
    }

    // Calculate weekly stats
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weeklyConversations = userProfile.conversationHistory.filter(
      conv => new Date(conv.timestamp) >= weekStart
    )

    const weeklyStats = {
      conversationsThisWeek: weeklyConversations.length,
      minutesThisWeek: weeklyConversations.reduce((sum, conv) => sum + conv.duration, 0),
      wordsThisWeek: Math.floor(userProfile.totalWords * 0.3) // Rough estimate for this week
    }

    // Generate achievements based on progress
    const achievements = []
    
    if (userProfile.totalConversations >= 1) {
      achievements.push({
        id: 'first-chat',
        title: 'First Chat',
        description: 'Started your first conversation',
        icon: '💬',
        earnedAt: new Date().toISOString(),
        rarity: 'common'
      })
    }
    
    if (userProfile.totalConversations >= 5) {
      achievements.push({
        id: 'chatty-learner',
        title: 'Chatty Learner',
        description: 'Completed 5 conversations',
        icon: '🗣️',
        earnedAt: new Date().toISOString(),
        rarity: 'common'
      })
    }
    
    if (userProfile.streakDays >= 3) {
      achievements.push({
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintained a 3-day learning streak',
        icon: '🔥',
        earnedAt: new Date().toISOString(),
        rarity: 'rare'
      })
    }

    if (userProfile.totalWords >= 100) {
      achievements.push({
        id: 'word-collector',
        title: 'Word Collector',
        description: 'Practiced over 100 words',
        icon: '📚',
        earnedAt: new Date().toISOString(),
        rarity: 'rare'
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        userProgress: {
          totalConversations: userProfile.totalConversations,
          totalWords: userProfile.totalWords,
          streakDays: userProfile.streakDays,
          favoritePersona: userProfile.favoritePersona
        },
        preferences: {
          targetLanguage: userProfile.targetLanguage,
          nativeLanguage: userProfile.nativeLanguage,
          proficiencyLevel: userProfile.proficiencyLevel
        },
        conversationHistory: userProfile.conversationHistory,
        weeklyStats,
        achievements,
        goals: [
          {
            id: 'weekly-conversations',
            title: 'Weekly Conversations',
            target: 10,
            current: weeklyStats.conversationsThisWeek,
            type: 'conversations',
            deadline: 'End of week'
          },
          {
            id: 'daily-streak',
            title: 'Daily Streak',
            target: 7,
            current: userProfile.streakDays,
            type: 'streak',
            deadline: 'Ongoing'
          },
          {
            id: 'monthly-words',
            title: 'Monthly Words',
            target: 500,
            current: userProfile.totalWords,
            type: 'words',
            deadline: 'End of month'
          }
        ]
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
