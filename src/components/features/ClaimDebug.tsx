'use client'

import React, { useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useVesting } from '@/hooks/useVesting'
import { useSmartContractVesting } from '@/hooks/useSmartContractVesting'

export function ClaimDebug() {
  const [testPeriod, setTestPeriod] = useState(1)
  const [testAmount, setTestAmount] = useState(1000)
  const { address } = useAppKitAccount()
  
  const {
    purchases,
    totalTokensPurchased,
    totalClaimableNow,
    totalClaimed,
    totalRemaining,
    isLoading: legacyLoading,
    error: legacyError,
    addPurchase,
    claimTokens: legacyClaimTokens,
    refreshData: legacyRefreshData
  } = useVesting()
  
  const {
    userPurchase: smartUserPurchase,
    presaleConfig: smartPresaleConfig,
    totalClaimableNow: smartTotalClaimable,
    totalClaimed: smartTotalClaimed,
    totalRemaining: smartTotalRemaining,
    isLoading: smartLoading,
    error: smartError,
    claimTokens: smartClaimTokens,
    refreshData: smartRefreshData,
    isSmartContractMode,
    programDeployed
  } = useSmartContractVesting()

  const handleTestPurchase = async () => {
    try {
      await addPurchase({
        solAmount: 1,
        usdcAmount: 0,
        tokensPurchased: testAmount,
        solPriceAtPurchase: 100,
        tokenPriceAtPurchase: 0.05,
        transactionSignature: 'test_signature_' + Date.now()
      })
      alert('✅ Test purchase added successfully!')
    } catch (error: any) {
      alert('❌ Failed to add test purchase: ' + error.message)
    }
  }

  const handleTestLegacyClaim = async () => {
    if (purchases.length === 0) {
      alert('❌ No purchases available. Add a test purchase first.')
      return
    }
    
    try {
      const purchase = purchases[0]
      await legacyClaimTokens(purchase.id, testPeriod)
      alert('✅ Legacy claim successful!')
    } catch (error: any) {
      alert('❌ Legacy claim failed: ' + error.message)
    }
  }

  const handleTestSmartClaim = async () => {
    if (!isSmartContractMode) {
      alert('❌ Smart contract mode not available')
      return
    }
    
    try {
      await smartClaimTokens(testPeriod)
      alert('✅ Smart contract claim successful!')
    } catch (error: any) {
      alert('❌ Smart contract claim failed: ' + error.message)
    }
  }

  return (
    <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-yellow-400 mb-3">🔧 Claim Function Debug Panel</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-yellow-300 mb-1">Test Period (1-4):</label>
          <input
            type="number"
            min="1"
            max="4"
            value={testPeriod}
            onChange={(e) => setTestPeriod(parseInt(e.target.value))}
            className="w-full px-2 py-1 bg-gray-800 text-white rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-yellow-300 mb-1">Test Amount (tokens):</label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(parseInt(e.target.value))}
            className="w-full px-2 py-1 bg-gray-800 text-white rounded text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={handleTestPurchase}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded"
        >
          ➕ Add Test Purchase
        </button>
        <button
          onClick={handleTestLegacyClaim}
          disabled={purchases.length === 0 || legacyLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm py-2 px-3 rounded"
        >
          🎮 Test Legacy Claim
        </button>
        <button
          onClick={handleTestSmartClaim}
          disabled={!isSmartContractMode || smartLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm py-2 px-3 rounded"
        >
          🔗 Test Smart Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-medium text-yellow-300 mb-2">Legacy Mode:</h5>
          <div className="space-y-1 text-gray-300">
            <div>Purchases: {purchases.length}</div>
            <div>Total Tokens: {totalTokensPurchased}</div>
            <div>Claimable Now: {totalClaimableNow}</div>
            <div>Total Claimed: {totalClaimed}</div>
            <div>Remaining: {totalRemaining}</div>
            {legacyError && <div className="text-red-400">Error: {legacyError}</div>}
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-yellow-300 mb-2">Smart Contract Mode:</h5>
          <div className="space-y-1 text-gray-300">
            <div>Mode: {isSmartContractMode ? '✅ Active' : '❌ Inactive'}</div>
            <div>Deployed: {programDeployed ? '✅ Yes' : '❌ No'}</div>
            <div>User Purchase: {smartUserPurchase ? '✅ Yes' : '❌ No'}</div>
            <div>Claimable Now: {smartTotalClaimable}</div>
            <div>Total Claimed: {smartTotalClaimed}</div>
            <div>Remaining: {smartTotalRemaining}</div>
            {smartError && <div className="text-red-400">Error: {smartError}</div>}
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-yellow-300 mb-2">Data Sync Status:</h5>
          <div className="space-y-1 text-gray-300">
            <div>Unified Storage: {localStorage.getItem('vibes_unified_purchases') ? '✅ Found' : '❌ None'}</div>
            <div>Recent Purchases: {localStorage.getItem('vibes_recent_purchases') ? '✅ Found' : '❌ None'}</div>
            <div>Legacy Purchases: {localStorage.getItem('vibes_user_purchases') ? '✅ Found' : '❌ None'}</div>
            <div>Wallet Address: {address ? address.slice(0, 8) + '...' : '❌ Not Connected'}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={legacyRefreshData}
          disabled={legacyLoading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white text-xs py-1 px-2 rounded"
        >
          🔄 Refresh Legacy
        </button>
        <button
          onClick={smartRefreshData}
          disabled={smartLoading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white text-xs py-1 px-2 rounded"
        >
          🔄 Refresh Smart
        </button>
        <button
          onClick={() => {
            // Force sync by clearing cache and refreshing
            localStorage.removeItem('vibes_recent_purchases')
            window.location.reload()
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded"
        >
          🔄 Force Sync
        </button>
        <button
          onClick={() => {
            // Unified sync - consolidate all storage formats
            try {
              if (!address) {
                alert('❌ Wallet not connected')
                return
              }
              
              // Get data from all sources
              const recentPurchases = localStorage.getItem('vibes_recent_purchases')
              const legacyPurchases = localStorage.getItem('vibes_user_purchases')
              const unifiedPurchases = localStorage.getItem('vibes_unified_purchases')
              
              let purchaseData = null
              let source = ''
              
              // Priority: unified > recent > legacy
              if (unifiedPurchases) {
                const unified = JSON.parse(unifiedPurchases)
                if (unified[address]) {
                  purchaseData = unified[address]
                  source = 'unified'
                }
              }
              
              if (!purchaseData && recentPurchases) {
                const recent = JSON.parse(recentPurchases)
                if (recent[address]) {
                  purchaseData = recent[address]
                  source = 'recent'
                }
              }
              
              if (!purchaseData && legacyPurchases) {
                const legacy = JSON.parse(legacyPurchases)
                if (legacy[address] && legacy[address].length > 0) {
                  const legacyPurchase = legacy[address][0]
                  purchaseData = {
                    totalTokensPurchased: legacyPurchase.tokensPurchased,
                    totalSolSpent: legacyPurchase.solAmount,
                    totalUsdcSpent: legacyPurchase.usdcAmount,
                    purchaseCount: 1,
                    purchaseDate: legacyPurchase.purchaseDate,
                    transactionSignature: legacyPurchase.transactionSignature
                  }
                  source = 'legacy'
                }
              }
              
              if (purchaseData) {
                // Consolidate to unified storage
                const unified = JSON.parse(localStorage.getItem('vibes_unified_purchases') || '{}')
                unified[address] = {
                  ...purchaseData,
                  lastSynced: new Date().toISOString(),
                  syncedFrom: source,
                  consolidated: true
                }
                localStorage.setItem('vibes_unified_purchases', JSON.stringify(unified))
                
                alert(`✅ Purchase data consolidated from ${source} storage!`)
                window.location.reload()
              } else {
                alert('❌ No purchase data found in any storage')
              }
            } catch (error) {
              alert('❌ Consolidation failed: ' + error.message)
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
        >
          🔄 Consolidate All
        </button>
      </div>
    </div>
  )
}
