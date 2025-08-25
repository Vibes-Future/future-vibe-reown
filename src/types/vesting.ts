// Vesting and Claims Type Definitions for VIBES Token

export interface VestingSchedule {
  totalTokens: number
  listingTimestamp: Date
  claimablePercentages: number[] // [40, 20, 20, 20] for each period
  claimDates: Date[] // Calculated claim dates
  claimedAmounts: number[] // How much has been claimed in each period
  isListed: boolean // Whether token has been listed (enables first claim)
}

export interface UserPurchase {
  id: string
  purchaseDate: Date
  solAmount: number
  usdcAmount: number
  tokensPurchased: number
  solPriceAtPurchase: number
  tokenPriceAtPurchase: number
  vestingSchedule: VestingSchedule
  transactionSignature: string
}

export interface ClaimableTokens {
  totalClaimable: number
  periodsAvailable: {
    period: number
    percentage: number
    amount: number
    claimDate: Date
    isClaimed: boolean
    isAvailable: boolean
  }[]
  nextClaimDate: Date | null
  nextClaimAmount: number
}

export interface ClaimTransaction {
  period: number
  amount: number
  timestamp: Date
  signature: string
}

export interface PresaleConfig {
  listingDate: Date | null // When tokens will be listed and first claims available
  vestingPeriodDays: number // 30 days between each claim
  initialClaimPercentage: number // 40%
  monthlyClaimPercentage: number // 20%
  totalVestingPeriods: number // 4 periods total
}

// Default vesting configuration
export const DEFAULT_VESTING_CONFIG: PresaleConfig = {
  listingDate: new Date('2026-08-01T00:00:00Z'), // Example listing date
  vestingPeriodDays: 30,
  initialClaimPercentage: 40,
  monthlyClaimPercentage: 20,
  totalVestingPeriods: 4
}

// Vesting calculation utilities
export class VestingCalculator {
  
  /**
   * Create vesting schedule for a purchase
   */
  static createVestingSchedule(
    tokensPurchased: number, 
    config: PresaleConfig = DEFAULT_VESTING_CONFIG
  ): VestingSchedule {
    
    if (!config.listingDate) {
      throw new Error('Listing date must be set')
    }

    const claimDates: Date[] = []
    const claimablePercentages = [
      config.initialClaimPercentage,
      ...Array(config.totalVestingPeriods - 1).fill(config.monthlyClaimPercentage)
    ]
    
    // Calculate claim dates starting from listing date
    for (let i = 0; i < config.totalVestingPeriods; i++) {
      const claimDate = new Date(config.listingDate)
      claimDate.setDate(claimDate.getDate() + (i * config.vestingPeriodDays))
      claimDates.push(claimDate)
    }

    return {
      totalTokens: tokensPurchased,
      listingTimestamp: config.listingDate,
      claimablePercentages,
      claimDates,
      claimedAmounts: new Array(config.totalVestingPeriods).fill(0),
      isListed: new Date() >= config.listingDate
    }
  }

  /**
   * Calculate claimable tokens for current time
   */
  static calculateClaimableTokens(vestingSchedule: VestingSchedule): ClaimableTokens {
    const now = new Date()
    let totalClaimable = 0
    const periodsAvailable = []
    let nextClaimDate: Date | null = null
    let nextClaimAmount = 0

    for (let i = 0; i < vestingSchedule.claimDates.length; i++) {
      const claimDate = vestingSchedule.claimDates[i]
      const percentage = vestingSchedule.claimablePercentages[i]
      const amount = (vestingSchedule.totalTokens * percentage) / 100
      const isClaimed = vestingSchedule.claimedAmounts[i] > 0
      const isAvailable = vestingSchedule.isListed && now >= claimDate && !isClaimed

      if (isAvailable) {
        totalClaimable += amount
      }

      // Find next claim date
      if (!nextClaimDate && now < claimDate && !isClaimed) {
        nextClaimDate = claimDate
        nextClaimAmount = amount
      }

      periodsAvailable.push({
        period: i + 1,
        percentage,
        amount,
        claimDate,
        isClaimed,
        isAvailable
      })
    }

    return {
      totalClaimable,
      periodsAvailable,
      nextClaimDate,
      nextClaimAmount
    }
  }

  /**
   * Calculate total claimed so far
   */
  static getTotalClaimed(vestingSchedule: VestingSchedule): number {
    return vestingSchedule.claimedAmounts.reduce((sum, amount) => sum + amount, 0)
  }

  /**
   * Calculate remaining tokens to claim
   */
  static getRemainingTokens(vestingSchedule: VestingSchedule): number {
    const totalClaimed = this.getTotalClaimed(vestingSchedule)
    return vestingSchedule.totalTokens - totalClaimed
  }

  /**
   * Get vesting progress percentage
   */
  static getVestingProgress(vestingSchedule: VestingSchedule): number {
    const totalClaimed = this.getTotalClaimed(vestingSchedule)
    return (totalClaimed / vestingSchedule.totalTokens) * 100
  }
}
