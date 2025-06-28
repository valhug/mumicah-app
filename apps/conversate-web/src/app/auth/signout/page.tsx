'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto sign out after a short delay
    const timer = setTimeout(() => {
      signOut({ callbackUrl: '/', redirect: true })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/', redirect: true })
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Signed Out Successfully
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Thank you for using Conversate. You&apos;ll be redirected shortly.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleSignOut}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Out Now
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              variant="outline"
            >
              Go to Homepage
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Your learning progress has been saved and will be available when you sign back in.
          </p>
        </div>
      </div>
    </div>
  )
}
