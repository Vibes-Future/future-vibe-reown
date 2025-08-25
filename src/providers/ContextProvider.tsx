'use client'

// Context provider for Reown AppKit and application state
import React, { ReactNode } from 'react'
import '@/config/appkit' // Initialize AppKit configuration

interface Props {
  children: ReactNode
}

export function ContextProvider({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {children}
    </div>
  )
}
