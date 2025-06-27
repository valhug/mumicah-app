import React from 'react'
import { cn } from '../utils'
import { Card } from './layout'

// ===== DASHBOARD COMPONENTS =====

// Welcome Section component
export interface WelcomeSectionProps {
  title: string
  subtitle?: string
  status?: 'active' | 'inactive' | 'pending'
  actions?: React.ReactNode
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  title,
  subtitle,
  status,
  actions
}) => {
  const statusStyles = {
    active: 'bg-success/10 text-success border border-success/20',
    inactive: 'bg-muted text-muted-foreground border border-border',
    pending: 'bg-warning/10 text-warning border border-warning/20'
  }

  return (
    <Card className="p-6">
      <div className="flex-between">
        <div>
          <h1 className="h2-bold content-primary mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="body-regular content-secondary">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {status && (
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              statusStyles[status]
            )}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
          {actions}
        </div>
      </div>
    </Card>
  )
}

// Stats card component
export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: string
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className
}) => {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="small-medium content-secondary mb-1">
            {title}
          </p>
          <p className="h2-bold content-primary">
            {value}
          </p>
          {description && (
            <p className="body-regular content-tertiary mt-1">
              {description}
            </p>
          )}
        </div>
        
        {icon && (
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={cn(
            'text-sm font-medium',
            trend.isPositive ? 'text-success' : 'text-error'
          )}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            vs last month
          </span>
        </div>
      )}
    </Card>
  )
}
