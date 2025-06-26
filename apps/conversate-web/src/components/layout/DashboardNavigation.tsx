'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  LightBulbIcon,
  CpuChipIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Personas', href: '/personas', icon: UserGroupIcon },
  { name: 'AI Insights', href: '/dashboard/ai-insights', icon: CpuChipIcon, priority: 3 },
  { name: 'Smart Suggestions', href: '/dashboard/suggestions', icon: LightBulbIcon, priority: 3 },
  { name: 'Language Feedback', href: '/dashboard/feedback', icon: BookOpenIcon, priority: 3 },
  { name: 'Language Exchange', href: '/dashboard/exchange', icon: GlobeAltIcon, priority: 4 },
  { name: 'Study Groups', href: '/dashboard/study-groups', icon: AcademicCapIcon, priority: 4 },
  { name: 'Challenges', href: '/dashboard/challenges', icon: TrophyIcon, priority: 4 },
  { name: 'Communities', href: '/communities', icon: UserGroupIcon },
  { name: 'Conversations', href: '/dashboard/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Progress', href: '/dashboard/progress', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardNavigation({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={classNames(
        sidebarOpen ? 'fixed inset-0 flex z-40 md:hidden' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-background border-r border-border">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-brand">Mumicah</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={classNames(
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center px-2 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md w-full transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-4 h-6 w-6" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-border bg-background">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-brand">Mumicah</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                  )}
                >
                  <item.icon
                    className={classNames(
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <button
              onClick={handleSignOut}
              className="group flex items-center px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md w-full transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-background">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
