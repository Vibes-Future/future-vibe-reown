#!/bin/bash

# Environment Switcher Script for Future Vibe
# Usage: ./scripts/switch-env.sh [devnet|testnet|mainnet]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Future Vibe Environment Switcher${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [devnet|testnet|mainnet]"
    echo ""
    echo "Available environments:"
    echo "  devnet   - Development environment (default)"
    echo "  testnet  - Testnet environment"
    echo "  mainnet  - Production environment"
    echo ""
    echo "Examples:"
    echo "  $0 devnet"
    echo "  $0 testnet"
    echo "  $0 mainnet"
}

# Function to backup current .env.local
backup_env() {
    if [ -f ".env.local" ]; then
        cp .env.local ".env.local.backup.$(date +%Y%m%d_%H%M%S)"
        print_status "Backed up current .env.local"
    fi
}

# Function to switch to devnet
switch_to_devnet() {
    print_status "Switching to Devnet environment..."
    
    if [ -f "env.development" ]; then
        cp env.development .env.local
        print_status "✅ Switched to Devnet"
        print_warning "Remember to update NEXT_PUBLIC_PROJECT_ID in .env.local"
    else
        print_error "env.development file not found"
        exit 1
    fi
}

# Function to switch to testnet
switch_to_testnet() {
    print_status "Switching to Testnet environment..."
    
    if [ -f "env.testnet" ]; then
        cp env.testnet .env.local
        print_status "✅ Switched to Testnet"
        print_warning "Remember to update smart contract addresses in .env.local"
    else
        print_error "env.testnet file not found"
        exit 1
    fi
}

# Function to switch to mainnet
switch_to_mainnet() {
    print_status "Switching to Mainnet environment..."
    
    if [ -f "env.mainnet" ]; then
        cp env.mainnet .env.local
        print_status "✅ Switched to Mainnet"
        print_warning "⚠️  PRODUCTION ENVIRONMENT - Ensure all addresses are correct!"
    else
        print_error "env.mainnet file not found"
        exit 1
    fi
}

# Function to show current environment
show_current() {
    if [ -f ".env.local" ]; then
        print_status "Current environment:"
        echo ""
        grep "NEXT_PUBLIC_SOLANA_NETWORK" .env.local || echo "Network: Not set"
        echo ""
        print_status "To switch environments, run: $0 [devnet|testnet|mainnet]"
    else
        print_warning "No .env.local file found"
        print_status "Run: $0 devnet to create one"
    fi
}

# Main script logic
main() {
    print_header
    
    # Check if environment file exists
    if [ ! -f ".env.local" ]; then
        print_warning "No .env.local file found. Creating from devnet template..."
        switch_to_devnet
        exit 0
    fi
    
    # Parse command line arguments
    case "${1:-}" in
        "devnet")
            backup_env
            switch_to_devnet
            ;;
        "testnet")
            backup_env
            switch_to_testnet
            ;;
        "mainnet")
            backup_env
            switch_to_mainnet
            ;;
        "current"|"status")
            show_current
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "")
            show_current
            ;;
        *)
            print_error "Invalid environment: $1"
            show_usage
            exit 1
            ;;
    esac
    
    echo ""
    print_status "Environment switch complete!"
    print_status "Restart your development server to apply changes:"
    echo "  npm run dev"
}

# Run main function
main "$@"
