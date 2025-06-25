import { Community } from '@/models/Community'
import Link from 'next/link'

interface CommunityCardProps {
  community: Community
  isJoined: boolean
  onJoin: () => void
}

export function CommunityCard({ community, isJoined, onJoin }: CommunityCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Japanese': '🇯🇵',
      'Korean': '🇰🇷',
      'Chinese': '🇨🇳',
      'Arabic': '🇸🇦',
      'Russian': '🇷🇺'
    }
    return flags[language] || '🌍'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <div className="p-6">        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/communities/${community._id}`} className="flex items-center space-x-2 group">
            <span className="text-2xl">{getLanguageFlag(community.language)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {community.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {community.language}
              </p>
            </div>
          </Link>
          {community.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(community.difficulty)}`}>
              {community.difficulty}
            </span>
          )}
        </div>{/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {community.description.length > 120 
            ? `${community.description.substring(0, 120)}...` 
            : community.description
          }
        </p>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {community.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {community.tags.length > 3 && (
              <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                +{community.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>{community.memberCount} members</span>
            </div>
            {community.category && (
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{community.category}</span>
              </div>
            )}
          </div>

          <button
            onClick={onJoin}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isJoined
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isJoined ? 'Joined' : 'Join'}
          </button>
        </div>

        {/* Activity Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <div className={`h-2 w-2 rounded-full ${community.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span>{community.isActive ? 'Active' : 'Quiet'}</span>
            </div>
            <span>
              Created {community.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
