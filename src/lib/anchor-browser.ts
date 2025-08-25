/**
 * Solución para usar Anchor en el navegador
 * Este archivo proporciona una implementación compatible con el navegador para Anchor
 */

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

// Importar los polyfills específicos para Solana
import { initializeSolanaPolyfills, verifySolanaPolyfills, createSafeBN, BN } from './solana-web3-polyfill';

// Configuración de Anchor
export const ANCHOR_CONFIG = {
  commitment: 'confirmed' as anchor.web3.Commitment,
  preflightCommitment: 'confirmed' as anchor.web3.Commitment,
  skipPreflight: false
};

// Clase de proveedor personalizada para el navegador
export class BrowserAnchorProvider extends anchor.AnchorProvider {
  constructor(connection: Connection, wallet: any, opts: any) {
    super(connection, wallet, opts);
  }

  // Método estático para crear una instancia
  static create(connection: Connection, wallet: any): BrowserAnchorProvider {
    return new BrowserAnchorProvider(
      connection,
      wallet,
      ANCHOR_CONFIG
    );
  }
}

// IDL para el programa de presale
export const PRESALE_IDL = {
  version: "0.1.0",
  name: "vibes_presale",
  instructions: [
    {
      name: "purchaseWithSol",
      accounts: [
        { name: "presaleConfig", isMut: true, isSigner: false },
        { name: "userPurchase", isMut: true, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "presaleVault", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "solAmount", type: "u64" }
      ]
    },
    {
      name: "claimVestedTokens",
      accounts: [
        { name: "presaleConfig", isMut: false, isSigner: false },
        { name: "userPurchase", isMut: true, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "userVibesAccount", isMut: true, isSigner: false },
        { name: "presaleVibesVault", isMut: true, isSigner: false },
        { name: "vibesMint", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "period", type: "u8" }
      ]
    }
  ],
  accounts: [
    {
      name: "presaleConfig",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "isActive", type: "bool" },
          { name: "totalSoldAmount", type: "u64" },
          { name: "currentPrice", type: "u64" },
          { name: "listingTimestamp", type: "i64" }
        ]
      }
    },
    {
      name: "userPurchase",
      type: {
        kind: "struct",
        fields: [
          { name: "user", type: "publicKey" },
          { name: "totalTokensPurchased", type: "u64" },
          { name: "totalClaimedTokens", type: "u64" },
          { name: "lastClaimPeriod", type: "u8" },
          { name: "vestingSchedule", type: {
            defined: "VestingSchedule"
          }}
        ]
      }
    }
  ],
  types: [
    {
      name: "VestingSchedule",
      type: {
        kind: "struct",
        fields: [
          { name: "periods", type: "u8" },
          { name: "claimedAmounts", type: { array: ["u64", 4] } },
          { name: "periodAmounts", type: { array: ["u64", 4] } }
        ]
      }
    }
  ],
  events: [],
  errors: []
};

// Función para crear un programa Anchor compatible con el navegador
export function createBrowserProgram(programId: string, connection: Connection, wallet: any) {
  // Inicializar todos los polyfills de Solana
  initializeSolanaPolyfills();
  
  // Verificar que los polyfills funcionan correctamente
  if (!verifySolanaPolyfills()) {
    throw new Error('Solana polyfills failed verification');
  }
  
  // Pequeña pausa para asegurar que los polyfills se han aplicado
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Crear un proveedor compatible con el navegador
        const provider = BrowserAnchorProvider.create(connection, wallet);
        
        // Crear el programa con manejo de errores mejorado
        const program = new anchor.Program(
          PRESALE_IDL,
          new PublicKey(programId),
          provider
        );
        
        resolve(program);
      } catch (error) {
        console.error("Error al crear el programa Anchor:", error);
        console.error("Polyfills verified:", verifySolanaPolyfills());
        console.error("Window BN:", typeof (window as any)?.BN);
        reject(error);
      }
    }, 100); // Pequeña pausa de 100ms
  });
}

// Función para crear un BN desde un número
export function createBN(value: number | string): BN {
  return createSafeBN(value);
}

// Función para convertir SOL a lamports usando BN
export function solToLamports(sol: number): BN {
  return createSafeBN(sol * 1e9);
}

// Función para convertir lamports a SOL
export function lamportsToSol(lamports: BN | number): number {
  if (BN.isBN(lamports)) {
    return lamports.toNumber() / 1e9;
  }
  return lamports / 1e9;
}
