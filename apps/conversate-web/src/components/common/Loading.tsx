'use client'

import { motion } from 'framer-motion'
import { Loader2, MessageCircle, Mic, Brain, Zap } from 'lucide-react'
import { cn } from '@mumicah/shared'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  )
}

interface LoadingDotsProps {
  className?: string
  dotClassName?: string
}

export function LoadingDots({ className, dotClassName }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-1 justify-center items-center', className)} aria-label="Loading">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('w-2 h-2 bg-primary rounded-full', dotClassName)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )
}

interface LoadingPulseProps {
  className?: string
  children?: React.ReactNode
}

export function LoadingPulse({ className, children }: LoadingPulseProps) {
  return (
    <motion.div
      className={cn('bg-muted rounded-lg', className)}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      aria-label="Loading content"
    >
      {children}
    </motion.div>
  )
}

interface TypingIndicatorProps {
  className?: string
  message?: string
}

export function TypingIndicator({ className, message = 'AI is typing' }: TypingIndicatorProps) {
  return (
    <motion.div
      className={cn('flex items-center space-x-3 p-3 bg-muted/50 rounded-lg', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex items-center space-x-1">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
      <LoadingDots dotClassName="bg-primary/60" />
    </motion.div>
  )
}

interface VoiceProcessingIndicatorProps {
  isRecording?: boolean
  isProcessing?: boolean
  className?: string
}

export function VoiceProcessingIndicator({ 
  isRecording = false, 
  isProcessing = false, 
  className 
}: VoiceProcessingIndicatorProps) {
  const message = isRecording 
    ? 'Listening...' 
    : isProcessing 
      ? 'Processing speech...' 
      : 'Ready'

  return (
    <motion.div
      className={cn('flex items-center space-x-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-live="polite"
      aria-label={message}
    >
      <motion.div
        animate={isRecording || isProcessing ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isRecording || isProcessing ? Infinity : 0 }}
      >
        {isRecording ? (
          <Mic className="w-4 h-4 text-red-500" />
        ) : isProcessing ? (
          <Brain className="w-4 h-4 text-primary" />
        ) : (
          <Mic className="w-4 h-4 text-muted-foreground" />
        )}
      </motion.div>
      <span className="text-sm text-muted-foreground">{message}</span>
    </motion.div>
  )
}

interface SkeletonProps {
  className?: string
  lines?: number
  showAvatar?: boolean
}

export function MessageSkeleton({ className, lines = 2, showAvatar = true }: SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)} aria-label="Loading message">
      <div className="flex space-x-3">
        {showAvatar && (
          <LoadingPulse className="w-8 h-8 rounded-full flex-shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <LoadingPulse
              key={index}
              className={cn(
                'h-4',
                index === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface FullPageLoadingProps {
  message?: string
  showProgress?: boolean
  progress?: number
  className?: string
}

export function FullPageLoading({ 
  message = 'Loading...', 
  showProgress = false,
  progress = 0,
  className 
}: FullPageLoadingProps) {
  return (
    <div className={cn(
      'min-h-screen flex flex-col items-center justify-center p-4 bg-background',
      className
    )}>
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Logo/Icon */}
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <LoadingDots className="justify-center" />
        </div>

        {/* Progress Bar (optional) */}
        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText, 
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'relative disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className={cn('flex items-center justify-center gap-2', isLoading && 'opacity-0')}>
        {children}
      </span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          {loadingText && <span>{loadingText}</span>}
        </span>
      )}
    </button>
  )
}
