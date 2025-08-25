// Utility functions for consistent number formatting
// Prevents hydration mismatches between server and client

/**
 * Format numbers consistently across server and client
 * Uses English locale to prevent hydration mismatches
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format SOL amounts with 4 decimal places
 */
export const formatSOL = (lamports: number): string => {
  const sol = lamports / 1000000000 // LAMPORTS_PER_SOL
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(sol)
}

/**
 * Format token amounts with 2 decimal places
 */
export const formatTokens = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

/**
 * Compact number formatting for large values
 */
export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num)
}
