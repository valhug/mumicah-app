'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AuthPageContainer,
  AuthCard,
  AuthHeader,
  AuthForm,
  AuthInputGroup,
  AuthInput,
  AuthButton,
  SocialAuthButton,
  AuthDivider,
  AuthLink,
  AuthError,
  AuthSuccess
} from '@mumicah/ui'

// Google Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Development bypass for testing - use API endpoint
      if (email === 'demo@conversate.dev' && password === 'dev-user-123') {
        console.log('Using development bypass...')
        
        const response = await fetch('/api/dev-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          console.log('Development login successful')
          router.push('/dashboard')
          return
        } else {
          throw new Error(result.error || 'Development login failed')
        }
      }

      // Regular Supabase authentication
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      setMagicLinkSent(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <AuthPageContainer>
        <AuthCard>
          <AuthSuccess
            title="Check your email"
            message={`We've sent a magic link to ${email}. Click the link in your email to sign in to your account.`}
            action={
              <AuthButton
                variant="outline"
                onClick={() => setMagicLinkSent(false)}
              >
                Back to login
              </AuthButton>
            }
          />
        </AuthCard>
      </AuthPageContainer>
    )
  }

  return (
    <AuthPageContainer>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to your account to continue your language learning journey"
        />

        <AuthError message={error} />

        <div className="space-y-4">
          {/* Google Login */}
          <SocialAuthButton
            icon={<GoogleIcon />}
            provider="Google"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
          />

          <AuthDivider />

          {/* Email/Password Form */}
          <AuthForm onSubmit={handleEmailLogin}>
            <AuthInputGroup label="Email address">
              <AuthInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </AuthInputGroup>

            <AuthInputGroup label="Password">
              <AuthInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </AuthInputGroup>

            <div className="flex justify-end">
              <Link href="/forgot-password">
                <AuthLink href="/forgot-password">
                  Forgot your password?
                </AuthLink>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-bold mb-2">
                  🚀 DEVELOPMENT MODE ACTIVE
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Use these credentials to test Priority 2 features:
                </p>
                <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">
                  Email: demo@conversate.dev<br />
                  Password: dev-user-123
                </div>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                  This will bypass authentication and go directly to dashboard
                </p>
              </div>
              
              <AuthButton
                type="submit"
                isLoading={isLoading}
              >
                Sign in
              </AuthButton>

              <AuthButton
                type="button"
                variant="outline"
                onClick={handleMagicLink}
                isLoading={isLoading}
                disabled={!email}
              >
                Send magic link
              </AuthButton>
            </div>
          </AuthForm>

          <div className="text-center">
            <span className="body-regular content-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup">
                <AuthLink href="/signup">
                  Sign up
                </AuthLink>
              </Link>
            </span>
          </div>
        </div>
      </AuthCard>
    </AuthPageContainer>
  )
}
