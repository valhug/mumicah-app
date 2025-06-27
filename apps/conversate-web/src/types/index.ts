// Re-export specific types from conversation module
export type { 
  PersonaId, 
  ConversationContext, 
  ConversationMessage, 
  ConversationSegment,
  EnhancedConversationContext,
  PersonaResponse,
  VocabularyHighlight 
} from './conversation'
export * from './database'

// Additional shared types for the app
export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  query: string
  filters?: Record<string, unknown>
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
}
