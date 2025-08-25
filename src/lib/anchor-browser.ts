/**
 * Solución para usar Anchor en el navegador
 * Este archivo proporciona una implementación compatible con el navegador para Anchor
 */

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

// Importar BN directamente de bn.js
import BN from 'bn.js';

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
  // Asegurarse de que BN esté disponible globalmente y en Anchor
  if (typeof window !== 'undefined') {
    (window as any).BN = BN;
    // Asegurarse de que anchor.BN también esté definido correctamente
    anchor.BN = BN;
  }
  
  // Crear un proveedor compatible con el navegador
  const provider = BrowserAnchorProvider.create(connection, wallet);
  
  try {
    // Crear y devolver el programa con manejo explícito de errores
    return new anchor.Program(
      PRESALE_IDL,
      new PublicKey(programId),
      provider
    );
  } catch (error) {
    console.error("Error al crear el programa Anchor:", error);
    throw error;
  }
}

// Función para crear un BN desde un número
export function createBN(value: number | string): BN {
  return new BN(value);
}

// Función para convertir SOL a lamports usando BN
export function solToLamports(sol: number): BN {
  return createBN(sol * 1e9);
}

// Función para convertir lamports a SOL
export function lamportsToSol(lamports: BN | number): number {
  if (BN.isBN(lamports)) {
    return lamports.toNumber() / 1e9;
  }
  return lamports / 1e9;
}
