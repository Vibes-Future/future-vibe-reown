'use client'

import { PRESALE_PRICING, getCurrentPresalePeriod } from '@/config/pricing'

export function PricingTable() {
  const currentPeriod = getCurrentPresalePeriod()

  return (
    <div className="bg-BG-FFF-8 backdrop-blur-sm rounded-2xl p-8 border border-stroct-1 mt-8">
      <h3 className="my-text-32 gap-mb-24 text-center gradient-text-primary">
        VIBES Pricing Schedule
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-primary-6">
              <th className="pb-4 text-foundation-blue-60 font-medium">Period</th>
              <th className="pb-4 text-foundation-blue-60 font-medium text-right">Price per VIBES</th>
              <th className="pb-4 text-foundation-blue-60 font-medium text-right">Increase</th>
              <th className="pb-4 text-foundation-blue-60 font-medium text-center">Status</th>
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
                  className={`border-b border-primary-6/50 ${
                    isCurrentPeriod 
                      ? 'bg-primary-1/10 border-primary-1/30' 
                      : isPastPeriod 
                        ? 'bg-BG-FFF-8 text-foundation-blue-50' 
                        : ''
                  }`}
                >
                  <td className="py-4">
                    <div className="flex items-center">
                      <div>
                        <div className={`font-medium ${
                          isCurrentPeriod ? 'text-primary-1' : 
                          isPastPeriod ? 'text-foundation-blue-50' : 'text-white'
                        }`}>
                          {period.month} {period.year}
                        </div>
                        <div className="text-xs text-foundation-blue-50">
                          {period.startDate.toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short' 
                          })} - {period.endDate.toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 text-right">
                    <div className={`text-lg font-semibold ${
                      isCurrentPeriod ? 'text-primary-1' : 
                      isPastPeriod ? 'text-foundation-blue-50' : 'text-white'
                    }`}>
                      ${period.priceUSD.toFixed(4)}
                    </div>
                  </td>
                  
                  <td className="py-4 text-right">
                    {index > 0 && (
                      <div className={`text-sm ${
                        isPastPeriod ? 'text-foundation-blue-50' : 'text-highlight-1'
                      }`}>
                        +{increment.toFixed(1)}%
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 text-center">
                    {isCurrentPeriod && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-1/20 text-primary-1 border border-primary-1/30">
                        ● ACTIVE
                      </span>
                    )}
                    {isPastPeriod && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-foundation-blue-50/20 text-foundation-blue-50 border border-foundation-blue-50/30">
                        Completed
                      </span>
                    )}
                    {isFuturePeriod && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-highlight-1/20 text-highlight-1 border border-highlight-1/30">
                        Upcoming
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
          <div className="text-sm text-gray-400">Total Periods</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            ${PRESALE_PRICING[0].priceUSD.toFixed(4)}
          </div>
          <div className="text-sm text-gray-400">Initial Price</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            ${PRESALE_PRICING[PRESALE_PRICING.length - 1].priceUSD.toFixed(4)}
          </div>
          <div className="text-sm text-gray-400">Final Price</div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          💡 <strong>Strategy:</strong> Prices increase every month. 
          Buy early to get better prices!
        </p>
      </div>
    </div>
  )
}
