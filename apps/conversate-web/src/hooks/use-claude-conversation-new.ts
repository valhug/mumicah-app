'use client'

import { useState, useCallback } from 'react'
import { PersonaId } from '@/config/langchain'

interface ConversationMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  metadata?: Record<string, unknown>
}

interface ConversationState {
  messages: ConversationMessage[]
  isLoading: boolean
  currentPersona: PersonaId
}

interface SendMessageOptions {
  conversationId?: string
  userId?: string
  language?: string
}

export function useClaudeConversation(initialPersona: PersonaId | string = 'maria') {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    isLoading: false,
    currentPersona: initialPersona as PersonaId
  })

  const sendMessage = useCallback(async (content: string, options?: SendMessageOptions) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date(),
        metadata: {}
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }))

      // Call our LangChain API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId: options?.userId || 'demo-user',
          personaId: state.currentPersona,
          targetLanguage: options?.language || 'Spanish',
          proficiencyLevel: 'intermediate'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        content: data.data.message,
        role: 'assistant',
        timestamp: new Date(),
        metadata: data.data.metadata
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }))

      return { content: data.data.message, metadata: data.data.metadata }
    } catch (error) {
      console.error('Error sending message:', error)
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [state.currentPersona])

  const changePersona = useCallback(async (newPersona: PersonaId) => {
    setState(prev => ({ ...prev, currentPersona: newPersona }))
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    currentPersona: state.currentPersona,
    sendMessage,
    changePersona
  }
}
