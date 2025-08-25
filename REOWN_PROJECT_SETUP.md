# 🔧 Error 403 de Reown: Cómo solucionarlo

## ❌ **Error que estás viendo**

```
[Reown Config] Failed to fetch remote project configuration. 
Using local/default values. Error: HTTP status code: 403
```

Este error indica que el **Project ID** en tu configuración no es válido o no está configurado correctamente.

## ✅ **Solución paso a paso**

### 1. **Obtener un Project ID válido**

Ve a [Reown Cloud](https://cloud.reown.com/) y sigue estos pasos:

1. **Registrarse/Iniciar sesión**
   - Ve a https://cloud.reown.com/
   - Click en "Sign Up" o "Sign In"
   - Usa tu email para registrarte

2. **Crear nuevo proyecto**
   - Click en "+ New Project"
   - Selecciona "AppKit" como tipo de proyecto
   - Nombra tu proyecto (ej: "Solana Presale App")
   - Click "Create"

3. **Obtener Project ID**
   - Después de crear el proyecto, verás tu **Project ID**
   - Se ve algo así: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - **Copia este ID completo**

### 2. **Configurar en tu app**

Crea o actualiza tu archivo `.env.local`:

```env
# Reemplaza con tu Project ID real de Reown
NEXT_PUBLIC_REOWN_PROJECT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Tu configuración de Helius
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=tu_helius_api_key

# Configuración de red
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Información de la app
NEXT_PUBLIC_APP_NAME=Solana Presale & Staking
NEXT_PUBLIC_APP_DESCRIPTION=A decentralized application for token presale and staking on Solana
```

### 3. **Reiniciar la aplicación**

```bash
# Para el servidor (Ctrl+C en la terminal)
# Luego reinicia:
npm run dev
```

### 4. **Verificar que funciona**

Después de reiniciar, deberías ver:
- ✅ No más errores 403 en la consola
- ✅ Botón "Connect Wallet" funcionando
- ✅ Detección automática de wallets

## 🔍 **Troubleshooting**

### **Problema: Sigue apareciendo error 403**
**Soluciones:**
- ✅ Verifica que copiaste el Project ID completo
- ✅ Asegúrate de que el archivo se llama `.env.local`
- ✅ Reinicia completamente el servidor de desarrollo
- ✅ Verifica que no hay espacios extra en el Project ID

### **Problema: .env.local no se lee**
**Soluciones:**
- ✅ El archivo debe estar en la **raíz del proyecto** (mismo nivel que package.json)
- ✅ El archivo debe llamarse exactamente `.env.local`
- ✅ Reinicia el servidor después de cambios

### **Problema: Project ID no válido**
**Posibles causas:**
- ❌ Usaste un Project ID de ejemplo/placeholder
- ❌ El proyecto fue eliminado en Reown Cloud
- ❌ El Project ID está mal copiado

## 📱 **Verificación rápida**

1. **Ve a tu .env.local**
2. **Verifica que tienes algo como:**
   ```env
   NEXT_PUBLIC_REOWN_PROJECT_ID=12345678-1234-1234-1234-123456789012
   ```
3. **NO debe ser:**
   - `your_project_id_here` ❌
   - `ad3c25f6-90b4-4c55-92cd-60e521c91102` ❌ (ID de ejemplo)
   - Un ID vacío o con espacios ❌

## 🎯 **¿Sin Project ID aún?**

**🆓 Es completamente GRATIS:**
- Sin límites para desarrollo
- Sin tarjeta de crédito requerida
- Setup en 2 minutos

**Pasos rápidos:**
1. Ve a [cloud.reown.com](https://cloud.reown.com/)
2. Registro con email
3. Crear proyecto AppKit
4. Copiar Project ID
5. Pegar en `.env.local`
6. ¡Listo! 🎉

## 🚀 **Una vez solucionado**

Tu app tendrá:
- ✅ Conexión perfecta de wallets
- ✅ Detección automática de Phantom, Solflare, etc.
- ✅ UI responsiva para wallets
- ✅ Gestión segura de conexiones

¡Y podrás continuar desarrollando sin errores! 💪
