'use client'

// Context provider for Reown AppKit and application state
import React, { ReactNode } from 'react'
import BNPolyfillProvider from './BNPolyfillProvider'
import { AppKitProvider } from './AppKitProvider'

interface Props {
  children: ReactNode
}

export function ContextProvider({ children }: Props) {
  return (
    <BNPolyfillProvider>
      <AppKitProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
          {children}
        </div>
      </AppKitProvider>
    </BNPolyfillProvider>
  )
}
