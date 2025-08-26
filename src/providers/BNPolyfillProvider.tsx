'use client'

import { useEffect, useState } from 'react'
import { initializeSolanaPolyfills } from '@/lib/solana-web3-polyfill'

interface BNPolyfillProviderProps {
  children: React.ReactNode
}

export default function BNPolyfillProvider({ children }: BNPolyfillProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize all Solana polyfills as soon as the component mounts
    const initPolyfills = async () => {
      try {
        await initializeSolanaPolyfills()
        setIsInitialized(true)
        console.log('✅ BNPolyfillProvider: Solana polyfills initialized successfully')
      } catch (error) {
        console.error('❌ BNPolyfillProvider: Failed to initialize polyfills:', error)
        // Still set as initialized to avoid blocking the app
        setIsInitialized(true)
      }
    }

    initPolyfills()
  }, [])

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1 mx-auto mb-4"></div>
          <p className="text-primary-1 font-medium">Initializing Solana polyfills...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
