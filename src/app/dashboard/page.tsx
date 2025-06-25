import { getCurrentUser } from '@/lib/dal'
import { UserService } from '@/services/user.service'
import DashboardStats from '@/components/features/DashboardStats'
import RecentActivity from '@/components/features/RecentActivity'
import QuickActions from '@/components/features/QuickActions'

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return <div>Loading...</div>
  }

  const userService = new UserService()
  
  // Fetch user data in parallel
  const [userStats, recentActivity] = await Promise.all([
    userService.getUserStats(currentUser.id).catch(() => null),
    userService.getUserActivity(currentUser.id, 10).catch(() => [])
  ])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {currentUser.profile?.display_name || currentUser.email}!
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Continue your language learning journey
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={userStats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivity} />
        
        {/* Learning Goals */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Learning Goals
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Weekly conversation goal</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">3/5 sessions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly community posts</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">8/10 posts</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
