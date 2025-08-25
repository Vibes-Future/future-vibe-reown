/**
 * Versión segura de la integración con Solana que evita problemas con BN y _bn
 */

import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

// Importar la implementación segura de Anchor
import { 
  createSafeProgram, 
  createSafePublicKey, 
  derivePDA, 
  createSafeBN,
  type SafeProgram 
} from '@/lib/anchor-safe'

// Program ID - will be updated after deployment
const PRESALE_PROGRAM_ID = process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID 
  ? process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID
  : null

const VIBES_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS
  ? createSafePublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS)
  : null

// Check if smart contracts are deployed
export const isSmartContractDeployed = Boolean(PRESALE_PROGRAM_ID && VIBES_MINT)

// Transaction result interfaces
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

// Initialize program connection using safe implementation
export const initializeProgram = async (wallet: any, connection: Connection): Promise<SafeProgram> => {
  if (!PRESALE_PROGRAM_ID) {
    throw new Error('Presale program not deployed yet')
  }

  try {
    console.log('🔄 Initializing safe program...')
    const program = await createSafeProgram(PRESALE_PROGRAM_ID, connection, wallet)
    console.log('✅ Safe program initialized successfully')
    return program
  } catch (error) {
    console.error('❌ Failed to initialize safe program:', error)
    throw error
  }
}

// Get presale configuration PDA using safe implementation
export const getPresaleConfigPDA = () => {
  if (!PRESALE_PROGRAM_ID) return null
  
  try {
    const programId = createSafePublicKey(PRESALE_PROGRAM_ID)
    const [presaleConfig] = derivePDA([Buffer.from('presale_config')], programId)
    return presaleConfig
  } catch (error) {
    console.error('Error deriving presale config PDA:', error)
    return null
  }
}

// Get user purchase PDA using safe implementation
export const getUserPurchasePDA = (userPublicKey: PublicKey) => {
  if (!PRESALE_PROGRAM_ID) return null
  
  try {
    const programId = createSafePublicKey(PRESALE_PROGRAM_ID)
    const [userPurchase] = derivePDA(
      [Buffer.from('user_purchase'), userPublicKey.toBuffer()],
      programId
    )
    return userPurchase
  } catch (error) {
    console.error('Error deriving user purchase PDA:', error)
    return null
  }
}

// Get presale vault PDA using safe implementation
export const getPresaleVaultPDA = () => {
  if (!PRESALE_PROGRAM_ID) return null
  
  try {
    const programId = createSafePublicKey(PRESALE_PROGRAM_ID)
    const [presaleVault] = derivePDA([Buffer.from('presale_vault')], programId)
    return presaleVault
  } catch (error) {
    console.error('Error deriving presale vault PDA:', error)
    return null
  }
}

// Purchase tokens with SOL using safe implementation
export const purchaseTokensWithSOL = async (
  wallet: any,
  connection: Connection,
  solAmount: number
): Promise<PurchaseResult> => {
  try {
    console.log('🚀 Purchasing tokens with SOL (safe mode):', solAmount)
    
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected')
    }

    // Initialize safe program
    const program = await initializeProgram(wallet, connection)

    // Convert SOL to lamports safely
    const solAmountLamports = createSafeBN(solAmount * LAMPORTS_PER_SOL)
    console.log('Converting SOL to lamports:', solAmount, '->', solAmountLamports.toString())

    // Get PDAs safely
    const presaleConfig = getPresaleConfigPDA()
    const userPurchase = getUserPurchasePDA(wallet.publicKey)
    const presaleVault = getPresaleVaultPDA()

    if (!presaleConfig || !userPurchase || !presaleVault) {
      throw new Error('Could not derive required PDAs')
    }

    // Execute transaction using safe program
    const signature = await program.methods
      .purchaseWithSol(solAmountLamports)
      .accounts({
        user: wallet.publicKey,
        presaleConfig,
        userPurchase,
        presaleVault,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    console.log('✅ SOL purchase transaction completed (safe mode):', signature)

    return {
      success: true,
      signature,
      explorerUrl: `https://solscan.io/tx/${signature}?cluster=devnet`,
      vibesAmount: solAmount * 1000, // Mock calculation based on current rate
    }
  } catch (error: any) {
    console.error('❌ Error purchasing tokens with SOL (safe mode):', error)
    return {
      success: false,
      error: error.message || 'Failed to purchase tokens with SOL'
    }
  }
}

// Purchase tokens with USDC using safe implementation
export const purchaseTokensWithUSDC = async (
  wallet: any,
  connection: Connection,
  usdcAmount: number
): Promise<PurchaseResult> => {
  try {
    console.log('🚀 Purchasing tokens with USDC (safe mode):', usdcAmount)
    
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected')
    }

    // Initialize safe program
    const program = await initializeProgram(wallet, connection)

    // Convert USDC to micro-USDC (6 decimals)
    const usdcAmountMicro = createSafeBN(usdcAmount * 1_000_000)
    console.log('Converting USDC to micro-USDC:', usdcAmount, '->', usdcAmountMicro.toString())

    // Get PDAs safely
    const presaleConfig = getPresaleConfigPDA()
    const userPurchase = getUserPurchasePDA(wallet.publicKey)

    if (!presaleConfig || !userPurchase) {
      throw new Error('Could not derive required PDAs')
    }

    // Execute transaction using safe program
    const signature = await program.methods
      .purchaseWithUsdc(usdcAmountMicro)
      .accounts({
        user: wallet.publicKey,
        presaleConfig,
        userPurchase,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    console.log('✅ USDC purchase transaction completed (safe mode):', signature)

    return {
      success: true,
      signature,
      explorerUrl: `https://solscan.io/tx/${signature}?cluster=devnet`,
      vibesAmount: usdcAmount * 1000, // Mock calculation based on current rate
    }
  } catch (error: any) {
    console.error('❌ Error purchasing tokens with USDC (safe mode):', error)
    return {
      success: false,
      error: error.message || 'Failed to purchase tokens with USDC'
    }
  }
}

// Claim vested tokens using safe implementation
export const claimVestedTokens = async (
  wallet: any,
  connection: Connection,
  scheduleIndex: number
): Promise<ClaimResult> => {
  try {
    console.log('🚀 Claiming vested tokens (safe mode), schedule index:', scheduleIndex)
    
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected')
    }

    // Initialize safe program
    const program = await initializeProgram(wallet, connection)

    // Get PDAs safely
    const presaleConfig = getPresaleConfigPDA()
    const userPurchase = getUserPurchasePDA(wallet.publicKey)

    if (!presaleConfig || !userPurchase) {
      throw new Error('Could not derive required PDAs')
    }

    // Execute transaction using safe program
    const signature = await program.methods
      .claimVestedTokens(scheduleIndex)
      .accounts({
        user: wallet.publicKey,
        presaleConfig,
        userPurchase,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    console.log('✅ Claim transaction completed (safe mode):', signature)

    return {
      success: true,
      signature,
      explorerUrl: `https://solscan.io/tx/${signature}?cluster=devnet`,
      claimedAmount: 250, // Mock amount (25% of 1000 tokens)
      period: scheduleIndex
    }
  } catch (error: any) {
    console.error('❌ Error claiming vested tokens (safe mode):', error)
    return {
      success: false,
      error: error.message || 'Failed to claim vested tokens'
    }
  }
}

// Get presale configuration data using safe implementation
export const getPresaleConfigData = async (connection: Connection) => {
  if (!PRESALE_PROGRAM_ID) {
    console.log('❌ Presale program not deployed yet')
    return null
  }

  try {
    console.log('🔄 Fetching presale config data (safe mode)...')
    
    // Create a dummy wallet for read-only operations
    const dummyWallet = {
      publicKey: createSafePublicKey('11111111111111111111111111111112'),
      signTransaction: async (tx: Transaction) => tx,
      signAllTransactions: async (txs: Transaction[]) => txs,
      signMessage: async (message: Uint8Array) => message,
      connect: async () => {},
      disconnect: async () => {}
    }

    const program = await initializeProgram(dummyWallet, connection)
    const presaleConfigPDA = getPresaleConfigPDA()
    
    if (!presaleConfigPDA) {
      throw new Error('Could not derive presale config PDA')
    }

    const configData = await program.account.presaleConfig.fetch(presaleConfigPDA)
    console.log('✅ Presale config data fetched (safe mode):', configData)
    
    return configData
  } catch (error) {
    console.error('❌ Failed to fetch presale config data (safe mode):', error)
    return null
  }
}

// Get user purchase data using safe implementation
export const getUserPurchaseData = async (connection: Connection, userPublicKey: PublicKey) => {
  if (!PRESALE_PROGRAM_ID) {
    console.log('❌ Presale program not deployed yet')
    return null
  }

  try {
    console.log('🔄 Fetching user purchase data (safe mode)...', userPublicKey.toString())
    
    // Create a wallet adapter for read-only operations
    const walletAdapter = {
      publicKey: userPublicKey,
      signTransaction: async (tx: Transaction) => tx,
      signAllTransactions: async (txs: Transaction[]) => txs,
      signMessage: async (message: Uint8Array) => message,
      connect: async () => {},
      disconnect: async () => {}
    }

    const program = await initializeProgram(walletAdapter, connection)
    const userPurchasePDA = getUserPurchasePDA(userPublicKey)
    
    if (!userPurchasePDA) {
      throw new Error('Could not derive user purchase PDA')
    }

    const purchaseData = await program.account.userPurchase.fetch(userPurchasePDA)
    console.log('✅ User purchase data fetched (safe mode):', purchaseData)
    
    return purchaseData
  } catch (error) {
    console.error('❌ Failed to fetch user purchase data (safe mode):', error)
    // Return null if account doesn't exist (user hasn't made any purchases)
    return null
  }
}

// Default connection
export const getConnection = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  return new Connection(rpcUrl, 'confirmed')
}

// Get explorer URL for a transaction
export const getExplorerUrl = (signature: string, cluster: string = 'devnet') => {
  return `https://solscan.io/tx/${signature}?cluster=${cluster}`
}
