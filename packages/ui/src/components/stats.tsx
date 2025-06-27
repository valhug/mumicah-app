import React from 'react'
import { cn } from '../utils'

// Progress Bar Component
export const ProgressBar = ({
  value,
  max = 100,
  className,
  color = "primary",
  showText = false,
  label,
}: {
  value: number
  max?: number
  className?: string
  color?: "primary" | "success" | "warning" | "error"
  showText?: boolean
  label?: string
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorVariants = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning", 
    error: "bg-destructive"
  }

  // Convert percentage to Tailwind width class
  const getWidthClass = (percent: number) => {
    if (percent >= 100) return "w-full"
    if (percent >= 95) return "w-11/12"
    if (percent >= 90) return "w-10/12"
    if (percent >= 80) return "w-4/5"
    if (percent >= 75) return "w-3/4"
    if (percent >= 70) return "w-7/12"
    if (percent >= 66) return "w-2/3"
    if (percent >= 60) return "w-3/5"
    if (percent >= 50) return "w-1/2"
    if (percent >= 40) return "w-2/5"
    if (percent >= 33) return "w-1/3"
    if (percent >= 25) return "w-1/4"
    if (percent >= 20) return "w-1/5"
    if (percent >= 10) return "w-1/12"
    return "w-0"
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showText) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="body-regular content-secondary">{label}</span>
          )}
          {showText && (
            <span className="small-medium content-primary">{value}/{max}</span>
          )}
        </div>
      )}
      <div className="w-full bg-border h-2 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-300", colorVariants[color], getWidthClass(percentage))}
        />
      </div>
    </div>
  )
}

// Metric Card Component (renamed to avoid conflict)
export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}) => {
  return (
    <div className={cn("card-wrapper p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="body-medium content-secondary">{title}</h3>
        {icon && <div className="w-8 h-8 content-tertiary">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="h2-bold content-primary">{value}</div>
        
        <div className="flex items-center space-x-2">
          {subtitle && (
            <span className="small-medium content-secondary">{subtitle}</span>
          )}
          {trend && (
            <span className={cn(
              "small-medium font-semibold",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Quick Action Button
export const QuickActionButton = ({
  title,
  description,
  icon,
  onClick,
  href,
  variant = "default",
  className,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "default" | "primary" | "accent"
  className?: string
}) => {
  const variants = {
    default: "card-wrapper hover:surface-secondary border-primary",
    primary: "card-wrapper hover:bg-primary/5 border-primary",
    accent: "card-wrapper hover:bg-brand-accent/5 border-accent"
  }

  const Component = href ? 'a' : 'button'
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        "p-6 space-y-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start space-x-4">
        {icon && (
          <div className="w-10 h-10 content-primary flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <h3 className="h3-semibold content-primary">{title}</h3>
          {description && (
            <p className="paragraph-regular content-secondary">{description}</p>
          )}
        </div>
      </div>
    </Component>
  )
}

// Goals Card
export const GoalsCard = ({
  title,
  goals,
  className,
}: {
  title: string
  goals: Array<{
    label: string
    current: number
    target: number
    color?: "primary" | "success" | "warning" | "error"
  }>
  className?: string
}) => {
  return (
    <div className={cn("card-wrapper p-6 space-y-6", className)}>
      <h3 className="h3-semibold content-primary">{title}</h3>
      
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <ProgressBar
            key={index}
            label={goal.label}
            value={goal.current}
            max={goal.target}
            color={goal.color || "primary"}
            showText
          />
        ))}
      </div>
    </div>
  )
}

// Activity Item
export const ActivityItem = ({
  title,
  description,
  timestamp,
  icon,
  type = "default",
  className,
}: {
  title: string
  description?: string
  timestamp: string
  icon?: React.ReactNode
  type?: "default" | "success" | "warning" | "error"
  className?: string
}) => {
  const typeColors = {
    default: "content-tertiary",
    success: "text-success",
    warning: "text-warning",
    error: "text-destructive"
  }

  return (
    <div className={cn("flex items-start space-x-3 py-3", className)}>
      {icon && (
        <div className={cn("w-6 h-6 mt-0.5", typeColors[type])}>
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <p className="body-medium content-primary">{title}</p>
        {description && (
          <p className="small-medium content-secondary">{description}</p>
        )}
        <p className="small-medium content-tertiary">{timestamp}</p>
      </div>
    </div>
  )
}

// Recent Activity Card
export const RecentActivityCard = ({
  title = "Recent Activity",
  activities,
  className,
}: {
  title?: string
  activities: Array<{
    id: string
    title: string
    description?: string
    timestamp: string
    icon?: React.ReactNode
    type?: "default" | "success" | "warning" | "error"
  }>
  className?: string
}) => {
  return (
    <div className={cn("card-wrapper p-6 space-y-6", className)}>
      <h3 className="h3-semibold content-primary">{title}</h3>
      
      <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              description={activity.description}
              timestamp={activity.timestamp}
              icon={activity.icon}
              type={activity.type}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="paragraph-regular content-secondary">
              No recent activity to show
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
