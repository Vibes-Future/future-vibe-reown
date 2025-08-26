'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import { AppKitProvider as ReownAppKitProvider } from '@reown/appkit/react'
import { initializeAppKit } from '@/config/appkit'

interface Props {
  children: ReactNode
}

export function AppKitProvider({ children }: Props) {
  const [appKit, setAppKit] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Initialize AppKit safely
      const kit = initializeAppKit()
      setAppKit(kit)
      console.log('✅ AppKitProvider: AppKit initialized successfully')
    } catch (err) {
      console.error('❌ AppKitProvider: Failed to initialize AppKit:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">AppKit Initialization Failed</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while initializing
  if (!appKit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1 mx-auto mb-4"></div>
          <p className="text-primary-1 font-medium">Initializing AppKit...</p>
        </div>
      </div>
    )
  }
  
  return (
    <ReownAppKitProvider appKit={appKit}>
      {children}
    </ReownAppKitProvider>
  )
}
