import React from 'react'
import { cn } from '../utils'
import { Section } from './layout'

// ===== CTA COMPONENTS =====

// CTA Section component
export interface CTASectionProps {
  title: string
  subtitle?: string
  primaryAction?: {
    text: string
    href: string
  }
  secondaryAction?: {
    text: string
    href: string
  }
  className?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className
}) => {
  return (
    <Section className={cn('py-24', className)}>
      <div className="text-center p-16 bg-gradient-to-br from-primary/10 via-orange-500/10 to-amber-500/10 border border-primary/20 rounded-3xl backdrop-blur-sm">
        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <a
              href={primaryAction.href}
              className="inline-flex items-center justify-center px-12 py-6 text-xl font-medium rounded-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {primaryAction.text}
            </a>
          )}
          
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="inline-flex items-center justify-center px-12 py-6 text-xl font-medium rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground transition-all duration-300"
            >
              {secondaryAction.text}
            </a>
          )}
        </div>
      </div>
    </Section>
  )
}
