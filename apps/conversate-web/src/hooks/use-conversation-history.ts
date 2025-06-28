'use client'

import { useState, useEffect, useCallback } from 'react'
import { PersonaId } from '@/config/langchain'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    corrections?: string[]
    feedback?: string
    wordCount?: number
  }
}

interface ConversationData {
  id: string
  personaId: PersonaId
  startedAt: string
  completedAt?: string
  status: 'active' | 'completed' | 'archived'
  messages: Message[]
  metadata: {
    duration: number
    totalMessages: number
    topics: string[]
    targetLanguage: string
    userProficiencyLevel: string
    quality: 'poor' | 'fair' | 'good' | 'excellent'
  }
}

export interface ConversationSummary {
  id: string
  personaName: string
  personaAvatar: string
  personaId: PersonaId
  startedAt: Date
  endedAt?: Date
  duration: number // minutes
  messageCount: number
  userMessageCount: number
  aiMessageCount: number
  topics: string[]
  learningPoints: string[]
  overallRating?: number
  wasHelpful: boolean
  lastMessage: string
  status: 'active' | 'completed' | 'archived'
  targetLanguage: string
  proficiencyLevel: string
}

export interface ConversationHistoryData {
  conversations: ConversationSummary[]
  total: number
  hasMore: boolean
  isLoading: boolean
  error: string | null
}

export interface UseConversationHistoryOptions {
  limit?: number
  personaId?: PersonaId
  autoRefresh?: boolean
}

export function useConversationHistory(options: UseConversationHistoryOptions = {}) {
  const { limit = 10, personaId, autoRefresh = false } = options
  
  const [data, setData] = useState<ConversationHistoryData>({
    conversations: [],
    total: 0,
    hasMore: false,
    isLoading: true,
    error: null
  })

  const [offset, setOffset] = useState(0)

  const fetchConversations = useCallback(async (resetOffset = false) => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }))
      
      const currentOffset = resetOffset ? 0 : offset
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString(),
      })
      
      if (personaId) {
        params.set('personaId', personaId)
      }

      const response = await fetch(`/api/conversations?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const result = await response.json()
      
      if (result.success) {
        // Transform the API response to match our interface
        const transformedConversations: ConversationSummary[] = result.data.conversations.map((conv: ConversationData) => ({
          id: conv.id,
          personaName: getPersonaName(conv.personaId),
          personaAvatar: getPersonaAvatar(conv.personaId),
          personaId: conv.personaId,
          startedAt: new Date(conv.startedAt),
          endedAt: conv.completedAt ? new Date(conv.completedAt) : undefined,
          duration: conv.metadata.duration,
          messageCount: conv.metadata.totalMessages,
          userMessageCount: Math.floor(conv.metadata.totalMessages / 2),
          aiMessageCount: Math.ceil(conv.metadata.totalMessages / 2),
          topics: conv.metadata.topics,
          learningPoints: extractLearningPoints(conv.messages),
          overallRating: undefined, // TODO: Add rating system
          wasHelpful: conv.metadata.quality === 'good' || conv.metadata.quality === 'excellent',
          lastMessage: getLastAIMessage(conv.messages),
          status: conv.status,
          targetLanguage: conv.metadata.targetLanguage,
          proficiencyLevel: conv.metadata.userProficiencyLevel
        }))

        setData(prev => ({
          ...prev,
          conversations: resetOffset ? transformedConversations : [...prev.conversations, ...transformedConversations],
          total: result.data.total,
          hasMore: result.data.hasMore,
          isLoading: false
        }))

        if (resetOffset) {
          setOffset(transformedConversations.length)
        } else {
          setOffset(prev => prev + transformedConversations.length)
        }
      } else {
        throw new Error(result.error || 'Failed to fetch conversations')
      }
    } catch (error) {
      console.error('Error fetching conversation history:', error)
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }))
    }
  }, [limit, personaId, offset])

  const refresh = useCallback(() => {
    setOffset(0)
    fetchConversations(true)
  }, [fetchConversations])

  useEffect(() => {
    fetchConversations(true)
  }, [fetchConversations])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refresh()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, refresh])

  const loadMore = () => {
    if (!data.isLoading && data.hasMore) {
      fetchConversations(false)
    }
  }

  const archiveConversation = async (conversationId: string) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'archive',
          conversationId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Remove from local state
        setData(prev => ({
          ...prev,
          conversations: prev.conversations.filter(conv => conv.id !== conversationId)
        }))
        return true
      } else {
        throw new Error(result.message || 'Failed to archive conversation')
      }
    } catch (error) {
      console.error('Error archiving conversation:', error)
      return false
    }
  }

  return {
    ...data,
    loadMore,
    refresh,
    archiveConversation,
    hasMore: data.hasMore && !data.isLoading
  }
}

// Helper functions
function getPersonaName(personaId: PersonaId): string {
  const personaNames: Record<string, string> = {
    maya: 'Maya Chen',
    alex: 'Alex Rivera', 
    luna: 'Luna Park',
    diego: 'Diego Santos',
    'jean-claude': 'Jean-Claude Dubois'
  }
  return personaNames[personaId] || personaId
}

function getPersonaAvatar(personaId: PersonaId): string {
  const personaAvatars: Record<string, string> = {
    maya: '👩‍🎓',
    alex: '👨‍💼',
    luna: '🎨',
    diego: '⚽',
    'jean-claude': '🍷'
  }
  return personaAvatars[personaId] || '🤖'
}

function extractLearningPoints(messages: Message[]): string[] {
  // Extract learning points from message metadata
  const learningPoints: string[] = []
  
  messages.forEach(message => {
    if (message.metadata?.corrections) {
      learningPoints.push(...message.metadata.corrections)
    }
    if (message.metadata?.feedback) {
      learningPoints.push(message.metadata.feedback)
    }
  })
  
  return [...new Set(learningPoints)].slice(0, 5) // Unique, max 5
}

function getLastAIMessage(messages: Message[]): string {
  const aiMessages = messages.filter(msg => msg.role === 'assistant')
  const lastAI = aiMessages[aiMessages.length - 1]
  return lastAI?.content?.substring(0, 100) + '...' || 'No messages yet'
}
