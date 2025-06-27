import { redirect } from 'next/navigation'

export default function DevDashboardPage() {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    redirect('/login')
  }

  // Redirect to dashboard with mock session
  redirect('/dashboard')
}
