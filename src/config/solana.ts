// Solana configuration and connection setup
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

// Network configuration based on environment
export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet-beta' | 'testnet' | 'devnet') || 'devnet'

// RPC endpoint configuration
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK)

// Create Solana connection instance
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

// Program IDs (to be updated with actual deployed programs)
export const PRESALE_PROGRAM_ID = process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID 
  ? new PublicKey(process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID)
  : null

export const STAKING_PROGRAM_ID = process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID
  ? new PublicKey(process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID)
  : null

// Token mint address (to be updated with actual token)
export const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS
  ? new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS)
  : null

// Constants for the application
export const CONSTANTS = {
  LAMPORTS_PER_SOL: 1000000000,
  TOKEN_DECIMALS: 9,
  MIN_PRESALE_AMOUNT: 0.1, // Minimum SOL amount for presale
  MAX_PRESALE_AMOUNT: 100, // Maximum SOL amount for presale
  PRESALE_TOKEN_RATE: 1000, // Tokens per SOL
  STAKING_APY: 15, // Annual percentage yield for staking
} as const

// Helper function to format SOL amounts (deprecated - use formatters from utils)
export const formatSOL = (lamports: number): string => {
  return (lamports / CONSTANTS.LAMPORTS_PER_SOL).toFixed(4)
}

// Helper function to format token amounts (deprecated - use formatters from utils)
export const formatTokens = (amount: number): string => {
  return (amount / Math.pow(10, CONSTANTS.TOKEN_DECIMALS)).toFixed(2)
}
