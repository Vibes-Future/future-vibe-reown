# 🏗️ VIBES Token Presale - Arquitectura del Proyecto

## 📁 Estructura de Directorios

```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Layout principal de la aplicación
│   ├── page.tsx           # Página principal (Home)
│   └── globals.css        # Estilos globales
├── components/            # Componentes React reutilizables
│   ├── index.ts          # Exports centralizados
│   ├── ui/               # Componentes base (botones, inputs, etc.)
│   ├── layout/           # Componentes de layout
│   │   └── Navbar.tsx    # Navegación principal
│   └── features/         # Componentes específicos de features
│       ├── PresaleSection.tsx      # Sección de presale
│       ├── StakingSection.tsx      # Sección de staking
│       ├── VestingDashboard.tsx    # Dashboard de vesting
│       ├── PricingTable.tsx        # Tabla de precios
│       └── TransactionInfo.tsx     # Información de transacciones
├── hooks/                # Custom hooks React
│   ├── index.ts          # Exports centralizados
│   ├── useSolPrice.ts    # Hook para precio de SOL
│   ├── useUsdcPrice.ts   # Hook para precio de USDC
│   ├── usePresaleStats.ts # Hook para estadísticas de presale
│   ├── useVesting.ts     # Hook para vesting
│   └── useSmartContractVesting.ts # Hook para vesting de smart contracts
├── providers/            # Providers de contexto React
│   ├── AppKitProvider.tsx    # Provider para Reown AppKit
│   ├── BNPolyfillProvider.tsx # Provider para polyfills de BN
│   └── ContextProvider.tsx   # Provider principal de la app
├── config/               # Configuraciones de la aplicación
│   ├── environment.ts    # Variables de entorno
│   └── paths.ts          # Configuración centralizada de rutas
├── utils/                # Utilidades y helpers
│   ├── solana-direct.ts  # Integración directa con Solana
│   └── formatters.ts     # Funciones de formateo
├── types/                # Tipos TypeScript
│   ├── index.ts          # Exports centralizados
│   └── vesting.ts        # Tipos para vesting
└── lib/                  # Librerías y configuraciones externas
    └── solana-web3-polyfill.ts # Polyfills para Solana Web3
```

## 🎯 Principios de Arquitectura

### **1. Separación de Responsabilidades**
- **Layout**: Componentes de estructura (Navbar, Footer)
- **Features**: Componentes específicos de funcionalidad
- **UI**: Componentes base reutilizables
- **Providers**: Gestión de estado y contexto

### **2. Organización por Dominio**
- **Presale**: Lógica relacionada con la venta de tokens
- **Staking**: Lógica relacionada con el staking
- **Vesting**: Lógica relacionada con el vesting de tokens

### **3. Imports Centralizados**
- Cada directorio tiene su `index.ts`
- Rutas consistentes usando `@/` alias
- Configuración centralizada en `paths.ts`

## 🔧 Configuración

### **Variables de Entorno (.env)**
```bash
# Reown AppKit
NEXT_PUBLIC_PROJECT_ID=your_project_id

# Solana Network
NEXT_PUBLIC_SOLANA_RPC_URL=your_rpc_url
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Smart Contracts
NEXT_PUBLIC_PRESALE_PROGRAM_ID=your_program_id
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=your_token_address
```

### **Next.js Config**
- **App Router**: Next.js 15
- **TypeScript**: Configuración estricta
- **Tailwind CSS**: Framework de estilos
- **Webpack**: Polyfills para Solana

## 🚀 Escalabilidad

### **Agregar Nuevos Features**
1. Crear componente en `src/components/features/`
2. Agregar export en `src/components/index.ts`
3. Importar en la página correspondiente

### **Agregar Nuevos Hooks**
1. Crear hook en `src/hooks/`
2. Agregar export en `src/hooks/index.ts`
3. Usar en componentes

### **Agregar Nuevos Providers**
1. Crear provider en `src/providers/`
2. Integrar en `ContextProvider.tsx`
3. Usar en componentes

## 📋 Convenciones de Código

### **Nomenclatura**
- **Componentes**: PascalCase (ej: `PresaleSection`)
- **Hooks**: camelCase con prefijo `use` (ej: `useSolPrice`)
- **Archivos**: kebab-case (ej: `presale-section.tsx`)
- **Directorios**: kebab-case (ej: `features/`)

### **Imports**
- **Absolutos**: `@/components/features/PresaleSection`
- **Relativos**: `./TransactionInfo` (para archivos en el mismo directorio)
- **Orden**: React, librerías externas, imports internos

### **Exports**
- **Named exports**: `export { ComponentName }`
- **Default exports**: `export default ComponentName`
- **Barrel exports**: Archivos `index.ts` para centralizar

## 🧹 Mantenimiento

### **Limpieza Regular**
- Eliminar imports no utilizados
- Verificar que no haya archivos duplicados
- Mantener la estructura de directorios consistente

### **Refactoring**
- Mover componentes a directorios apropiados
- Actualizar imports después de mover archivos
- Verificar que el servidor funcione correctamente

## ✅ Checklist de Calidad

- [ ] Todas las rutas de importación son correctas
- [ ] No hay archivos duplicados
- [ ] La estructura de directorios es lógica
- [ ] Los exports están centralizados
- [ ] El servidor funciona sin errores
- [ ] La arquitectura es escalable
- [ ] El código es mantenible
