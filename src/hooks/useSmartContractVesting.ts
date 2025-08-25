// Hook for managing vesting with real smart contracts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { Connection, PublicKey } from '@solana/web3.js'
import { 
  purchaseTokensWithSOL,
  claimVestedTokens,
  getUserPurchaseData,
  getPresaleConfigData,
  getExplorerUrl,
  isSmartContractDeployed,
  PurchaseResult,
  ClaimResult
} from '@/utils/solana-integration'  // Cambiado a solana-integration
import { connection } from '@/config/solana'

interface SmartContractPurchase {
  userAddress: string
  totalTokensPurchased: number
  totalSOLSpent: number
  totalUSDCSpent: number
  purchaseCount: number
  vestingSchedule: {
    totalTokens: number
    listingTimestamp: number
    claimedAmounts: number[]
    claimedFlags: boolean[]
  }
}

interface SmartContractPresaleConfig {
  authority: string
  vibesMint: string
  listingTimestamp: number
  solToVibesRate: number
  usdcToVibesRate: number
  totalSold: number
  isActive: boolean
}

interface UseSmartContractVestingReturn {
  // Data
  userPurchase: SmartContractPurchase | null
  presaleConfig: SmartContractPresaleConfig | null
  totalTokensPurchased: number
  totalClaimableNow: number
  totalClaimed: number
  totalRemaining: number
  
  // State
  isLoading: boolean
  error: string | null
  lastTransaction: string | null
  
  // Functions
  purchaseWithSOL: (solAmount: number) => Promise<PurchaseResult>
  claimTokens: (period: number) => Promise<ClaimResult>
  refreshData: () => Promise<void>
  
  // Smart contract info
  isSmartContractMode: boolean
  programDeployed: boolean
}

export const useSmartContractVesting = (): UseSmartContractVestingReturn => {
  const [userPurchase, setUserPurchase] = useState<SmartContractPurchase | null>(null)
  const [presaleConfig, setPresaleConfig] = useState<SmartContractPresaleConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastTransaction, setLastTransaction] = useState<string | null>(null)
  
  const { isConnected, address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  // Check if smart contracts are deployed
  const programDeployed = isSmartContractDeployed
  
  const isSmartContractMode = programDeployed && isConnected

  // Load data from smart contracts
  const loadSmartContractData = useCallback(async () => {
    if (!isConnected || !address || !programDeployed) {
      setUserPurchase(null)
      setPresaleConfig(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔗 Loading data from smart contracts...')
      
      // Load presale configuration
      const configData = await getPresaleConfigData(connection)
      if (configData) {
        setPresaleConfig({
          authority: configData.authority.toString(),
          vibesMint: configData.vibesMint ? configData.vibesMint.toString() : "",
          listingTimestamp: Number(configData.listingTimestamp || 0),
          solToVibesRate: Number(configData.solToVibesRate || 100),
          usdcToVibesRate: Number(configData.usdcToVibesRate || 10),
          totalSold: Number(configData.totalSoldAmount || 0),
          isActive: configData.isActive || false
        })
      }

      // Load user purchase data
      const userPublicKey = new PublicKey(address)
      const purchaseData = await getUserPurchaseData(connection, userPublicKey)
      
      if (purchaseData) {
        try {
          setUserPurchase({
            userAddress: purchaseData.user?.toString() || address,
            totalTokensPurchased: Number(purchaseData.totalTokensPurchased || 0),
            totalSOLSpent: Number(purchaseData.totalSolSpent || 0),
            totalUSDCSpent: Number(purchaseData.totalUsdcSpent || 0),
            purchaseCount: Number(purchaseData.purchaseCount || 0),
            vestingSchedule: {
              totalTokens: Number(purchaseData.totalTokensPurchased || 0),
              listingTimestamp: Number(configData?.listingTimestamp || 0),
              claimedAmounts: Array.isArray(purchaseData.vestingSchedule?.claimedAmounts) 
                ? purchaseData.vestingSchedule.claimedAmounts.map((a: any) => Number(a)) 
                : [0, 0, 0, 0],
              claimedFlags: Array.isArray(purchaseData.vestingSchedule?.claimedFlags)
                ? purchaseData.vestingSchedule.claimedFlags
                : [false, false, false, false]
            }
          })
        } catch (parseError) {
          console.error('Error parsing purchase data:', parseError);
          console.log('Raw purchase data:', purchaseData);
          setError('Error parsing purchase data from blockchain');
          setUserPurchase(null);
        }
        
        console.log('✅ Smart contract data loaded:', {
          totalPurchased: Number(purchaseData.totalTokensPurchased),
          vestingSchedule: purchaseData.vestingSchedule
        })
      } else {
        console.log('ℹ️ No purchase data found for user')
        setUserPurchase(null)
      }

    } catch (err: any) {
      console.error('❌ Failed to load smart contract data:', err)
      setError(`Failed to load blockchain data: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, programDeployed])

  // Purchase tokens with SOL
  const purchaseWithSOL = useCallback(async (solAmount: number): Promise<PurchaseResult> => {
    if (!isConnected || !walletProvider || !programDeployed) {
      throw new Error('Wallet not connected or smart contracts not deployed')
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🛒 [SMART CONTRACT] Purchasing tokens with SOL:', { solAmount })
      
      const result = await purchaseTokensWithSOL(walletProvider, connection, solAmount)
      
      if (result.success && result.signature) {
        setLastTransaction(result.signature)
        console.log('✅ Purchase successful:', result.signature)
        console.log('🔍 Explorer:', result.explorerUrl)
        
        // Refresh data after successful purchase
        setTimeout(() => {
          loadSmartContractData()
        }, 2000) // Wait for blockchain confirmation
        
        return result
      } else {
        throw new Error(result.error || 'Purchase failed')
      }

    } catch (err: any) {
      console.error('❌ Purchase failed:', err)
      setError(`Purchase failed: ${err.message}`)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, walletProvider, programDeployed, loadSmartContractData])

  // Claim vested tokens
  const claimTokens = useCallback(async (period: number): Promise<ClaimResult> => {
    if (!isConnected || !walletProvider || !programDeployed) {
      throw new Error('Wallet not connected or smart contracts not deployed')
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('💎 [SMART CONTRACT] Claiming tokens for period:', period)
      
      const result = await claimVestedTokens(walletProvider, connection, period)
      
      if (result.success && result.signature) {
        setLastTransaction(result.signature)
        console.log('✅ Claim successful:', result.signature)
        console.log('🔍 Explorer:', result.explorerUrl)
        
        // Refresh data after successful claim
        setTimeout(() => {
          loadSmartContractData()
        }, 2000) // Wait for blockchain confirmation
        
        return result
      } else {
        throw new Error(result.error || 'Claim failed')
      }

    } catch (err: any) {
      console.error('❌ Claim failed:', err)
      setError(`Claim failed: ${err.message}`)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, walletProvider, programDeployed, loadSmartContractData])

  // Refresh data from blockchain
  const refreshData = useCallback(async () => {
    await loadSmartContractData()
  }, [loadSmartContractData])

  // Load data when wallet connects or smart contracts become available
  useEffect(() => {
    if (isSmartContractMode) {
      loadSmartContractData()
    }
  }, [isSmartContractMode, loadSmartContractData])

  // Calculate totals
  const totalTokensPurchased = userPurchase?.totalTokensPurchased || 0
  
  const totalClaimableNow = useMemo(() => {
    if (!userPurchase || !presaleConfig) return 0
    
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const listingTimestamp = presaleConfig.listingTimestamp
    
    // If not listed yet, no tokens claimable
    if (currentTimestamp < listingTimestamp) return 0
    
    let claimable = 0
    const vestingSchedule = userPurchase.vestingSchedule
    const periodDuration = 30 * 24 * 60 * 60 // 30 days in seconds
    
    // Check each period
    for (let i = 0; i < 4; i++) {
      const periodTimestamp = listingTimestamp + (i * periodDuration)
      
      // If period is unlocked and not claimed
      if (currentTimestamp >= periodTimestamp && !vestingSchedule.claimedFlags[i]) {
        const periodAmount = i === 0 
          ? (vestingSchedule.totalTokens * 40) / 100  // 40% first period
          : (vestingSchedule.totalTokens * 20) / 100  // 20% other periods
        
        claimable += periodAmount
      }
    }
    
    return claimable
  }, [userPurchase, presaleConfig])

  const totalClaimed = userPurchase?.vestingSchedule.claimedAmounts.reduce((sum, amount) => sum + amount, 0) || 0
  const totalRemaining = totalTokensPurchased - totalClaimed

  return {
    // Data
    userPurchase,
    presaleConfig,
    totalTokensPurchased,
    totalClaimableNow,
    totalClaimed,
    totalRemaining,
    
    // State
    isLoading,
    error,
    lastTransaction,
    
    // Functions
    purchaseWithSOL,
    claimTokens,
    refreshData,
    
    // Smart contract info
    isSmartContractMode,
    programDeployed
  }
}

// Helper to get explorer URL for last transaction
export const useLastTransactionExplorer = (signature: string | null) => {
  return signature ? getExplorerUrl(signature, 'devnet') : null
}