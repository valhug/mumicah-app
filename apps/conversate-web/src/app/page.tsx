import { getCurrentUser } from '@/lib/dal'
import { redirect } from 'next/navigation'
import HomePageContent from '@/components/pages/HomePageContent'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return <HomePageContent />
}
