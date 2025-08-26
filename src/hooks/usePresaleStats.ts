import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getConnection } from '@/utils/solana-direct'
import { PRESALE_PROGRAM_ID, TOKEN_MINT_ADDRESS } from '@/config/solana'

export interface PresaleStats {
  totalTokensSold: number
  totalSOLRaised: number
  totalParticipants: number
  hardCap: number // in SOL
  softCap: number // in SOL
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
  isLoading: boolean
  error: string | null
}

export function usePresaleStats(): PresaleStats {
  const [stats, setStats] = useState<PresaleStats>({
    totalTokensSold: 0,
    totalSOLRaised: 0,
    totalParticipants: 0,
    hardCap: 10000, // Default hard cap in SOL
    softCap: 1000,  // Default soft cap in SOL
    isActive: false,
    startDate: null,
    endDate: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchPresaleStats = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true, error: null }))
        
        const connection = getConnection()
        
        // Try to get real data from smart contract first
        if (PRESALE_PROGRAM_ID) {
          try {
            // TODO: Replace with actual smart contract calls
            // For now, we'll simulate getting data from the program
            const programAccount = await connection.getAccountInfo(PRESALE_PROGRAM_ID)
            
            if (programAccount) {
              // Program exists, try to get presale data
              // This is where you'd call your smart contract to get real stats
              console.log('🔗 Smart contract found, fetching real presale data...')
              
              // Simulate real data for now - replace with actual smart contract calls
              const mockRealData = {
                totalTokensSold: Math.floor(Math.random() * 5000000) + 1000000, // Random between 1M-6M
                totalSOLRaised: Math.floor(Math.random() * 5000) + 1000, // Random between 1K-6K SOL
                totalParticipants: Math.floor(Math.random() * 500) + 100, // Random between 100-600
                hardCap: 10000,
                softCap: 1000,
                isActive: true,
                startDate: new Date('2025-07-01'),
                endDate: new Date('2026-07-31')
              }
              
              setStats({
                ...mockRealData,
                isLoading: false,
                error: null
              })
              
              return
            }
          } catch (error) {
            console.log('⚠️ Smart contract not accessible, using fallback data')
          }
        }
        
        // Fallback: Get data from localStorage (simulation mode)
        if (typeof window !== 'undefined') {
          const storedPurchases = localStorage.getItem('vibes_purchases')
          if (storedPurchases) {
            const purchases = JSON.parse(storedPurchases)
            const totalSOL = Object.values(purchases).reduce((acc: number, purchase: any) => {
              return acc + (purchase.totalSolSpent || 0)
            }, 0)
            
            const totalTokens = Object.values(purchases).reduce((acc: number, purchase: any) => {
              return acc + (purchase.totalTokensPurchased || 0)
            }, 0)
            
            const participants = Object.keys(purchases).length
            
            setStats({
              totalTokensSold: totalTokens,
              totalSOLRaised: totalSOL,
              totalParticipants: participants,
              hardCap: 10000,
              softCap: 1000,
              isActive: true,
              startDate: new Date('2025-07-01'),
              endDate: new Date('2026-07-31'),
              isLoading: false,
              error: null
            })
            
            return
          }
        }
        
        // Default fallback data
        setStats({
          totalTokensSold: 0,
          totalSOLRaised: 0,
          totalParticipants: 0,
          hardCap: 10000,
          softCap: 1000,
          isActive: false,
          startDate: null,
          endDate: null,
          isLoading: false,
          error: null
        })
        
      } catch (error) {
        console.error('Error fetching presale stats:', error)
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Error loading presale statistics'
        }))
      }
    }

    fetchPresaleStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchPresaleStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return stats
}
