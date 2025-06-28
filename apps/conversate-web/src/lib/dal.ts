// lib/dal.ts (Data Access Layer)
import 'server-only'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }
  
  return { isAuth: true, userId: session.user.id, user: session.user }
})

export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) return null
  
  // Return the NextAuth user object
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    // Add any additional profile data if needed
    created_at: new Date().toISOString(), // Placeholder
    updated_at: new Date().toISOString()  // Placeholder
  }
})

export const getSession = cache(async () => {
  return await getServerSession(authOptions)
})
