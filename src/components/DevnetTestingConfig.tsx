'use client'

import { useState } from 'react'
import { clearMockData } from '@/utils/mock-solana'

/**
 * DevnetTestingConfig - Componente para configurar opciones de testing
 * 
 * Este componente permite a los desarrolladores:
 * - Simular el timestamp de listing
 * - Establecer la fecha actual para pruebas
 * - Alternar entre modo simulación y blockchain
 */
export default function DevnetTestingConfig() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClearData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos de simulación?')) {
      clearMockData()
      alert('Datos de simulación borrados. Recarga la página para ver los cambios.')
    }
  }

  const handleSimulateListing = () => {
    // Set listing timestamp to 1 minute ago
    const oneMinuteAgo = Math.floor(Date.now() / 1000) - 60
    localStorage.setItem('vibes_listing_timestamp', oneMinuteAgo.toString())
    alert('Listing simulado como 1 minuto en el pasado. Recarga la página para ver los cambios.')
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsExpanded(true)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
        >
          🧪
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">🧪 Configuración de Testing</h3>
        <button 
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Simulación de Listing</p>
          <button 
            onClick={handleSimulateListing}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded w-full"
          >
            Simular Listing (1 min atrás)
          </button>
        </div>
        
        <div>
          <p className="text-xs text-gray-400 mb-1">Datos de Simulación</p>
          <button 
            onClick={handleClearData}
            className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded w-full"
          >
            Borrar Datos Simulados
          </button>
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400">Modo Simulación</p>
          <div className="flex items-center mt-1">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Activo</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Los datos se almacenan localmente
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-700 text-xs text-gray-500">
        <p>Esta es una simulación para testing. Las transacciones no se envían a la blockchain real.</p>
      </div>
    </div>
  )
}