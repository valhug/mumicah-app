'use client'

import { useState, useEffect } from 'react'
import { signIn, getProviders, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
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

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

// Google Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

// GitHub Icon Component  
const GitHubIcon = () => <Github className="w-5 h-5" />

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }
  const [signupSent, setSignupSent] = useState(false)
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeProviders = async () => {
      // Check if user is already signed in
      const session = await getSession()
      if (session) {
        router.push('/chat')
        return
      }

      // Get available providers
      const res = await getProviders()
      console.log('Available providers:', res)
      
      // Filter out credentials provider from OAuth providers list
      const oauthProviders = res ? Object.fromEntries(
        Object.entries(res).filter(([, provider]) => provider.type === 'oauth')
      ) : null
      
      console.log('OAuth providers only:', oauthProviders)
      setProviders(oauthProviders)
    }

    initializeProviders()
  }, [router])

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
      // Use NextAuth credentials registration
      const result = await signIn('credentials', {
        email,
        password,
        displayName,
        isSignup: 'true', // Flag to indicate this is a signup request
        redirect: false,
      })

      if (result?.error) {
        setError('Account creation failed. Please try again.')
      } else {
        setSignupSent(true)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignup = async (providerId: string) => {
    setIsLoading(true)
    setError('')

    try {
      await signIn(providerId, { 
        callbackUrl: '/chat',
        redirect: true 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth registration failed'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <GitHubIcon />
      case 'google':
        return <GoogleIcon />
      default:
        return <GoogleIcon />
    }
  }

  const getProviderButtonClass = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'bg-gray-900 hover:bg-gray-800 text-white border-gray-700'
      case 'google':
        return 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
    }
  }

  if (signupSent) {
    return (
      <AuthPageContainer>
        <AuthCard>
          <AuthSuccess
            title="Account created successfully!"
            message={`Welcome to Conversate! Your account has been created and you can now start your language learning journey.`}
            action={
              <Link href="/chat">
                <AuthButton>
                  Start Learning
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
          {/* OAuth Providers */}
          {providers && Object.values(providers).length > 0 && (
            <div className="space-y-3">
              {Object.values(providers).map((provider) => (
                <SocialAuthButton
                  key={provider.name}
                  icon={getProviderIcon(provider.id)}
                  provider={provider.name}
                  onClick={() => handleOAuthSignup(provider.id)}
                  isLoading={isLoading}
                  className={getProviderButtonClass(provider.id)}
                />
              ))}
            </div>
          )}

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
