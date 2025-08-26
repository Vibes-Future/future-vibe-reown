# 🌐 Environment Setup Guide

This guide explains how to configure the Future Vibe application for different networks (Devnet, Testnet, Mainnet).

## 📁 Environment Files

### 1. **env.development** - For Devnet Testing
```bash
# Copy to .env.local for development
cp env.development .env.local
```

**Use this for:**
- 🧪 Development and testing
- 🔗 Devnet blockchain interactions
- 🎮 Simulation mode enabled
- 📝 Debug logs enabled

### 2. **env.testnet** - For Testnet Testing
```bash
# Copy to .env.local for testnet testing
cp env.testnet .env.local
```

**Use this for:**
- 🧪 Pre-production testing
- 🔗 Testnet blockchain interactions
- ⚠️ Simulation mode disabled
- 📝 Debug logs enabled

### 3. **env.mainnet** - For Production
```bash
# Copy to .env.local for mainnet deployment
cp env.mainnet .env.local
```

**Use this for:**
- 🚀 Production deployment
- 🔗 Mainnet blockchain interactions
- ⚠️ Simulation mode disabled
- 🚫 Debug logs disabled

## 🔧 Configuration Variables

### **Network Configuration**
```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet|testnet|mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### **Reown AppKit**
```bash
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
```

### **Smart Contract Addresses**
```bash
NEXT_PUBLIC_PRESALE_PROGRAM_ID=your_presale_program_id
NEXT_PUBLIC_STAKING_PROGRAM_ID=your_staking_program_id
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=your_token_mint_address
```

### **Liquidity Pool Addresses**
```bash
# Mainnet (Real addresses)
NEXT_PUBLIC_LIQUIDITY_POOL_SOL=vYAXJaPhEMAXkK7x5oBK56WJBBp1CaZMSAoHxn6o7PS
NEXT_PUBLIC_LIQUIDITY_POOL_USDC=H5cnsMTCWbyzmkCagHYmMuJkc39RJDc2vdhCLVN8so8z

# Devnet/Testnet (Replace with deployed addresses)
NEXT_PUBLIC_LIQUIDITY_POOL_SOL=your_devnet_sol_pool_here
NEXT_PUBLIC_LIQUIDITY_POOL_USDC=your_devnet_usdc_pool_here
```

### **Presale Configuration**
```bash
NEXT_PUBLIC_PRESALE_HARD_CAP_SOL=10000
NEXT_PUBLIC_PRESALE_SOFT_CAP_SOL=1000
NEXT_PUBLIC_PRESALE_HARD_CAP_USDC=10000000
NEXT_PUBLIC_PRESALE_SOFT_CAP_USDC=1000000
```

### **Token Configuration**
```bash
NEXT_PUBLIC_TOKEN_DECIMALS=9
NEXT_PUBLIC_MIN_PRESALE_AMOUNT_SOL=0.1
NEXT_PUBLIC_MAX_PRESALE_AMOUNT_SOL=100
NEXT_PUBLIC_MIN_PRESALE_AMOUNT_USDC=10
NEXT_PUBLIC_MAX_PRESALE_AMOUNT_USDC=10000
```

### **Feature Flags**
```bash
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true|false
NEXT_PUBLIC_ENABLE_SIMULATION_MODE=true|false
```

## 🚀 Quick Start

### **For Development (Devnet):**
```bash
# 1. Copy development environment
cp env.development .env.local

# 2. Update with your actual values
nano .env.local

# 3. Start development server
npm run dev
```

### **For Testing (Testnet):**
```bash
# 1. Copy testnet environment
cp env.testnet .env.local

# 2. Update with your testnet addresses
nano .env.local

# 3. Start development server
npm run dev
```

### **For Production (Mainnet):**
```bash
# 1. Copy mainnet environment
cp env.mainnet .env.local

# 2. Update with your production addresses
nano .env.local

# 3. Build and deploy
npm run build
npm start
```

## 🔍 Environment Validation

The application automatically validates your environment configuration. You can check the current configuration in the browser console:

```javascript
// In browser console
import { getEnvironmentInfo } from '@/config/environment'
console.log(getEnvironmentInfo())
```

## ⚠️ Important Notes

### **Security:**
- Never commit `.env.local` files to version control
- Keep production addresses secure
- Use different project IDs for each environment

### **Development Workflow:**
1. **Start with Devnet** for development and testing
2. **Move to Testnet** for integration testing
3. **Deploy to Mainnet** for production

### **Network Switching:**
- Change `NEXT_PUBLIC_SOLANA_NETWORK` in `.env.local`
- Update RPC URLs accordingly
- Ensure liquidity pool addresses match the network

## 🆘 Troubleshooting

### **Common Issues:**

1. **"Project ID not set"**
   - Ensure `NEXT_PUBLIC_PROJECT_ID` is set in `.env.local`

2. **"Liquidity pool not found"**
   - Verify pool addresses match the selected network
   - Check if pools are deployed on the target network

3. **"Smart contract not accessible"**
   - Ensure program IDs are correct for the network
   - Verify programs are deployed on the target network

### **Debug Mode:**
Enable debug logs to see detailed information:
```bash
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true
```

## 📚 Additional Resources

- [Solana Networks Documentation](https://docs.solana.com/clusters)
- [Reown AppKit Documentation](https://docs.reown.com)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
