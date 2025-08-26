'use client'

import { useAppKit } from '@reown/appkit/react'

export function Navbar() {
  const { open } = useAppKit()

  return (
    <nav className="bg-primary-8/95 backdrop-blur-sm border-b border-primary-6 sticky top-0 z-50">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-1 to-highlight-1 rounded-lg flex items-center justify-center">
              <span className="text-primary-4 font-bold text-sm">V</span>
            </div>
            <span className="text-2xl font-bold gradient-text-primary">
              VIBES
            </span>
          </div>



          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => open()}
              className="btn btn-primary"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
