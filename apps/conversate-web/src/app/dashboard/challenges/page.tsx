import { PageContainer } from '@mumicah/ui'
import CommunityFeatures from '@/components/features/CommunityFeatures'

export default function ChallengesPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Challenges</h1>
          <p className="text-gray-600">Participate in language learning challenges and compete with the community</p>
        </div>
        <CommunityFeatures />
      </div>
    </PageContainer>
  )
}
