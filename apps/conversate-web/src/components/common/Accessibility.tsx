'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react'
import { Button } from '@mumicah/ui'
import { Card, CardContent } from '@mumicah/ui'

// Screen Reader Only component for accessibility announcements
interface ScreenReaderOnlyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: React.ElementType
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-atomic'?: boolean
}

export function ScreenReaderOnly({
  children,
  as: Component = 'div',
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = false,
  ...props
}: ScreenReaderOnlyProps) {
  return (
    <Component
      className="sr-only"
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      {...props}
    >
      {children}
    </Component>
  )
}

// Live Region for dynamic content announcements
interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  clearAfter?: number
}

export function LiveRegion({ message, priority = 'polite', clearAfter = 5000 }: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message)

  useEffect(() => {
    setCurrentMessage(message)
    
    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setCurrentMessage('')
      }, clearAfter)
      
      return () => clearTimeout(timer)
    }
  }, [message, clearAfter])

  return (
    <ScreenReaderOnly aria-live={priority} aria-atomic={true}>
      {currentMessage}
    </ScreenReaderOnly>
  )
}

// Skip Link component for keyboard navigation
interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </a>
  )
}

// Focus Management hook and component
export function useFocusManagement() {
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null)

  const captureFocus = () => {
    setLastFocusedElement(document.activeElement as HTMLElement)
  }

  const restoreFocus = () => {
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus()
    }
  }

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    return () => container.removeEventListener('keydown', handleTabKey)
  }

  return { captureFocus, restoreFocus, trapFocus }
}

// Accessible Modal component
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function AccessibleModal({ isOpen, onClose, title, children, className }: AccessibleModalProps) {
  const { captureFocus, restoreFocus, trapFocus } = useFocusManagement()

  useEffect(() => {
    if (isOpen) {
      captureFocus()
      document.body.style.overflow = 'hidden'
      
      // Focus the modal when it opens
      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      if (modal) {
        modal.focus()
        const cleanup = trapFocus(modal)
        return () => {
          cleanup()
          document.body.style.overflow = ''
          restoreFocus()
        }
      }
    }
  }, [isOpen, captureFocus, restoreFocus, trapFocus])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card
              className={`max-w-lg w-full max-h-[90vh] overflow-auto ${className}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="modal-title" className="text-lg font-semibold">
                    {title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {children}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Accessibility Settings Panel
interface AccessibilitySettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [fontSize, setFontSize] = useState('medium')

  useEffect(() => {
    // Apply accessibility settings to document
    if (reducedMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0s')
    } else {
      document.documentElement.style.removeProperty('--motion-duration')
    }

    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    document.documentElement.setAttribute('data-font-size', fontSize)
  }, [reducedMotion, highContrast, fontSize])

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility Settings"
    >
      <div className="space-y-6">
        <LiveRegion message={isOpen ? 'Accessibility settings opened' : ''} />
        
        {/* Motion Settings */}
        <div className="space-y-3">
          <h3 className="font-medium">Motion & Animation</h3>
          <label className="flex items-center justify-between">
            <span>Reduce motion</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="sr-only"
              aria-describedby="motion-help"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-pressed={reducedMotion}
              aria-describedby="motion-help"
            >
              {reducedMotion ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </label>
          <p id="motion-help" className="text-sm text-muted-foreground">
            Reduces animations and transitions for users sensitive to motion
          </p>
        </div>

        {/* Visual Settings */}
        <div className="space-y-3">
          <h3 className="font-medium">Visual</h3>
          <label className="flex items-center justify-between">
            <span>High contrast mode</span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="sr-only"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHighContrast(!highContrast)}
              aria-pressed={highContrast}
            >
              {highContrast ? 'On' : 'Off'}
            </Button>
          </label>
          
          <div className="space-y-2">
            <label htmlFor="font-size">Font size</label>
            <select
              id="font-size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="space-y-3">
          <h3 className="font-medium">Audio</h3>
          <label className="flex items-center justify-between">
            <span>Enable speech synthesis</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              aria-pressed={speechEnabled}
            >
              {speechEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onClose} className="flex-1">
            Save Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setReducedMotion(false)
              setHighContrast(false)
              setSpeechEnabled(true)
              setFontSize('medium')
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </AccessibleModal>
  )
}

// Keyboard Navigation Helper
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = (
    e: React.KeyboardEvent,
    items: HTMLElement[],
    options: {
      onEnter?: (index: number) => void
      onEscape?: () => void
      loop?: boolean
    } = {}
  ) => {
    const { onEnter, onEscape, loop = true } = options

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => {
          const next = prev + 1
          const newIndex = loop ? next % items.length : Math.min(next, items.length - 1)
          items[newIndex]?.focus()
          return newIndex
        })
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => {
          const next = prev - 1
          const newIndex = loop ? (next + items.length) % items.length : Math.max(next, 0)
          items[newIndex]?.focus()
          return newIndex
        })
        break
      
      case 'Enter':
        e.preventDefault()
        onEnter?.(focusedIndex)
        break
      
      case 'Escape':
        e.preventDefault()
        onEscape?.()
        break
    }
  }

  return { focusedIndex, setFocusedIndex, handleKeyDown }
}
