// Test page with minimal UI library import
import { Button } from '@mumicah/ui'

export default function TestUIPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-8">Test UI Import</h1>
      <p className="text-gray-600 mb-4">
        Testing single component import from @mumicah/ui
      </p>
      <Button>Test Button from UI Library!</Button>
    </div>
  )
}
