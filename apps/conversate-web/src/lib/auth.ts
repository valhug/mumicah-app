import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// Helper function to check if credentials are properly configured
const hasValidCredentials = (id?: string, secret?: string) => {
  return id && secret && !id.includes('your_') && !secret.includes('your_') && id.length > 10
}

// Debug logging for providers
console.log('Auth providers debug:', {
  hasValidGitHub: hasValidCredentials(process.env.GITHUB_ID, process.env.GITHUB_SECRET),
  hasValidGoogle: hasValidCredentials(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET),
  gitHubIdSet: !!process.env.GITHUB_ID,
  googleIdSet: !!process.env.GOOGLE_CLIENT_ID
})

// Build providers array dynamically based on available credentials
const providers = []

// Add Credentials provider for email/password authentication
providers.push(
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      displayName: { label: 'Display Name', type: 'text' },
      isSignup: { label: 'Is Signup', type: 'text' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      const isSignup = credentials.isSignup === 'true'

      if (isSignup) {
        // Handle signup - in production, you'd create the user in your database
        console.log('Processing signup for:', credentials.email)
        
        // Basic validation
        if (credentials.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }

        // Create new user (for now, just return the user object)
        // In production, you'd save to database and return the created user
        return {
          id: `signup_${Date.now()}`, // Temporary ID generation
          name: credentials.displayName || credentials.email.split('@')[0],
          email: credentials.email,
        }
      } else {
        // Handle login - validate existing user
        // For now, we'll use a simple demo user validation
        // In production, you'd validate against your database
        if (credentials.email === 'demo@conversate.dev' && credentials.password === 'dev-user-123') {
          return {
            id: '1',
            name: 'Demo User',
            email: 'demo@conversate.dev',
          }
        }

        // You can add more user validation logic here
        // For example, checking against a database or external API
        
        return null
      }
    }
  })
)

// Add GitHub provider if credentials are valid
if (hasValidCredentials(process.env.GITHUB_ID, process.env.GITHUB_SECRET)) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'user:email',
        },
      },
    })
  )
}

// Add Google provider if credentials are valid
if (hasValidCredentials(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    })
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn() {
      // Allow sign in for any user with valid provider
      // In the future, you can add logic here to check if user exists in your database
      // and link accounts with the same email address
      return true
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      // Ensure we always have the email from the token
      if (token?.email && session?.user) {
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ user, token, account, profile }) {
      if (user) {
        token.uid = user.id
        // Store email in token for consistent access
        if (user.email) {
          token.email = user.email
        }
      }
      
      // Handle account linking - use email as the primary identifier
      if (account && profile) {
        // For OAuth providers, use the email from the profile
        if (account.type === 'oauth' && profile?.email) {
          token.email = profile.email
        }
      }
      
      return token
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl + '/chat'
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}