/**
 * Polyfill específico para @solana/web3.js en el navegador
 * Este archivo resuelve problemas específicos con BN y BigNumber en el entorno del navegador
 */

import BN from 'bn.js'

// Función para inicializar todos los polyfills necesarios para Solana Web3.js
export async function initializeSolanaPolyfills() {
  if (typeof window === 'undefined') return

  // Asegurar que BN está disponible globalmente
  (window as any).BN = BN
  ;(window as any).BigNumber = BN
  
  // Polyfill para el objeto global si existe
  if (typeof globalThis !== 'undefined') {
    ;(globalThis as any).BN = BN
    ;(globalThis as any).BigNumber = BN
  }

  // Polyfill específico para Buffer
  if (typeof (window as any).Buffer === 'undefined') {
    try {
      // Usar import dinámico en lugar de require para compatibilidad con navegador
      import('buffer').then(({ Buffer }) => {
        (window as any).Buffer = Buffer
        ;(globalThis as any).Buffer = Buffer
        console.log('✅ Buffer polyfill loaded successfully')
      }).catch((error) => {
        console.warn('Buffer polyfill not available:', error)
      })
    } catch (error) {
      console.warn('Buffer polyfill not available:', error)
    }
  }

  // Polyfill para process si no existe
  if (typeof (window as any).process === 'undefined') {
    ;(window as any).process = {
      env: {},
      browser: true,
      version: '',
      versions: { node: '' }
    }
  }

  // Crear un proxy para BN que maneja mejor la compatibilidad
  const BNProxy = new Proxy(BN, {
    construct(target, args) {
      try {
        return new target(...args)
      } catch (error) {
        console.warn('BN constructor error, falling back:', error)
        return new target(0)
      }
    }
  })

  ;(window as any).BN = BNProxy
  
  console.log('🔧 Solana Web3.js polyfills initialized')
}

// Función para verificar si todos los polyfills están funcionando
export function verifySolanaPolyfills(): boolean {
  if (typeof window === 'undefined') return false

  try {
    // Verificar BN
    const testBN = new (window as any).BN(42)
    if (!testBN || typeof testBN.toString !== 'function') {
      throw new Error('BN not working properly')
    }

    // Verificar que podemos crear un BN desde diferentes tipos
    const fromString = new (window as any).BN('100')
    const fromNumber = new (window as any).BN(100)
    
    if (fromString.toString() !== '100' || fromNumber.toString() !== '100') {
      throw new Error('BN conversion not working')
    }

    return true
  } catch (error) {
    console.error('Solana polyfills verification failed:', error)
    return false
  }
}

// Función para crear un BN de forma segura
export function createSafeBN(value: any): BN {
  if (typeof window === 'undefined') {
    return new BN(value || 0)
  }

  try {
    // Intentar usar el BN global del window
    if ((window as any).BN) {
      return new (window as any).BN(value || 0)
    }
    
    // Fallback al BN importado
    return new BN(value || 0)
  } catch (error) {
    console.warn('Failed to create BN, using fallback:', error)
    return new BN(0)
  }
}

export { BN }
