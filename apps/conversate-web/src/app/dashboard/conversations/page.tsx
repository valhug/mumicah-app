'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Button, Badge } from '@mumicah/ui'
import { MessageCircle, Clock, Search, ChevronRight } from 'lucide-react'

interface Conversation {
  id: string
  title: string
  persona: string
  personaAvatar: string
  lastMessage: string
  timestamp: Date
  duration: number
  messageCount: number
  language: string
  quality: 'excellent' | 'good' | 'fair'
  topics: string[]
}

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('all')
  const [filterPersona, setFilterPersona] = useState('all')

  // Debug logging to help identify navigation issues
  console.log('ConversationsPage rendered at:', new Date().toISOString())

  const conversations: Conversation[] = [
    {
      id: '1',
      title: 'Travel Stories from Japan',
      persona: 'Maya Chen',
      personaAvatar: '👩🏻‍🎓',
      lastMessage: 'That sounds like an amazing experience! I would love to visit Kyoto someday...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      duration: 25,
      messageCount: 18,
      language: 'English',
      quality: 'excellent',
      topics: ['travel', 'culture', 'food']
    },
    {
      id: '2',
      title: 'Business Meeting Preparation',
      persona: 'Maria Rodriguez',
      personaAvatar: '👩🏽‍🏫',
      lastMessage: 'Recuerda usar el subjuntivo cuando expreses dudas o emociones...',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      duration: 32,
      messageCount: 24,
      language: 'Spanish',
      quality: 'good',
      topics: ['business', 'grammar', 'formal language']
    },
    {
      id: '3',
      title: 'Anime and Manga Discussion',
      persona: 'Hiroshi Tanaka',
      personaAvatar: '👨🏻‍💻',
      lastMessage: 'そのアニメは本当に面白いですね！私も見ました。',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      duration: 18,
      messageCount: 15,
      language: 'Japanese',
      quality: 'excellent',
      topics: ['anime', 'entertainment', 'culture']
    },
    {
      id: '4',
      title: 'Science and Innovation',
      persona: 'Alex Mueller',
      personaAvatar: '👨🏼‍🔬',
      lastMessage: 'Die neuesten Entwicklungen in der KI sind wirklich beeindruckend...',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      duration: 28,
      messageCount: 21,
      language: 'German',
      quality: 'good',
      topics: ['science', 'technology', 'innovation']
    }
  ]

  const languages = ['all', 'English', 'Spanish', 'Japanese', 'German']
  const personas = ['all', 'Maya Chen', 'Maria Rodriguez', 'Hiroshi Tanaka', 'Alex Mueller']

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesLanguage = filterLanguage === 'all' || conv.language === filterLanguage
    const matchesPersona = filterPersona === 'all' || conv.persona === filterPersona
    
    return matchesSearch && matchesLanguage && matchesPersona
  })

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Conversation History</h1>
        <p className="text-muted-foreground mt-2">
          Review your past conversations, track your progress, and continue where you left off.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations, messages, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Button
                    key={language}
                    variant={filterLanguage === language ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterLanguage(language)}
                    className="capitalize"
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Persona</label>
              <div className="flex flex-wrap gap-2">
                {personas.slice(0, 4).map((persona) => (
                  <Button
                    key={persona}
                    variant={filterPersona === persona ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPersona(persona)}
                    className="capitalize"
                  >
                    {persona === 'all' ? 'All' : persona.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{conversation.personaAvatar}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{conversation.title}</h3>
                      <p className="text-sm text-muted-foreground">with {conversation.persona}</p>
                    </div>
                    <Badge className={getQualityColor(conversation.quality)}>
                      {conversation.quality}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {conversation.lastMessage}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conversation.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {conversation.messageCount} messages
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {conversation.language}
                    </Badge>
                    <span>{formatTimestamp(conversation.timestamp)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {conversation.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-muted text-xs rounded-md capitalize"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm">
                    Continue
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{conversations.length}</div>
            <div className="text-sm text-muted-foreground">Total Conversations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.round(conversations.reduce((sum, c) => sum + c.duration, 0) / conversations.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Duration (min)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {conversations.filter(c => c.quality === 'excellent').length}
            </div>
            <div className="text-sm text-muted-foreground">Excellent Quality</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Array.from(new Set(conversations.flatMap(c => c.topics))).length}
            </div>
            <div className="text-sm text-muted-foreground">Topics Covered</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
