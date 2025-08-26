# Solana Presale & Staking DApp

A modern decentralized application built with Next.js, TypeScript, and Reown AppKit for token presale and staking on the Solana blockchain.

## 🚀 Features

- **Token Presale**: Participate in token presales with SOL
- **Token Staking**: Stake tokens and earn rewards with configurable APY
- **Wallet Integration**: Seamless wallet connection using Reown AppKit
- **Solana Integration**: Built specifically for the Solana blockchain
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🏗️ Architecture

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── config/             # Configuration files
├── providers/          # Context providers
└── types/             # TypeScript type definitions
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Reown Project ID (get one at [Reown Cloud](https://cloud.reown.com/))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reown
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Solana Configuration
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   
   # Reown Configuration  
   NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=Solana Presale & Staking
   NEXT_PUBLIC_APP_DESCRIPTION=A decentralized application for token presale and staking on Solana
   
   # Token Configuration (for development)
   NEXT_PUBLIC_TOKEN_MINT_ADDRESS=
   NEXT_PUBLIC_PRESALE_PROGRAM_ID=
   NEXT_PUBLIC_STAKING_PROGRAM_ID=
   
   # Development Settings
   NODE_ENV=development
   ```

4. **Get your Reown Project ID**
   - Visit [Reown Cloud](https://cloud.reown.com/)
   - Create a new project
   - Copy your Project ID
   - Replace `your_project_id_here` in your `.env.local` file

## 🚀 Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Start production server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Solana Network

By default, the app is configured to use Solana Devnet. To change networks:

1. Update `NEXT_PUBLIC_SOLANA_NETWORK` in your `.env.local`
2. Update `NEXT_PUBLIC_SOLANA_RPC_URL` accordingly

**Available networks:**
- `devnet`: Development network (default)
- `testnet`: Test network 
- `mainnet-beta`: Production network

### Reown AppKit

The app uses Reown AppKit for wallet connections. Configuration is in `src/config/appkit.ts`.

**Supported features:**
- Auto-discovery of Solana wallets
- Secure transaction signing
- Network switching
- Account management

## 📱 Usage

### Connecting a Wallet

1. Click "Connect Wallet" in the navigation
2. Choose your preferred Solana wallet
3. Approve the connection

### Participating in Presale

1. Navigate to the Presale tab
2. Enter the amount of SOL you want to spend
3. Review the token amount you'll receive
4. Click "Purchase Tokens"
5. Approve the transaction in your wallet

### Staking Tokens

1. Navigate to the Staking tab
2. Choose "Stake" or "Unstake"
3. Enter the amount of tokens
4. Review the expected rewards (for staking)
5. Click "Stake Tokens" or "Unstake Tokens"
6. Approve the transaction in your wallet

### Claiming Rewards

1. Go to the Staking tab
2. Your accumulated rewards are displayed
3. Click "Claim Rewards" to collect them
4. Approve the transaction in your wallet

## 🔐 Security

- **No hardcoded secrets**: All sensitive data is managed through environment variables
- **Secure transactions**: All blockchain interactions are signed by the user's wallet
- **Input validation**: All user inputs are validated before processing
- **Error handling**: Comprehensive error handling throughout the application

## 🎨 Customization

### Styling

The app uses Tailwind CSS for styling. You can customize:

- Colors: Update the gradient colors in components
- Layout: Modify component structures in `src/components/`
- Animations: Add custom animations using Tailwind

### Constants

Update presale and staking parameters in `src/config/solana.ts`:

```typescript
export const CONSTANTS = {
  LAMPORTS_PER_SOL: 1000000000,
  TOKEN_DECIMALS: 9,
  MIN_PRESALE_AMOUNT: 0.1,
  MAX_PRESALE_AMOUNT: 100,
  PRESALE_TOKEN_RATE: 1000,
  STAKING_APY: 15,
} as const
```

## 🧪 Development

### Smart Contracts

To integrate with real smart contracts:

1. Deploy your presale and staking programs to Solana
2. Update the program IDs in your `.env.local` file
3. Implement the actual transaction logic in the components

### Testing

Run the test suite:
```bash
npm test
```

### Linting

Check code quality:
```bash
npm run lint
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the [FAQ](#) section
3. Join our [Discord community](#)

---

**Note**: This is a development template. Before deploying to production, ensure you have proper smart contracts deployed and thoroughly test all functionality.