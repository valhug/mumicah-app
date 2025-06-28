import { getCurrentUser } from '@/lib/dal'
import { UserService } from '@/services/user.service'
import DashboardClient from '@/components/features/DashboardClient'

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard.</p>
          <a href="/login" className="text-primary hover:underline">Go to Login</a>
        </div>
      </div>
    )
  }

  const userService = new UserService()
  
  // Fetch user data in parallel
  const [userStats, recentActivity] = await Promise.all([
    userService.getUserStats(currentUser.id).catch(() => null),
    userService.getUserActivity(currentUser.id, 10).catch(() => [])
  ])

  // Safe display name extraction  
  const displayName = currentUser?.email || 'User'

  return (
    <DashboardClient 
      currentUser={currentUser}
      userStats={userStats}
      recentActivity={recentActivity}
      displayName={displayName}
    />
  )
}
