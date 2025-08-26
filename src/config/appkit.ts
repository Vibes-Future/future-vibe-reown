// Reown AppKit configuration for Solana integration
import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { env } from './environment'

// Get project ID from environment variables
const projectId = env.projectId

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
}

// Custom RPC URL from environment configuration
const customRpcUrl = env.rpcUrl

// Configure Solana adapter with custom RPC
const solanaAdapter = new SolanaAdapter({
  wallets: [] // Auto-discovers wallets
})

// Define custom Solana networks with your RPC
const customSolanaDevnet = {
  ...solanaDevnet,
  rpcUrl: customRpcUrl
}

// Initialize AppKit
export const appKit = createAppKit({
  adapters: [solanaAdapter],
  networks: [customSolanaDevnet, solanaTestnet, solana],
  defaultNetwork: customSolanaDevnet,
  metadata: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Solana Presale & Staking',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A decentralized application for token presale and staking on Solana',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  projectId,
  features: {
    analytics: true, // Optional - turn on/off analytics
    email: false, // Optional - turn on/off email login
    socials: [] // Optional - add social logins
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'system-ui, -apple-system, sans-serif', // Usar fuentes del sistema
    '--w3m-font-size-master': '10px',
  }
})

export default appKit
