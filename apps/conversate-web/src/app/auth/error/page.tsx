'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification link was invalid or has expired.',
  Default: 'An error occurred during authentication.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const errorMessage = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.Default : ERROR_MESSAGES.Default

  const handleRetry = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 flex items-center justify-center gap-2"
              variant="outline"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Button>
          </div>

          {error && (
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <strong>Error Code:</strong> {error}
            </div>
          )}

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}
