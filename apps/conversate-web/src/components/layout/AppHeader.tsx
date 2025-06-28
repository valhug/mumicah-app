'use client'

import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AppHeader() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const user = session?.user

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login', redirect: true })
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass border-b border-border/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="text-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              🗣️
            </motion.div>
            <span className="text-xl font-bold text-brand group-hover:text-brand transition-colors">
              Mumicah
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link 
                href="/communities" 
                className="content-secondary hover:text-brand px-3 py-2 text-sm font-medium transition-colors"
              >
                Communities
              </Link>
            </motion.div>
            {user && (
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link 
                  href="/dashboard" 
                  className="content-secondary hover:text-brand px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </motion.div>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 surface-secondary rounded-full animate-pulse"></div>
            ) : user ? (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/dashboard"
                  className="content-secondary hover:content-primary text-sm transition-colors"
                >
                  {user.name || user.email?.split('@')[0]}
                </Link>
                <motion.button
                  onClick={handleSignOut}
                  className="content-tertiary hover:content-secondary text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign out
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/login"
                  className="content-secondary hover:text-brand px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
