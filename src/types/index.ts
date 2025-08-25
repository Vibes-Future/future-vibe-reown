// TypeScript type definitions for the Solana Presale & Staking application

export interface PresaleData {
  isActive: boolean
  totalTokensSold: number
  totalSOLRaised: number
  tokenPrice: number // SOL per token
  maxTokensPerWallet: number
  minPurchaseAmount: number
  maxPurchaseAmount: number
  startTime: Date
  endTime: Date
}

export interface StakingData {
  isActive: boolean
  totalStaked: number
  totalRewards: number
  apy: number
  lockPeriod: number // in days
  minimumStakeAmount: number
}

export interface UserPresaleData {
  tokensPurchased: number
  solSpent: number
  lastPurchaseTime: Date | null
}

export interface UserStakingData {
  stakedAmount: number
  stakingStartTime: Date | null
  accumulatedRewards: number
  lastClaimTime: Date | null
  isUnlocked: boolean
}

export interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export interface TransactionResult {
  success: boolean
  signature?: string
  error?: string
}

export interface PresaleTransaction {
  amount: number // SOL amount
  expectedTokens: number
}

export interface StakingTransaction {
  amount: number // Token amount
  action: 'stake' | 'unstake' | 'claim'
}

// Utility types
export type NetworkType = 'mainnet-beta' | 'testnet' | 'devnet'
export type TransactionStatus = 'pending' | 'confirmed' | 'failed'

// Component prop types
export interface PresaleComponentProps {
  presaleData: PresaleData
  userData: UserPresaleData
  onPurchase: (transaction: PresaleTransaction) => Promise<TransactionResult>
}

export interface StakingComponentProps {
  stakingData: StakingData
  userData: UserStakingData
  onStake: (transaction: StakingTransaction) => Promise<TransactionResult>
  onUnstake: (transaction: StakingTransaction) => Promise<TransactionResult>
  onClaim: () => Promise<TransactionResult>
}
