'use client'

import { useState } from 'react'
import { env, getEnvironmentInfo, validateEnvironment } from '@/config/environment'

export function EnvironmentDebug() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [validation, setValidation] = useState(() => validateEnvironment())

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setValidation(validateEnvironment())
    }
  }

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
        {/* Header */}
        <div 
          className="px-4 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
          onClick={toggleExpanded}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              validation.isValid ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-white">
              {env.network.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">
              {validation.isValid ? '✓ Valid' : `✗ ${validation.errors.length} errors`}
            </span>
            <span className="text-gray-500 ml-2">
              {isExpanded ? '▼' : '▲'}
            </span>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
            {/* Network Info */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">Network</h4>
              <div className="text-xs text-white space-y-1">
                <div>Type: {env.network}</div>
                <div>RPC: {env.rpcUrl}</div>
                <div>Project ID: {env.projectId || 'NOT SET'}</div>
              </div>
            </div>

            {/* Smart Contracts */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">Smart Contracts</h4>
              <div className="text-xs text-white space-y-1">
                <div>Presale: {env.presaleProgramId || 'NOT SET'}</div>
                <div>Token Mint: {env.tokenMintAddress || 'NOT SET'}</div>
                <div>Staking: {env.stakingProgramId || 'NOT SET'}</div>
              </div>
            </div>

            {/* Liquidity Pools */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">Liquidity Pools</h4>
              <div className="text-xs text-white space-y-1">
                <div>SOL: {env.liquidityPoolSol || 'NOT SET'}</div>
                <div>USDC: {env.liquidityPoolUsdc || 'NOT SET'}</div>
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">Configuration</h4>
              <div className="text-xs text-white space-y-1">
                <div>Hard Cap SOL: {env.presaleHardCapSol}</div>
                <div>Hard Cap USDC: {env.presaleHardCapUsdc}</div>
                <div>Min SOL: {env.minPresaleAmountSol}</div>
                <div>Min USDC: {env.minPresaleAmountUsdc}</div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">Features</h4>
              <div className="text-xs text-white space-y-1">
                <div>Debug Logs: {env.enableDebugLogs ? 'ON' : 'OFF'}</div>
                <div>Simulation: {env.enableSimulationMode ? 'ON' : 'OFF'}</div>
              </div>
            </div>

            {/* Validation Errors */}
            {!validation.isValid && (
              <div>
                <h4 className="text-xs font-semibold text-red-400 mb-1">Errors</h4>
                <div className="text-xs text-red-300 space-y-1">
                  {validation.errors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  console.log(getEnvironmentInfo())
                  console.log('Environment config:', env)
                }}
                className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              >
                Log to Console
              </button>
              
              <button
                onClick={() => setValidation(validateEnvironment())}
                className="w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
              >
                Revalidate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
