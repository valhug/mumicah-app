'use client'

import { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { Button } from '@mumicah/ui'
import { cn } from '@mumicah/shared'
import { Send, Mic, MicOff, Paperclip, Smile, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { voiceService, type SpeechRecognitionResult } from '@/services/voice-service'
import { LoadingSpinner, VoiceProcessingIndicator } from '@/components/common/Loading'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onPronunciationRequest?: (text: string) => void
  disabled?: boolean
  placeholder?: string
  language?: string
  showVoiceFeatures?: boolean
}

export function ChatInput({ 
  onSendMessage, 
  onPronunciationRequest,
  disabled = false, 
  placeholder = "Type a message...",
  language = 'fr-FR',
  showVoiceFeatures = true
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setVoiceSupported(voiceService.isVoiceSupported())
  }, [])

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      setVoiceTranscript('')
      
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

  const handleVoiceRecord = async () => {
    if (!voiceSupported) {
      alert('Voice recording is not supported in your browser')
      return
    }

    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setIsListening(false)
      voiceService.stopListening()
    } else {
      // Start recording
      setIsRecording(true)
      setIsListening(true)
      setVoiceTranscript('')

      try {
        await voiceService.startListening(
          language,
          (result: SpeechRecognitionResult) => {
            setVoiceTranscript(result.transcript)
            if (result.isFinal && result.transcript.trim()) {
              setMessage(result.transcript)
              setIsRecording(false)
              setIsListening(false)
            }
          },
          () => {
            setIsRecording(false)
            setIsListening(false)
          }
        )
      } catch (error) {
        console.error('Voice recording error:', error)
        setIsRecording(false)
        setIsListening(false)
      }
    }
  }

  const handleTextToSpeech = async () => {
    if (!voiceSupported || !message.trim()) return

    try {
      await voiceService.speakText(message, { language })
    } catch (error) {
      console.error('Text-to-speech error:', error)
    }
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Listening...
                  </span>
                </div>
                {voiceTranscript && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 flex-1 italic">
                    &quot;{voiceTranscript}&quot;
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                "w-full resize-none bg-transparent border-0 outline-none",
                "text-sm placeholder:text-muted-foreground",
                "min-h-[24px] max-h-[120px] py-0",
                "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              )}
              rows={1}
            />
          </div>

          {/* Voice Controls */}
          {showVoiceFeatures && voiceSupported && (
            <div className="flex items-center gap-2">
              {/* Text-to-Speech */}
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-8 w-8 p-0 hover:bg-accent"
                onClick={handleTextToSpeech}
                disabled={disabled || !message.trim()}
                title="Listen to message"
              >
                <Volume2 className="h-4 w-4" />
              </Button>

              {/* Pronunciation Practice */}
              {onPronunciationRequest && message.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 h-8 w-8 p-0 hover:bg-accent text-primary"
                  onClick={() => onPronunciationRequest(message.trim())}
                  disabled={disabled}
                  title="Practice pronunciation"
                >
                  🎯
                </Button>
              )}

              {/* Voice Input */}
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
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          )}

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

          {/* Send Button */}
          <Button
            size="sm"
            className="shrink-0 h-8 w-8 p-0 rounded-full relative"
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            title="Send message"
          >
            {disabled ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Voice Processing Indicator */}
        {showVoiceFeatures && voiceSupported && (
          <VoiceProcessingIndicator 
            isRecording={isRecording}
            isProcessing={isListening}
            className="mt-2"
          />
        )}

        {/* Recording Hint */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center"
          >
            <span className="text-xs text-muted-foreground">
              Speak clearly in {language === 'fr-FR' ? 'French' : 'your target language'}. Tap mic to stop.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
