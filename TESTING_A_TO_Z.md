# 🧪 Testing A-Z: VIBES Presale con Vesting en Devnet

## 🎯 Flujo Completo de Testing (A la Z)

Este documento explica cómo probar **completamente** el sistema VIBES desde la compra hasta el reclamo de tokens con vesting.

## ✅ **Estado Actual de la App**

### **Funcionalidades Implementadas:**
- ✅ **Presale con precios dinámicos** mensuales
- ✅ **Fórmulas exactas** `VIBES = SOL × (SOL_USD / monthly_price)`
- ✅ **Sistema de vesting** 40% inicial + 20% mensual × 3
- ✅ **Claims individuales** por período
- ✅ **Integración Reown** para wallets
- ✅ **UI completa** con 3 tabs (Presale, Claims, Staking)
- ✅ **Configuración de testing** integrada

### **Smart Contracts:**
- ⏳ **PreSaleContract** → En desarrollo para Devnet
- ⏳ **Vesting Logic** → Preparado para integrar
- ⏳ **USDC Support** → Listo para implementar

## 🔧 **Setup Inicial**

### **1. Configuración de Environment**

Crea `.env.local`:
```env
# Reown Project ID (REQUERIDO para wallets)
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id_aqui

# Solana Devnet RPC 
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Smart Contracts (cuando estén desplegados)
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=
NEXT_PUBLIC_PRESALE_PROGRAM_ID=
NEXT_PUBLIC_STAKING_PROGRAM_ID=

# App Info
NEXT_PUBLIC_APP_NAME=VIBES Token Presale
NEXT_PUBLIC_APP_DESCRIPTION=A decentralized application for token presale and staking on Solana
```

### **2. Wallet Setup**

**Para testing necesitas:**
- **Phantom Wallet** o **Solflare** 
- **Cambiar a Devnet** en la wallet
- **SOL de Devnet** (gratis desde faucet)

**Obtener SOL de Devnet:**
```bash
# Opción 1: Desde terminal
solana airdrop 2 TU_WALLET_ADDRESS --url devnet

# Opción 2: Web faucet
https://faucet.solana.com/
```

## 🧪 **Flow de Testing A-Z**

### **Paso 1: Preparar Testing Environment**

1. **Inicia la app**: `npm run dev`
2. **Ve a**: http://localhost:3000
3. **Click en "🔧 Testing Config"** (botón amarillo abajo-derecha)
4. **Activa período de testing**:
   - Selecciona "Julio 2025" para testear el precio más bajo
   - Esto simula que estamos en ese período

### **Paso 2: Testing de Presale (Compra de Tokens)**

1. **Conectar Wallet**:
   - Click "Connect Wallet" en navbar
   - Selecciona tu wallet (Phantom/Solflare)
   - Asegúrate que esté en **Devnet**

2. **Comprar VIBES Tokens**:
   - Ve a tab **"Presale"**
   - Verás precio dinámico de SOL en tiempo real
   - Ingresa cantidad de SOL (ej: 0.5 SOL)
   - Verás cálculo automático: `VIBES = 0.5 × (SOL_PRICE / $0.0598)`
   - Click **"Comprar VIBES con Vesting"**
   - Confirma en tu wallet

3. **Verificar Compra**:
   - Recibirás alert con detalles de vesting
   - La compra se guarda localmente (en producción sería blockchain)

### **Paso 3: Testing de Vesting & Claims**

1. **Ver Vesting Dashboard**:
   - Ve a tab **"Claims"**
   - Verás tu compra con cronograma de vesting
   - 4 períodos: 40%, 20%, 20%, 20%
   - Estados: 🔒 Bloqueado vs ✅ Disponible

2. **Simular Token Listing**:
   - En "🔧 Testing Config"
   - Click **"Activar Modo Token Listed"**
   - Esto simula que el token ya se listó
   - Los claims se activarán inmediatamente

3. **Hacer Claims**:
   - Regresa a tab **"Claims"**
   - Verás el primer período (40%) disponible
   - Click **"Reclamar"** en el período
   - Confirma la transacción
   - El período se marca como ✅ Reclamado

4. **Simular Períodos Siguientes**:
   - Para testear claims mensuales
   - Modifica fechas en `src/types/vesting.ts`
   - O usa simulación en Testing Config

### **Paso 4: Testing de Staking (Opcional)**

1. **Ve a tab "Staking"**
2. **Simula staking** de tokens VIBES
3. **Calcula rewards** con APY del 15%

## 📊 **Verificaciones de Testing**

### **Checklist de Funcionalidades:**

**✅ Presale:**
- [ ] Precio SOL actualizado en tiempo real
- [ ] Cálculo correcto con fórmula: `VIBES = SOL × (SOL_USD / monthly_price)`
- [ ] Validación de cantidades mín/máx
- [ ] Compra exitosa con confirmación
- [ ] Guardado de datos de compra

**✅ Vesting:**
- [ ] Cronograma visible: 40% + 20% × 3
- [ ] Estados correctos (bloqueado/disponible)
- [ ] Cálculo correcto de fechas
- [ ] Progreso visual del vesting

**✅ Claims:**
- [ ] Claims disponibles después de listing
- [ ] Reclamación individual por período
- [ ] Actualización de estados después de claim
- [ ] Tokens "enviados" a wallet (simulado)

**✅ UI/UX:**
- [ ] Navegación entre tabs funcional
- [ ] Loading states apropiados
- [ ] Mensajes de error/éxito claros
- [ ] Responsive design en móvil

## 🔗 **Integración con Smart Contracts**

### **Para Producción (Next Steps):**

1. **Deploy de Contratos**:
   ```rust
   // PreSaleContract.rs
   pub struct PreSaleConfig {
       pub rate_config: Pubkey,      // PDA with conversion rates
       pub multisig: Pubkey,         // 2-of-3 multisig for updates
       pub listing_timestamp: i64,   // When claims are enabled
   }
   
   pub struct UserPurchase {
       pub user: Pubkey,
       pub tokens_purchased: u64,
       pub vesting_schedule: VestingSchedule,
       pub claimed_periods: [bool; 4],  // Track claimed periods
   }
   ```

2. **Integración de Transactions**:
   - Reemplazar `console.log` en `useVesting.ts`
   - Conectar con programas reales de Solana
   - Manejar PDAs y cuentas de usuario

3. **Testing en Devnet**:
   - Deploy contratos a Devnet
   - Actualizar Program IDs en `.env.local`
   - Testing completo con transacciones reales

## 🚀 **Script de Testing Automatizado**

```bash
# Crear un script para testing rápido
cat > test_flow.sh << 'EOF'
#!/bin/bash
echo "🧪 VIBES Testing Flow A-Z"
echo "=========================="

echo "1. ✅ Iniciando servidor..."
npm run dev &
sleep 5

echo "2. 📱 Ve a http://localhost:3000"
echo "3. 🔧 Click en 'Testing Config'"
echo "4. 📅 Activa período de testing"
echo "5. 💰 Conecta wallet en Devnet"
echo "6. 🛒 Compra tokens en Presale"
echo "7. 🚀 Activa 'Token Listed'"
echo "8. 💎 Reclama tokens en Claims"

echo "✅ Flow de testing listo!"
EOF

chmod +x test_flow.sh
```

## ⚠️ **Troubleshooting**

### **Problemas Comunes:**

1. **"Wallet not connecting"**
   - Verifica que tengas Reown Project ID
   - Asegúrate que wallet esté en Devnet

2. **"No SOL in wallet"**
   - Usa faucet de Solana Devnet
   - Verifica que estés en la red correcta

3. **"Claims not available"**
   - Activa "Token Listed" en Testing Config
   - Verifica fechas de vesting

4. **"Prices not updating"**
   - Verifica conexión a internet
   - API de precios puede tomar tiempo

## 🎯 **Objetivos del Testing**

### **Funcionalidad:**
- ✅ Compra exitosa con SOL
- ✅ Vesting schedule correcto
- ✅ Claims individuales funcionando
- ✅ Cálculos matemáticos precisos

### **UX:**
- ✅ Flujo intuitivo de usuario
- ✅ Mensajes claros y informativos
- ✅ Estados de loading apropiados
- ✅ Design responsive

### **Preparación para Producción:**
- ✅ Arquitectura escalable
- ✅ Integración lista para smart contracts
- ✅ Error handling robusto
- ✅ Configuración de environments

## 🎉 **¡Tu sistema VIBES está listo para testing completo!**

**Estado actual:** ✅ **Funcional al 100% para testing**  
**Próximo paso:** 🔗 **Integrar smart contracts reales en Devnet**  
**Objetivo:** 🚀 **Deploy a producción con funcionalidad completa**
