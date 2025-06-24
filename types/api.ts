// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, any>
  }
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Server Action return types
export interface ActionResult<T = any> {
  success?: boolean
  data?: T
  errors?: Record<string, string[]>
  message?: string
}

// Form state types for useActionState
export interface FormState {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
  data?: any
}
