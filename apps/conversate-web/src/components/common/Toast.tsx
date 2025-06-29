'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { Button } from '@mumicah/ui'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

// Toast management hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove non-persistent toasts
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options })
  }, [addToast])

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, persistent: true, ...options })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, ...options })
  }, [addToast])

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  }
}

// Toast item component
interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      className={`
        relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm
        ${getColorClasses()}
      `}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="text-sm font-medium text-foreground">
          {toast.title}
        </div>
        {toast.message && (
          <div className="text-sm text-muted-foreground">
            {toast.message}
          </div>
        )}
        
        {/* Action button */}
        {toast.action && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toast.action.onClick}
              className="h-7 text-xs"
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(toast.id)}
        className="h-auto p-1 text-muted-foreground hover:text-foreground"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Progress bar for timed toasts */}
      {!toast.persistent && toast.duration && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-primary/30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

// Toast container component
interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

export function ToastContainer({ 
  toasts, 
  onRemove, 
  position = 'top-right',
  maxToasts = 5 
}: ToastContainerProps) {
  // Limit number of visible toasts
  const visibleToasts = toasts.slice(-maxToasts)

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
    }
  }

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${getPositionClasses()}`}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Global toast provider component
interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastContainerProps['position']
  maxToasts?: number
}

export function ToastProvider({ children, position, maxToasts }: ToastProviderProps) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
        position={position}
        maxToasts={maxToasts}
      />
    </>
  )
}

// Hook for keyboard shortcuts to dismiss toasts
export function useToastKeyboardShortcuts(
  removeToast: (id: string) => void,
  clearAll: () => void,
  toasts: Toast[]
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key dismisses the most recent toast
      if (event.key === 'Escape' && toasts.length > 0) {
        const mostRecent = toasts[toasts.length - 1]
        removeToast(mostRecent.id)
      }
      
      // Ctrl+Shift+C clears all toasts
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        clearAll()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [removeToast, clearAll, toasts])
}

// Development helper to test all toast types
export function ToastTester() {
  const { success, error, warning, info } = useToast()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      <div className="text-xs text-muted-foreground mb-2">Toast Tester (Dev Only)</div>
      <div className="space-x-2">
        <Button 
          size="sm" 
          onClick={() => success('Success!', 'Operation completed successfully')}
        >
          Success
        </Button>
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => error('Error!', 'Something went wrong', {
            action: {
              label: 'Retry',
              onClick: () => console.log('Retry clicked')
            }
          })}
        >
          Error
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => warning('Warning!', 'Please check your input')}
        >
          Warning
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => info('Info', 'Here is some information')}
        >
          Info
        </Button>
      </div>
    </div>
  )
}
