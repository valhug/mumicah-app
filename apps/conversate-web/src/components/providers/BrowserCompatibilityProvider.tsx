'use client'

import { useEffect, useState } from 'react'
import { browserCompatibility } from '@/services/browser-compatibility.service'
import { useToast } from '@/components/common/Toast'
import { Button } from '@mumicah/ui'
import { AlertTriangle, Chrome, Globe } from 'lucide-react'

interface BrowserCompatibilityProviderProps {
  children: React.ReactNode
}

export function BrowserCompatibilityProvider({ children }: BrowserCompatibilityProviderProps) {
  const [isChecked, setIsChecked] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const { warning, error } = useToast()

  useEffect(() => {
    // Initialize browser compatibility checking
    const initCompatibilityCheck = async () => {
      try {
        const browserInfo = browserCompatibility.init()
        const report = browserCompatibility.getCompatibilityReport()

        // Check if browser meets minimum requirements
        if (!browserCompatibility.meetsMinimumRequirements()) {
          setShowWarning(true)
          error(
            'Browser Not Supported',
            'Your browser may not support all features. Please consider upgrading.',
            {
              persistent: true,
              action: {
                label: 'More Info',
                onClick: () => window.open('https://browsehappy.com/', '_blank')
              }
            }
          )
        } else if (browserInfo.recommendedAction === 'warn') {
          warning(
            'Limited Browser Support',
            'Some advanced features may not work properly in your browser.',
            {
              action: {
                label: 'Details',
                onClick: () => console.log('Browser compatibility:', report)
              }
            }
          )
        }

        // Load polyfills for missing features
        try {
          await browserCompatibility.loadPolyfills()
          browserCompatibility.applyFallbacks()
        } catch (polyfillError) {
          console.warn('Some polyfills failed to load:', polyfillError)
        }

        setIsChecked(true)
      } catch (compatibilityError) {
        console.error('Browser compatibility check failed:', compatibilityError)
        setIsChecked(true) // Still allow app to load
      }
    }

    initCompatibilityCheck()
  }, [warning, error])

  // Show loading state while checking compatibility
  if (!isChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Checking browser compatibility...</p>
        </div>
      </div>
    )
  }

  // Show browser compatibility warning modal if needed
  if (showWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <h1 className="text-xl font-bold">Browser Not Supported</h1>
          </div>
          
          <p className="text-muted-foreground">
            Your browser doesn&apos;t support all the features required for the best experience. 
            Some functionality may be limited or not work properly.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium">Recommended browsers:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
                className="flex items-center gap-2"
              >
                <Chrome className="w-4 h-4" />
                Chrome
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.mozilla.org/firefox/', '_blank')}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Firefox
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="flex-1"
            >
              Continue Anyway
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
