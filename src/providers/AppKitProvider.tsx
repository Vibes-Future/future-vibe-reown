'use client'

import React, { ReactNode } from 'react'
import { AppKitProvider as ReownAppKitProvider } from '@reown/appkit/react'
import { initializeAppKit } from '@/config/appkit'

interface Props {
  children: ReactNode
}

export function AppKitProvider({ children }: Props) {
  // Initialize AppKit immediately
  const appKit = initializeAppKit()
  
  return (
    <ReownAppKitProvider appKit={appKit}>
      {children}
    </ReownAppKitProvider>
  )
}
