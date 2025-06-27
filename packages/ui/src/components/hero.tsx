import React from 'react'
import { cn } from '../utils'
import { Section } from './layout'

// ===== HERO COMPONENTS =====

// Hero section component
export interface HeroSectionProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  children,
  className,
  size = 'lg'
}) => {
  const sizes = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-24'
  }

  return (
    <Section className={cn(sizes[size], className)}>
      <div className="text-center space-y-8">
        {children}
      </div>
    </Section>
  )
}

// Hero title component
export interface HeroTitleProps {
  children: React.ReactNode
  gradient?: boolean
  className?: string
}

export const HeroTitle: React.FC<HeroTitleProps> = ({
  children,
  gradient = false,
  className
}) => {
  return (
    <h1 className={cn(
      'text-5xl md:text-7xl font-bold animate-fade-in',
      gradient ? 'gradient-text' : 'text-foreground',
      className
    )}>
      {children}
    </h1>
  )
}

// Hero subtitle component
export interface HeroSubtitleProps {
  children: React.ReactNode
  className?: string
}

export const HeroSubtitle: React.FC<HeroSubtitleProps> = ({
  children,
  className
}) => {
  return (
    <p className={cn(
      'text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed',
      className
    )}>
      {children}
    </p>
  )
}
