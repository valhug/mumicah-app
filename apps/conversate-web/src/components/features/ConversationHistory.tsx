'use client'

import { useState, useEffect } from 'react'
import { Card, Badge, Button } from '@mumicah/ui'
import { Search, Filter, Clock, MessageSquare, Bot, Calendar, TrendingUp } from 'lucide-react'

interface ConversationHistoryProps {
  userId?: string
}

interface ConversationSummary {
  id: string
  personaName: string
  personaAvatar: string
  startedAt: Date
  endedAt: Date
  duration: number // minutes
  messageCount: number
  userMessageCount: number
  aiMessageCount: number
  topics: string[]
  learningPoints: string[]
  overallRating?: number
  wasHelpful: boolean
  lastMessage: string
}

// Demo data - replace with real API calls
const DEMO_CONVERSATIONS: ConversationSummary[] = [
  {
    id: '1',
    personaName: 'Maya Chen',
    personaAvatar: '👩‍🎓',
    startedAt: new Date('2024-01-20T14:30:00'),
    endedAt: new Date('2024-01-20T15:15:00'),
    duration: 45,
    messageCount: 32,
    userMessageCount: 16,
    aiMessageCount: 16,
    topics: ['Travel Planning', 'Cultural Exchange', 'Japanese Customs'],
    learningPoints: ['Polite expressions', 'Travel vocabulary', 'Question formation'],
    overallRating: 5,
    wasHelpful: true,
    lastMessage: "Thank you for helping me practice! I feel more confident about my upcoming trip to Japan."
  },
  {
    id: '2',
    personaName: 'Alex Rivera',
    personaAvatar: '👨‍💼',
    startedAt: new Date('2024-01-19T09:00:00'),
    endedAt: new Date('2024-01-19T09:30:00'),
    duration: 30,
    messageCount: 24,
    userMessageCount: 12,
    aiMessageCount: 12,
    topics: ['Business Spanish', 'Professional Communication', 'Presentations'],
    learningPoints: ['Formal vocabulary', 'Business idioms', 'Professional tone'],
    overallRating: 4,
    wasHelpful: true,
    lastMessage: "Great progress on your business Spanish! Keep practicing those formal expressions."
  },
  {
    id: '3',
    personaName: 'Luna Park',
    personaAvatar: '🎨',
    startedAt: new Date('2024-01-18T16:45:00'),
    endedAt: new Date('2024-01-18T17:20:00'),
    duration: 35,
    messageCount: 28,
    userMessageCount: 14,
    aiMessageCount: 14,
    topics: ['Korean Culture', 'K-pop', 'Creative Writing'],
    learningPoints: ['Casual speech patterns', 'Cultural expressions', 'Emotion vocabulary'],
    overallRating: 5,
    wasHelpful: true,
    lastMessage: "Your Korean is improving so much! Let's talk about K-dramas next time! 🎬"
  },
  {
    id: '4',
    personaName: 'Diego Santos',
    personaAvatar: '⚽',
    startedAt: new Date('2024-01-17T20:15:00'),
    endedAt: new Date('2024-01-17T20:45:00'),
    duration: 30,
    messageCount: 20,
    userMessageCount: 10,
    aiMessageCount: 10,
    topics: ['Sports', 'Brazilian Portuguese', 'Casual Conversation'],
    learningPoints: ['Sports vocabulary', 'Slang expressions', 'Pronunciation tips'],
    overallRating: 4,
    wasHelpful: true,
    lastMessage: "Ótimo trabalho! Your Portuguese pronunciation is getting much better!"
  }
]

export default function ConversationHistory({ userId }: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'this-week' | 'this-month' | 'helpful'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadConversations = async () => {
      setIsLoading(true)
      // Replace with actual API call: await ConversationService.getUserConversations(userId)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConversations(DEMO_CONVERSATIONS)
      setIsLoading(false)
    }

    loadConversations()
  }, [userId])

  const filteredConversations = conversations.filter(conv => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      conv.personaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conv.learningPoints.some(point => point.toLowerCase().includes(searchTerm.toLowerCase()))

    // Date/type filter
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    let matchesFilter = true
    switch (selectedFilter) {
      case 'this-week':
        matchesFilter = conv.startedAt >= oneWeekAgo
        break
      case 'this-month':
        matchesFilter = conv.startedAt >= oneMonthAgo
        break
      case 'helpful':
        matchesFilter = conv.wasHelpful && (conv.overallRating || 0) >= 4
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getStarRating = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Conversation History</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-muted/30 rounded-lg h-24" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Conversation History</h3>
          <Badge variant="secondary">{conversations.length} total</Badge>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations, topics, or personas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'this-week' | 'this-month' | 'helpful')}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Filter conversations by time period"
            >
              <option value="all">All Time</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{conversations.length}</div>
            <div className="text-sm text-muted-foreground">Total Conversations</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {Math.round(conversations.reduce((sum, conv) => sum + conv.duration, 0) / 60)}h
            </div>
            <div className="text-sm text-muted-foreground">Total Practice Time</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {Math.round(conversations.reduce((sum, conv) => sum + (conv.overallRating || 0), 0) / conversations.length * 10) / 10}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {conversations.filter(conv => conv.wasHelpful).length}
            </div>
            <div className="text-sm text-muted-foreground">Helpful Sessions</div>
          </div>
        </div>
      </Card>

      {/* Conversation List */}
      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No conversations found</h4>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedFilter !== 'all' 
                ? "Try adjusting your search or filter criteria"
                : "Start your first conversation with an AI persona!"}
            </p>
            <Button asChild>
              <a href="/chat">Start Chatting</a>
            </Button>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card key={conversation.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{conversation.personaAvatar}</div>
                  <div>
                    <h4 className="font-semibold text-foreground">{conversation.personaName}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(conversation.startedAt)}
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      {conversation.duration}m
                      <span>•</span>
                      <MessageSquare className="h-3 w-3" />
                      {conversation.messageCount} messages
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {conversation.overallRating && (
                    <span className="text-sm">{getStarRating(conversation.overallRating)}</span>
                  )}
                  {conversation.wasHelpful && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Helpful
                    </Badge>
                  )}
                </div>
              </div>

              {/* Topics */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {conversation.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Learning Points */}
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">You learned about:</div>
                <div className="flex flex-wrap gap-2">
                  {conversation.learningPoints.map((point) => (
                    <Badge key={point} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Message Preview */}
              <div className="bg-muted/30 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground italic">
                    &quot;{conversation.lastMessage}&quot;
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{conversation.userMessageCount} your messages • {conversation.aiMessageCount} AI responses</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/chat?persona=${conversation.personaName.toLowerCase().replace(' ', '-')}`}>
                      Continue Chat
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
