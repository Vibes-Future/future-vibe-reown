'use client'

import { useEffect } from 'react'
import { initializeSolanaPolyfills } from '@/lib/solana-web3-polyfill'

interface BNPolyfillProviderProps {
  children: React.ReactNode
}

export default function BNPolyfillProvider({ children }: BNPolyfillProviderProps) {
  useEffect(() => {
    // Inicializar todos los polyfills de Solana tan pronto como se monte el componente
    initializeSolanaPolyfills()
  }, [])

  return <>{children}</>
}
