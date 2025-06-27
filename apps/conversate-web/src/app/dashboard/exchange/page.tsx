import { PageContainer } from '@mumicah/ui'
import LanguageExchange from '@/components/features/LanguageExchange'

export default function LanguageExchangePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Language Exchange</h1>
          <p className="text-gray-600">Connect with native speakers and practice languages together</p>
        </div>
        <LanguageExchange />
      </div>
    </PageContainer>
  )
}
