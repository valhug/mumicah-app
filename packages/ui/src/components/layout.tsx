import React from 'react'
import { cn } from '../utils'

// ===== LAYOUT COMPONENTS =====

// Base Card component using design system
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'elevated' | 'outline'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-card border border-border',
      glass: 'glass',
      elevated: 'bg-card border border-border shadow-lg',
      outline: 'border-2 border-border bg-transparent'
    }
    
    return (
      <div
        ref={ref}
        className={cn('rounded-lg', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// Section container component
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: 'section' | 'div' | 'main'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  as: Component = 'section',
  size = 'xl',
  ...props
}) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <Component
      className={cn('relative z-10 mx-auto px-6', sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

// Page container component
export interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {children}
    </div>
  )
}
