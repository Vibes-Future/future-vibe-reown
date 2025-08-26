'use client'

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Direct process.env access:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            NEXT_PUBLIC_PROJECT_ID: {process.env.NEXT_PUBLIC_PROJECT_ID || 'NOT SET'}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">From our environment config:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify({
              projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
              network: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
              rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">All NEXT_PUBLIC_ variables:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {Object.keys(process.env)
              .filter(key => key.startsWith('NEXT_PUBLIC_'))
              .reduce((obj, key) => {
                obj[key] = process.env[key]
                return obj
              }, {} as Record<string, string | undefined>)
            }
          </pre>
        </div>
      </div>
    </div>
  )
}
