import { getCurrentUser } from '@/lib/dal'
import { UserService } from '@/services/user.service'
import DashboardStats from '@/components/features/DashboardStats'
import RecentActivity from '@/components/features/RecentActivity'
import QuickActions from '@/components/features/QuickActions'
import DashboardWidgets from '@/components/features/DashboardWidgets'
import SharedPackageTest from '@/components/features/SharedPackageTest'
import { WelcomeSection } from '@mumicah/ui'

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection
        title={`Welcome back, ${displayName}!`}
        subtitle="Continue your language learning journey"
        status="active"
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Enhanced Dashboard with Widgets */}
      <DashboardWidgets userId={currentUser.id} />

      {/* Legacy Components (can be removed once widgets are fully tested) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Overview */}
        <DashboardStats stats={userStats} />
        
        {/* Recent Activity */}
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Shared Package Test (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <SharedPackageTest />
      )}
    </div>
  )
}
