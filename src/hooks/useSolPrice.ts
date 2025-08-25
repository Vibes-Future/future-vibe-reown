// Hook to fetch SOL price in USD from various APIs
import { useState, useEffect, useCallback } from 'react'

interface SolPriceData {
  price: number
  lastUpdated: Date
  isLoading: boolean
  error: string | null
}

const PRICE_APIS = [
  // CoinGecko API (primary)
  'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
  // Backup: CoinMarketCap alternative endpoint
  'https://api.coincap.io/v2/assets/solana'
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

    try {
      // Try CoinGecko first
      const response = await fetch(PRICE_APIS[0], {
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const price = data?.solana?.usd

      if (typeof price === 'number' && price > 0) {
        setPriceData({
          price,
          lastUpdated: new Date(),
          isLoading: false,
          error: null
        })
        return
      }

      throw new Error('Invalid price data from API')

    } catch (error) {
      console.warn('Primary API failed, trying backup...', error)
      
      try {
        // Try backup API
        const backupResponse = await fetch(PRICE_APIS[1])
        const backupData = await backupResponse.json()
        const price = parseFloat(backupData?.data?.priceUsd)

        if (price && price > 0) {
          setPriceData({
            price,
            lastUpdated: new Date(),
            isLoading: false,
            error: null
          })
          return
        }

        throw new Error('Backup API also failed')

      } catch (backupError) {
        console.error('All price APIs failed:', backupError)
        
        // Use fallback price
        setPriceData({
          price: FALLBACK_SOL_PRICE,
          lastUpdated: new Date(),
          isLoading: false,
          error: 'Unable to fetch live price, using fallback'
        })
      }
    }
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
