import { PageContainer } from '@mumicah/ui'
import StudyGroups from '@/components/features/StudyGroups'

export default function StudyGroupsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
          <p className="text-gray-600">Join study groups and practice with fellow learners</p>
        </div>
        <StudyGroups />
      </div>
    </PageContainer>
  )
}
