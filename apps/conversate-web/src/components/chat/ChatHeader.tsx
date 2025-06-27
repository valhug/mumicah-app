'use client'

import { Badge, Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'
import { Settings, MoreVertical } from 'lucide-react'

interface Persona {
  id: string
  name: string
  emoji: string
  color: string
  role: string
  description: string
}

interface ChatHeaderProps {
  persona: Persona
  onPersonaChange: () => void
}

export function ChatHeader({ persona, onPersonaChange }: ChatHeaderProps) {
  const colorMap = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500', 
    violet: 'from-violet-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500'
  }

  const personaGradient = colorMap[persona.color as keyof typeof colorMap] || 'from-blue-500 to-cyan-500'

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Persona Info */}
          <div className="flex items-center gap-3">
            {/* Persona Avatar */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg",
              `bg-gradient-to-br ${personaGradient}`
            )}>
              {persona.emoji}
            </div>

            {/* Persona Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {persona.name}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  AI
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {persona.role} • Online
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Change Persona */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onPersonaChange}
              className="hidden sm:flex"
            >
              Switch Persona
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              title="Chat settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* More Options */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              title="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Persona Description */}
        <div className="mt-2 text-sm text-muted-foreground">
          {persona.description}
        </div>
      </div>
    </div>
  )
}
