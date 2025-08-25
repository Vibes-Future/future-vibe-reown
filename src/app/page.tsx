'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { PresaleSection } from '@/components/PresaleSection'
import { StakingSection } from '@/components/StakingSection'
import { VestingDashboard } from '@/components/VestingDashboard'
import { PricingTable } from '@/components/PricingTable'
import DevnetTestingConfig from '@/components/DevnetTestingConfig'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'presale' | 'claims' | 'staking'>('presale')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
            VIBES Token Presale
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Participa en el presale de VIBES con precios dinámicos mensuales y gana recompensas a través del staking en Solana
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('presale')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'presale'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Presale
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'claims'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Claims
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'staking'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Staking
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'presale' && <PresaleSection />}
          {activeTab === 'claims' && <VestingDashboard />}
          {activeTab === 'staking' && <StakingSection />}
        </div>

        {/* Pricing Table - only show on presale tab */}
        {activeTab === 'presale' && (
          <div className="max-w-6xl mx-auto">
            <PricingTable />
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
      
      {/* Development Testing Config */}
      <DevnetTestingConfig />
    </div>
  )
}