'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User } from 'lucide-react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {session.user?.name || session.user?.email || 'User'}
          </span>
        </div>
        <Button
          onClick={() => signOut()}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => signIn()}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  )
}
