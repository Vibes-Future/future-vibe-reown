// Simple environment configuration for Future Vibe application
export const env = {
  // Reown AppKit - REQUIRED
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  
  // Solana Configuration
  rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=10bdc822-0b46-4952-98fc-095c326565d7',
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'testnet' | 'mainnet-beta',
  
  // Smart Contract Addresses
  presaleProgramId: process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID || null,
  tokenMintAddress: process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS || null,
  
  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'VIBES Token Presale',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A decentralized application for token presale and staking on Solana',
  
  // Development
  isDev: process.env.NODE_ENV === 'development'
}

// Validation function
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!env.projectId) {
    errors.push('NEXT_PUBLIC_PROJECT_ID is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default env
