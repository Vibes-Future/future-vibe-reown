# 🚀 Configuración con Helius RPC

Ya que mencionaste que tienes Helius configurado, aquí tienes los pasos específicos para optimizar tu setup.

## ✅ ¿Ya tienes tu API Key de Helius?

Si ya tienes tu API key, simplemente actualiza tu `.env.local`:

```env
# Tu Project ID de Reown
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id_aqui

# Tu Helius RPC (reemplaza TU_API_KEY con tu clave real)
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=TU_API_KEY

# Para mainnet (cuando estés listo para producción):
# NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=TU_API_KEY

NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Configuración de la app
NEXT_PUBLIC_APP_NAME=Solana Presale & Staking
NEXT_PUBLIC_APP_DESCRIPTION=A decentralized application for token presale and staking on Solana
```

## 🔧 ¿No tienes Helius aún? Setup en 2 minutos:

### 1. Crear cuenta en Helius
1. Ve a [helius.dev](https://www.helius.dev/)
2. Click en "Get Started Free"
3. Regístrate con tu email
4. Verifica tu cuenta

### 2. Crear tu API Key
1. Ve al Dashboard
2. Click en "Create New Project" 
3. Selecciona "Solana"
4. Copia tu API Key

### 3. Configurar en tu app
Usa tu API key en `.env.local`:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=TU_API_KEY_REAL
```

## 📊 **Beneficios de Helius vs RPC Público**

| Feature | RPC Público | Helius |
|---------|-------------|--------|
| **Requests/mes** | ~1,000 | 100,000 |
| **Velocidad** | 2-5 segundos | 100-500ms |
| **Rate Limits** | Muy estrictos | Generosos |
| **Reliability** | Variable | 99.9% uptime |
| **Costo** | Gratis | Gratis (plan básico) |

## 🚀 **Restart tu app después de configurar**

```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia:
npm run dev
```

## 🔍 **Verificar que funciona**

1. Abre http://localhost:3000
2. Abre Developer Tools (F12)
3. Ve a la pestaña Network
4. Conecta una wallet
5. Deberías ver requests a `helius-rpc.com` en lugar de `api.devnet.solana.com`

## ⚡ **Para Mainnet (Producción)**

Cuando estés listo para lanzar:

1. Cambia la URL en `.env.local`:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=TU_API_KEY
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

2. Actualiza las redes en `src/config/appkit.ts`:
   ```typescript
   networks: [solana, customSolanaDevnet, solanaTestnet],
   defaultNetwork: solana, // Cambia a mainnet
   ```

## 🔐 **Seguridad de API Keys**

### ✅ **Correcto**:
- API key en `.env.local` (no se sube a Git)
- Variables con `NEXT_PUBLIC_` (para frontend)

### ❌ **Incorrecto**:
- Hardcodear API key en el código
- Subir `.env.local` a Git
- Usar API keys privadas en frontend

## 🆘 **Troubleshooting**

### Error: "Failed to fetch"
- ✅ Verifica que tu API key esté correcta
- ✅ Asegúrate de tener el formato correcto de URL
- ✅ Reinicia el servidor después de cambios

### Error: "Rate limited"
- ✅ Verifica que estés usando Helius, no RPC público
- ✅ Checa tu usage en el dashboard de Helius

### Error: "Network not found"
- ✅ Verifica que `NEXT_PUBLIC_SOLANA_NETWORK` sea `devnet` o `mainnet-beta`

## 📞 **¿Todo configurado?**

Si seguiste estos pasos, tu app debería estar:
- ✅ Conectando wallets con Reown
- ✅ Usando Helius para transacciones rápidas
- ✅ Lista para desarrollo/testing

¡Ahora puedes empezar a desarrollar las funcionalidades específicas de tu presale y staking! 🎉
