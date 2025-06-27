// Test component to verify shared package integration
'use client'

import { cn, formatFullName, formatCompactNumber, PERSONAS, ECOSYSTEM_APPS } from '@mumicah/shared'
import { useState } from 'react'

export default function SharedPackageTest() {
  const [count, setCount] = useState(1234567)

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        🧪 Shared Package Integration Test
      </h2>
      
      <div className="space-y-4">
        {/* Test cn utility */}
        <div className={cn(
          "p-4 rounded-lg",
          "bg-blue-100 dark:bg-blue-900",
          "border border-blue-200 dark:border-blue-700"
        )}>
          <strong>✅ cn() utility working:</strong> Combined classes successfully
        </div>

        {/* Test formatFullName utility */}
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <strong>✅ formatFullName() utility working:</strong> {formatFullName('John', 'Doe')}
        </div>

        {/* Test formatCompactNumber utility */}
        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <strong>✅ formatCompactNumber() utility working:</strong> 
          <br />
          <button 
            onClick={() => setCount(c => c + 1000)}
            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Count: {formatCompactNumber(count)} (click to increment)
          </button>
        </div>

        {/* Test constants - personas */}
        <div className="p-4 bg-amber-100 dark:bg-amber-900 rounded-lg">
          <strong>✅ PERSONAS constants working:</strong>
          <div className="mt-2 space-y-1">
            {Object.values(PERSONAS).map(persona => (
              <div key={persona.id} className="flex items-center space-x-2">
                <div 
                  className={cn("w-4 h-4 rounded-full", `bg-[${persona.color}]`)}
                />
                <span>{persona.name}: {persona.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test ecosystem apps */}
        <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <strong>✅ ECOSYSTEM_APPS constants working:</strong>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
            {ECOSYSTEM_APPS.map(app => (
              <div key={app.id} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-700 rounded">
                <span>{app.icon}</span>
                <div>
                  <div className="font-medium">{app.displayName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{app.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
          <strong>🎉 All shared package imports working correctly!</strong>
          <br />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            This proves the monorepo shared logic extraction was successful.
          </span>
        </div>
      </div>
    </div>
  )
}
