'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DevTestPage() {
  const [debug, setDebug] = useState('')
  const router = useRouter()

  const testDevBypass = () => {
    const isDev = process.env.NODE_ENV === 'development' || 
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1'
    
    const debugInfo = {
      NODE_ENV: process.env.NODE_ENV,
      hostname: window.location.hostname,
      isDev,
      location: window.location.href
    }
    
    setDebug(JSON.stringify(debugInfo, null, 2))
    
    if (isDev) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg border">
        <h1 className="text-2xl font-bold text-center">Development Test</h1>
        
        <button 
          onClick={testDevBypass}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Dev Bypass → Dashboard
        </button>
        
        <a 
          href="/dashboard"
          className="block w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-center"
        >
          Direct Dashboard Link
        </a>
        
        <a 
          href="/login"
          className="block w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
        >
          Go to Login Page
        </a>
        
        {debug && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-auto">{debug}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
