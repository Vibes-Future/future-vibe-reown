// Reown AppKit configuration for Solana integration
import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { env } from './environment'

// Simple AppKit initialization function
export function initializeAppKit() {
  try {
    // Validate environment
    if (!env.projectId) {
      throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
    }

    // Create Solana adapter
    const solanaAdapter = new SolanaAdapter({
      wallets: []
    })

    // Create custom network configuration
    const customSolanaDevnet = {
      ...solanaDevnet,
      rpcUrl: env.rpcUrl
    }

    // Initialize and return AppKit
    return createAppKit({
      adapters: [solanaAdapter],
      networks: [customSolanaDevnet, solanaTestnet, solana],
      defaultNetwork: customSolanaDevnet,
      metadata: {
        name: 'VIBES Token Presale',
        description: 'A decentralized application for token presale and staking on Solana',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      },
      projectId: env.projectId,
      features: {
        analytics: true,
        email: false,
        socials: []
      },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-font-family': 'system-ui, -apple-system, sans-serif',
        '--w3m-font-size-master': '10px',
      }
    })
  } catch (error) {
    console.error('Failed to initialize AppKit:', error)
    throw error
  }
}

// Lazy initialization
let appKitInstance: ReturnType<typeof initializeAppKit> | null = null

export function getAppKit() {
  if (!appKitInstance) {
    appKitInstance = initializeAppKit()
  }
  return appKitInstance
}

export default getAppKit
