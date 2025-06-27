'use client'

import { useState } from 'react'

// Simple interfaces for our demo
interface DemoMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const DEMO_PERSONAS = [
  { id: 'maria', name: 'Maria', emoji: '👩‍🏫', description: 'Patient Spanish teacher' },
  { id: 'alex', name: 'Alex', emoji: '🧑‍💼', description: 'Casual conversation partner' },
  { id: 'luna', name: 'Luna', emoji: '🌸', description: 'Cultural guide' },
]

export default function LangChainDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedPersona, setSelectedPersona] = useState(DEMO_PERSONAS[0])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)

    // Add user message
    const userMessage: DemoMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    try {
      // Call our LangChain API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId: 'demo-user',
          personaId: selectedPersona.id,
          targetLanguage: 'Spanish',
          proficiencyLevel: 'intermediate'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Add AI response
      const aiMessage: DemoMessage = {
        id: (Date.now() + 1).toString(),
        content: data.data?.message || 'Sorry, I had trouble responding.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('Error:', error)
      // Add error message
      const errorMessage: DemoMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Make sure your API keys are configured.`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <h1 className="text-xl font-bold">LangChain Conversate Demo</h1>
            <p className="text-blue-100">AI-powered language learning conversations</p>
          </div>

          {/* Persona Selector */}
          <div className="border-b p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Choose your conversation partner:</h3>
            <div className="flex gap-2">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPersona.id === persona.id
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {persona.emoji} {persona.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current: {selectedPersona.description}</p>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">👋 Welcome to LangChain Conversate!</p>
                <p className="text-sm mt-2">Start a conversation with {selectedPersona.name} to practice your language skills.</p>
                <div className="mt-4 space-y-1 text-xs">
                  <p>✨ AI-powered responses with LangChain</p>
                  <p>📚 Vocabulary and grammar assistance</p>
                  <p>🌍 Cultural learning integration</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Type your message to ${selectedPersona.name}...`}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
          </div>

          {/* Debug Info */}
          <div className="border-t p-4 bg-gray-50">
            <details>
              <summary className="text-sm text-gray-600 cursor-pointer">Debug Info</summary>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>Selected Persona: {selectedPersona.id}</p>
                <p>Messages: {messages.length}</p>
                <p>API Status: {isLoading ? 'Loading...' : 'Ready'}</p>
                <p className="text-red-600">Note: Make sure OPENAI_API_KEY or ANTHROPIC_API_KEY is set in your .env file</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
