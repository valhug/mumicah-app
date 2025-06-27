import React from 'react'
import { cn } from '../utils'

// ===== PERSONA COMPONENTS =====

// Persona card component
export interface PersonaCardProps {
  name: string
  role: string
  description: string
  emoji: string
  color: 'amber' | 'emerald' | 'violet'
  badges: string[]
  className?: string
  onClick?: () => void
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  name,
  role,
  description,
  emoji,
  color,
  badges,
  className,
  onClick
}) => {
  const colorStyles = {
    amber: {
      gradient: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-500/20',
      iconGradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      roleColor: 'text-amber-600/80',
      badgeStyle: 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    },
    emerald: {
      gradient: 'from-emerald-500/10 to-green-500/10',
      border: 'border-emerald-500/20',
      iconGradient: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-600',
      roleColor: 'text-emerald-600/80',
      badgeStyle: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    },
    violet: {
      gradient: 'from-violet-500/10 to-purple-500/10',
      border: 'border-violet-500/20',
      iconGradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      roleColor: 'text-violet-600/80',
      badgeStyle: 'bg-violet-500/10 text-violet-700 border-violet-500/20'
    }
  }

  const styles = colorStyles[color]

  return (
    <div 
      className={cn(
        'group relative p-8 bg-gradient-to-br border rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105',
        styles.gradient,
        styles.border,
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        styles.gradient
      )}></div>
      
      <div className="relative z-10">
        <div className={cn(
          'w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500',
          styles.iconGradient
        )}>
          <span className="text-2xl">{emoji}</span>
        </div>
        
        <h3 className={cn('text-2xl font-bold mb-3', styles.textColor)}>
          {name}
        </h3>
        
        <p className={cn('text-sm mb-4 font-medium', styles.roleColor)}>
          {role}
        </p>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                styles.badgeStyle
              )}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
