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
  AuthError
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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const router = useRouter()

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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/chat')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (providerId: string) => {
    setIsLoading(true)
    setError('')

    try {
      await signIn(providerId, { 
        callbackUrl: '/chat',
        redirect: true 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth login failed'
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
  return (
    <AuthPageContainer>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AuthCard>
          <motion.div variants={itemVariants}>
            <AuthHeader
              title="Welcome back"
              subtitle="Sign in to your account to continue your language learning journey"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AuthError message={error} />
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>            {/* OAuth Providers */}
            {providers && Object.values(providers).length > 0 && (
              <motion.div className="space-y-3" variants={itemVariants}>
                {Object.values(providers).map((provider, index) => (
                  <motion.div 
                    key={provider.name}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SocialAuthButton
                      icon={getProviderIcon(provider.id)}
                      provider={provider.name}
                      onClick={() => handleOAuthLogin(provider.id)}
                      isLoading={isLoading}
                      className={getProviderButtonClass(provider.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <AuthDivider />
            </motion.div>

            {/* Email/Password Form */}
            <motion.div variants={itemVariants}>
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
              <AuthButton
                type="submit"
                isLoading={isLoading}
              >
                Sign in
              </AuthButton>

              <AuthButton
                type="button"
                variant="outline"
                onClick={() => router.push('/chat')}
                isLoading={isLoading}
              >
                Continue as Guest
              </AuthButton>
            </div>
              </AuthForm>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <span className="body-regular content-secondary">
                Don&apos;t have an account?{' '}
                <Link href="/signup">
                  <AuthLink href="/signup">
                    Sign up
                  </AuthLink>
                </Link>
              </span>
            </motion.div>
          </motion.div>
        </AuthCard>
      </motion.div>
    </AuthPageContainer>
  )
}
