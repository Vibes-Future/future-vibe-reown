'use client'

import { useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useVesting } from '@/hooks/useVesting'
import { useSmartContractVesting } from '@/hooks/useSmartContractVesting'
import { formatTokens, formatNumber } from '@/utils/formatters'
import { VestingCalculator } from '@/types/vesting'
import { TransactionInfo, SmartContractStatus } from './TransactionInfo'
import { ClaimDebug } from './ClaimDebug'

export function VestingDashboard() {
  const { isConnected, address } = useAppKitAccount()
  
  // Legacy vesting hook (simulation mode)
  const {
    purchases,
    totalTokensPurchased: legacyTotalPurchased,
    totalClaimableNow: legacyTotalClaimable,
    totalClaimed: legacyTotalClaimed,
    totalRemaining: legacyTotalRemaining,
    isLoading: legacyLoading,
    error: legacyError,
    claimTokens: legacyClaimTokens,
    getClaimableForPurchase,
    refreshData: legacyRefreshData
  } = useVesting()

  // Smart contract vesting hook
  const {
    userPurchase,
    totalTokensPurchased: smartTotalPurchased,
    totalClaimableNow: smartTotalClaimable,
    totalClaimed: smartTotalClaimed,
    totalRemaining: smartTotalRemaining,
    isLoading: smartLoading,
    error: smartError,
    claimTokens: smartClaimTokens,
    lastTransaction,
    isSmartContractMode,
    programDeployed,
    refreshData: smartRefreshData
  } = useSmartContractVesting()

  // Use smart contract data if available, otherwise fall back to legacy
  const isUsingSmartContracts = isSmartContractMode && userPurchase
  const totalTokensPurchased = isUsingSmartContracts ? smartTotalPurchased : legacyTotalPurchased
  const totalClaimableNow = isUsingSmartContracts ? smartTotalClaimable : legacyTotalClaimable
  const totalClaimed = isUsingSmartContracts ? smartTotalClaimed : legacyTotalClaimed
  const totalRemaining = isUsingSmartContracts ? smartTotalRemaining : legacyTotalRemaining
  const isLoading = isUsingSmartContracts ? smartLoading : legacyLoading
  const error = isUsingSmartContracts ? smartError : legacyError
  const refreshData = isUsingSmartContracts ? smartRefreshData : legacyRefreshData

  const [claimingPurchaseId, setClaimingPurchaseId] = useState<string | null>(null)
  const [claimingPeriod, setClaimingPeriod] = useState<number | null>(null)

  const handleClaim = async (purchaseId: string, period: number) => {
    setClaimingPurchaseId(purchaseId)
    setClaimingPeriod(period)
    
    try {
      if (isUsingSmartContracts) {
        // Use smart contract claim
        console.log('🔗 Using Smart Contract for claim')
        const result = await smartClaimTokens(period)
        
        if (result.success) {
                     alert(`Tokens claimed successfully from Blockchain!
           
🎉 You have claimed ${formatTokens(result.claimedAmount || 0)} VIBES tokens
📅 Period: ${period + 1}
🔗 Transaction: ${result.signature}
🔍 View on Solscan: ${result.explorerUrl}`)
        } else {
          throw new Error(result.error || 'Smart contract claim failed')
        }
      } else {
        // Use legacy simulation claim
        console.log('🎮 Using Simulation Mode for claim')
        await legacyClaimTokens(purchaseId, period)
                 alert('Tokens claimed successfully (Simulation)!')
      }
    } catch (error) {
      console.error('Claim error:', error)
             alert('Error claiming tokens. Please try again.')
    } finally {
      setClaimingPurchaseId(null)
      setClaimingPeriod(null)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-BG-FFF-8 backdrop-blur-sm rounded-2xl p-8 border border-stroct-1">
        <div className="text-center">
          <h3 className="my-text-24 gap-mb-16 gradient-text-primary">Vesting & Claims</h3>
                     <p className="text-foundation-blue-60">Connect your wallet to see your purchases and claim tokens</p>
        </div>
      </div>
    )
  }

  // Check if user has any purchases (either legacy or smart contract)
  const hasPurchases = isUsingSmartContracts ? !!userPurchase : purchases.length > 0
  
  if (!hasPurchases) {
    return (
      <div className="bg-BG-FFF-8 backdrop-blur-sm rounded-2xl p-8 border border-stroct-1">
        <div className="text-center">
          <h3 className="my-text-24 gap-mb-16 gradient-text-primary">Vesting & Claims</h3>
          <p className="text-foundation-blue-60">You don't have any registered purchases yet</p>
          <p className="text-sm text-foundation-blue-50 mt-2">
            Buy VIBES tokens in the Presale section to see your vesting schedule here
          </p>
          {isUsingSmartContracts && (
            <p className="text-xs text-primary-1 mt-2">
              🔗 Connected to Smart Contract Mode
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-BG-FFF-8 backdrop-blur-sm rounded-2xl p-8 border border-stroct-1">
      {/* Debug Panel - Remove in production */}
      <ClaimDebug />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="my-text-24 gradient-text-primary">Vesting & Claims</h3>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="text-sm text-primary-1 hover:text-primary-2 disabled:opacity-50 my-transition"
        >
          {isLoading ? 'Updating...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-BG-FFF-8 rounded-lg p-4 text-center border border-stroct-1">
          <div className="text-2xl font-bold text-white">
            {formatTokens(totalTokensPurchased)}
          </div>
          <div className="text-sm text-foundation-blue-60">Total Purchased</div>
        </div>
        
        <div className="bg-primary-1/20 border border-primary-1/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary-1">
            {formatTokens(totalClaimableNow)}
          </div>
          <div className="text-sm text-foundation-blue-60">Available Now</div>
        </div>
        
        <div className="bg-highlight-1/20 border border-highlight-1/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-highlight-1">
            {formatTokens(totalClaimed)}
          </div>
          <div className="text-sm text-foundation-blue-60">Already Claimed</div>
        </div>
        
        <div className="bg-BG-FFF-8 rounded-lg p-4 text-center border border-stroct-1">
          <div className="text-2xl font-bold text-white">
            {formatTokens(totalRemaining)}
          </div>
          <div className="text-sm text-foundation-blue-60">Pending</div>
        </div>
      </div>

      {/* Purchases and Vesting */}
      <div className="space-y-6">
        {purchases.map((purchase) => {
          const claimable = getClaimableForPurchase(purchase)
          const progress = VestingCalculator.getVestingProgress(purchase.vestingSchedule)
          
          return (
            <div key={purchase.id} className="bg-BG-FFF-8 rounded-lg p-6 border border-stroct-1">
              {/* Purchase Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Purchase #{purchase.id.slice(-8)}
                  </h4>
                  <p className="text-sm text-foundation-blue-60">
                    {purchase.purchaseDate.toLocaleDateString('en-US')} • 
                    {formatTokens(purchase.tokensPurchased)} VIBES
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-foundation-blue-60">Vesting Progress</div>
                  <div className="text-lg font-semibold text-white">
                    {progress.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-BG-FFF-8 rounded-full h-2 mb-4 border border-stroct-1">
                <div 
                  className="bg-gradient-to-r from-primary-1 to-highlight-1 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              {/* Vesting Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {claimable.periodsAvailable.map((period) => {
                  const isClaimingThis = claimingPurchaseId === purchase.id && claimingPeriod === period.period
                  
                  return (
                    <div
                      key={period.period}
                      className={`p-4 rounded-lg border transition-all ${
                        period.isClaimed
                          ? 'bg-green-600/20 border-green-500/30'
                          : period.isAvailable
                            ? 'bg-blue-600/20 border-blue-500/30'
                            : 'bg-gray-700/50 border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">
                          Period {period.period}
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {period.percentage}%
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          {formatTokens(period.amount)} VIBES
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          {period.claimDate.toLocaleDateString('en-US')}
                        </div>
                        
                        {period.isClaimed ? (
                          <div className="text-xs text-green-400 font-medium">
                            ✅ Claimed
                          </div>
                        ) : period.isAvailable ? (
                          <button
                            onClick={() => handleClaim(purchase.id, period.period)}
                            disabled={isClaimingThis || isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs py-2 px-3 rounded transition-colors"
                          >
                            {isClaimingThis ? 'Claiming...' : 'Claim'}
                          </button>
                        ) : (
                          <div className="text-xs text-gray-500">
                            🔒 Locked until {period.claimDate.toLocaleDateString('en-US')}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Next Claim Info */}
              {claimable.nextClaimDate && (
                <div className="mt-4 p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                  <div className="text-sm text-purple-400">
                    📅 Next claim available: {claimable.nextClaimDate.toLocaleDateString('en-US')} • 
                    {formatTokens(claimable.nextClaimAmount)} VIBES
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
        <h4 className="font-semibold text-blue-400 mb-2">💡 How Vesting Works:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong>40%</strong> available immediately after listing</li>
          <li>• <strong>20%</strong> each month for 3 additional months</li>
          <li>• Tokens can be claimed individually per period</li>
          <li>• Once claimed, tokens go directly to your wallet</li>
          <li>• {isUsingSmartContracts ? '🔗 Using smart contracts on Solana' : '🎮 Simulation mode active'}</li>
        </ul>
      </div>

      {/* Smart Contract Status */}
      <div className="mt-6">
        <SmartContractStatus />
      </div>

      {/* Transaction Information */}
      {lastTransaction && (
        <TransactionInfo
          signature={lastTransaction}
          programId={process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID}
          tokenMint={process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS}
          userAddress={isConnected ? address : undefined}
          status="confirmed"
          type="claim"
          timestamp={new Date()}
        />
      )}
    </div>
  )
}
