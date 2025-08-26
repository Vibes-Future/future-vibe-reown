'use client'

import { useState } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { CONSTANTS } from '@/config/solana'
import { formatNumber, formatTokens } from '@/utils/formatters'

export function StakingSection() {
  const [stakeAmount, setStakeAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<'stake' | 'unstake'>('stake')
  const { isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  // Mock staking data (will be replaced with real data from blockchain)
  const stakingData = {
    isActive: true,
    totalStaked: 5000000,
    totalRewards: 750000,
    apy: CONSTANTS.STAKING_APY,
    lockPeriod: 30, // days
    minimumStakeAmount: 100
  }

  // Mock user staking data
  const userStakingData = {
    stakedAmount: 10000,
    stakingStartTime: new Date('2024-01-15'),
    accumulatedRewards: 125.5,
    lastClaimTime: new Date('2024-01-10'),
    isUnlocked: true
  }

  const calculateRewards = (amount: number, days: number): number => {
    const dailyRate = stakingData.apy / 100 / 365
    return amount * dailyRate * days
  }

  const calculateAPY = (amount: string): number => {
    const tokens = parseFloat(amount) || 0
    return calculateRewards(tokens, 365)
  }

  const handleStake = async () => {
    if (!isConnected || !walletProvider) {
      alert('Please connect your wallet first')
      return
    }

    const tokens = parseFloat(stakeAmount)
    if (!tokens || tokens < stakingData.minimumStakeAmount) {
      alert(`Minimum stake amount is ${stakingData.minimumStakeAmount} tokens`)
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual staking transaction logic
      console.log('Staking tokens...', { amount: tokens })
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Successfully staked ${formatTokens(tokens)} tokens!`)
      setStakeAmount('')
    } catch (error) {
      console.error('Staking failed:', error)
      alert('Staking failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnstake = async () => {
    if (!isConnected || !walletProvider) {
      alert('Please connect your wallet first')
      return
    }

    const tokens = parseFloat(stakeAmount)
    if (!tokens || tokens > userStakingData.stakedAmount) {
      alert(`Cannot unstake more than your staked amount (${userStakingData.stakedAmount} tokens)`)
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual unstaking transaction logic
      console.log('Unstaking tokens...', { amount: tokens })
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Successfully unstaked ${formatTokens(tokens)} tokens!`)
      setStakeAmount('')
    } catch (error) {
      console.error('Unstaking failed:', error)
      alert('Unstaking failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!isConnected || !walletProvider) {
      alert('Please connect your wallet first')
      return
    }

    if (userStakingData.accumulatedRewards <= 0) {
      alert('No rewards to claim')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual claim rewards transaction logic
      console.log('Claiming rewards...', { rewards: userStakingData.accumulatedRewards })
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Successfully claimed ${userStakingData.accumulatedRewards.toFixed(2)} tokens in rewards!`)
    } catch (error) {
      console.error('Claim failed:', error)
      alert('Claim failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-BG-FFF-8 backdrop-blur-sm rounded-2xl p-8 border border-stroct-1">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Staking Statistics */}
        <div className="space-y-6">
          <h2 className="my-text-32 gap-mb-24 gradient-text-primary">Token Staking</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Staked</div>
              <div className="text-lg font-semibold text-white">
                {formatNumber(stakingData.totalStaked)}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">APY</div>
              <div className="text-lg font-semibold text-green-400">
                {stakingData.apy}%
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Lock Period</div>
              <div className="text-lg font-semibold text-white">
                {stakingData.lockPeriod} days
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Min Stake</div>
              <div className="text-lg font-semibold text-white">
                {stakingData.minimumStakeAmount}
              </div>
            </div>
          </div>

          {/* User Staking Info */}
          {isConnected && (
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
              <h4 className="text-lg font-semibold text-white mb-4">Your Staking</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Staked</div>
                  <div className="text-white font-semibold">
                    {formatNumber(userStakingData.stakedAmount)} tokens
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Rewards</div>
                  <div className="text-green-400 font-semibold">
                    {userStakingData.accumulatedRewards.toFixed(2)} tokens
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Staking Since</div>
                  <div className="text-white font-semibold">
                    {userStakingData.stakingStartTime.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Status</div>
                  <div className={`font-semibold ${userStakingData.isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                    {userStakingData.isUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              </div>
              
              {/* Claim Rewards Button */}
              <button
                onClick={handleClaimRewards}
                disabled={!isConnected || isLoading || userStakingData.accumulatedRewards <= 0}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                Claim Rewards ({userStakingData.accumulatedRewards.toFixed(2)} tokens)
              </button>
            </div>
          )}
        </div>

        {/* Staking Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Stake/Unstake Tokens</h3>
          
          {/* Action Toggle */}
          <div className="bg-gray-700 rounded-lg p-1 inline-flex w-full">
            <button
              onClick={() => setActiveAction('stake')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                activeAction === 'stake'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => setActiveAction('unstake')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                activeAction === 'unstake'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Unstake
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Token Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Token Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0"
                  min={activeAction === 'stake' ? stakingData.minimumStakeAmount : 0}
                  max={activeAction === 'unstake' ? userStakingData.stakedAmount : undefined}
                  step="1"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400 text-sm">tokens</span>
                </div>
              </div>
              {activeAction === 'unstake' && (
                <div className="text-sm text-gray-400 mt-1">
                  Available: {formatNumber(userStakingData.stakedAmount)} tokens
                </div>
              )}
            </div>

            {/* Rewards Calculation */}
            {activeAction === 'stake' && stakeAmount && (
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3">
                <div className="text-sm text-gray-400 mb-1">Expected yearly rewards</div>
                <div className="text-white text-lg font-semibold">
                  {calculateAPY(stakeAmount).toFixed(2)} tokens
                </div>
                <div className="text-xs text-gray-500">
                  Based on {stakingData.apy}% APY
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={activeAction === 'stake' ? handleStake : handleUnstake}
              disabled={!isConnected || isLoading || !stakeAmount}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : !isConnected ? (
                'Connect Wallet'
              ) : (
                `${activeAction === 'stake' ? 'Stake' : 'Unstake'} Tokens`
              )}
            </button>

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 text-center">
              * Staked tokens are locked for {stakingData.lockPeriod} days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
