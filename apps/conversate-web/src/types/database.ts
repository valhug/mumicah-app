// Base document interface for MongoDB
export interface BaseDocument {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// User document
export interface UserDocument extends BaseDocument {
  email: string
  name?: string
  avatar?: string
  preferredLanguages: string[]
  nativeLanguage: string
  level: number
  xp: number
  streakDays: number
  lastActiveDate: Date
}

// Activity document
export interface ActivityDocument extends BaseDocument {
  userId: string
  type: 'conversation' | 'lesson' | 'quiz' | 'achievement'
  description: string
  metadata?: Record<string, any>
  xpGained?: number
}

// Community document
export interface CommunityDocument extends BaseDocument {
  name: string
  description: string
  avatar?: string
  banner?: string
  language: string
  memberCount: number
  isPrivate: boolean
  tags: string[]
  createdBy: string
  moderators: string[]
  rules?: string[]
}

// Post document
export interface PostDocument extends BaseDocument {
  communityId: string
  authorId: string
  title?: string
  content: string
  mediaAttachments: MediaAttachment[]
  reactions: Reaction[]
  comments: Comment[]
  isAnnouncement: boolean
  isPinned: boolean
  languageNotes?: LanguageNote[]
  tags: string[]
}

// Media attachment interface
export interface MediaAttachment {
  id: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  filename: string
  size: number
  mimeType: string
}

// Reaction interface
export interface Reaction {
  userId: string
  emoji: string
  createdAt: Date
}

// Comment interface
export interface Comment {
  id: string
  authorId: string
  content: string
  parentCommentId?: string
  reactions: Reaction[]
  createdAt: Date
  updatedAt: Date
}

// Language note interface
export interface LanguageNote {
  id: string
  text: string
  explanation: string
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'culture'
  authorId: string
  createdAt: Date
}

// Conversation document
export interface ConversationDocument extends BaseDocument {
  userId: string
  personaId: string
  title?: string
  messages: Message[]
  status: 'active' | 'completed' | 'archived'
  language: string
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  totalMessages: number
  duration?: number
  tags: string[]
}

// Message interface
export interface Message {
  id: string
  sender: 'user' | 'persona'
  content: string
  timestamp: Date
  metadata?: {
    audioPath?: string
    vocabularyHighlights?: VocabularyHighlight[]
    grammarPoints?: string[]
    culturalNotes?: string
  }
}

// Vocabulary highlight interface
export interface VocabularyHighlight {
  word: string
  category: string
  definition: string
  usage?: string
}

// Notification document
export interface NotificationDocument extends BaseDocument {
  userId: string
  type: 'system' | 'community' | 'social' | 'achievement'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

// Resource document
export interface ResourceDocument extends BaseDocument {
  title: string
  description: string
  type: 'article' | 'video' | 'podcast' | 'exercise' | 'quiz'
  content?: string
  url?: string
  language: string
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  authorId: string
  isPublic: boolean
  downloads: number
  rating: number
  reviews: ResourceReview[]
}

// Resource review interface
export interface ResourceReview {
  id: string
  userId: string
  rating: number
  comment?: string
  createdAt: Date
}

// Media document
export interface MediaDocument extends BaseDocument {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  isPublic: boolean
  tags: string[]
  metadata?: {
    width?: number
    height?: number
    duration?: number
    transcription?: string
  }
}


