'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'
import { Send, Mic, Paperclip, Smile } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Type a message..." }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    setMessage(textarea.value)
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    // Set height to scrollHeight (max 5 lines)
    const maxHeight = 5 * 24 // 5 lines * 24px line height
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }

  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // TODO: Process voice recording
    } else {
      // Start recording
      setIsRecording(true)
      // TODO: Start voice recording
    }
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 bg-background border border-border rounded-2xl p-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full resize-none border-0 bg-transparent px-0 py-1",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-0",
                "max-h-32 min-h-[24px] leading-6"
              )}
              rows={1}
            />
          </div>

          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
            title="Add emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>

          {/* Voice/Send Button */}
          {message.trim() ? (
            <Button
              size="sm"
              className={cn(
                "shrink-0 h-8 w-8 p-0 rounded-full",
                "bg-gradient-to-r from-primary to-primary/80",
                "hover:from-primary/90 hover:to-primary/70",
                "transition-all duration-200 hover:scale-105"
              )}
              onClick={handleSubmit}
              disabled={disabled}
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              className={cn(
                "shrink-0 h-8 w-8 p-0 rounded-full transition-all duration-200",
                isRecording && "animate-pulse"
              )}
              onClick={handleVoiceRecord}
              disabled={disabled}
              title={isRecording ? "Stop recording" : "Voice message"}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording... Tap to stop
          </div>
        )}
      </div>
    </div>
  )
}
