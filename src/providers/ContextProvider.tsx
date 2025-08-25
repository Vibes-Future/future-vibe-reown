'use client'

// Context provider for Reown AppKit and application state
import React, { ReactNode } from 'react'
import '@/config/appkit' // Initialize AppKit configuration
import BNPolyfillProvider from '@/components/BNPolyfillProvider'

interface Props {
  children: ReactNode
}

export function ContextProvider({ children }: Props) {
  return (
    <BNPolyfillProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
        {children}
      </div>
    </BNPolyfillProvider>
  )
}
