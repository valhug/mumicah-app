'use client'

import { Card } from '@mumicah/ui'
import { User, Mail, Globe, Calendar, Badge } from 'lucide-react'

export default function ProfilePage() {
  const userProfile = {
    name: 'Demo User',
    email: 'demo@example.com',
    joinDate: 'January 2024',
    languages: ['English', 'Spanish', 'Japanese'],
    level: 'Intermediate',
    totalConversations: 42,
    streakDays: 7
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{userProfile.joinDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Languages</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userProfile.languages.map((language) => (
                    <span
                      key={language}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Level</span>
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{userProfile.level}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Conversations</span>
              <span className="font-medium">{userProfile.totalConversations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Streak</span>
              <span className="font-medium">{userProfile.streakDays} days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">More Profile Features Coming Soon!</h3>
          <p className="text-gray-600">We&apos;re working on adding profile customization, learning preferences, and more.</p>
        </div>
      </Card>
    </div>
  )
}
