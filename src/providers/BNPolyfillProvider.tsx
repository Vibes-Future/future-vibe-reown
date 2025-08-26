'use client'

import { useEffect } from 'react'
import { initializeSolanaPolyfills } from '@/lib/solana-web3-polyfill'

interface BNPolyfillProviderProps {
  children: React.ReactNode
}

export default function BNPolyfillProvider({ children }: BNPolyfillProviderProps) {
  useEffect(() => {
    // Initialize all Solana polyfills as soon as the component mounts
    initializeSolanaPolyfills()
  }, [])

  return <>{children}</>
}
