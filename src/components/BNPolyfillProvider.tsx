'use client'

import { useEffect } from 'react'
import { initializeBNPolyfill } from '@/lib/bn-polyfill'

interface BNPolyfillProviderProps {
  children: React.ReactNode
}

export default function BNPolyfillProvider({ children }: BNPolyfillProviderProps) {
  useEffect(() => {
    // Inicializar el polyfill de BN tan pronto como se monte el componente
    initializeBNPolyfill()
  }, [])

  return <>{children}</>
}
