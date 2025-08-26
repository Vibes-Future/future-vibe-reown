import { useState, useEffect } from 'react'

export function useUsdcPrice() {
  const [usdcPriceUSD, setUsdcPriceUSD] = useState<number>(1.0) // USDC is pegged to USD
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsdcPrice = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // USDC is pegged to USD, but we can fetch real-time data from APIs
        // For now, we'll use the stable peg value
        setUsdcPriceUSD(1.0)
        
        // TODO: In production, fetch from CoinGecko or similar API
        // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd')
        // const data = await response.json()
        // setUsdcPriceUSD(data['usd-coin'].usd)
        
      } catch (err) {
        console.error('Error fetching USDC price:', err)
        setError('Error loading USDC price')
        // Fallback to stable peg
        setUsdcPriceUSD(1.0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsdcPrice()
    
    // Refresh price every 5 minutes
    const interval = setInterval(fetchUsdcPrice, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    usdcPriceUSD,
    isLoading,
    error
  }
}
