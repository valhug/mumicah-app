'use client'

import { useState } from 'react'
import { PageContainer } from '@mumicah/ui'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  persona?: {
    id: string
    name: string
    emoji: string
  }
}

interface Persona {
  id: string
  name: string
  emoji: string
  color: string
  role: string
  description: string
}

const DEMO_PERSONAS: Persona[] = [
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
  }
]

export default function LangChainDemoPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona>(DEMO_PERSONAS[0])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Test API connection
  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello, are you working?',
          personaId: selectedPersona.id,
          userId: 'demo-user',
          conversationId: 'demo-conversation'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setIsConnected(true)
        setMessages([{
          id: '1',
          content: 'Hello, are you working?',
          sender: 'user',
          timestamp: new Date()
        }, {
          id: '2',
          content: data.data.message || 'LangChain API is working!',
          sender: 'ai',
          timestamp: new Date(),
          persona: selectedPersona
        }])
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      setMessages([{
        id: 'error',
        content: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'ai',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage.trim(),
          personaId: selectedPersona.id,
          userId: 'demo-user',
          conversationId: 'demo-conversation'
        })
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: data.data.message,
          sender: 'ai',
          timestamp: new Date(),
          persona: selectedPersona
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    setIsConnected(false)
  }

  return (
    <PageContainer className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">🚀 LangChain Integration Demo</h1>
          <p className="text-gray-600">
            Test the LangChain-powered conversation system with AI personas
          </p>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="font-medium">
                {isConnected ? 'LangChain API Connected' : 'Not Connected'}
              </span>
            </div>
            <div className="space-x-3">
              <button
                onClick={testConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={clearMessages}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>

        {/* Persona Selection */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold mb-3">Select AI Persona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DEMO_PERSONAS.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selectedPersona.id === persona.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{persona.emoji}</span>
                  <span className="font-medium">{persona.name}</span>
                </div>
                <p className="text-sm text-gray-600">{persona.role}</p>
                <p className="text-xs text-gray-500 mt-1">{persona.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-lg border shadow-sm">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Test the connection or send a message to get started!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.id.includes('error')
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.persona && (
                      <div className="text-xs opacity-75 mb-1">
                        {message.persona.emoji} {message.persona.name}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">{selectedPersona.name} is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Chat with ${selectedPersona.name}...`}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">🔧 Integration Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ LangChain API endpoint at <code>/api/chat</code></li>
            <li>✅ Multiple AI personas with different conversation styles</li>
            <li>✅ Enhanced conversation service with session management</li>
            <li>✅ Real-time conversation with OpenAI/Anthropic models</li>
            <li>✅ TypeScript support with proper error handling</li>
            <li>✅ Persona-specific conversation context and memory</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  )
}
