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
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Communities', href: '/communities', icon: UserGroupIcon },
  { name: 'Conversations', href: '/dashboard/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Progress', href: '/dashboard/progress', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardNavigation() {
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-blue-600">Mumicah</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={classNames(
                      pathname === item.href
                        ? 'text-gray-500 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center px-2 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md w-full"
            >
              <ArrowRightOnRectangleIcon className="mr-4 h-6 w-6 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-blue-600">Mumicah</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      pathname === item.href
                        ? 'text-gray-500 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={handleSignOut}
              className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md w-full"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  )
}
