// VIBES Token Presale Pricing Configuration
// Monthly pricing structure for presale periods

export interface PresalePeriod {
  month: string
  year: number
  priceUSD: number // Price per token in USD
  startDate: Date
  endDate: Date
}

// Monthly pricing schedule for VIBES token presale
export const PRESALE_PRICING: PresalePeriod[] = [
  {
    month: 'July',
    year: 2025,
    priceUSD: 0.0598,
    startDate: new Date('2025-07-01T00:00:00Z'),
    endDate: new Date('2025-07-31T23:59:59Z')
  },
  {
    month: 'August',
    year: 2025,
    priceUSD: 0.0658,
    startDate: new Date('2025-08-01T00:00:00Z'),
    endDate: new Date('2025-08-31T23:59:59Z')
  },
  {
    month: 'September',
    year: 2025,
    priceUSD: 0.0718,
    startDate: new Date('2025-09-01T00:00:00Z'),
    endDate: new Date('2025-09-30T23:59:59Z')
  },
  {
    month: 'October',
    year: 2025,
    priceUSD: 0.0777,
    startDate: new Date('2025-10-01T00:00:00Z'),
    endDate: new Date('2025-10-31T23:59:59Z')
  },
  {
    month: 'December',
    year: 2025,
    priceUSD: 0.0837,
    startDate: new Date('2025-12-01T00:00:00Z'),
    endDate: new Date('2025-12-31T23:59:59Z')
  },
  {
    month: 'January',
    year: 2026,
    priceUSD: 0.0897,
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-01-31T23:59:59Z')
  },
  {
    month: 'February',
    year: 2026,
    priceUSD: 0.0957,
    startDate: new Date('2026-02-01T00:00:00Z'),
    endDate: new Date('2026-02-28T23:59:59Z')
  },
  {
    month: 'March',
    year: 2026,
    priceUSD: 0.1017,
    startDate: new Date('2026-03-01T00:00:00Z'),
    endDate: new Date('2026-03-31T23:59:59Z')
  },
  {
    month: 'April',
    year: 2026,
    priceUSD: 0.1047,
    startDate: new Date('2026-04-01T00:00:00Z'),
    endDate: new Date('2026-04-30T23:59:59Z')
  },
  {
    month: 'May',
    year: 2026,
    priceUSD: 0.1077,
    startDate: new Date('2026-05-01T00:00:00Z'),
    endDate: new Date('2026-05-31T23:59:59Z')
  },
  {
    month: 'June',
    year: 2026,
    priceUSD: 0.1107,
    startDate: new Date('2026-06-01T00:00:00Z'),
    endDate: new Date('2026-06-30T23:59:59Z')
  },
  {
    month: 'July',
    year: 2026,
    priceUSD: 0.1137,
    startDate: new Date('2026-07-01T00:00:00Z'),
    endDate: new Date('2026-07-31T23:59:59Z')
  }
]

/**
 * Get current presale period based on current date
 */
export const getCurrentPresalePeriod = (): PresalePeriod | null => {
  const now = new Date()
  
  return PRESALE_PRICING.find(period => 
    now >= period.startDate && now <= period.endDate
  ) || null
}

/**
 * Get next presale period for countdown display
 */
export const getNextPresalePeriod = (): PresalePeriod | null => {
  const now = new Date()
  
  return PRESALE_PRICING.find(period => 
    now < period.startDate
  ) || null
}

/**
 * Calculate VIBES tokens from SOL amount
 * Formula: VIBES_MENGE = 1 SOL * (SOL_USD_PRICE / monthly_price)
 */
export const calculateVibesFromSOL = (
  solAmount: number, 
  solPriceUSD: number, 
  tokenPriceUSD: number
): number => {
  if (solAmount <= 0 || solPriceUSD <= 0 || tokenPriceUSD <= 0) return 0
  
  return solAmount * (solPriceUSD / tokenPriceUSD)
}

/**
 * Calculate VIBES tokens from USDC amount
 * Formula: VIBES_MENGE = USDC_MENGE / monthly_price
 */
export const calculateVibesFromUSDC = (
  usdcAmount: number, 
  tokenPriceUSD: number
): number => {
  if (usdcAmount <= 0 || tokenPriceUSD <= 0) return 0
  
  return usdcAmount / tokenPriceUSD
}

/**
 * Calculate required SOL amount for desired VIBES tokens
 */
export const calculateSOLRequired = (
  vibesAmount: number,
  solPriceUSD: number,
  tokenPriceUSD: number
): number => {
  if (vibesAmount <= 0 || solPriceUSD <= 0 || tokenPriceUSD <= 0) return 0
  
  return (vibesAmount * tokenPriceUSD) / solPriceUSD
}

/**
 * Calculate required USDC amount for desired VIBES tokens
 */
export const calculateUSDCRequired = (
  vibesAmount: number,
  tokenPriceUSD: number
): number => {
  if (vibesAmount <= 0 || tokenPriceUSD <= 0) return 0
  
  return vibesAmount * tokenPriceUSD
}

/**
 * Check if presale is currently active
 */
export const isPresaleActive = (): boolean => {
  return getCurrentPresalePeriod() !== null
}

/**
 * Get presale progress (which period we're in)
 */
export const getPresaleProgress = (): {
  currentPeriod: number
  totalPeriods: number
  progressPercentage: number
} => {
  const currentPeriod = getCurrentPresalePeriod()
  const currentIndex = currentPeriod 
    ? PRESALE_PRICING.findIndex(p => p === currentPeriod) + 1
    : 0
  
  return {
    currentPeriod: currentIndex,
    totalPeriods: PRESALE_PRICING.length,
    progressPercentage: (currentIndex / PRESALE_PRICING.length) * 100
  }
}
