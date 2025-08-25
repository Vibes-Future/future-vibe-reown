import { web3, Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor'
import { PublicKey, Connection } from '@solana/web3.js'

// Anchor configuration
export const ANCHOR_CONFIG = {
  commitment: 'confirmed' as web3.Commitment,
  preflightCommitment: 'confirmed' as web3.Commitment,
  skipPreflight: false
}

// Custom provider setup
export class CustomAnchorProvider extends AnchorProvider {
  constructor(connection: Connection, wallet: any, opts: any) {
    super(connection, wallet, opts)
  }

  // Override to handle BN initialization
  static initialize(connection: Connection, wallet: any) {
    return new CustomAnchorProvider(
      connection,
      wallet,
      ANCHOR_CONFIG
    )
  }
}

// Program initialization with proper BN context
export const initializeAnchorProgram = (
  idl: Idl,
  programId: PublicKey,
  provider: CustomAnchorProvider
) => {
  try {
    // Initialize BN context first
    const bn = BN.prototype ? BN : require('bn.js')
    
    // Create program with initialized BN
    return new Program(
      idl,
      programId,
      provider,
      undefined,
      () => bn
    )
  } catch (error) {
    console.error('Failed to initialize Anchor program:', error)
    throw error
  }
}
