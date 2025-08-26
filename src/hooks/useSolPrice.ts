// Hook to fetch SOL price in USD from various APIs
import { useState, useEffect, useCallback } from 'react'

interface SolPriceData {
  price: number
  lastUpdated: Date
  isLoading: boolean
  error: string | null
}

// Use a proxy service to avoid CORS issues
const PRICE_APIS = [
  // CoinGecko API through proxy (primary)
  'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
  // Alternative proxy
  'https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
]

// Fallback SOL price if APIs fail (approximate current price)
const FALLBACK_SOL_PRICE = 150 // USD

/**
 * Custom hook to fetch and manage SOL price in USD
 */
export const useSolPrice = (refreshInterval = 60000) => { // Default: 1 minute
  const [priceData, setPriceData] = useState<SolPriceData>({
    price: FALLBACK_SOL_PRICE,
    lastUpdated: new Date(),
    isLoading: true,
    error: null
  })

  const fetchSolPrice = useCallback(async () => {
    setPriceData(prev => ({ ...prev, isLoading: true, error: null }))

    // For now, use fallback price to avoid CORS issues
    // TODO: Implement server-side price fetching or use a working proxy
    setPriceData({
      price: FALLBACK_SOL_PRICE,
      lastUpdated: new Date(),
      isLoading: false,
      error: 'Using fallback price (CORS issues with external APIs)'
    })
  }, [])

  // Fetch price on mount and set up interval
  useEffect(() => {
    fetchSolPrice()

    const interval = setInterval(() => {
      fetchSolPrice()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchSolPrice, refreshInterval])

  // Manual refresh function
  const refreshPrice = useCallback(() => {
    fetchSolPrice()
  }, [fetchSolPrice])

  return {
    ...priceData,
    refreshPrice
  }
}

/**
 * Format SOL price for display
 */
export const formatSolPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

/**
 * Get price update status text
 */
export const getPriceStatusText = (lastUpdated: Date, error: string | null): string => {
  if (error) return 'Using fallback price'
  
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
  
  if (minutesAgo < 1) return 'Just updated'
  if (minutesAgo === 1) return '1 minute ago'
  return `${minutesAgo} minutes ago`
}
