'use client'

import { useAppKit } from '@reown/appkit/react'

export function Navbar() {
  const { open } = useAppKit()

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-white">
              VIBES
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#presale" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Presale
            </a>
            <a 
              href="#staking" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Staking
            </a>
            <a 
              href="#about" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => open()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
