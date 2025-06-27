import React from 'react'
import { Community } from '@/models/Community'
import { 
  ContentCard, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  Badge, 
  Button 
} from '@mumicah/ui'

interface CommunityCardProps {
  community: Community
  isJoined: boolean
  onJoin: () => void
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  isJoined,
  onJoin
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'default'
      case 'intermediate':
        return 'secondary'
      case 'advanced':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <ContentCard className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{community.name}</h3>
            <p className="text-sm text-gray-600">{community.language} • {community.category}</p>
          </div>
          <Badge variant={getDifficultyColor(community.difficulty)}>
            {community.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="paragraph-regular content-secondary mb-4">
          {community.description}
        </p>
        
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {community.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
            {community.tags.length > 3 && (
              <Badge variant="default">
                +{community.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="flex items-center space-x-1 content-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span className="small-medium">{community.memberCount} members</span>
        </div>
        
        <Button
          variant={isJoined ? "outline" : "default"}
          size="sm"
          onClick={onJoin}
        >
          {isJoined ? 'Leave' : 'Join'}
        </Button>
      </CardFooter>
    </ContentCard>
  )
}
