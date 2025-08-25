/**
 * Dynamic import para Anchor y componentes relacionados
 * Esto evita problemas con el SSR y asegura que se cargue solo en el cliente
 */

import { Connection } from '@solana/web3.js'

// Interface para el programa de Anchor
export interface AnchorProgram {
  methods: any
  account: any
}

// Interface para el resultado de la inicialización
export interface InitProgramResult {
  success: boolean
  program?: AnchorProgram
  error?: string
}

// Función para inicializar el programa de manera dinámica
export async function initializeProgramDynamic(
  programId: string,
  connection: Connection,
  wallet: any
): Promise<InitProgramResult> {
  // Solo ejecutar en el cliente
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: 'Cannot initialize program on server side'
    }
  }

  try {
    // Import dinámico del módulo de Anchor
    const { createBrowserProgram } = await import('./anchor-browser')
    
    // Crear el programa (ahora es async)
    const program = await createBrowserProgram(programId, connection, wallet)
    
    return {
      success: true,
      program
    }
  } catch (error: any) {
    console.error('Failed to initialize program dynamically:', error)
    return {
      success: false,
      error: error.message || 'Unknown error during program initialization'
    }
  }
}

// Función para verificar si estamos en el cliente
export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

// Función para verificar si el navegador soporta WebAssembly
export function supportsWebAssembly(): boolean {
  return typeof WebAssembly !== 'undefined'
}
