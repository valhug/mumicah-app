import React from 'react'
import { cn } from '../utils'

// ===== FEATURE COMPONENTS =====

// Feature card component
export interface FeatureCardProps {
  title: string
  description: string
  icon: string
  gradient: string
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient,
  className
}) => {
  return (
    <div className={cn(
      'p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group',
      className
    )}>
      <div className={cn(
        'w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300',
        gradient
      )}>
        <span className="text-2xl">{icon}</span>
      </div>
      
      <h3 className="text-xl font-bold text-card-foreground mb-3">
        {title}
      </h3>
      
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
