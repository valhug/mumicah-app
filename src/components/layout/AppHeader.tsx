'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function AppHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">🗣️</div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Mumicah
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/communities" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Communities
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
