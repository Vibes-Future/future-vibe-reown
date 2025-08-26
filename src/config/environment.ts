// Environment configuration for Future Vibe application
// This file centralizes all environment variables and provides type safety

// Interface for environment configuration
export interface EnvironmentConfig {
  // Network Configuration
  network: 'devnet' | 'testnet' | 'mainnet-beta'
  rpcUrl: string
  
  // Reown AppKit
  projectId: string
  
  // Smart Contract Addresses
  presaleProgramId: string | null
  stakingProgramId: string | null
  tokenMintAddress: string | null
  
  // Liquidity Pool Addresses
  liquidityPoolSol: string
  liquidityPoolUsdc: string
  
  // Presale Configuration
  presaleHardCapSol: number
  presaleSoftCapSol: number
  presaleHardCapUsdc: number
  presaleSoftCapUsdc: number
  
  // Token Configuration
  tokenDecimals: number
  minPresaleAmountSol: number
  maxPresaleAmountSol: number
  minPresaleAmountUsdc: number
  maxPresaleAmountUsdc: number
  
  // Feature Flags
  enableDebugLogs: boolean
  enableSimulationMode: boolean
  
  // Computed Properties
  isMainnet: boolean
  isTestnet: boolean
  isDevnet: boolean
}

// Helper function to get environment variable with fallback
function getEnvVar(key: string, fallback: string = ''): string {
  // In Next.js, NEXT_PUBLIC_ variables are available in both server and client
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback
  }
  
  // Fallback for client-side
  if (typeof window !== 'undefined') {
    // Try to get from window object if available
    return (window as any)[key] || fallback
  }
  
  return fallback
}

// Helper function to get environment variable as number with fallback
function getEnvVarNumber(key: string, fallback: number): number {
  const value = getEnvVar(key)
  return value ? parseFloat(value) : fallback
}

// Helper function to get environment variable as boolean
function getEnvVarBoolean(key: string, fallback: boolean = false): boolean {
  const value = getEnvVar(key)
  return value ? value.toLowerCase() === 'true' : fallback
}

// Helper function to get Helius RPC URL based on network
function getHeliusRpcUrl(network: string): string {
  const apiKey = '10bdc822-0b46-4952-98fc-095c326565d7' // Your Helius API key
  
  switch (network) {
    case 'devnet':
      return `https://devnet.helius-rpc.com/?api-key=${apiKey}`
    case 'testnet':
      return `https://testnet.helius-rpc.com/?api-key=${apiKey}`
    case 'mainnet-beta':
      return `https://mainnet.helius-rpc.com/?api-key=${apiKey}`
    default:
      return `https://devnet.helius-rpc.com/?api-key=${apiKey}`
  }
}

// Main environment configuration
export const env: EnvironmentConfig = {
  // Network Configuration
  network: (getEnvVar('NEXT_PUBLIC_SOLANA_NETWORK', 'devnet') as 'devnet' | 'testnet' | 'mainnet-beta'),
  rpcUrl: getEnvVar('NEXT_PUBLIC_SOLANA_RPC_URL', getHeliusRpcUrl(getEnvVar('NEXT_PUBLIC_SOLANA_NETWORK', 'devnet'))),
  
  // Reown AppKit
  projectId: getEnvVar('NEXT_PUBLIC_PROJECT_ID', ''),
  
  // Smart Contract Addresses
  presaleProgramId: getEnvVar('NEXT_PUBLIC_PRESALE_PROGRAM_ID', '') || null,
  stakingProgramId: getEnvVar('NEXT_PUBLIC_STAKING_PROGRAM_ID', '') || null,
  tokenMintAddress: getEnvVar('NEXT_PUBLIC_TOKEN_MINT_ADDRESS', '') || null,
  
  // Liquidity Pool Addresses
  liquidityPoolSol: getEnvVar('NEXT_PUBLIC_LIQUIDITY_POOL_SOL', ''),
  liquidityPoolUsdc: getEnvVar('NEXT_PUBLIC_LIQUIDITY_POOL_USDC', ''),
  
  // Presale Configuration
  presaleHardCapSol: getEnvVarNumber('NEXT_PUBLIC_PRESALE_HARD_CAP_SOL', 10000),
  presaleSoftCapSol: getEnvVarNumber('NEXT_PUBLIC_PRESALE_SOFT_CAP_SOL', 1000),
  presaleHardCapUsdc: getEnvVarNumber('NEXT_PUBLIC_PRESALE_HARD_CAP_USDC', 10000000),
  presaleSoftCapUsdc: getEnvVarNumber('NEXT_PUBLIC_PRESALE_SOFT_CAP_USDC', 1000000),
  
  // Token Configuration
  tokenDecimals: getEnvVarNumber('NEXT_PUBLIC_TOKEN_DECIMALS', 9),
  minPresaleAmountSol: getEnvVarNumber('NEXT_PUBLIC_MIN_PRESALE_AMOUNT_SOL', 0.1),
  maxPresaleAmountSol: getEnvVarNumber('NEXT_PUBLIC_MAX_PRESALE_AMOUNT_SOL', 100),
  minPresaleAmountUsdc: getEnvVarNumber('NEXT_PUBLIC_MIN_PRESALE_AMOUNT_USDC', 10),
  maxPresaleAmountUsdc: getEnvVarNumber('NEXT_PUBLIC_MAX_PRESALE_AMOUNT_USDC', 10000),
  
  // Feature Flags
  enableDebugLogs: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_DEBUG_LOGS', true),
  enableSimulationMode: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_SIMULATION_MODE', true),
  
  // Computed Properties
  get isMainnet() { return this.network === 'mainnet-beta' },
  get isTestnet() { return this.network === 'testnet' },
  get isDevnet() { return this.network === 'devnet' }
}

// Validation function to check if required environment variables are set
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check required variables
  if (!env.projectId) {
    errors.push('NEXT_PUBLIC_PROJECT_ID is required')
  }
  
  if (!env.liquidityPoolSol) {
    errors.push('NEXT_PUBLIC_LIQUIDITY_POOL_SOL is required')
  }
  
  if (!env.liquidityPoolUsdc) {
    errors.push('NEXT_PUBLIC_LIQUIDITY_POOL_USDC is required')
  }
  
  // Check network-specific requirements
  if (env.isMainnet) {
    if (!env.presaleProgramId) {
      errors.push('NEXT_PUBLIC_PRESALE_PROGRAM_ID is required for mainnet')
    }
    if (!env.tokenMintAddress) {
      errors.push('NEXT_PUBLIC_TOKEN_MINT_ADDRESS is required for mainnet')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function to get environment info for debugging
export function getEnvironmentInfo(): string {
  return `
🌐 Environment Configuration:
   Network: ${env.network}
   RPC URL: ${env.rpcUrl}
   Project ID: ${env.projectId || 'NOT SET'}
   
🔗 Smart Contracts:
   Presale Program: ${env.presaleProgramId || 'NOT SET'}
   Token Mint: ${env.tokenMintAddress || 'NOT SET'}
   
💧 Liquidity Pools:
   SOL: ${env.liquidityPoolSol || 'NOT SET'}
   USDC: ${env.liquidityPoolUsdc || 'NOT SET'}
   
⚙️ Features:
   Debug Logs: ${env.enableDebugLogs}
   Simulation Mode: ${env.enableSimulationMode}
   
📊 Presale Caps:
   SOL: ${env.presaleSoftCapSol} - ${env.presaleHardCapSol}
   USDC: ${env.presaleSoftCapUsdc} - ${env.presaleHardCapUsdc}
  `.trim()
}

// Export default for convenience
export default env
