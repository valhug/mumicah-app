'use client'

import { cn } from '@mumicah/shared'

interface Persona {
  id: string
  name: string
  emoji: string
  color: string
}

interface TypingIndicatorProps {
  persona: Persona
}

export function TypingIndicator({ persona }: TypingIndicatorProps) {
  const colorMap = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500', 
    violet: 'from-violet-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500'
  }

  const personaGradient = colorMap[persona.color as keyof typeof colorMap] || 'from-blue-500 to-cyan-500'

  return (
    <div className="flex gap-3 max-w-4xl mx-auto">
      {/* Persona Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-lg",
        `bg-gradient-to-br ${personaGradient}`
      )}>
        {persona.emoji}
      </div>

      {/* Typing Animation */}
      <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-foreground mr-2">
            {persona.name} is typing
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}
