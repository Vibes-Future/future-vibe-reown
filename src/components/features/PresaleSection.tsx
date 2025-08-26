'use client'

import { useState } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { CONSTANTS } from '@/config/solana'
import { formatNumber, formatTokens } from '@/utils/formatters'
import { 
  getCurrentPresalePeriod, 
  getNextPresalePeriod,
  calculateVibesFromSOL,
  calculateVibesFromUSDC,
  isPresaleActive,
  getPresaleProgress 
} from '@/config/pricing'
import { useSolPrice, formatSolPrice, getPriceStatusText } from '@/hooks/useSolPrice'
import { useUsdcPrice } from '@/hooks/useUsdcPrice'
import { useVesting } from '@/hooks/useVesting'
import { useSmartContractVesting } from '@/hooks/useSmartContractVesting'
import { usePresaleStats } from '@/hooks/usePresaleStats'
import { TransactionInfo, SmartContractStatus } from './TransactionInfo'

export function PresaleSection() {
  const [solAmount, setSolAmount] = useState<string>('')
  const [usdcAmount, setUsdcAmount] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'SOL' | 'USDC'>('SOL')
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  // Get real-time SOL price and presale period data
  const { price: solPriceUSD, isLoading: priceLoading, error: priceError, lastUpdated } = useSolPrice()
  
  // Get real-time USDC price data
  const { usdcPriceUSD, isLoading: usdcPriceLoading } = useUsdcPrice()
  
  const currentPeriod = getCurrentPresalePeriod()
  const nextPeriod = getNextPresalePeriod()
  const presaleActive = isPresaleActive()
  const progress = getPresaleProgress()

  // Vesting functionality - Smart contracts vs simulation
  const { addPurchase, isLoading: vestingLoading } = useVesting()
  const { 
    purchaseWithSOL, 
    purchaseWithUSDC,
    isLoading: smartContractLoading, 
    lastTransaction,
    isSmartContractMode,
    programDeployed 
  } = useSmartContractVesting()

  // Real presale statistics from blockchain or localStorage
  const presaleStats = usePresaleStats()

  // Real presale data based on monthly pricing and blockchain stats
  const presaleData = {
    isActive: presaleActive,
    currentPeriod: currentPeriod,
    nextPeriod: nextPeriod,
    tokenPriceUSD: currentPeriod?.priceUSD || 0.0598, // Current month price or default to July price
    solPriceUSD: solPriceUSD,
    // Real data from blockchain or localStorage
    totalTokensSold: presaleStats.totalTokensSold,
    totalSOLRaised: presaleStats.totalSOLRaised,
    totalParticipants: presaleStats.totalParticipants,
    maxTokensPerWallet: 100000, // This could also come from smart contract
    minPurchaseAmount: CONSTANTS.MIN_PRESALE_AMOUNT,
    maxPurchaseAmount: CONSTANTS.MAX_PRESALE_AMOUNT,
    hardCap: presaleStats.hardCap,
    softCap: presaleStats.softCap,
    progress: progress
  }

  const calculateVibesTokens = (input: string, method: 'SOL' | 'USDC'): number => {
    const amount = parseFloat(input) || 0
    if (!currentPeriod) return 0
    
    if (method === 'SOL') {
      if (!solPriceUSD) return 0
      // Use the exact formula: VIBES_MENGE = 1 SOL * (SOL_USD_PRICE / monthly_price)
      return calculateVibesFromSOL(amount, solPriceUSD, currentPeriod.priceUSD)
    } else {
      // USDC calculation: VIBES_MENGE = USDC_AMOUNT / monthly_price
      return calculateVibesFromUSDC(amount, currentPeriod.priceUSD)
    }
  }

  const handlePurchase = async () => {
    if (!isConnected || !walletProvider) {
      alert('Please connect your wallet first')
      return
    }

    if (!presaleData.isActive) {
      alert('The presale is not active at this time')
      return
    }

    let amount: number
    let minAmount: number
    let maxAmount: number
    let currency: string

    if (paymentMethod === 'SOL') {
      amount = parseFloat(solAmount)
      minAmount = CONSTANTS.MIN_PRESALE_AMOUNT
      maxAmount = CONSTANTS.MAX_PRESALE_AMOUNT
      currency = 'SOL'
    } else {
      amount = parseFloat(usdcAmount)
      minAmount = CONSTANTS.MIN_PRESALE_USDC_AMOUNT
      maxAmount = CONSTANTS.MAX_PRESALE_USDC_AMOUNT
      currency = 'USDC'
    }

    if (!amount || amount < minAmount || amount > maxAmount) {
      alert(`Please enter an amount between ${minAmount} and ${maxAmount} ${currency}`)
      return
    }

    setIsLoading(true)
    try {
      const vibesTokens = calculateVibesTokens(paymentMethod === 'SOL' ? solAmount : usdcAmount, paymentMethod)
      
      if (isSmartContractMode) {
        // Use real smart contracts
        console.log(`🔗 Using Smart Contracts for purchase with ${paymentMethod}`)
        
        let result: any
        if (paymentMethod === 'SOL') {
          result = await purchaseWithSOL(amount)
        } else {
          result = await purchaseWithUSDC(amount)
        }
        
        if (result.success) {
          alert(`Successful purchase on Blockchain! 
          
🎉 You have purchased ${formatTokens(result.vibesAmount || vibesTokens)} VIBES tokens
💰 You paid ${amount} ${currency}
🔗 Transaction: ${result.signature}
📅 Vesting Schedule stored on blockchain:
• 40% available after listing
• 20% each month for 3 additional months

Go to the "Claims" section to claim your tokens when they are available.
🔍 View on Solscan: ${result.explorerUrl}`)
        } else {
          throw new Error(result.error || 'Smart contract purchase failed')
        }
      } else {
        // Use simulation mode
        console.log(`🎮 Using Simulation Mode for purchase with ${paymentMethod}`)
        await addPurchase({
          purchaseDate: new Date(),
          solAmount: paymentMethod === 'SOL' ? amount : 0,
          usdcAmount: paymentMethod === 'USDC' ? amount : 0,
          tokensPurchased: vibesTokens,
          solPriceAtPurchase: solPriceUSD,
          tokenPriceAtPurchase: presaleData.tokenPriceUSD,
          transactionSignature: '' // Will be set by addPurchase
        })
        
        alert(`Successful purchase (Simulation)! 
        
🎉 You have purchased ${formatTokens(vibesTokens)} VIBES tokens
💰 You paid ${sol} SOL
📅 Vesting Schedule:
• 40% available after listing
• 20% each month for 3 additional months

Go to the "Claims" section to claim your tokens when they are available.

⚠️ Simulation mode - For real transactions, deploy the smart contracts.`)
      }
      
      // Clear input fields
      setSolAmount('')
      setUsdcAmount('')
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = presaleStats.hardCap > 0 ? (presaleData.totalSOLRaised / presaleData.hardCap) * 100 : 0

  return (
    <div className="bg-BG-FFF-8 backdrop-blur-sm rounded-2xl p-8 border border-stroct-1">
      {/* Loading State */}
      {presaleStats.isLoading && (
        <div className="absolute inset-0 bg-BG-FFF-8/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1 mx-auto mb-4"></div>
            <p className="text-primary-1 font-medium">Cargando estadísticas del presale...</p>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Presale Statistics */}
        <div className="space-y-6">
          <h2 className="my-text-32 gap-mb-24 gradient-text-primary">VIBES Token Presale</h2>
          
          {/* Error State */}
          {presaleStats.error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-400">⚠️</span>
                <p className="text-red-400 text-sm">{presaleStats.error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-red-400 hover:text-red-300 text-xs underline mt-2"
              >
                Recargar página
              </button>
            </div>
          )}
          
          {/* Blockchain Connection Status */}
          <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  programDeployed ? 'bg-primary-1' : 'bg-foundation-blue-50'
                }`}></span>
                <span className="text-sm text-foundation-blue-60">
                  {programDeployed ? 'Smart Contract Conectado' : 'Modo Simulación'}
                </span>
              </div>
              <div className="text-xs text-foundation-blue-50">
                {programDeployed ? '🔗 Devnet' : '🎮 Local'}
              </div>
            </div>
          </div>
          
          {/* Current Period Info */}
          {presaleData.isActive && currentPeriod ? (
            <div className="bg-gradient-to-r from-primary-1/20 to-primary-2/20 rounded-lg p-4 border border-primary-1/30">
              <div className="text-sm text-foundation-blue-60 mb-1">Periodo Actual</div>
              <div className="text-xl font-bold text-white">
                {currentPeriod.month} {currentPeriod.year}
              </div>
              <div className="text-sm text-primary-1">
                ${currentPeriod.priceUSD.toFixed(4)} USD por VIBES
              </div>
            </div>
          ) : nextPeriod ? (
            <div className="bg-gradient-to-r from-highlight-1/20 to-highlight-2/20 rounded-lg p-4 border border-highlight-1/30">
              <div className="text-sm text-foundation-blue-60 mb-1">Next Period</div>
              <div className="text-xl font-bold text-white">
                {nextPeriod.month} {nextPeriod.year}
              </div>
              <div className="text-sm text-highlight-1">
                Starts: {nextPeriod.startDate.toLocaleDateString('en-US')}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-600/20 to-red-600/20 rounded-lg p-4 border border-red-500/30">
              <div className="text-sm text-foundation-blue-60 mb-1">Status</div>
              <div className="text-xl font-bold text-white">
                Presale Completed
              </div>
            </div>
          )}
          
          {/* SOL Price Display */}
          <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-foundation-blue-60">SOL Price</div>
                <div className="text-lg font-semibold text-white">
                  {priceLoading ? 'Loading...' : formatSolPrice(solPriceUSD)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-foundation-blue-50">
                  {getPriceStatusText(lastUpdated, priceError)}
                </div>
                {priceError && (
                  <div className="text-xs text-highlight-1 mt-1">
                    Fallback price
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-foundation-blue-60 mb-2">
              <span>Presale Progress</span>
              <span>Period {progress.currentPeriod} of {progress.totalPeriods}</span>
            </div>
            <div className="w-full bg-BG-FFF-8 rounded-full h-3 border border-stroct-1">
              <div 
                className="bg-gradient-to-r from-primary-1 to-highlight-1 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-foundation-blue-60 mt-2">
              {presaleStats.isLoading ? (
                <div className="animate-pulse bg-primary-1/20 h-4 rounded"></div>
              ) : (
                `${progressPercentage.toFixed(1)}% of presale completed`
              )}
            </div>
            <div className="text-center text-xs text-foundation-blue-50 mt-1">
              {presaleStats.isLoading ? (
                <div className="animate-pulse bg-primary-1/20 h-3 rounded"></div>
              ) : (
                `${presaleData.totalSOLRaised.toFixed(1)} / ${presaleData.hardCap} SOL`
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
              <div className="text-sm text-foundation-blue-60">VIBES Price</div>
              <div className="text-lg font-semibold text-white">
                ${presaleData.tokenPriceUSD.toFixed(4)}
              </div>
            </div>
            <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
              <div className="text-sm text-foundation-blue-60">VIBES Sold</div>
              <div className="text-lg font-semibold text-white">
                {presaleStats.isLoading ? (
                  <div className="animate-pulse bg-primary-1/20 h-6 rounded"></div>
                ) : (
                  formatNumber(presaleData.totalTokensSold)
                )}
              </div>
            </div>
            <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
              <div className="text-sm text-foundation-blue-60">SOL Raised</div>
              <div className="text-lg font-semibold text-white">
                {presaleStats.isLoading ? (
                  <div className="animate-pulse bg-primary-1/20 h-6 rounded"></div>
                ) : (
                  `${presaleData.totalSOLRaised.toFixed(1)} SOL`
                )}
              </div>
            </div>
            <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
              <div className="text-sm text-foundation-blue-60">Participants</div>
              <div className="text-lg font-semibold text-white">
                {presaleStats.isLoading ? (
                  <div className="animate-pulse bg-primary-1/20 h-6 rounded"></div>
                ) : (
                  presaleData.totalParticipants
                )}
              </div>
            </div>
            <div className="bg-BG-FFF-8 rounded-lg p-4 border border-stroct-1">
              <div className="text-sm text-foundation-blue-60">Mínimo SOL</div>
              <div className="text-lg font-semibold text-white">
                {presaleData.minPurchaseAmount} SOL
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Máximo SOL</div>
              <div className="text-lg font-semibold text-white">
                {presaleData.maxPurchaseAmount} SOL
              </div>
            </div>
          </div>

          {/* Period End Timer */}
          {currentPeriod && (
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
              <div className="text-sm text-gray-400 mb-1">Period Ends</div>
              <div className="text-xl font-bold text-white">
                {currentPeriod.endDate.toLocaleDateString('en-US')}
              </div>
              <div className="text-sm text-purple-400 mt-1">
                The price increases next month!
              </div>
            </div>
          )}
        </div>

        {/* Purchase Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Buy VIBES Tokens</h3>
          
          {!presaleData.isActive ? (
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-medium">
                Presale is not active at this time
              </div>
              {nextPeriod && (
                <div className="text-sm text-gray-300 mt-2">
                  Next period: {nextPeriod.month} {nextPeriod.year}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('SOL')}
                    className={`py-2 px-4 rounded-lg border transition-all duration-200 ${
                      paymentMethod === 'SOL'
                        ? 'bg-primary-1 text-primary-4 border-primary-1'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    💎 SOL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('USDC')}
                    className={`py-2 px-4 rounded-lg border transition-all duration-200 ${
                      paymentMethod === 'USDC'
                        ? 'bg-primary-1 text-primary-4 border-primary-1'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    💵 USDC
                  </button>
                </div>
              </div>

              {/* Formula Display */}
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs text-blue-400 mb-1">Calculation formula:</div>
                <div className="text-sm text-white font-mono">
                  {paymentMethod === 'SOL' 
                    ? `VIBES = SOL × ($${formatNumber(solPriceUSD)} / $${presaleData.tokenPriceUSD.toFixed(4)})`
                    : `VIBES = USDC / $${presaleData.tokenPriceUSD.toFixed(4)}`
                  }
                </div>
              </div>

              {/* SOL Input */}
              {paymentMethod === 'SOL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    SOL Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={solAmount}
                      onChange={(e) => setSolAmount(e.target.value)}
                      placeholder="0.00"
                      min={CONSTANTS.MIN_PRESALE_AMOUNT}
                      max={CONSTANTS.MAX_PRESALE_AMOUNT}
                      step="0.1"
                      disabled={!presaleData.isActive || priceLoading}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-400 text-sm">SOL</span>
                    </div>
                  </div>
                  {solAmount && (
                    <div className="text-xs text-gray-400 mt-1">
                      ≈ ${(parseFloat(solAmount) * solPriceUSD).toFixed(2)} USD
                    </div>
                  )}
                </div>
              )}

              {/* USDC Input */}
              {paymentMethod === 'USDC' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cantidad de USDC
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usdcAmount}
                      onChange={(e) => setUsdcAmount(e.target.value)}
                      placeholder="0.00"
                      min={CONSTANTS.MIN_PRESALE_USDC_AMOUNT}
                      max={CONSTANTS.MAX_PRESALE_USDC_AMOUNT}
                      step="1"
                      disabled={!presaleData.isActive || usdcPriceLoading}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-400 text-sm">USDC</span>
                    </div>
                  </div>
                  {usdcAmount && (
                    <div className="text-xs text-gray-400 mt-1">
                      ≈ ${(parseFloat(usdcAmount) * usdcPriceUSD).toFixed(2)} USD
                    </div>
                  )}
                </div>
              )}

              {/* Token Output */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  You will receive
                </label>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3">
                  <div className="text-white text-lg font-semibold">
                    {formatTokens(calculateVibesTokens(
                      paymentMethod === 'SOL' ? solAmount : usdcAmount, 
                      paymentMethod
                    ))} VIBES
                  </div>
                  {(paymentMethod === 'SOL' ? solAmount : usdcAmount) && 
                   calculateVibesTokens(paymentMethod === 'SOL' ? solAmount : usdcAmount, paymentMethod) > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Value: ${(calculateVibesTokens(
                        paymentMethod === 'SOL' ? solAmount : usdcAmount, 
                        paymentMethod
                      ) * presaleData.tokenPriceUSD).toFixed(2)} USD
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={!isConnected || isLoading || vestingLoading || smartContractLoading || 
                         !(paymentMethod === 'SOL' ? solAmount : usdcAmount) || 
                         !presaleData.isActive || 
                         (paymentMethod === 'SOL' ? priceLoading : usdcPriceLoading)}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isSmartContractMode 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                } disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white`}
              >
                {(isLoading || vestingLoading || smartContractLoading) ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {smartContractLoading ? 'Sending to Blockchain...' : 
                     vestingLoading ? 'Configuring vesting...' : 'Processing...'}
                  </div>
                ) : !isConnected ? (
                  'Connect Wallet'
                ) : (paymentMethod === 'SOL' ? priceLoading : usdcPriceLoading) ? (
                  'Loading prices...'
                ) : !presaleData.isActive ? (
                  'Presale not active'
                ) : isSmartContractMode ? (
                  `🔗 Buy with ${paymentMethod} (Smart Contract)`
                ) : (
                  `🎮 Buy VIBES with ${paymentMethod} (Simulation)`
                )}
              </button>

              {/* Disclaimer */}
              <div className="text-xs text-gray-500 text-center">
                * Tokens will be distributed after the presale ends
              </div>
              
              {/* Additional Info */}
              <div className="text-xs text-gray-500 text-center mt-2">
                Current price: ${presaleData.tokenPriceUSD.toFixed(4)} USD per VIBES
                {currentPeriod && (
                  <>
                    <br />
                    Valid until: {currentPeriod.endDate.toLocaleDateString('en-US')}
                  </>
                )}
                <br />
                💧 Liquidity Pools: SOL | USDC
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Contract Status */}
      <div className="mt-6">
        <SmartContractStatus />
      </div>

      {/* Transaction Information */}
      {lastTransaction && (
        <TransactionInfo
          signature={lastTransaction}
          programId={process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID}
          tokenMint={process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS}
          userAddress={isConnected ? address : undefined}
          status="confirmed"
          type="purchase"
          timestamp={new Date()}
        />
      )}
    </div>
  )
}
