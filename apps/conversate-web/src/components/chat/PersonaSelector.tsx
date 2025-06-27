'use client'

import { Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'

interface Persona {
  id: string
  name: string
  emoji: string
  color: string
  role: string
  description: string
}

interface PersonaSelectorProps {
  personas: Persona[]
  selectedPersona: Persona
  onSelectPersona: (persona: Persona) => void
}

export function PersonaSelector({ personas, selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  const colorMap = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500', 
    violet: 'from-violet-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500'
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Choose AI Persona:
          </span>
          
          <div className="flex gap-2">
            {personas.map((persona) => {
              const isSelected = persona.id === selectedPersona.id
              const personaGradient = colorMap[persona.color as keyof typeof colorMap] || 'from-blue-500 to-cyan-500'

              return (
                <Button
                  key={persona.id}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSelectPersona(persona)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap transition-all duration-200",
                    isSelected && [
                      `bg-gradient-to-r ${personaGradient}`,
                      "text-white shadow-lg hover:shadow-xl",
                      "transform hover:scale-105"
                    ]
                  )}
                >
                  <span className="text-base">{persona.emoji}</span>
                  <span className="hidden sm:inline">{persona.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
