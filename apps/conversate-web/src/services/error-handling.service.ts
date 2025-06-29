'use client'

// Error types and classification
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface AppError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  details?: string
  stack?: string
  timestamp: Date
  userId?: string
  userAgent?: string
  url?: string
  retryable: boolean
  metadata?: Record<string, unknown>
}

export interface ErrorHandlerOptions {
  showToast?: boolean
  logToConsole?: boolean
  logToService?: boolean
  allowRetry?: boolean
  fallbackAction?: () => void
}

class ErrorHandlingService {
  private errors: AppError[] = []
  private maxErrors = 100
  private retryAttempts = new Map<string, number>()
  private maxRetries = 3

  // Create a standardized error
  createError(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: string,
    metadata?: Record<string, unknown>
  ): AppError {
    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryable: this.isRetryable(type),
      metadata
    }
  }

  // Handle different types of errors
  handleError(error: Error | AppError, options: ErrorHandlerOptions = {}): AppError {
    let appError: AppError

    if (this.isAppError(error)) {
      appError = error
    } else {
      appError = this.classifyError(error)
    }

    // Store error
    this.storeError(appError)

    // Log error
    if (options.logToConsole !== false) {
      this.logToConsole(appError)
    }

    if (options.logToService) {
      this.logToExternalService(appError)
    }

    // Show user notification
    if (options.showToast) {
      this.showErrorToast(appError)
    }

    // Handle retry logic
    if (options.allowRetry && appError.retryable) {
      this.handleRetry(appError, options.fallbackAction)
    }

    return appError
  }

  // Classify unknown errors
  private classifyError(error: Error): AppError {
    let type = ErrorType.UNKNOWN
    let severity = ErrorSeverity.MEDIUM
    let retryable = false

    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      type = ErrorType.NETWORK
      retryable = true
    }
    
    // Authentication errors
    else if (error.message.includes('unauthorized') || error.message.includes('403')) {
      type = ErrorType.AUTHENTICATION
      severity = ErrorSeverity.HIGH
    }
    
    // Validation errors
    else if (error.message.includes('validation') || error.message.includes('invalid')) {
      type = ErrorType.VALIDATION
      severity = ErrorSeverity.LOW
    }
    
    // Server errors
    else if (error.message.includes('500') || error.message.includes('server')) {
      type = ErrorType.SERVER
      severity = ErrorSeverity.HIGH
      retryable = true
    }

    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message: error.message,
      details: error.stack,
      stack: error.stack,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryable
    }
  }

  // Handle network errors specifically
  handleNetworkError(response?: Response, requestUrl?: string): AppError {
    let message = 'Network error occurred'
    let type = ErrorType.NETWORK
    let severity = ErrorSeverity.MEDIUM

    if (response) {
      switch (response.status) {
        case 400:
          message = 'Bad request - please check your input'
          type = ErrorType.VALIDATION
          severity = ErrorSeverity.LOW
          break
        case 401:
          message = 'Authentication required'
          type = ErrorType.AUTHENTICATION
          severity = ErrorSeverity.HIGH
          break
        case 403:
          message = 'Access denied'
          type = ErrorType.PERMISSION
          severity = ErrorSeverity.HIGH
          break
        case 404:
          message = 'Resource not found'
          type = ErrorType.NOT_FOUND
          severity = ErrorSeverity.LOW
          break
        case 429:
          message = 'Too many requests - please try again later'
          type = ErrorType.NETWORK
          severity = ErrorSeverity.MEDIUM
          break
        case 500:
          message = 'Server error - please try again'
          type = ErrorType.SERVER
          severity = ErrorSeverity.HIGH
          break
        default:
          message = `Request failed with status ${response.status}`
      }
    }

    return this.createError(message, type, severity, `URL: ${requestUrl}`, {
      status: response?.status,
      url: requestUrl
    })
  }

  // Handle API errors with context
  handleApiError(error: Error | { message?: string; response?: Response }, endpoint: string, method: string = 'GET'): AppError {
    const message = error.message || 'API request failed'
    const details = `${method} ${endpoint}: ${error.message || 'Unknown error'}`
    
    return this.handleError(
      this.createError(message, ErrorType.NETWORK, ErrorSeverity.MEDIUM, details, {
        endpoint,
        method,
        response: 'response' in error ? error.response : undefined
      })
    )
  }

  // Retry mechanism
  private handleRetry(error: AppError, fallbackAction?: () => void) {
    const currentAttempts = this.retryAttempts.get(error.id) || 0
    
    if (currentAttempts < this.maxRetries) {
      this.retryAttempts.set(error.id, currentAttempts + 1)
      
      // Exponential backoff
      const delay = Math.pow(2, currentAttempts) * 1000
      
      setTimeout(() => {
        console.log(`Retrying operation (attempt ${currentAttempts + 1}/${this.maxRetries})`)
        // The actual retry logic would be handled by the calling code
        fallbackAction?.()
      }, delay)
    } else {
      console.error(`Max retries (${this.maxRetries}) exceeded for error:`, error.id)
      this.retryAttempts.delete(error.id)
    }
  }

  // Browser compatibility checks
  checkBrowserCompatibility(): { compatible: boolean; warnings: string[] } {
    const warnings: string[] = []
    let compatible = true

    // Check for essential APIs
    if (!window.fetch) {
      warnings.push('Fetch API not supported')
      compatible = false
    }

    if (!window.speechSynthesis) {
      warnings.push('Speech Synthesis API not supported')
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      warnings.push('Speech Recognition API not supported')
    }

    if (!window.IntersectionObserver) {
      warnings.push('Intersection Observer API not supported')
      compatible = false
    }

    if (!window.localStorage) {
      warnings.push('Local Storage not supported')
      compatible = false
    }

    // Check for modern ES features
    try {
      new Promise(() => {})
    } catch {
      warnings.push('Promises not supported')
      compatible = false
    }

    return { compatible, warnings }
  }

  // Performance monitoring
  trackPerformance(name: string, startTime: number, metadata?: Record<string, unknown>) {
    const duration = performance.now() - startTime
    
    if (duration > 1000) { // Slow operation warning
      this.handleError(
        this.createError(
          `Slow operation detected: ${name}`,
          ErrorType.CLIENT,
          ErrorSeverity.LOW,
          `Operation took ${duration.toFixed(2)}ms`,
          { duration, operation: name, ...metadata }
        ),
        { logToConsole: true }
      )
    }
  }

  // Memory monitoring
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024
      const usagePercent = (usedMB / limitMB) * 100

      if (usagePercent > 80) {
        this.handleError(
          this.createError(
            'High memory usage detected',
            ErrorType.CLIENT,
            ErrorSeverity.MEDIUM,
            `Memory usage: ${usedMB.toFixed(2)}MB (${usagePercent.toFixed(1)}%)`,
            { usedMB, limitMB, usagePercent }
          ),
          { logToConsole: true }
        )
      }
    }
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byType: {} as Record<ErrorType, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      recent: this.errors.filter(e => Date.now() - e.timestamp.getTime() < 3600000).length // Last hour
    }

    this.errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1
    })

    return stats
  }

  // Clear old errors
  clearOldErrors() {
    const oneHourAgo = Date.now() - 3600000
    this.errors = this.errors.filter(error => error.timestamp.getTime() > oneHourAgo)
  }

  // Helper methods
  private isAppError(error: unknown): error is AppError {
    return error !== null && typeof error === 'object' && 'id' in error && 'type' in error
  }

  private isRetryable(type: ErrorType): boolean {
    return [ErrorType.NETWORK, ErrorType.SERVER].includes(type)
  }

  private storeError(error: AppError) {
    this.errors.push(error)
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }
  }

  private logToConsole(error: AppError) {
    const style = this.getConsoleStyle(error.severity)
    console.group(`%c${error.severity.toUpperCase()} ERROR: ${error.message}`, style)
    console.log('Type:', error.type)
    console.log('Timestamp:', error.timestamp.toISOString())
    console.log('URL:', error.url)
    if (error.details) console.log('Details:', error.details)
    if (error.metadata) console.log('Metadata:', error.metadata)
    if (error.stack) console.log('Stack:', error.stack)
    console.groupEnd()
  }

  private getConsoleStyle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'color: white; background-color: red; font-weight: bold; padding: 2px 4px;'
      case ErrorSeverity.HIGH:
        return 'color: white; background-color: orange; font-weight: bold; padding: 2px 4px;'
      case ErrorSeverity.MEDIUM:
        return 'color: black; background-color: yellow; padding: 2px 4px;'
      case ErrorSeverity.LOW:
        return 'color: blue; background-color: lightblue; padding: 2px 4px;'
      default:
        return 'color: gray; padding: 2px 4px;'
    }
  }

  private logToExternalService(error: AppError) {
    // In production, you would send this to your error tracking service
    // e.g., Sentry, LogRocket, Bugsnag, etc.
    console.log('Would log to external service:', error)
  }

  private showErrorToast(error: AppError) {
    // This would integrate with your toast notification system
    console.log('Would show toast:', error.message)
  }

  private getCurrentUserId(): string | undefined {
    // This would get the current user ID from your auth system
    return 'user-123' // Placeholder
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandlingService()

// Convenience functions
export const handleError = (error: Error | AppError, options?: ErrorHandlerOptions) => 
  errorHandler.handleError(error, options)

export const handleNetworkError = (response?: Response, url?: string) => 
  errorHandler.handleNetworkError(response, url)

export const handleApiError = (error: Error | { message?: string; response?: Response }, endpoint: string, method?: string) => 
  errorHandler.handleApiError(error, endpoint, method)

export const trackPerformance = (name: string, startTime: number, metadata?: Record<string, unknown>) => 
  errorHandler.trackPerformance(name, startTime, metadata)

export const checkBrowserCompatibility = () => 
  errorHandler.checkBrowserCompatibility()
