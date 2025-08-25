'use client'

import { PRESALE_PRICING, getCurrentPresalePeriod } from '@/config/pricing'

export function PricingTable() {
  const currentPeriod = getCurrentPresalePeriod()

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mt-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Cronograma de Precios VIBES
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="pb-4 text-gray-400 font-medium">Período</th>
              <th className="pb-4 text-gray-400 font-medium text-right">Precio por VIBES</th>
              <th className="pb-4 text-gray-400 font-medium text-right">Incremento</th>
              <th className="pb-4 text-gray-400 font-medium text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {PRESALE_PRICING.map((period, index) => {
              const isCurrentPeriod = currentPeriod?.month === period.month && currentPeriod?.year === period.year
              const isPastPeriod = new Date() > period.endDate
              const isFuturePeriod = new Date() < period.startDate
              
              // Calculate increment from previous period
              const previousPrice = index > 0 ? PRESALE_PRICING[index - 1].priceUSD : period.priceUSD
              const increment = index > 0 ? ((period.priceUSD - previousPrice) / previousPrice * 100) : 0

              return (
                <tr 
                  key={`${period.month}-${period.year}`}
                  className={`border-b border-gray-700/50 ${
                    isCurrentPeriod 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : isPastPeriod 
                        ? 'bg-gray-600/20 text-gray-500' 
                        : ''
                  }`}
                >
                  <td className="py-4">
                    <div className="flex items-center">
                      <div>
                        <div className={`font-medium ${
                          isCurrentPeriod ? 'text-green-400' : 
                          isPastPeriod ? 'text-gray-500' : 'text-white'
                        }`}>
                          {period.month} {period.year}
                        </div>
                        <div className="text-xs text-gray-500">
                          {period.startDate.toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short' 
                          })} - {period.endDate.toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 text-right">
                    <div className={`text-lg font-semibold ${
                      isCurrentPeriod ? 'text-green-400' : 
                      isPastPeriod ? 'text-gray-500' : 'text-white'
                    }`}>
                      ${period.priceUSD.toFixed(4)}
                    </div>
                  </td>
                  
                  <td className="py-4 text-right">
                    {index > 0 && (
                      <div className={`text-sm ${
                        isPastPeriod ? 'text-gray-500' : 'text-orange-400'
                      }`}>
                        +{increment.toFixed(1)}%
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 text-center">
                    {isCurrentPeriod && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        ● ACTIVO
                      </span>
                    )}
                    {isPastPeriod && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-500 border border-gray-500/30">
                        Finalizado
                      </span>
                    )}
                    {isFuturePeriod && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Próximo
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {PRESALE_PRICING.length}
          </div>
          <div className="text-sm text-gray-400">Períodos Total</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            ${PRESALE_PRICING[0].priceUSD.toFixed(4)}
          </div>
          <div className="text-sm text-gray-400">Precio Inicial</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            ${PRESALE_PRICING[PRESALE_PRICING.length - 1].priceUSD.toFixed(4)}
          </div>
          <div className="text-sm text-gray-400">Precio Final</div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          💡 <strong>Estrategia:</strong> Los precios aumentan cada mes. 
          ¡Compra temprano para obtener mejores precios!
        </p>
      </div>
    </div>
  )
}
