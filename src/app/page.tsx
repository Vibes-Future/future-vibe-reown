'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { PresaleSection } from '@/components/PresaleSection'
import { StakingSection } from '@/components/StakingSection'
import { VestingDashboard } from '@/components/VestingDashboard'
import { PricingTable } from '@/components/PricingTable'
import DevnetTestingConfig from '@/components/DevnetTestingConfig'
import { EnvironmentDebug } from '@/components/EnvironmentDebug'


export default function Home() {
  const [activeTab, setActiveTab] = useState<'presale' | 'claims' | 'staking'>('presale')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 section-py">
        <div className="container text-center gap-mb-32">
          <h1 className="banner-title gradient-text-primary">
            VIBES Token Presale
          </h1>
          <p className="my-text-20 max-w-3xl mx-auto text-foundation-blue-20">
            Participa en el presale de VIBES con precios dinámicos mensuales y gana recompensas a través del staking en Solana
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-mb-32">
          <div className="bg-BG-FFF-8 rounded-lg p-1 inline-flex border border-stroct-1">
            <button
              onClick={() => setActiveTab('presale')}
              className={`px-6 py-3 rounded-md font-medium my-transition ${
                activeTab === 'presale'
                  ? 'bg-primary-1 text-primary-4 shadow-lg'
                  : 'text-foundation-blue-60 hover:text-primary-1'
              }`}
            >
              Presale
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`px-6 py-3 rounded-md font-medium my-transition ${
                activeTab === 'claims'
                  ? 'bg-primary-1 text-primary-4 shadow-lg'
                  : 'text-foundation-blue-20 hover:text-primary-1'
              }`}
            >
              Claims
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`px-6 py-3 rounded-md font-medium my-transition ${
                activeTab === 'staking'
                  ? 'bg-primary-1 text-primary-4 shadow-lg'
                  : 'text-foundation-blue-60 hover:text-primary-1'
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


      
              {/* Development Testing Config */}
        <DevnetTestingConfig />
        
        {/* Environment Debug (Development Only) */}
        <EnvironmentDebug />
      </div>
    )
  }