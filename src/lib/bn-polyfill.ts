/**
 * Polyfill para BN.js en el navegador
 * Este archivo asegura que BN esté disponible antes de que se inicialice Anchor
 */

import BN from 'bn.js';

// Función para inicializar el polyfill de BN
export function initializeBNPolyfill() {
  if (typeof window !== 'undefined') {
    // Asegurar que BN esté disponible globalmente
    (window as any).BN = BN;
    
    // También como BigNumber para compatibilidad
    (window as any).BigNumber = BN;
    
    // Polyfill para el objeto global si existe
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).BN = BN;
    }
    
    // Para Node.js en contexto de testing
    if (typeof global !== 'undefined') {
      (global as any).BN = BN;
    }
    
    console.log('🔧 BN polyfill initialized successfully');
  }
}

// Función para verificar si BN está disponible
export function isBNAvailable(): boolean {
  if (typeof window !== 'undefined') {
    return !!(window as any).BN && typeof (window as any).BN === 'function';
  }
  return false;
}

// Función para crear un BN de forma segura
export function createSafeBN(value: number | string | BN): BN {
  if (BN.isBN(value)) {
    return value;
  }
  return new BN(value);
}

// Exportar BN para uso directo
export { BN };
