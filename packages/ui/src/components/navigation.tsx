import React from 'react'
import { cn } from '../utils'

// ===== NAVIGATION COMPONENTS =====

// Navigation bar component
export interface NavBarProps {
  children: React.ReactNode
  className?: string
  variant?: 'glass' | 'solid' | 'transparent'
}

export const NavBar: React.FC<NavBarProps> = ({
  children,
  className,
  variant = 'glass'
}) => {
  const variants = {
    glass: 'glass border-b border-border/50',
    solid: 'bg-background border-b border-border',
    transparent: 'bg-transparent'
  }

  return (
    <nav className={cn('relative z-50 px-6 py-4', variants[variant], className)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {children}
      </div>
    </nav>
  )
}

// Logo component
export interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className
}) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { icon: 'w-10 h-10', text: 'text-3xl' }
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center',
        sizes[size].icon
      )}>
        <span className="text-white font-bold text-sm">M</span>
      </div>
      {showText && (
        <h1 className={cn(
          'font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent',
          sizes[size].text
        )}>
          Mumicah
        </h1>
      )}
    </div>
  )
}
