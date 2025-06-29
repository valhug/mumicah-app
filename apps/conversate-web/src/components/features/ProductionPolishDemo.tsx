'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { Button } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Wifi, 
  Volume2,
  Trophy,
  Users,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/components/common/Toast'
import { errorHandler } from '@/services/error-handling.service'
import { browserCompatibility } from '@/services/browser-compatibility.service'
import { voiceService } from '@/services/voice-service'

interface ProductionPolishDemoProps {
  className?: string
}

export function ProductionPolishDemo({ className = '' }: ProductionPolishDemoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { success, error, warning, info } = useToast()

  // Demo various error handling scenarios
  const demoNetworkError = async () => {
    setIsLoading(true)
    try {
      // Simulate network error
      const mockError = new Error('Network request failed')
      mockError.name = 'NetworkError'
      
      const handledError = errorHandler.handleError(mockError, {
        showToast: false,
        logToConsole: true
      })

      console.log('Demo error handled:', handledError)

      error(
        'Network Error Demo',
        'This demonstrates how network errors are handled gracefully',
        {
          action: {
            label: 'Retry',
            onClick: () => success('Retry Success', 'Network operation completed successfully')
          }
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const demoVoiceError = async () => {
    try {
      // Test voice service availability
      if (!voiceService.isVoiceSupported()) {
        warning(
          'Voice Not Supported',
          'Your browser doesn\'t support voice features',
          {
            action: {
              label: 'Learn More',
              onClick: () => window.open('https://caniuse.com/speech-synthesis', '_blank')
            }
          }
        )
        return
      }

      success('Voice Available', 'Voice features are ready to use!')
    } catch (err) {
      const handledError = errorHandler.handleError(err as Error, {
        showToast: false
      })
      
      error('Voice Error', handledError.message)
    }
  }

  const demoBrowserCompatibility = () => {
    const report = browserCompatibility.getCompatibilityReport()
    
    if (report.unsupported.length === 0) {
      success(
        'Fully Compatible',
        `Your ${report.browser.name} browser supports all features!`,
        { duration: 4000 }
      )
    } else {
      warning(
        'Limited Compatibility',
        `${report.unsupported.length} features may not work properly`,
        {
          action: {
            label: 'Details',
            onClick: () => {
              console.log('Compatibility Report:', report)
              info('Check Console', 'Full compatibility report logged to console')
            }
          }
        }
      )
    }
  }

  const demoAchievementUnlock = () => {
    success(
      '🎉 Achievement Unlocked!',
      'Production Polish Master: You\'ve successfully tested all error handling features!',
      {
        duration: 6000,
        action: {
          label: 'View Achievements',
          onClick: () => info('Navigation', 'Would navigate to achievements page')
        }
      }
    )
  }

  const demoConnectionError = () => {
    error(
      'Connection Lost',
      'Unable to reach the server. Please check your internet connection.',
      {
        persistent: true,
        action: {
          label: 'Retry Connection',
          onClick: () => {
            success('Connected', 'Connection restored successfully!')
          }
        }
      }
    )
  }

  const demoProgressNotification = () => {
    info(
      '📈 Progress Update',
      'You\'re making great progress! Keep up the excellent work.',
      {
        duration: 5000,
        action: {
          label: 'View Stats',
          onClick: () => info('Stats', 'Would show detailed progress statistics')
        }
      }
    )
  }

  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Error Boundaries',
      description: 'Graceful error recovery',
      status: 'active',
      demo: demoNetworkError
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Toast Notifications',
      description: 'User-friendly feedback',
      status: 'active',
      demo: demoProgressNotification
    },
    {
      icon: <Wifi className="w-5 h-5" />,
      title: 'Browser Compatibility',
      description: 'Cross-browser support',
      status: 'active',
      demo: demoBrowserCompatibility
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      title: 'Voice Error Handling',
      description: 'Robust voice features',
      status: 'active',
      demo: demoVoiceError
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: 'Achievement System',
      description: 'Gamified notifications',
      status: 'active',
      demo: demoAchievementUnlock
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Connection Errors',
      description: 'Network issue handling',
      status: 'active',
      demo: demoConnectionError
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Production Polish Features
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive demonstration of error handling, notifications, and user experience features
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-primary">
                {feature.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} />
                </div>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={feature.demo}
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  'Demo'
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">All systems operational</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Production Ready
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            This dashboard demonstrates robust error handling, user feedback systems, 
            browser compatibility checks, and graceful degradation of features.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Enhanced User Experience
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Features include: Error boundaries, toast notifications, browser compatibility checks, 
                retry mechanisms, loading states, accessibility support, and graceful error recovery.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
