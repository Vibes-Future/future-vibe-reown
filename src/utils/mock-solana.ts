/**
 * MOCK SOLANA INTEGRATION
 * 
 * Este archivo proporciona una implementación simulada de interacciones con la blockchain
 * para permitir que la interfaz funcione sin necesidad de conexiones reales a la blockchain.
 * 
 * En un entorno de producción, esto sería reemplazado por interacciones reales con Solana.
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'

// Program ID - from environment variables
export const PRESALE_PROGRAM_ID = process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID 
  ? new PublicKey(process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID)
  : null

export const VIBES_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS
  ? new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS)
  : null

// Check if smart contracts are deployed
export const isSmartContractDeployed = Boolean(PRESALE_PROGRAM_ID && VIBES_MINT)

// Transaction result interface
export interface TransactionResult {
  success: boolean
  signature?: string
  error?: string
  explorerUrl?: string
}

export interface PurchaseResult extends TransactionResult {
  vibesAmount?: number
  vestingSchedule?: any
}

export interface ClaimResult extends TransactionResult {
  claimedAmount?: number
  period?: number
}

// Mock data for presale configuration
const mockPresaleConfig = {
  authority: "HwSrWhRHqrEBRn1rwF2TuU7jE5SmpEynwZUbA7EgxbfP",
  vibesMint: VIBES_MINT?.toString() || "",
  listingTimestamp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  solToVibesRate: 100,
  usdcToVibesRate: 10,
  totalSold: 5000000,
  isActive: true
}

// Mock data for user purchase
const createMockUserPurchase = (userAddress: string, purchaseAmount: number = 0) => ({
  user: userAddress,
  totalTokensPurchased: purchaseAmount,
  totalSolSpent: purchaseAmount > 0 ? purchaseAmount / 100 : 0,
  totalUsdcSpent: 0,
  purchaseCount: purchaseAmount > 0 ? 1 : 0,
  vestingSchedule: {
    totalTokens: purchaseAmount,
    listingTimestamp: mockPresaleConfig.listingTimestamp,
    claimedAmounts: [0, 0, 0, 0],
    claimedFlags: [false, false, false, false]
  }
})

// Store mock data in localStorage to persist between page reloads
const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

const getFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch (e) {
    console.error('Failed to get from localStorage:', e)
    return defaultValue
  }
}

// Initialize mock storage from localStorage
const mockStorage = {
  purchases: new Map(Object.entries(getFromLocalStorage('vibes_purchases', {})))
}

// Get presale configuration PDA
export const getPresaleConfigPDA = () => {
  if (!PRESALE_PROGRAM_ID) return null
  
  return new PublicKey("bRqMfCtLMXBBKnsmBdRDdakTWTmZEtxxbRqMfCtLMXBB")
}

// Get user purchase PDA
export const getUserPurchasePDA = (userPublicKey: PublicKey) => {
  if (!PRESALE_PROGRAM_ID) return null
  
  return new PublicKey(userPublicKey.toString().slice(0, 32))
}

// Get presale vault PDA
export const getPresaleVaultPDA = () => {
  if (!PRESALE_PROGRAM_ID) return null
  
  return new PublicKey("4eh7SquJxD2r2pcF7wpwjY2RJEMJ5fQN4eh7SquJxD2r")
}

// Purchase tokens with SOL
export const purchaseTokensWithSOL = async (
  wallet: any,
  connection: Connection,
  solAmount: number
): Promise<PurchaseResult> => {
  try {
    if (!PRESALE_PROGRAM_ID || !wallet.publicKey) {
      throw new Error('Program not initialized or wallet not connected')
    }

    console.log('🔗 [SMART CONTRACT] Purchasing with SOL:', { solAmount })

    // Simulate wallet confirmation dialog
    if (!confirm(`[SIMULACIÓN] ¿Confirmas la compra de tokens con ${solAmount} SOL?`)) {
      return {
        success: false,
        error: 'User rejected transaction'
      }
    }

    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate mock transaction signature
    const signature = `sim${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`
    
    // Calculate VIBES amount based on SOL amount and rate
    const vibesAmount = solAmount * mockPresaleConfig.solToVibesRate
    
    // Store purchase in mock storage
    const userAddress = wallet.publicKey.toString()
    const existingPurchase = mockStorage.purchases.get(userAddress)
    
    if (existingPurchase) {
      existingPurchase.totalTokensPurchased += vibesAmount
      existingPurchase.totalSolSpent += solAmount
      existingPurchase.purchaseCount += 1
      existingPurchase.vestingSchedule.totalTokens += vibesAmount
      mockStorage.purchases.set(userAddress, existingPurchase)
    } else {
      mockStorage.purchases.set(userAddress, createMockUserPurchase(userAddress, vibesAmount))
    }
    
    // Save to localStorage
    const purchasesObj = Object.fromEntries(mockStorage.purchases)
    saveToLocalStorage('vibes_purchases', purchasesObj)
    
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    
    console.log('✅ [SMART CONTRACT] Purchase successful:', {
      signature,
      vibesAmount,
      vestingSchedule: mockStorage.purchases.get(userAddress).vestingSchedule
    })

    return {
      success: true,
      signature,
      explorerUrl,
      vibesAmount,
      vestingSchedule: mockStorage.purchases.get(userAddress).vestingSchedule
    }

  } catch (error: any) {
    console.error('❌ [SMART CONTRACT] Purchase failed:', error)
    
    return {
      success: false,
      error: error.message || 'Purchase failed'
    }
  }
}

// Claim vested tokens
export const claimVestedTokens = async (
  wallet: any,
  connection: Connection,
  period: number
): Promise<ClaimResult> => {
  try {
    if (!PRESALE_PROGRAM_ID || !wallet.publicKey || !VIBES_MINT) {
      throw new Error('Program not initialized or wallet not connected')
    }

    console.log('🔗 [SMART CONTRACT] Claiming vested tokens:', { period })

    // Get user purchase from mock storage
    const userAddress = wallet.publicKey.toString()
    const userPurchase = mockStorage.purchases.get(userAddress)
    
    if (!userPurchase) {
      throw new Error('No purchase found for this user')
    }
    
    // Calculate claimable amount based on period
    const totalTokens = userPurchase.vestingSchedule.totalTokens
    let claimableAmount = 0
    
    if (period === 0) {
      // 40% for first period
      claimableAmount = totalTokens * 0.4
    } else if (period >= 1 && period <= 3) {
      // 20% for other periods
      claimableAmount = totalTokens * 0.2
    } else {
      throw new Error('Invalid vesting period')
    }
    
    // Check if already claimed
    if (userPurchase.vestingSchedule.claimedFlags[period]) {
      throw new Error('Tokens for this period already claimed')
    }

    // Simulate wallet confirmation dialog
    if (!confirm(`[SIMULACIÓN] ¿Confirmas el reclamo de ${claimableAmount.toFixed(2)} tokens del periodo ${period + 1}?`)) {
      return {
        success: false,
        error: 'User rejected transaction'
      }
    }

    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate mock transaction signature
    const signature = `sim${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`
    
    // Update claimed status
    userPurchase.vestingSchedule.claimedAmounts[period] = claimableAmount
    userPurchase.vestingSchedule.claimedFlags[period] = true
    mockStorage.purchases.set(userAddress, userPurchase)
    
    // Save to localStorage
    const purchasesObj = Object.fromEntries(mockStorage.purchases)
    saveToLocalStorage('vibes_purchases', purchasesObj)
    
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    
    console.log('✅ [SMART CONTRACT] Claim successful:', {
      signature,
      period,
      claimedAmount: claimableAmount
    })

    return {
      success: true,
      signature,
      explorerUrl,
      claimedAmount: claimableAmount,
      period
    }

  } catch (error: any) {
    console.error('❌ [SMART CONTRACT] Claim failed:', error)
    
    return {
      success: false,
      error: error.message || 'Claim failed'
    }
  }
}

// Get user purchase data from blockchain
export const getUserPurchaseData = async (
  connection: Connection,
  userPublicKey: PublicKey,
  wallet: any = null
): Promise<any> => {
  try {
    if (!PRESALE_PROGRAM_ID) {
      throw new Error('Program not deployed')
    }

    const userAddress = userPublicKey.toString()
    const userPurchase = mockStorage.purchases.get(userAddress)
    
    return userPurchase || null

  } catch (error) {
    console.error('Failed to fetch user purchase data:', error)
    return null
  }
}

// Get presale configuration from blockchain
export const getPresaleConfigData = async (
  connection: Connection,
  wallet: any = null
): Promise<any> => {
  try {
    if (!PRESALE_PROGRAM_ID) {
      throw new Error('Program not deployed')
    }
    
    return mockPresaleConfig

  } catch (error) {
    console.error('Failed to fetch presale config:', error)
    return null
  }
}

// Generate explorer URL for transaction
export const getExplorerUrl = (signature: string, cluster: string = 'devnet'): string => {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
}

// Generate explorer URL for account
export const getExplorerAccountUrl = (address: string, cluster: string = 'devnet'): string => {
  return `https://explorer.solana.com/account/${address}?cluster=${cluster}`
}

// Utility function to clear mock data (for testing)
export const clearMockData = () => {
  mockStorage.purchases.clear()
  localStorage.removeItem('vibes_purchases')
  console.log('🧹 Mock data cleared')
}