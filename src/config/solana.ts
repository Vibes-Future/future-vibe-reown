// Solana configuration and connection setup
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { env } from './environment'

// Network configuration based on environment
export const SOLANA_NETWORK = env.network

// RPC endpoint configuration
export const SOLANA_RPC_URL = env.rpcUrl

// Create Solana connection instance
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

// Program IDs (to be updated with actual deployed programs)
export const PRESALE_PROGRAM_ID = env.presaleProgramId 
  ? new PublicKey(env.presaleProgramId)
  : null

export const STAKING_PROGRAM_ID = env.stakingProgramId
  ? new PublicKey(env.stakingProgramId)
  : null

// Token mint address (to be updated with actual token)
export const TOKEN_MINT_ADDRESS = env.tokenMintAddress
  ? new PublicKey(env.tokenMintAddress)
  : null

// Liquidity pool addresses for presale - safely handle empty addresses
export const LIQUIDITY_POOLS = {
  SOL: env.liquidityPoolSol && env.liquidityPoolSol !== '11111111111111111111111111111112' 
    ? new PublicKey(env.liquidityPoolSol)
    : null,
  USDC: env.liquidityPoolUsdc && env.liquidityPoolUsdc !== '11111111111111111111111111111112'
    ? new PublicKey(env.liquidityPoolUsdc)
    : null
} as const

// Constants for the application
export const CONSTANTS = {
  LAMPORTS_PER_SOL: 1000000000,
  TOKEN_DECIMALS: env.tokenDecimals,
  MIN_PRESALE_AMOUNT: env.minPresaleAmountSol,
  MAX_PRESALE_AMOUNT: env.maxPresaleAmountSol,
  MIN_PRESALE_USDC_AMOUNT: env.minPresaleAmountUsdc,
  MAX_PRESALE_USDC_AMOUNT: env.maxPresaleAmountUsdc,
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
