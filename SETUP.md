# 🚀 Quick Setup Guide

This guide will help you get your Solana Presale & Staking app running in minutes.

## ⚡ Quick Start

### 1. Get Your Reown Project ID

This is **REQUIRED** for the app to work:

1. Go to [Reown Cloud](https://cloud.reown.com/)
2. Sign up or log in
3. Click "Create Project"
4. Choose "AppKit" as project type
5. Give your project a name (e.g., "Solana Presale App")
6. Copy your **Project ID**

### 2. Create Environment File

Create a file named `.env.local` in the root directory and add:

```env
# Replace 'your_project_id_here' with your actual Reown Project ID
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here

# Solana RPC Configuration
# Option 1: Free Solana Devnet (slower, rate limited)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Option 2: Helius RPC (recommended - faster, more reliable)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=your_helius_api_key

# Option 3: QuickNode or other RPC providers
# NEXT_PUBLIC_SOLANA_RPC_URL=your_custom_rpc_url

NEXT_PUBLIC_SOLANA_NETWORK=devnet

# App Configuration
NEXT_PUBLIC_APP_NAME=Solana Presale & Staking
NEXT_PUBLIC_APP_DESCRIPTION=A decentralized application for token presale and staking on Solana
```

### 💡 **RPC Provider Setup (Recommended)**

**Reown NO proporciona RPC** - necesitas un proveedor externo:

**🔥 Helius (Recomendado):**
1. Ve a [Helius](https://www.helius.dev/)
2. Crea cuenta gratis (100k requests/mes)
3. Obtén tu API key
4. Usa: `https://devnet.helius-rpc.com/?api-key=TU_API_KEY`

**Alternativas:**
- **QuickNode**: RPC rápido y confiable
- **Alchemy**: Buen soporte para desarrollo
- **RPC Público**: Gratis pero más lento

### 3. Start the App

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 🎯 What You Can Do Now

### ✅ Already Working:
- **Wallet Connection**: Connect any Solana wallet (Phantom, Solflare, etc.)
- **Beautiful UI**: Modern, responsive interface
- **Tab Navigation**: Switch between Presale and Staking
- **Mock Data**: Sample presale and staking data for testing
- **Input Validation**: Form validation and error handling

### 🔧 Ready for Customization:
- **Presale Parameters**: Update token rates, limits, etc. in `src/config/solana.ts`
- **Staking Settings**: Modify APY, lock periods, minimum amounts
- **Styling**: Customize colors, layouts, and animations
- **Branding**: Update logos, names, and descriptions

## 🚧 Next Steps (Optional)

### For Production Use:

1. **Smart Contracts**: Deploy actual Solana programs for presale and staking
2. **Real Data**: Replace mock data with blockchain data
3. **Testing**: Thoroughly test all functionality
4. **Security Audit**: Have contracts audited before mainnet deployment

### Development Features:

1. **Token Creation**: Create your own SPL token
2. **Program Development**: Write custom Solana programs
3. **Advanced Features**: Add more DeFi functionality

## 📱 Testing the App

### With Wallet Connected:
- Try entering different amounts in presale/staking forms
- Test validation (minimum/maximum amounts)
- See how the UI responds to different states

### Without Wallet:
- Buttons will show "Connect Wallet"
- Forms are disabled until connection
- Mock data is still visible

## 🐛 Troubleshooting

### Common Issues:

1. **"NEXT_PUBLIC_REOWN_PROJECT_ID is not set"**
   - Make sure you created `.env.local` file
   - Check your Project ID is correct
   - Restart the development server

2. **Wallet connection issues**
   - Make sure you have a Solana wallet installed
   - Try different wallet providers
   - Check browser console for errors

3. **Development server issues**
   - Stop server (Ctrl+C) and restart with `npm run dev`
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and run `npm install` again

## 🎨 Customization Quick Tips

### Change Token Rate:
Edit `PRESALE_TOKEN_RATE` in `src/config/solana.ts`

### Update Staking APY:
Modify `STAKING_APY` in `src/config/solana.ts`

### Change Colors:
Update gradient classes in components (from-purple-600, to-pink-600, etc.)

### Add Your Logo:
Replace the "S" logo in `src/components/Navbar.tsx` and `src/components/Footer.tsx`

---

**🎉 Congratulations!** You now have a fully functional Solana presale and staking interface. The foundation is solid - now you can build upon it with real smart contracts and additional features!
