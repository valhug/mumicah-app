// types/database.ts - Enhanced TypeScript types
import { Database as DatabaseGenerated } from './supabase-generated.types'
import { MergeDeep } from 'type-fest'
import { ObjectId } from 'mongodb'

// Enhanced Database type with custom JSON schemas
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        profiles: {
          Row: {
            learning_languages: string[] // Enhanced JSON type
            preferences: UserPreferences | null
            achievements: Achievement[] | null
          }
          Insert: {
            learning_languages?: string[]
            preferences?: UserPreferences | null
            achievements?: Achievement[] | null
          }
          Update: {
            learning_languages?: string[]
            preferences?: UserPreferences | null
            achievements?: Achievement[] | null
          }
        }
        learning_paths: {
          Row: {
            curriculum: Curriculum | null
            settings: LearningPathSettings | null
          }
          Insert: {
            curriculum?: Curriculum | null
            settings?: LearningPathSettings | null
          }
          Update: {
            curriculum?: Curriculum | null
            settings?: LearningPathSettings | null
          }
        }
      }
    }
  }
>

// Custom JSON type definitions
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    in_app: boolean
    daily_reminder: boolean
    weekly_summary: boolean
  }
  privacy: {
    profile_visibility: 'public' | 'friends' | 'private'
    show_progress: boolean
    allow_friend_requests: boolean
  }
  learning: {
    daily_goal: number // minutes per day
    preferred_difficulty: 'beginner' | 'intermediate' | 'advanced'
    auto_play_audio: boolean
    show_corrections: boolean
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned_at: string
  category: 'learning' | 'social' | 'streak' | 'milestone'
  points: number
}

export interface Curriculum {
  modules: CurriculumModule[]
  prerequisites: string[]
  estimated_completion_time: number
}

export interface CurriculumModule {
  id: string
  title: string
  description: string
  lessons: CurriculumLesson[]
  order: number
  is_required: boolean
}

export interface CurriculumLesson {
  id: string
  title: string
  type: 'video' | 'interactive' | 'quiz' | 'reading' | 'speaking'
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skills: string[]
  order: number
}

export interface LearningPathSettings {
  is_self_paced: boolean
  allow_skip: boolean
  require_completion: boolean
  certificate_enabled: boolean
  community_enabled: boolean
}

// MongoDB Document Types with enhanced TypeScript
export interface CommunityDocument {
  _id: ObjectId
  name: string
  description: string
  language: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed'
  creator_id: string
  moderators: string[]
  member_count: number
  is_private: boolean
  rules: string[]
  tags: string[]
  settings: {
    allow_media: boolean
    require_approval: boolean
    auto_approve_members: boolean
  }
  created_at: Date
  updated_at: Date
}

export interface PostDocument {
  _id: ObjectId
  user_id: string
  community_id: ObjectId
  content: string
  media: MediaAttachment[]
  reactions: Reaction[]
  comments: Comment[]
  tags: string[]
  language_note?: LanguageNote
  is_pinned: boolean
  is_archived: boolean
  view_count: number
  created_at: Date
  updated_at: Date
}

export interface MediaAttachment {
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  alt?: string
  size?: number
  width?: number
  height?: number
}

export interface Reaction {
  user_id: string
  type: 'like' | 'love' | 'helpful' | 'celebrate' | 'thinking'
  created_at: Date
}

export interface Comment {
  user_id: string
  content: string
  created_at: Date
  edited_at?: Date
}

export interface LanguageNote {
  corrected_text: string
  corrections: LanguageCorrection[]
}

export interface LanguageCorrection {
  original: string
  suggested: string
  type: 'grammar' | 'vocabulary' | 'spelling' | 'style'
  explanation: string
}

export interface ConversationDocument {
  _id: ObjectId
  participants: string[]
  type: 'direct' | 'group'
  title?: string
  messages: Message[]
  last_message_at: Date
  is_archived: boolean
  created_at: Date
  updated_at: Date
}

export interface Message {
  sender_id: string
  content: string
  type: 'text' | 'image' | 'audio' | 'file'
  media_url?: string
  reply_to?: ObjectId
  edited_at?: Date
  created_at: Date
}

export interface ActivityDocument {
  _id: ObjectId
  user_id: string
  action: string
  target_type?: string
  target_id?: string
  metadata: Record<string, any>
  timestamp: Date
  ip_address?: string
  user_agent?: string
}

export interface ResourceDocument {
  _id: ObjectId
  title: string
  description: string
  content_type: 'video' | 'audio' | 'pdf' | 'article' | 'interactive' | 'quiz' | 'flashcards'
  language: string
  target_language?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
  tags: string[]
  url?: string
  file_data?: {
    size: number
    mime_type: string
    duration?: number
    transcript?: string
  }
  creator_id: string
  is_public: boolean
  is_premium: boolean
  usage_count: number
  rating: {
    average: number
    count: number
  }
  reviews: ResourceReview[]
  created_at: Date
  updated_at: Date
}

export interface ResourceReview {
  user_id: string
  rating: number
  comment?: string
  created_at: Date
}

export interface NotificationDocument {
  _id: ObjectId
  recipient_id: string
  sender_id?: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  action_url?: string
  is_read: boolean
  is_archived: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  expires_at?: Date
  created_at: Date
}

export interface MediaDocument {
  _id: ObjectId
  upload_id: string
  user_id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
  duration?: number
  url: string
  thumbnail_url?: string
  alt_text?: string
  tags: string[]
  usage_count: number
  is_public: boolean
  status: 'uploading' | 'processing' | 'ready' | 'error'
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

// Helper types for API responses
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T]
