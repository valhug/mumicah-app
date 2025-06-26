import { verifySession } from '@/lib/dal'
import { redirect } from 'next/navigation'
import DashboardNavigation from '@/components/layout/DashboardNavigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify user is authenticated
  try {
    await verifySession()
  } catch {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation>
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </DashboardNavigation>
    </div>
  )
}
