// Hook for managing vesting and claims functionality
import { useState, useEffect, useCallback } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { 
  UserPurchase, 
  ClaimableTokens, 
  VestingCalculator, 
  DEFAULT_VESTING_CONFIG,
  ClaimTransaction 
} from '@/types/vesting'

// Mock storage - in production this would come from blockchain
const STORAGE_KEY = 'vibes_user_purchases'

interface UseVestingReturn {
  purchases: UserPurchase[]
  totalTokensPurchased: number
  totalClaimableNow: number
  totalClaimed: number
  totalRemaining: number
  isLoading: boolean
  error: string | null
  addPurchase: (purchase: Omit<UserPurchase, 'id' | 'vestingSchedule'>) => Promise<void>
  claimTokens: (purchaseId: string, period: number) => Promise<void>
  getClaimableForPurchase: (purchase: UserPurchase) => ClaimableTokens
  refreshData: () => Promise<void>
}

export const useVesting = (): UseVestingReturn => {
  const [purchases, setPurchases] = useState<UserPurchase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isConnected, address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  // Load purchases from storage (or blockchain in production)
  const loadPurchases = useCallback(async () => {
    if (!isConnected || !address) {
      setPurchases([])
      return
    }

    try {
      // In production, this would query the blockchain for user's purchases
      const stored = localStorage.getItem(`${STORAGE_KEY}_${address}`)
      if (stored) {
        const parsedPurchases = JSON.parse(stored).map((p: any) => ({
          ...p,
          purchaseDate: new Date(p.purchaseDate),
          vestingSchedule: {
            ...p.vestingSchedule,
            listingTimestamp: new Date(p.vestingSchedule.listingTimestamp),
            claimDates: p.vestingSchedule.claimDates.map((d: string) => new Date(d))
          }
        }))
        setPurchases(parsedPurchases)
      }
    } catch (err) {
      console.error('Error loading purchases:', err)
      setError('Error loading purchase history')
    }
  }, [isConnected, address])

  // Save purchases to storage (or blockchain in production)
  const savePurchases = useCallback((newPurchases: UserPurchase[]) => {
    if (!address) return
    
    try {
      localStorage.setItem(`${STORAGE_KEY}_${address}`, JSON.stringify(newPurchases))
    } catch (err) {
      console.error('Error saving purchases:', err)
    }
  }, [address])

  // Add new purchase
  const addPurchase = useCallback(async (
    purchaseData: Omit<UserPurchase, 'id' | 'vestingSchedule'>
  ) => {
    if (!isConnected || !walletProvider) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create vesting schedule
      const vestingSchedule = VestingCalculator.createVestingSchedule(
        purchaseData.tokensPurchased,
        DEFAULT_VESTING_CONFIG
      )

      const newPurchase: UserPurchase = {
        ...purchaseData,
        id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        vestingSchedule
      }

      // In production, this would call the smart contract
      console.log('🔗 [SMART CONTRACT CALL] Recording purchase:', {
        user: address,
        solAmount: newPurchase.solAmount,
        usdcAmount: newPurchase.usdcAmount,
        tokensPurchased: newPurchase.tokensPurchased,
        vestingSchedule: newPurchase.vestingSchedule
      })

      // Simulate transaction signature
      const transactionSignature = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      newPurchase.transactionSignature = transactionSignature

      const updatedPurchases = [...purchases, newPurchase]
      setPurchases(updatedPurchases)
      savePurchases(updatedPurchases)

      console.log('✅ Purchase recorded successfully:', transactionSignature)
    } catch (err) {
      console.error('Purchase failed:', err)
      setError('Purchase failed. Please try again.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, walletProvider, address, purchases, savePurchases])

  // Claim tokens for a specific period
  const claimTokens = useCallback(async (purchaseId: string, period: number) => {
    if (!isConnected || !walletProvider) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🎯 Starting claim process for purchase:', purchaseId, 'period:', period)
      
      const purchase = purchases.find(p => p.id === purchaseId)
      if (!purchase) {
        throw new Error('Purchase not found')
      }

      const claimable = VestingCalculator.calculateClaimableTokens(purchase.vestingSchedule)
      const periodData = claimable.periodsAvailable.find(p => p.period === period)
      
      console.log('📊 Claimable data:', claimable)
      console.log('📅 Period data:', periodData)
      
      if (!periodData) {
        throw new Error(`Period ${period} not found in vesting schedule`)
      }
      
      if (!periodData.isAvailable) {
        const now = new Date()
        const claimDate = periodData.claimDate
        throw new Error(`Tokens not available for claim yet. Available from: ${claimDate.toLocaleDateString('en-US')}`)
      }

      // In production, this would call the smart contract claim function
      console.log('🔗 [SMART CONTRACT CALL] Claiming tokens:', {
        user: address,
        purchaseId,
        period,
        amount: periodData.amount,
        percentage: periodData.percentage,
        totalTokens: purchase.tokensPurchased
      })

      // Simulate transaction signature
      const claimSignature = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Update the purchase to mark this period as claimed
      const updatedPurchases = purchases.map(p => {
        if (p.id === purchaseId) {
          const updatedSchedule = { ...p.vestingSchedule }
          updatedSchedule.claimedAmounts[period - 1] = periodData.amount
          return { ...p, vestingSchedule: updatedSchedule }
        }
        return p
      })

      setPurchases(updatedPurchases)
      savePurchases(updatedPurchases)

      console.log('✅ Tokens claimed successfully:', {
        signature: claimSignature,
        amount: periodData.amount,
        period: period,
        purchaseId: purchaseId
      })
      
      // Show success message
      alert(`🎉 Successfully claimed ${periodData.amount.toFixed(2)} VIBES tokens for period ${period}!`)
      
    } catch (err: any) {
      console.error('❌ Claim failed:', err)
      const errorMessage = err.message || 'Claim failed. Please try again.'
      setError(errorMessage)
      alert(`❌ Claim failed: ${errorMessage}`)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, walletProvider, address, purchases, savePurchases])

  // Get claimable tokens for a specific purchase
  const getClaimableForPurchase = useCallback((purchase: UserPurchase): ClaimableTokens => {
    return VestingCalculator.calculateClaimableTokens(purchase.vestingSchedule)
  }, [])

  // Refresh data (in production would re-query blockchain)
  const refreshData = useCallback(async () => {
    await loadPurchases()
  }, [loadPurchases])

  // Load data when wallet connects
  useEffect(() => {
    loadPurchases()
  }, [loadPurchases])

  // Calculate totals
  const totalTokensPurchased = purchases.reduce((sum, p) => sum + p.tokensPurchased, 0)
  
  const totalClaimableNow = purchases.reduce((sum, p) => {
    const claimable = VestingCalculator.calculateClaimableTokens(p.vestingSchedule)
    return sum + claimable.totalClaimable
  }, 0)

  const totalClaimed = purchases.reduce((sum, p) => {
    return sum + VestingCalculator.getTotalClaimed(p.vestingSchedule)
  }, 0)

  const totalRemaining = purchases.reduce((sum, p) => {
    return sum + VestingCalculator.getRemainingTokens(p.vestingSchedule)
  }, 0)

  return {
    purchases,
    totalTokensPurchased,
    totalClaimableNow,
    totalClaimed,
    totalRemaining,
    isLoading,
    error,
    addPurchase,
    claimTokens,
    getClaimableForPurchase,
    refreshData
  }
}
