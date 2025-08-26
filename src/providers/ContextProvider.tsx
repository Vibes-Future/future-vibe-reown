'use client'

// Context provider for Reown AppKit and application state
import React, { ReactNode, useEffect } from 'react'
import BNPolyfillProvider from './BNPolyfillProvider'
import { AppKitProvider } from './AppKitProvider'

interface Props {
  children: ReactNode
}

export function ContextProvider({ children }: Props) {
  useEffect(() => {
    // Global error handler to catch unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Prevent the default browser behavior
      event.preventDefault()
    }

    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error)
      // Prevent the default browser behavior
      event.preventDefault()
    }

    // Add global error handlers
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup function
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

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
