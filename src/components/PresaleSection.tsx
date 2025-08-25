'use client'

import { useState } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { CONSTANTS } from '@/config/solana'
import { formatNumber, formatTokens } from '@/utils/formatters'
import { 
  getCurrentPresalePeriod, 
  getNextPresalePeriod,
  calculateVibesFromSOL,
  isPresaleActive,
  getPresaleProgress 
} from '@/config/pricing'
import { useSolPrice, formatSolPrice, getPriceStatusText } from '@/hooks/useSolPrice'
import { useVesting } from '@/hooks/useVesting'
import { useSmartContractVesting } from '@/hooks/useSmartContractVesting'
import { TransactionInfo, SmartContractStatus } from '@/components/TransactionInfo'

export function PresaleSection() {
  const [solAmount, setSolAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  // Get real-time SOL price and presale period data
  const { price: solPriceUSD, isLoading: priceLoading, error: priceError, lastUpdated } = useSolPrice()
  const currentPeriod = getCurrentPresalePeriod()
  const nextPeriod = getNextPresalePeriod()
  const presaleActive = isPresaleActive()
  const progress = getPresaleProgress()

  // Vesting functionality - Smart contracts vs simulation
  const { addPurchase, isLoading: vestingLoading } = useVesting()
  const { 
    purchaseWithSOL, 
    isLoading: smartContractLoading, 
    lastTransaction,
    isSmartContractMode,
    programDeployed 
  } = useSmartContractVesting()

  // Real presale data based on monthly pricing
  const presaleData = {
    isActive: presaleActive,
    currentPeriod: currentPeriod,
    nextPeriod: nextPeriod,
    tokenPriceUSD: currentPeriod?.priceUSD || 0.0598, // Current month price or default to July price
    solPriceUSD: solPriceUSD,
    // Mock data for now (will be replaced with blockchain data)
    totalTokensSold: 2500000,
    totalSOLRaised: 2500,
    maxTokensPerWallet: 100000,
    minPurchaseAmount: CONSTANTS.MIN_PRESALE_AMOUNT,
    maxPurchaseAmount: CONSTANTS.MAX_PRESALE_AMOUNT,
    hardCap: 10000, // SOL
    progress: progress
  }

  const calculateVibesTokens = (solInput: string): number => {
    const sol = parseFloat(solInput) || 0
    if (!currentPeriod || !solPriceUSD) return 0
    
    // Use the exact formula: VIBES_MENGE = 1 SOL * (SOL_USD_PRICE / monthly_price)
    return calculateVibesFromSOL(sol, solPriceUSD, currentPeriod.priceUSD)
  }

  const handlePurchase = async () => {
    if (!isConnected || !walletProvider) {
      alert('Por favor conecta tu wallet primero')
      return
    }

    if (!presaleData.isActive) {
      alert('El presale no está activo en este momento')
      return
    }

    const sol = parseFloat(solAmount)
    if (!sol || sol < presaleData.minPurchaseAmount || sol > presaleData.maxPurchaseAmount) {
      alert(`Por favor ingresa una cantidad entre ${presaleData.minPurchaseAmount} y ${presaleData.maxPurchaseAmount} SOL`)
      return
    }

    setIsLoading(true)
    try {
      const vibesTokens = calculateVibesTokens(solAmount)
      
      if (isSmartContractMode) {
        // Use real smart contracts
        console.log('🔗 Using Smart Contracts for purchase')
        const result = await purchaseWithSOL(sol)
        
        if (result.success) {
          alert(`¡Compra exitosa en Blockchain! 
          
🎉 Has comprado ${formatTokens(result.vibesAmount || vibesTokens)} VIBES tokens
💰 Pagaste ${sol} SOL
🔗 Transacción: ${result.signature}
📅 Vesting Schedule almacenado en blockchain:
• 40% disponible después del listing
• 20% cada mes por 3 meses adicionales

Ve a la sección "Claims" para reclamar tus tokens cuando estén disponibles.
🔍 Ver en Solscan: ${result.explorerUrl}`)
        } else {
          throw new Error(result.error || 'Smart contract purchase failed')
        }
      } else {
        // Use simulation mode
        console.log('🎮 Using Simulation Mode for purchase')
        await addPurchase({
          purchaseDate: new Date(),
          solAmount: sol,
          usdcAmount: 0, // SOL purchase
          tokensPurchased: vibesTokens,
          solPriceAtPurchase: solPriceUSD,
          tokenPriceAtPurchase: presaleData.tokenPriceUSD,
          transactionSignature: '' // Will be set by addPurchase
        })
        
        alert(`¡Compra exitosa (Simulación)! 
        
🎉 Has comprado ${formatTokens(vibesTokens)} VIBES tokens
💰 Pagaste ${sol} SOL
📅 Vesting Schedule:
• 40% disponible después del listing
• 20% cada mes por 3 meses adicionales

Ve a la sección "Claims" para reclamar tus tokens cuando estén disponibles.

⚠️ Modo simulación - Para transacciones reales, despliega los smart contracts.`)
      }
      
      setSolAmount('')
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Error en la compra. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (presaleData.totalSOLRaised / presaleData.hardCap) * 100

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Presale Statistics */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">VIBES Token Presale</h2>
          
          {/* Current Period Info */}
          {presaleData.isActive && currentPeriod ? (
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
              <div className="text-sm text-gray-400 mb-1">Periodo Actual</div>
              <div className="text-xl font-bold text-white">
                {currentPeriod.month} {currentPeriod.year}
              </div>
              <div className="text-sm text-green-400">
                ${currentPeriod.priceUSD.toFixed(4)} USD por VIBES
              </div>
            </div>
          ) : nextPeriod ? (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 border border-yellow-500/30">
              <div className="text-sm text-gray-400 mb-1">Próximo Período</div>
              <div className="text-xl font-bold text-white">
                {nextPeriod.month} {nextPeriod.year}
              </div>
              <div className="text-sm text-yellow-400">
                Comienza: {nextPeriod.startDate.toLocaleDateString('es-ES')}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-600/20 to-red-600/20 rounded-lg p-4 border border-red-500/30">
              <div className="text-sm text-gray-400 mb-1">Estado</div>
              <div className="text-xl font-bold text-white">
                Presale Finalizado
              </div>
            </div>
          )}
          
          {/* SOL Price Display */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400">Precio SOL</div>
                <div className="text-lg font-semibold text-white">
                  {priceLoading ? 'Cargando...' : formatSolPrice(solPriceUSD)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {getPriceStatusText(lastUpdated, priceError)}
                </div>
                {priceError && (
                  <div className="text-xs text-yellow-400 mt-1">
                    Precio de respaldo
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progreso del Presale</span>
              <span>Período {progress.currentPeriod} de {progress.totalPeriods}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-400 mt-2">
              {progress.progressPercentage.toFixed(1)}% del presale completado
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Precio VIBES</div>
              <div className="text-lg font-semibold text-white">
                ${presaleData.tokenPriceUSD.toFixed(4)}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">VIBES Vendidos</div>
              <div className="text-lg font-semibold text-white">
                {formatNumber(presaleData.totalTokensSold)}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Mínimo SOL</div>
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
              <div className="text-sm text-gray-400 mb-1">Período Termina</div>
              <div className="text-xl font-bold text-white">
                {currentPeriod.endDate.toLocaleDateString('es-ES')}
              </div>
              <div className="text-sm text-purple-400 mt-1">
                ¡El precio aumenta el próximo mes!
              </div>
            </div>
          )}
        </div>

        {/* Purchase Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Comprar VIBES Tokens</h3>
          
          {!presaleData.isActive ? (
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-medium">
                Presale no está activo en este momento
              </div>
              {nextPeriod && (
                <div className="text-sm text-gray-300 mt-2">
                  Próximo período: {nextPeriod.month} {nextPeriod.year}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formula Display */}
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs text-blue-400 mb-1">Fórmula de cálculo:</div>
                <div className="text-sm text-white font-mono">
                  VIBES = SOL × (${formatNumber(solPriceUSD)} / ${presaleData.tokenPriceUSD.toFixed(4)})
                </div>
              </div>

              {/* SOL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cantidad de SOL
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    placeholder="0.00"
                    min={presaleData.minPurchaseAmount}
                    max={presaleData.maxPurchaseAmount}
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

              {/* Token Output */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Recibirás
                </label>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3">
                  <div className="text-white text-lg font-semibold">
                    {formatTokens(calculateVibesTokens(solAmount))} VIBES
                  </div>
                  {solAmount && calculateVibesTokens(solAmount) > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Valor: ${(calculateVibesTokens(solAmount) * presaleData.tokenPriceUSD).toFixed(2)} USD
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={!isConnected || isLoading || vestingLoading || smartContractLoading || !solAmount || !presaleData.isActive || priceLoading}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isSmartContractMode 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                } disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white`}
              >
                {(isLoading || vestingLoading || smartContractLoading) ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {smartContractLoading ? 'Enviando a Blockchain...' : 
                     vestingLoading ? 'Configurando vesting...' : 'Procesando...'}
                  </div>
                ) : !isConnected ? (
                  'Conectar Wallet'
                ) : priceLoading ? (
                  'Cargando precios...'
                ) : !presaleData.isActive ? (
                  'Presale no activo'
                ) : isSmartContractMode ? (
                  '🔗 Comprar con Smart Contract'
                ) : (
                  '🎮 Comprar VIBES (Simulación)'
                )}
              </button>

              {/* Disclaimer */}
              <div className="text-xs text-gray-500 text-center">
                * Los tokens se distribuirán después de que termine el presale
              </div>
              
              {/* Additional Info */}
              <div className="text-xs text-gray-500 text-center mt-2">
                Precio actual: ${presaleData.tokenPriceUSD.toFixed(4)} USD por VIBES
                {currentPeriod && (
                  <>
                    <br />
                    Válido hasta: {currentPeriod.endDate.toLocaleDateString('es-ES')}
                  </>
                )}
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
