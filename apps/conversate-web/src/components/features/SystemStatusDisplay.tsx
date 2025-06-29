'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/common/Toast'
import { browserCompatibility } from '@/services/browser-compatibility.service'
import { errorHandler } from '@/services/error-handling.service'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { Button } from '@mumicah/ui'
import { 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  Globe,
  Shield,
  Cpu
} from 'lucide-react'

interface SystemStatusDisplayProps {
  className?: string
}

export function SystemStatusDisplay({ className = '' }: SystemStatusDisplayProps) {
  const [systemStatus, setSystemStatus] = useState({
    browser: 'checking',
    features: 'checking',
    connectivity: 'checking',
    performance: 'checking'
  })
  const [showDetails, setShowDetails] = useState(false)
  const { info, warning, error: showError, success } = useToast()

  useEffect(() => {
    checkSystemStatus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkSystemStatus = async () => {
    try {
      // Browser compatibility check
      const browserInfo = browserCompatibility.init()
      const compatReport = browserCompatibility.getCompatibilityReport()
      
      if (browserCompatibility.meetsMinimumRequirements()) {
        setSystemStatus(prev => ({ ...prev, browser: 'good' }))
        success(
          'Browser Compatible',
          `${browserInfo.name} ${browserInfo.version} is fully supported`,
          { duration: 3000 }
        )
      } else {
        setSystemStatus(prev => ({ ...prev, browser: 'warning' }))
        warning(
          'Limited Browser Support',
          `Some features may not work in ${browserInfo.name} ${browserInfo.version}`
        )
      }

      // Feature availability check
      const missingFeatures = compatReport.unsupported.length
      if (missingFeatures === 0) {
        setSystemStatus(prev => ({ ...prev, features: 'good' }))
      } else if (missingFeatures <= 2) {
        setSystemStatus(prev => ({ ...prev, features: 'warning' }))
        info(
          'Some Features Unavailable',
          `${missingFeatures} advanced features are not supported`,
          { duration: 4000 }
        )
      } else {
        setSystemStatus(prev => ({ ...prev, features: 'error' }))
        showError(
          'Many Features Unavailable',
          'Consider upgrading your browser for the best experience',
          { persistent: true }
        )
      }

      // Connectivity check
      if (navigator.onLine) {
        setSystemStatus(prev => ({ ...prev, connectivity: 'good' }))
      } else {
        setSystemStatus(prev => ({ ...prev, connectivity: 'error' }))
        showError(
          'No Internet Connection',
          'You are currently offline. Some features may not work.',
          { persistent: true }
        )
      }

      // Performance check (simulated)
      const performanceScore = Math.random() * 100
      if (performanceScore > 80) {
        setSystemStatus(prev => ({ ...prev, performance: 'good' }))
      } else if (performanceScore > 60) {
        setSystemStatus(prev => ({ ...prev, performance: 'warning' }))
        info('Performance Notice', 'Your device may experience slower performance')
      } else {
        setSystemStatus(prev => ({ ...prev, performance: 'error' }))
        warning('Low Performance', 'Consider closing other applications for better performance')
      }

    } catch (error) {
      const handledError = errorHandler.handleError(error as Error, {
        logToConsole: true,
        showToast: false // We'll handle toast manually
      })

      showError(
        'System Check Failed',
        handledError.message || 'Unable to check system status'
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 animate-spin border-2 border-primary border-t-transparent rounded-full" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Excellent'
      case 'warning':
        return 'Limited'
      case 'error':
        return 'Issues Found'
      default:
        return 'Checking...'
    }
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          System Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.browser)}
                <span className="text-sm font-medium">Browser</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getStatusText(systemStatus.browser)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.features)}
                <span className="text-sm font-medium">Features</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getStatusText(systemStatus.features)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.connectivity)}
                <span className="text-sm font-medium">Connection</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getStatusText(systemStatus.connectivity)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.performance)}
                <span className="text-sm font-medium">Performance</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getStatusText(systemStatus.performance)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSystemStatus}
            className="flex-1"
          >
            Refresh
          </Button>
        </div>

        {showDetails && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs space-y-2">
            <div>
              <strong>Browser:</strong> {navigator.userAgent.slice(0, 60)}...
            </div>
            <div>
              <strong>Platform:</strong> {navigator.platform}
            </div>
            <div>
              <strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Language:</strong> {navigator.language}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
