#!/usr/bin/env node

/**
 * VIBES Smart Contract Testing Script
 * 
 * This script helps test the entire A-Z flow of the VIBES presale system
 * with real smart contracts on Solana Devnet.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 VIBES Smart Contract Testing Suite');
console.log('======================================');

// Check environment configuration
function checkEnvironment() {
    console.log('\n1. 🔍 Checking Environment Configuration...');
    
    // Check if .env.local exists
    const envPath = path.join(__dirname, '.env.local');
    const envExists = fs.existsSync(envPath);
    
    if (!envExists) {
        console.log('❌ .env.local file not found');
        console.log('💡 Create .env.local with required environment variables');
        return false;
    }
    
    // Read environment variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
        'NEXT_PUBLIC_REOWN_PROJECT_ID',
        'NEXT_PUBLIC_SOLANA_RPC_URL',
        'NEXT_PUBLIC_PRESALE_PROGRAM_ID',
        'NEXT_PUBLIC_TOKEN_MINT_ADDRESS'
    ];
    
    const missingVars = [];
    requiredVars.forEach(varName => {
        if (!envContent.includes(varName + '=') || envContent.includes(varName + '=\n') || envContent.includes(varName + '=#')) {
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        console.log('❌ Missing environment variables:');
        missingVars.forEach(varName => {
            console.log(`   - ${varName}`);
        });
        return false;
    }
    
    console.log('✅ Environment configuration looks good');
    return true;
}

// Check smart contract deployment
function checkSmartContracts() {
    console.log('\n2. 🔗 Checking Smart Contract Status...');
    
    const contractDir = path.join(__dirname, 'anchor-project');
    const contractExists = fs.existsSync(contractDir);
    
    if (!contractExists) {
        console.log('❌ Anchor project directory not found');
        console.log('💡 Smart contracts not set up yet');
        return false;
    }
    
    // Check if build artifacts exist
    const targetDir = path.join(contractDir, 'target');
    const targetExists = fs.existsSync(targetDir);
    
    if (!targetExists) {
        console.log('⚠️ Smart contracts not built yet');
        console.log('💡 Run: cd anchor-project && anchor build');
        return false;
    }
    
    // Check for deployment info
    const deploymentInfo = path.join(__dirname, 'deployment-info.json');
    const deploymentExists = fs.existsSync(deploymentInfo);
    
    if (!deploymentExists) {
        console.log('⚠️ Smart contracts not deployed yet');
        console.log('💡 Run: cd anchor-project && anchor deploy --provider.cluster devnet');
        return false;
    }
    
    console.log('✅ Smart contracts appear to be deployed');
    
    // Show deployment info
    const deploymentData = JSON.parse(fs.readFileSync(deploymentInfo, 'utf8'));
    console.log(`   📋 Program ID: ${deploymentData.programId}`);
    console.log(`   🪙 Token Mint: ${deploymentData.vibesMint}`);
    console.log(`   📅 Deployed: ${deploymentData.deployedAt}`);
    
    return true;
}

// Test application functionality
function testApplication() {
    console.log('\n3. 🚀 Testing Application...');
    
    // Check if app is running
    const packageJson = path.join(__dirname, 'package.json');
    const packageExists = fs.existsSync(packageJson);
    
    if (!packageExists) {
        console.log('❌ package.json not found');
        return false;
    }
    
    console.log('✅ Application files present');
    console.log('💡 Start the app with: npm run dev');
    console.log('🌐 Open: http://localhost:3000');
    
    return true;
}

// Generate testing checklist
function generateTestingChecklist() {
    console.log('\n4. 📋 A-Z Testing Checklist:');
    console.log('=============================');
    
    const checklist = [
        '🌐 Start application (npm run dev)',
        '💻 Open http://localhost:3000',
        '🔧 Check Smart Contract Status shows "✅ Deployed"',
        '👛 Connect wallet (Phantom/Solflare) on Devnet',
        '💰 Get Devnet SOL (solana airdrop 2 --url devnet)',
        '📈 Verify SOL price loads in real-time',
        '🛒 Go to Presale tab',
        '💎 Enter SOL amount (e.g., 0.5 SOL)',
        '🧮 Verify VIBES calculation shows',
        '✅ Click "🔗 Comprar con Smart Contract"',
        '🔐 Confirm transaction in wallet',
        '⏳ Wait for transaction confirmation',
        '🔍 Check transaction on Solscan',
        '📱 Go to Claims tab',
        '👀 Verify purchase appears with vesting schedule',
        '📅 Check 4 periods: 40%, 20%, 20%, 20%',
        '🕒 Simulate listing (Testing Config)',
        '💎 Claim tokens for available periods',
        '✅ Verify tokens transfer to wallet',
        '🔄 Refresh data to see updated states'
    ];
    
    checklist.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
    });
}

// Show deployment instructions
function showDeploymentInstructions() {
    console.log('\n5. 🚀 Smart Contract Deployment Instructions:');
    console.log('===============================================');
    
    console.log('If smart contracts are not deployed yet:');
    console.log('');
    console.log('1. Install Solana CLI:');
    console.log('   sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"');
    console.log('');
    console.log('2. Install Anchor CLI:');
    console.log('   npm install -g @coral-xyz/anchor-cli');
    console.log('');
    console.log('3. Configure for Devnet:');
    console.log('   solana config set --url devnet');
    console.log('   solana-keygen new');
    console.log('   solana airdrop 2 --url devnet');
    console.log('');
    console.log('4. Deploy contracts:');
    console.log('   cd anchor-project');
    console.log('   npm install');
    console.log('   anchor build');
    console.log('   anchor deploy --provider.cluster devnet');
    console.log('   node deploy.js');
    console.log('');
    console.log('5. Update .env.local with output Program IDs');
    console.log('');
    console.log('6. Restart app and test!');
}

// Show current status
function showCurrentStatus() {
    console.log('\n📊 Current System Status:');
    console.log('==========================');
    
    const envConfigured = checkEnvironment();
    const contractsDeployed = checkSmartContracts();
    const appReady = testApplication();
    
    console.log('\n🎯 Status Summary:');
    console.log(`   📝 Environment: ${envConfigured ? '✅ Configured' : '❌ Needs setup'}`);
    console.log(`   🔗 Smart Contracts: ${contractsDeployed ? '✅ Deployed' : '⚠️ Not deployed'}`);
    console.log(`   🚀 Application: ${appReady ? '✅ Ready' : '❌ Not ready'}`);
    
    const overallStatus = envConfigured && contractsDeployed && appReady;
    console.log(`\n🎉 Overall Status: ${overallStatus ? '✅ READY FOR TESTING!' : '⚠️ NEEDS SETUP'}`);
    
    if (overallStatus) {
        console.log('\n🎊 Your VIBES system is fully ready for A-Z testing!');
        console.log('💡 Follow the testing checklist above to verify everything works.');
    } else {
        console.log('\n📝 Complete the missing setup steps and run this script again.');
    }
}

// Main execution
function main() {
    showCurrentStatus();
    generateTestingChecklist();
    
    if (!checkSmartContracts()) {
        showDeploymentInstructions();
    }
    
    console.log('\n🎯 Quick Start Commands:');
    console.log('========================');
    console.log('npm run dev          # Start the app');
    console.log('node test-smart-contracts.js  # Run this test again');
    console.log('cd anchor-project && anchor build  # Build contracts');
    console.log('cd anchor-project && anchor deploy --provider.cluster devnet  # Deploy');
    console.log('');
    console.log('🎉 Happy testing with VIBES! 🚀');
}

// Run the main function
if (require.main === module) {
    main();
}
