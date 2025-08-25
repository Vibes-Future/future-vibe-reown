// Integration layer for Solana smart contracts
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createBrowserProgram, solToLamports, createBN } from '@/lib/anchor-browser'

// Program ID - will be updated after deployment
const PRESALE_PROGRAM_ID = process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID 
  ? process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID
  : null

const VIBES_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS
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

// Initialize program connection
export const initializeProgram = async (wallet: any, connection: Connection) => {
  if (!PRESALE_PROGRAM_ID) {
    throw new Error('Presale program not deployed yet')
  }

  try {
    // Usar nuestra implementación compatible con el navegador
    return createBrowserProgram(PRESALE_PROGRAM_ID, connection, wallet);
  } catch (error) {
    console.error('Failed to initialize program:', error)
    throw error
  }
}

// Get presale configuration PDA
export const getPresaleConfigPDA = () => {
  if (!PRESALE_PROGRAM_ID) return null
  
  const [presaleConfig] = PublicKey.findProgramAddressSync(
    [Buffer.from('presale_config')],
    new PublicKey(PRESALE_PROGRAM_ID)
  )
  
  return presaleConfig
}

// Get user purchase PDA
export const getUserPurchasePDA = (userPublicKey: PublicKey) => {
  if (!PRESALE_PROGRAM_ID) return null
  
  const [userPurchase] = PublicKey.findProgramAddressSync(
    [Buffer.from('user_purchase'), userPublicKey.toBuffer()],
    new PublicKey(PRESALE_PROGRAM_ID)
  )
  
  return userPurchase
}

// Get presale vault PDA
export const getPresaleVaultPDA = () => {
  if (!PRESALE_PROGRAM_ID) return null
  
  const [presaleVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('presale_vault')],
    new PublicKey(PRESALE_PROGRAM_ID)
  )
  
  return presaleVault
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

    const program = await initializeProgram(wallet, connection)
    const userPublicKey = wallet.publicKey

    // Get PDAs
    const presaleConfig = getPresaleConfigPDA()
    const userPurchase = getUserPurchasePDA(userPublicKey)
    const presaleVault = getPresaleVaultPDA()

    if (!presaleConfig || !userPurchase || !presaleVault) {
      throw new Error('Failed to derive PDAs')
    }

    // Convert SOL to lamports using our helper
    const solAmountLamports = solToLamports(solAmount)

    // Create transaction
    const tx = await program.methods
      .purchaseWithSol(solAmountLamports)
      .accounts({
        presaleConfig,
        userPurchase,
        user: userPublicKey,
        presaleVault,
        systemProgram: SystemProgram.programId
      })
      .transaction()

    // Send transaction
    const signature = await wallet.sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

    // Get updated user purchase data to return vesting info
    const userPurchaseData = await program.account.userPurchase.fetch(userPurchase)
    
    console.log('✅ [SMART CONTRACT] Purchase successful:', {
      signature,
      vibesAmount: userPurchaseData.totalTokensPurchased.toString(),
      vestingSchedule: userPurchaseData.vestingSchedule
    })

    return {
      success: true,
      signature,
      explorerUrl,
      vibesAmount: Number(userPurchaseData.totalTokensPurchased),
      vestingSchedule: userPurchaseData.vestingSchedule
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

    const program = await initializeProgram(wallet, connection)
    const userPublicKey = wallet.publicKey

    // Get PDAs
    const presaleConfig = getPresaleConfigPDA()
    const userPurchase = getUserPurchasePDA(userPublicKey)
    
    // Get user's VIBES token account
    const userVibesAccount = await getAssociatedTokenAddress(
      VIBES_MINT,
      userPublicKey
    )

    // Get presale VIBES vault (would be derived from presale config)
    const presaleVibesVault = await getAssociatedTokenAddress(
      VIBES_MINT,
      presaleConfig!
    )

    if (!presaleConfig || !userPurchase) {
      throw new Error('Failed to derive PDAs')
    }

    // Create transaction
    const tx = await program.methods
      .claimVestedTokens(period)
      .accounts({
        presaleConfig,
        userPurchase,
        user: userPublicKey,
        userVibesAccount,
        presaleVibesVault,
        vibesMint: VIBES_MINT,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .transaction()

    // Send transaction
    const signature = await wallet.sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

    // Calculate claimed amount (simplified)
    const userPurchaseData = await program.account.userPurchase.fetch(userPurchase)
    const claimedAmount = Number(userPurchaseData.vestingSchedule.claimedAmounts[period])

    console.log('✅ [SMART CONTRACT] Claim successful:', {
      signature,
      period,
      claimedAmount
    })

    return {
      success: true,
      signature,
      explorerUrl,
      claimedAmount,
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
  userPublicKey: PublicKey
): Promise<any> => {
  try {
    if (!PRESALE_PROGRAM_ID) {
      throw new Error('Program not deployed')
    }

    // Create a wallet adapter compatible con Anchor
    const walletAdapter = {
      publicKey: userPublicKey,
      signTransaction: async (tx: Transaction) => tx,
      signAllTransactions: async (txs: Transaction[]) => txs,
      // Añadir métodos adicionales que Anchor podría necesitar
      signMessage: async (message: Uint8Array) => message,
      connect: async () => {},
      disconnect: async () => {}
    }

    // Inicializar programa con manejo de errores
    let program;
    try {
      program = await initializeProgram(walletAdapter, connection);
    } catch (initError) {
      console.error('Failed to initialize program in getUserPurchaseData:', initError);
      return null;
    }

    const userPurchase = getUserPurchasePDA(userPublicKey)

    if (!userPurchase) {
      throw new Error('Failed to derive user purchase PDA')
    }

    try {
      const userPurchaseData = await program.account.userPurchase.fetch(userPurchase)
      return userPurchaseData
    } catch (error: any) {
      // Verificar si el error es porque la cuenta no existe
      if (error.message?.includes('Account does not exist') || 
          error.message?.includes('not found')) {
        console.log('User purchase account not found - this is normal for new users');
        return null;
      }
      
      console.error('Error fetching user purchase data:', error);
      return null;
    }

  } catch (error) {
    console.error('Failed to fetch user purchase data:', error)
    return null
  }
}

// Get presale configuration from blockchain
export const getPresaleConfigData = async (
  connection: Connection
): Promise<any> => {
  try {
    if (!PRESALE_PROGRAM_ID) {
      throw new Error('Program not deployed')
    }

    // Create a wallet adapter compatible con Anchor
    const walletAdapter = {
      publicKey: new PublicKey('11111111111111111111111111111111'),
      signTransaction: async (tx: Transaction) => tx,
      signAllTransactions: async (txs: Transaction[]) => txs,
      // Añadir métodos adicionales que Anchor podría necesitar
      signMessage: async (message: Uint8Array) => message,
      connect: async () => {},
      disconnect: async () => {}
    }

    // Inicializar programa con manejo de errores
    let program;
    try {
      program = await initializeProgram(walletAdapter, connection);
    } catch (initError) {
      console.error('Failed to initialize program in getPresaleConfigData:', initError);
      return null;
    }
    
    const presaleConfig = getPresaleConfigPDA()

    if (!presaleConfig) {
      throw new Error('Failed to derive presale config PDA')
    }

    try {
      const configData = await program.account.presaleConfig.fetch(presaleConfig)
      return configData
    } catch (error: any) {
      // Verificar si el error es porque la cuenta no existe
      if (error.message?.includes('Account does not exist') || 
          error.message?.includes('not found')) {
        console.log('Presale config account not found - this is normal during initialization');
        return null;
      }
      
      console.error('Error fetching presale config data:', error);
      return null;
    }

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