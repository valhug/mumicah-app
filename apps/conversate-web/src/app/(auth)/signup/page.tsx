'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSent, setSignupSent] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
          }
        }
      })

      if (error) throw error

      setSignupSent(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (signupSent) {
    return (
      <AuthPageContainer>
        <AuthCard>
          <AuthSuccess
            title="Check your email"
            message={`We've sent a confirmation link to ${email}. Click the link in your email to activate your account and get started.`}
            action={
              <Link href="/login">
                <AuthButton variant="outline">
                  Back to login
                </AuthButton>
              </Link>
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
          title="Join our community"
          subtitle="Start your language learning journey with native speakers"
        />

        <AuthError message={error} />

        <div className="space-y-4">
          {/* Google Signup */}
          <SocialAuthButton
            icon={<GoogleIcon />}
            provider="Google"
            onClick={handleGoogleSignup}
            isLoading={isLoading}
          />

          <AuthDivider text="Or sign up with email" />

          {/* Email/Password Form */}
          <AuthForm onSubmit={handleSignup}>
            <AuthInputGroup label="Display Name">
              <AuthInput
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should others see you?"
              />
            </AuthInputGroup>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </AuthInputGroup>

            <AuthInputGroup label="Confirm Password">
              <AuthInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                error={password !== confirmPassword && confirmPassword.length > 0}
              />
            </AuthInputGroup>

            <AuthButton
              type="submit"
              isLoading={isLoading}
            >
              Create account
            </AuthButton>
          </AuthForm>

          <div className="text-center">
            <span className="body-regular content-secondary">
              Already have an account?{' '}
              <Link href="/login">
                <AuthLink href="/login">
                  Sign in
                </AuthLink>
              </Link>
            </span>
          </div>

          <div className="small-medium content-tertiary text-center">
            By signing up, you agree to our{' '}
            <Link href="/terms">
              <AuthLink href="/terms">
                Terms of Service
              </AuthLink>
            </Link>{' '}
            and{' '}
            <Link href="/privacy">
              <AuthLink href="/privacy">
                Privacy Policy
              </AuthLink>
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthPageContainer>
  )
}
