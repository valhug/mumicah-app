import React from 'react'
import { cn } from '../utils'

// Auth Page Container
export const AuthPageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center surface-secondary",
      className
    )}>
      <div className="max-w-md w-full space-y-8 p-8">
        {children}
      </div>
    </div>
  )
}

// Auth Card
export const AuthCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn(
      "card-wrapper p-8 space-y-6 glass",
      className
    )}>
      {children}
    </div>
  )
}

// Auth Header
export const AuthHeader = ({
  title,
  subtitle,
  showLogo = true,
  className,
}: {
  title: string
  subtitle?: string
  showLogo?: boolean
  className?: string
}) => {
  return (
    <div className={cn("text-center space-y-4", className)}>
      {showLogo && (
        <h1 className="text-4xl font-bold text-brand mb-4">
          Mumicah
        </h1>
      )}
      <div className="space-y-2">
        <h2 className="h2-bold content-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="paragraph-regular content-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// Auth Form
export const AuthForm = ({
  children,
  onSubmit,
  className,
}: {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  className?: string
}) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className={cn("space-y-4", className)}
    >
      {children}
    </form>
  )
}

// Auth Input Group
export const AuthInputGroup = ({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block body-medium content-primary">
        {label}
      </label>
      {children}
    </div>
  )
}

// Auth Input
export const AuthInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
  }
>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-lg border transition-colors",
        "surface-primary content-primary",
        "border-primary focus:border-focus focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "placeholder:content-tertiary",
        "focus:outline-none",
        error && "border-destructive focus:border-destructive",
        className
      )}
      {...props}
    />
  )
})
AuthInput.displayName = "AuthInput"

// Auth Button (Primary)
export const AuthButton = ({
  children,
  isLoading = false,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  variant?: "primary" | "secondary" | "outline"
}) => {
  const variants = {
    primary: "bg-brand text-white hover:bg-primary/90 focus:ring-primary",
    secondary: "surface-secondary content-primary border border-primary hover:surface-tertiary",
    outline: "border border-primary content-primary hover:surface-secondary"
  }

  return (
    <button
      className={cn(
        "w-full flex justify-center items-center px-4 py-3 rounded-lg",
        "body-medium font-semibold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Social Auth Button
export const SocialAuthButton = ({
  children,
  icon,
  provider,
  isLoading = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode
  provider: string
  isLoading?: boolean
}) => {
  return (
    <button
      className={cn(
        "w-full flex justify-center items-center px-4 py-3 rounded-lg",
        "surface-primary content-primary border border-primary",
        "hover:surface-secondary transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "body-medium font-medium",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      <span className="w-5 h-5 mr-3">{icon}</span>
      {isLoading ? `Connecting to ${provider}...` : `Continue with ${provider}`}
    </button>
  )
}

// Auth Divider
export const AuthDivider = ({ text = "Or continue with" }: { text?: string }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-primary" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 surface-secondary content-secondary body-regular">
          {text}
        </span>
      </div>
    </div>
  )
}

// Auth Link
export const AuthLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => {
  return (
    <a
      href={href}
      className={cn(
        "text-brand hover:text-primary/80 transition-colors",
        "body-medium font-medium",
        className
      )}
    >
      {children}
    </a>
  )
}

// Error Message
export const AuthError = ({
  message,
  className,
}: {
  message: string
  className?: string
}) => {
  if (!message) return null

  return (
    <div className={cn(
      "bg-destructive/10 border border-destructive/20 text-destructive",
      "px-4 py-3 rounded-lg body-regular",
      className
    )}>
      {message}
    </div>
  )
}

// Success Message
export const AuthSuccess = ({
  title,
  message,
  action,
  className,
}: {
  title: string
  message: string
  action?: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <h2 className="h3-bold content-primary">
        {title}
      </h2>
      <p className="paragraph-regular content-secondary">
        {message}
      </p>
      {action && (
        <div className="pt-4">
          {action}
        </div>
      )}
    </div>
  )
}
