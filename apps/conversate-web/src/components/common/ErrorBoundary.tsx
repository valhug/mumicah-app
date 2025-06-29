'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@mumicah/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console and optionally to external service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)

    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          className="min-h-screen flex items-center justify-center p-4 bg-background"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-lg w-full border-destructive/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try again or return to the home page.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.props.showDetails && this.state.error && (
                <details className="bg-muted/50 p-3 rounded-lg">
                  <summary className="cursor-pointer font-medium text-sm mb-2">
                    Error Details
                  </summary>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 overflow-auto text-xs">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-auto text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1 gap-2"
                  aria-label="Try again"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1 gap-2"
                  aria-label="Go to home page"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-2">
                If this problem persists, please contact support.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    return this.props.children
  }
}

// HOC version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
