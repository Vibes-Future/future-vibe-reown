'use client'

import { useState } from 'react'
import { getExplorerUrl, getExplorerAccountUrl } from '@/utils/solana-direct'

interface TransactionInfoProps {
  signature?: string | null
  programId?: string | null
  tokenMint?: string | null
  userAddress?: string | null
  status?: 'pending' | 'confirmed' | 'failed'
  type?: 'purchase' | 'claim' | 'initialization'
  amount?: number
  timestamp?: Date
}

export function TransactionInfo({
  signature,
  programId,
  tokenMint,
  userAddress,
  status = 'confirmed',
  type,
  amount,
  timestamp
}: TransactionInfoProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!signature && !programId && !tokenMint) {
    return null
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'confirmed':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400'
      case 'confirmed':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-blue-400'
    }
  }

  const getTypeText = () => {
    switch (type) {
      case 'purchase':
        return 'Token Purchase'
      case 'claim':
        return 'Token Claim'
      case 'initialization':
        return 'Contract Initialization'
      default:
        return 'Transaction'
    }
  }

  return (
    <div className="bg-BG-FFF-8 border border-stroct-1 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <div className={`font-medium ${getStatusColor()}`}>
              {getTypeText()}
            </div>
            {timestamp && (
              <div className="text-xs text-foundation-blue-50">
                {timestamp.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        
        {(signature || programId || tokenMint) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-1 hover:text-primary-2 text-sm my-transition"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      {amount && (
        <div className="mt-2 text-sm text-foundation-blue-20">
          Amount: <span className="font-medium">{amount.toLocaleString()} VIBES</span>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 space-y-3 border-t border-primary-6 pt-4">
          {signature && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foundation-blue-60">Transaction Signature:</div>
              <div className="flex items-center justify-between bg-primary-4 rounded p-2">
                <code className="text-xs text-primary-1 break-all">
                  {signature}
                </code>
                <a
                  href={getExplorerUrl(signature, 'devnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-1 hover:text-primary-2 text-xs ml-2 whitespace-nowrap my-transition"
                >
                  View on Solscan ↗
                </a>
              </div>
            </div>
          )}

          {programId && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foundation-blue-60">Program ID:</div>
              <div className="flex items-center justify-between bg-primary-4 rounded p-2">
                <code className="text-xs text-highlight-1 break-all">
                  {programId}
                </code>
                <a
                  href={getExplorerAccountUrl(programId, 'devnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-1 hover:text-primary-2 text-xs ml-2 whitespace-nowrap my-transition"
                >
                  View Program ↗
                </a>
              </div>
            </div>
          )}

          {tokenMint && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foundation-blue-60">VIBES Token Mint:</div>
              <div className="flex items-center justify-between bg-primary-4 rounded p-2">
                <code className="text-xs text-highlight-2 break-all">
                  {tokenMint}
                </code>
                <a
                  href={getExplorerAccountUrl(tokenMint, 'devnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-1 hover:text-primary-2 text-xs ml-2 whitespace-nowrap my-transition"
                >
                  View Token ↗
                </a>
              </div>
            </div>
          )}

          {userAddress && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foundation-blue-60">Your Wallet:</div>
              <div className="flex items-center justify-between bg-primary-4 rounded p-2">
                <code className="text-xs text-primary-2 break-all">
                  {userAddress}
                </code>
                <a
                  href={getExplorerAccountUrl(userAddress, 'devnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-1 hover:text-primary-2 text-xs ml-2 whitespace-nowrap my-transition"
                >
                  View Wallet ↗
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <div className="text-xs text-gray-500 flex items-center space-x-2">
              <span>🌐</span>
              <span>Connected to Solana Devnet</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for showing smart contract deployment status
export function SmartContractStatus() {
  const programId = process.env.NEXT_PUBLIC_PRESALE_PROGRAM_ID
  const tokenMint = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS
  const isDeployed = Boolean(programId && tokenMint)

  return (
    <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">Smart Contract Status</h4>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isDeployed 
            ? 'bg-green-600/20 text-green-400 border border-green-500/30'
            : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
        }`}>
          {isDeployed ? '✅ Deployed' : '⏳ Not Deployed'}
        </div>
      </div>

      {isDeployed ? (
        <div className="space-y-2 text-sm">
          <div className="text-gray-300">
            🎉 Smart contracts are deployed and ready for use on Solana Devnet!
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Program:</span>
              <code className="text-purple-400 text-xs">{programId?.slice(0, 8)}...{programId?.slice(-8)}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Token:</span>
              <code className="text-orange-400 text-xs">{tokenMint?.slice(0, 8)}...{tokenMint?.slice(-8)}</code>
            </div>
          </div>

          <div className="text-xs text-green-400 mt-2">
            • Real blockchain transactions ✅
            • Transparent on-chain data ✅  
            • Decentralized vesting ✅
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="text-gray-300">
            Smart contracts are not deployed yet. Using simulation mode.
          </div>
          
          <div className="text-xs text-yellow-400">
            📝 To deploy: Run deployment script in anchor-project/
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            • Simulated transactions ⚠️
            • Local data storage ⚠️
            • Testing mode only ⚠️
          </div>
        </div>
      )}
    </div>
  )
}
