// Re-export all types from conversation module
export * from './conversation'
export * from './database'

// Additional shared types for the app
export interface ApiError {
  message: string
  code?: string
  details?: any
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
  filters?: Record<string, any>
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
}
