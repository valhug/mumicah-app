'use client'

import { motion } from 'framer-motion'
import { Badge, Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  persona?: {
    id: string
    name: string
    emoji: string
    color: string
  }
}

interface MessageBubbleProps {
  message: Message
  isUser: boolean
  persona?: Message['persona']
}

export function MessageBubble({ message, isUser, persona }: MessageBubbleProps) {
  const colorMap = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500', 
    violet: 'from-violet-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500'
  }

  const personaGradient = persona?.color 
    ? colorMap[persona.color as keyof typeof colorMap] 
    : 'from-blue-500 to-cyan-500'

  return (
    <motion.div 
      className={cn(
        "flex gap-3 max-w-4xl mx-auto",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {/* AI Avatar */}
      {!isUser && persona && (
        <motion.div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-lg",
            `bg-gradient-to-br ${personaGradient}`
          )}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.1,
            duration: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          {persona.emoji}
        </motion.div>
      )}

      {/* Message Content */}
      <motion.div 
        className={cn(
          "group relative max-w-xs sm:max-w-md lg:max-w-lg",
          isUser ? "order-first" : ""
        )}
        initial={{ opacity: 0, x: isUser ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md",
          isUser 
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ml-auto" 
            : "bg-card border border-border"
        )}>
          {/* Persona Name for AI messages */}
          {!isUser && persona && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">
                {persona.name}
              </span>
              <Badge variant="secondary" className="text-xs">
                AI
              </Badge>
            </div>
          )}

          {/* Message Text */}
          <p className={cn(
            "text-sm leading-relaxed",
            isUser ? "text-primary-foreground" : "text-foreground"
          )}>
            {message.content}
          </p>

          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Message Actions (shown on hover) */}
        <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {/* TODO: Copy message */}}
            >
              Copy
            </Button>
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {/* TODO: React to message */}}
              >
                👍
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* User Avatar */}
      {isUser && (
        <motion.div 
          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
        >
          You
        </motion.div>
      )}
    </motion.div>
  )
}
