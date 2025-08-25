# 🚀 Smart Contract Deployment Guide

## 📋 Prerequisites

### 1. Install Solana CLI
```bash
# Windows
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Mac/Linux  
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
```

### 2. Install Anchor CLI
```bash
npm install -g @coral-xyz/anchor-cli
# or
cargo install --git https://github.com/coral-xyz/anchor anchor-cli
```

### 3. Configure Solana for Devnet
```bash
solana config set --url devnet
solana-keygen new --outfile ~/.config/solana/id.json
solana airdrop 2 --url devnet
```

## 🔨 Deployment Process

### Step 1: Navigate to Contract Directory
```bash
cd anchor-project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Build the Program
```bash
anchor build
```

### Step 4: Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

### Step 5: Initialize Contract
```bash
node deploy.js
```

### Step 6: Update Environment Variables

The deploy script will output something like this:

```
🔧 Add these to your .env file:
=====================================
NEXT_PUBLIC_PRESALE_PROGRAM_ID=ViBeSSo1anaPreSa1eTokenVestingDevnetProgram
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRU
NEXT_PUBLIC_PRESALE_CONFIG=8s4B2vKDNHZ6M91PQnb9VkJ2T1x7qP9rA8c3vXe5N6yL
NEXT_PUBLIC_PRESALE_VAULT=9k5C3vL1oHz7N92QRnc4VlK3T8x7rP9sB9d4wYf6O7zM
=====================================
```

**Add these to your `.env.local` file:**

```env
# Your existing configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=your_api_key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id

# Add these from deployment output
NEXT_PUBLIC_PRESALE_PROGRAM_ID=ViBeSSo1anaPreSa1eTokenVestingDevnetProgram
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRU
NEXT_PUBLIC_PRESALE_CONFIG=8s4B2vKDNHZ6M91PQnb9VkJ2T1x7qP9rA8c3vXe5N6yL
NEXT_PUBLIC_PRESALE_VAULT=9k5C3vL1oHz7N92QRnc4VlK3T8x7rP9sB9d4wYf6O7zM
```

### Step 7: Restart Your App
```bash
# In the main project directory
npm run dev
```

## 🧪 Testing Deployment

### 1. Check Program Deployment
```bash
solana program show PROGRAM_ID --url devnet
```

### 2. Verify in Explorer
Visit: `https://explorer.solana.com/address/PROGRAM_ID?cluster=devnet`

### 3. Test in App
1. Open http://localhost:3000
2. Look for "✅ Deployed" status in Smart Contract Status
3. Connect wallet on Devnet
4. Purchase tokens with SOL
5. Check transaction on Solscan

## 🔧 Troubleshooting

### Common Issues:

**1. "Insufficient funds for transaction"**
```bash
solana airdrop 2 --url devnet
```

**2. "Program deploy failed"**
- Check if you have enough SOL (need ~2 SOL)
- Make sure you're on Devnet: `solana config get`

**3. "Anchor build failed"**
- Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Add to PATH: `source ~/.cargo/env`

**4. "Permission denied"**
```bash
chmod +x ~/.local/share/solana/install/active_release/bin/solana
```

**5. "Program already deployed"**
- Use `anchor upgrade` instead of `anchor deploy`
- Or generate new program keypair: `solana-keygen new -o target/deploy/vibes_presale-keypair.json`

## 📊 Contract Features

### Implemented Functions:
- ✅ `initialize_presale()` - Setup presale configuration
- ✅ `purchase_with_sol()` - Buy tokens with SOL
- ✅ `purchase_with_usdc()` - Buy tokens with USDC  
- ✅ `claim_vested_tokens()` - Claim by period (40%, 20%, 20%, 20%)
- ✅ `update_rates()` - Update conversion rates (authority only)
- ✅ `toggle_presale()` - Pause/unpause (authority only)

### Security Features:
- ✅ PDA-based account derivation
- ✅ Re-entrancy protection
- ✅ Authority-only functions
- ✅ Input validation
- ✅ Event emission for transparency

## 🎯 After Deployment

Your app will automatically:
1. **Detect smart contracts** are deployed
2. **Switch to blockchain mode** from simulation
3. **Show real transaction hashes** and links
4. **Store data on-chain** instead of localStorage
5. **Enable real token transfers** to user wallets

### Real Blockchain Features:
- 🔗 **Real transactions** on Solana Devnet
- 💎 **Actual token transfers** to user wallets
- 📊 **On-chain vesting schedules** 
- 🔍 **Transparent on Solscan** explorer
- 🏦 **Decentralized data storage**

## 📈 Production Deployment

For Mainnet deployment:

1. Change cluster to mainnet:
   ```bash
   solana config set --url mainnet-beta
   ```

2. Get production SOL for deployment costs

3. Update .env.local:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

4. Deploy with production RPC:
   ```bash
   anchor deploy --provider.cluster mainnet
   ```

## 🎉 Success!

Once deployed, your VIBES presale will be:
- ✅ **Fully decentralized** on Solana blockchain
- ✅ **Transparent** with all transactions visible
- ✅ **Secure** with tested smart contracts
- ✅ **User-friendly** with modern UI
- ✅ **Production-ready** for real users

**Your smart contract deployment is complete! 🚀**
