# 🚀 VIBES Token Presale

**A decentralized application for token presale and staking on Solana blockchain**

## 🎯 Project Overview

VIBES Token Presale is a modern, scalable DeFi application built with Next.js 15 and Solana blockchain technology. The project features a clean, professional architecture designed for long-term maintainability and scalability.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router
- **Blockchain**: Solana with Reown AppKit integration
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Custom Hooks
- **Type Safety**: TypeScript throughout

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # React components (layout, features, ui)
├── providers/             # React context providers
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── config/                # Configuration files
├── types/                 # TypeScript type definitions
└── lib/                   # External library configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🔧 Configuration

Environment variables are configured in `.env.local`:
- `NEXT_PUBLIC_PROJECT_ID`: Reown AppKit project ID
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint
- `NEXT_PUBLIC_SOLANA_NETWORK`: Network (devnet/testnet/mainnet)

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Project Setup](docs/README.md)

## 🌟 Features

- **Token Presale**: SOL and USDC payment options
- **Staking System**: Flexible staking with rewards
- **Vesting Dashboard**: Token vesting management
- **Wallet Integration**: Multi-wallet support via Reown AppKit
- **Responsive Design**: Mobile-first approach

## 🤝 Contributing

This project follows professional development standards:
- Clean, documented code
- Consistent architecture patterns
- Comprehensive error handling
- Performance optimization

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ for the Solana ecosystem**
