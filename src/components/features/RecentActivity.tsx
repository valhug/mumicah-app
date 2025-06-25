import { formatDistanceToNow } from 'date-fns'

interface Activity {
  _id: string
  action: string
  timestamp: Date
  targetType?: string
  targetId?: string
  metadata?: Record<string, any>
}

interface RecentActivityProps {
  activities: Activity[]
}

function getActivityIcon(action: string) {
  switch (action) {
    case 'profile_created':
    case 'profile_updated':
      return (
        <div className="bg-blue-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )
    case 'community_joined':
      return (
        <div className="bg-green-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      )
    case 'post_created':
      return (
        <div className="bg-purple-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      )
    case 'conversation_started':
      return (
        <div className="bg-orange-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className="bg-gray-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
  }
}

function getActivityDescription(action: string, metadata?: Record<string, any>) {
  switch (action) {
    case 'profile_created':
      return 'Created your profile'
    case 'profile_updated':
      return 'Updated profile information'
    case 'community_joined':
      return 'Joined a language community'
    case 'post_created':
      return 'Created a new post'
    case 'conversation_started':
      return 'Started a conversation'
    case 'friend_added':
      return 'Connected with a language partner'
    default:
      return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No recent activity yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start by joining a community or starting a conversation!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity._id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getActivityDescription(activity.action, activity.metadata)}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
