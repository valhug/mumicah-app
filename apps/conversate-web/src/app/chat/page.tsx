'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@mumicah/ui'
import { ChevronLeftIcon, ChevronRightIcon, BarChart3Icon } from 'lucide-react'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { PersonaSelector } from '@/components/chat/PersonaSelector'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { LearningDashboard } from '@/components/chat/LearningDashboard'
import { ConversationStarters } from '@/components/features/ConversationStarters'
import { PronunciationCoach } from '@/components/features/PronunciationCoach'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { SkipLink, LiveRegion } from '@/components/common/Accessibility'
import { useToast } from '@/components/common/Toast'
import { ThemeToggle } from '@/components/theme-toggle'
import { useClaudeConversation } from '@/hooks/use-claude-conversation'
import { errorHandler } from '@/services/error-handling.service'
import { PersonaId } from '@/types/conversation'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  persona?: {
    id: string
    name: string
    emoji: string
    color: string
  }
}

const DEMO_PERSONAS = [
  {
    id: 'maya',
    name: 'Maya',
    emoji: '👩‍🏫',
    color: 'amber',
    role: 'Patient Teacher',
    description: 'Gentle and encouraging, perfect for beginners'
  },
  {
    id: 'alex',
    name: 'Alex',
    emoji: '🧑‍💼',
    color: 'emerald',
    role: 'Casual Friend',
    description: 'Laid-back conversations and everyday slang'
  },
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🌸',
    color: 'violet',
    role: 'Cultural Guide',
    description: 'Teaches language through cultural stories'
  },
  {
    id: 'diego',
    name: 'Diego',
    emoji: '⚽',
    color: 'blue',
    role: 'Sports Enthusiast',
    description: 'Fun learning through sports and fitness'
  },
  {
    id: 'marie',
    name: 'Marie',
    emoji: '🎨',
    color: 'pink',
    role: 'Art & Culture Expert',
    description: 'Creative language learning through art'
  },
  {
    id: 'raj',
    name: 'Raj',
    emoji: '💻',
    color: 'indigo',
    role: 'Tech Mentor',
    description: 'Technology and business communication'
  }
]

export default function ChatPage() {
  const searchParams = useSearchParams()
  const personaParam = searchParams.get('persona')
  const { error: showError } = useToast()
  
  // Find initial persona from URL or default to Maya
  const initialPersona = DEMO_PERSONAS.find(p => p.id === personaParam) || DEMO_PERSONAS[0]
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedPersona, setSelectedPersona] = useState(initialPersona)
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showPronunciationCoach, setShowPronunciationCoach] = useState(false)
  const [pronunciationTarget, setPronunciationTarget] = useState('')
  const [language] = useState('fr-FR') // TODO: Get from user preference
  const [statusMessage, setStatusMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { isLoading } = useClaudeConversation(selectedPersona.id)

  // Test our LangChain integration
  const sendLangChainMessage = async (content: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          personaId: selectedPersona.id,
          userId: 'current-user',
          targetLanguage: 'Spanish', // TODO: Get from user preference
          proficiencyLevel: 'intermediate'
        })
      })

      const data = await response.json()
      if (data.success) {
        return {
          content: data.data.message,
          metadata: data.data.metadata
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('LangChain message error:', error)
      throw error
    }
  }

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Welcome message when persona changes
  useEffect(() => {
    const welcomeMessage: Message = {
      id: `welcome-${selectedPersona.id}`,
      content: getWelcomeMessage(selectedPersona),
      sender: 'ai',
      timestamp: new Date(),
      persona: selectedPersona
    }
    
    setMessages([welcomeMessage])
  }, [selectedPersona])

  // Apply persona-based theme
  useEffect(() => {
    document.body.setAttribute('data-persona-theme', selectedPersona.id);
    return () => document.body.removeAttribute('data-persona-theme');
  }, [selectedPersona]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    setStatusMessage('Sending message...')

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    setStatusMessage('AI is thinking...')

    try {
      // Use our LangChain service for persona-powered responses
      const response = await sendLangChainMessage(content)

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.content,
        sender: 'ai',
        timestamp: new Date(),
        persona: selectedPersona
      }

      setMessages(prev => [...prev, aiMessage])

      // Show learning tips if available
      if (response.metadata?.vocabulary?.length > 0) {
        setTimeout(() => {
          const tipMessage: Message = {
            id: `tip-${Date.now()}`,
            content: `💡 **Vocabulary tip**: ${response.metadata.vocabulary.join(', ')}`,
            sender: 'ai',
            timestamp: new Date(),
            persona: selectedPersona
          }
          setMessages(prev => [...prev, tipMessage])
        }, 1000)
      }

    } catch (error) {
      // Use error handling service for better error processing
      const handledError = errorHandler.handleError(error as Error, {
        logToConsole: true,
        showToast: false // We'll handle toast manually
      })

      console.error('Failed to send message:', handledError)

      // Show user-friendly error toast based on error type
      if (handledError.retryable) {
        showError(
          'Message Failed',
          'Unable to send your message. Please try again.',
          {
            action: {
              label: 'Retry',
              onClick: () => handleSendMessage(content)
            }
          }
        )
      } else {
        showError(
          'Connection Error',
          'Please check your internet connection and try again.',
          {
            persistent: true,
            action: {
              label: 'Refresh Page',
              onClick: () => window.location.reload()
            }
          }
        )
      }
      
      // Add contextual error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: handledError.details || "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        persona: selectedPersona
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setStatusMessage('')
    }
  }

  const handlePronunciationRequest = (text: string) => {
    setPronunciationTarget(text)
    setShowPronunciationCoach(true)
  }

  const handlePronunciationComplete = () => {
    setShowPronunciationCoach(false)
    setPronunciationTarget('')
  }

  return (
    <div className="h-screen bg-background flex relative">
      {/* Skip Link for accessibility */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      
      {/* Live Region for status announcements */}
      <LiveRegion message={statusMessage} />

      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('Chat page error:', error, errorInfo)
          setStatusMessage('An error occurred in the chat interface')
        }}
      >
      {/* Enhanced Left Sidebar - Learning Analytics - Mobile Responsive */}
      <div className={`
        ${isSidebarOpen ? 'w-80 md:w-80 sm:w-72' : 'w-16 md:w-16 sm:w-12'} 
        ${isSidebarOpen ? 'sm:fixed sm:z-50 sm:h-full' : ''}
        transition-all duration-500 ease-in-out 
        bg-card/95 backdrop-blur-lg 
        border-r border-border 
        shadow-xl
        flex flex-col relative overflow-hidden
      `}>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="sm:fixed sm:inset-0 sm:bg-black/50 sm:z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 opacity-60" />
        
        {/* Sidebar Header with Enhanced Design */}
        <div className="relative p-4 border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center space-x-3 opacity-100 transform translate-x-0 transition-all duration-300">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg">
                  <BarChart3Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Learning Analytics
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Real-time insights</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-1 mx-auto">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <BarChart3Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle - Always visible but responsive */}
              <div className={`${isSidebarOpen ? 'block' : 'sm:hidden md:block'} transition-all duration-300`}>
                <ThemeToggle />
              </div>
              
              {/* Mobile hamburger menu for collapsed state */}
              {!isSidebarOpen && (
                <div className="sm:block md:hidden">
                  <ThemeToggle />
                </div>
              )}
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105 relative group"
              >
                <div className="absolute inset-0 bg-primary rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                {isSidebarOpen ? (
                  <ChevronLeftIcon className="w-5 h-5 text-foreground relative z-10" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-foreground relative z-10" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content with Smooth Transitions */}
        <div className="flex-1 overflow-y-auto relative">
          {isSidebarOpen ? (
            <div className="p-4 opacity-100 transform translate-x-0 transition-all duration-500 delay-100">
              <LearningDashboard personaId={selectedPersona.id} className="border-0 shadow-none bg-transparent" />
            </div>
          ) : (
            <div className="p-3 space-y-3 opacity-100 transform translate-x-0 transition-all duration-300">
              {/* Enhanced Collapsed View with Tooltips */}
              <div className="flex flex-col items-center space-y-3">
                {/* Messages Count */}
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="text-white font-bold text-sm">15</span>
                  </div>
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-border shadow-md">
                    Messages Today
                  </div>
                </div>
                
                {/* Vocabulary Count */}
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-border shadow-md">
                    New Vocabulary
                  </div>
                </div>
                
                {/* Cultural Insights */}
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-border shadow-md">
                    Cultural Insights
                  </div>
                </div>
                
                {/* Engagement Score */}
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="text-white font-bold text-xs">85%</span>
                  </div>
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-border shadow-md">
                    Engagement Score
                  </div>
                </div>
                
                {/* Activity Indicator */}
                <div className="mt-4 flex flex-col items-center space-y-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="w-1 h-8 bg-gradient-to-t from-green-500/20 to-transparent rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Accent */}
        <div className="h-1 bg-primary" />
      </div>

      {/* Main Chat Area with Enhanced Design - Mobile Responsive */}
      <div id="main-content" className={`flex-1 flex flex-col relative overflow-hidden ${isSidebarOpen ? 'sm:ml-0' : ''}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10" />
          <div className="absolute inset-0 bg-gradient-radial-pattern" />
        </div>

        {/* Mobile Header Bar */}
        <div className="sm:hidden bg-card/90 backdrop-blur-md border-b border-border p-2 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Open learning analytics sidebar"
          >
            <BarChart3Icon className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">Chat with {selectedPersona.name}</h1>
          <ThemeToggle />
        </div>

        {/* Chat Header with Enhanced Gradient */}
        <div className="relative bg-primary shadow-xl">
          <div className="bg-primary-foreground/15 backdrop-blur-md border-b border-primary-foreground/20">
            <ChatHeader 
              persona={selectedPersona}
              onPersonaChange={() => {/* TODO: Open persona selector */}}
            />
          </div>
        </div>

        {/* Persona Selector with Glass Effect */}
        <div className="relative bg-card/60 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-secondary/30 to-accent/40" />
          <div className="relative">
            <PersonaSelector
              personas={DEMO_PERSONAS}
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
            />
          </div>
        </div>

        {/* Messages Area with Improved Background - Mobile Responsive */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 relative bg-background">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 relative z-10">
            {messages.length === 0 && (
              <div className="text-center py-8 sm:py-12 md:py-16">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <span className="text-2xl sm:text-3xl">{selectedPersona.emoji}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-4 border-background animate-pulse shadow-lg" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 px-4">
                  Welcome to your conversation with {selectedPersona.name}!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-base sm:text-lg leading-relaxed px-4 mb-6">
                  {getWelcomeMessage(selectedPersona)}
                </p>
                
                {/* Conversation Starters */}
                <div className="max-w-2xl mx-auto px-4">
                  <ConversationStarters
                    persona={selectedPersona.id as PersonaId}
                    userLevel="intermediate"
                    onStarterSelect={(starter) => {
                      handleSendMessage(starter.text)
                    }}
                    recentTopics={[]}
                    userInterests={['culture', 'travel', 'food']}
                  />
                </div>
                
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>AI Ready</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-border rounded-full" />
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Analytics Active</span>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.sender === 'user'}
                persona={message.persona}
              />
            ))}
            
            {isTyping && (
              <TypingIndicator persona={selectedPersona} />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input with Premium Glass Effect */}
        <div className="relative border-t border-border bg-card/70 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-card/60 via-secondary/40 to-accent/60" />
          <div className="relative max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              onPronunciationRequest={handlePronunciationRequest}
              disabled={isLoading}
              placeholder={`Chat with ${selectedPersona.name}...`}
            />
          </div>
        </div>
      </div>

      {/* Pronunciation Coach Modal */}
      {showPronunciationCoach && pronunciationTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Pronunciation Practice</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePronunciationComplete}
                >
                  ✕
                </Button>
              </div>
              <PronunciationCoach
                targetPhrase={pronunciationTarget}
                language={language}
                onComplete={handlePronunciationComplete}
                difficulty="intermediate"
              />
            </div>
          </div>
        </div>
      )}
      </ErrorBoundary>
    </div>
  )
}

function getWelcomeMessage(persona: typeof DEMO_PERSONAS[0]): string {
  const welcomeMessages = {
    maya: "Hello! I'm Maya, your patient language teacher. I'm here to help you learn step by step. What would you like to practice today? 😊",
    alex: "Hey there! I'm Alex. Let's have a casual chat and practice some everyday English. What's on your mind? 👋",
    luna: "Greetings! I'm Luna. I love sharing cultural stories while we practice language together. Shall we explore some interesting traditions? 🌸",
    diego: "¡Hola! I'm Diego! Ready to talk about sports, fitness, or anything that gets you moving? Let's have an energetic conversation! ⚽",
    marie: "Bonjour! I'm Marie. Let's explore the beautiful world of art, music, and culture while we practice together. What inspires you? 🎨",
    raj: "Hello! I'm Raj. Whether it's tech, business, or innovation, I'm here to help you master professional communication. What shall we discuss? 💻"
  }
  
  return welcomeMessages[persona.id as keyof typeof welcomeMessages] || `Hi! I'm ${persona.name}. Let's start chatting!`
}
