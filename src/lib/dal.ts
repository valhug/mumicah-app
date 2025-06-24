// lib/dal.ts (Data Access Layer)
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  return { isAuth: true, userId: user.id, user }
})

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get additional profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { ...user, profile }
})

export const getSession = cache(async () => {
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  return session
})
