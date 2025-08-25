const anchor = require('@coral-xyz/anchor');
const { SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } = require('@solana/spl-token');

// Deploy script for VIBES Presale contract
async function deployContract() {
    console.log('🚀 Starting VIBES Presale Contract Deploy to Devnet...');
    
    // Configure the client to use devnet
    const connection = new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Load wallet (ensure you have ~/.config/solana/id.json configured)
    const wallet = anchor.Wallet.local();
    console.log('📱 Deploying with wallet:', wallet.publicKey.toString());
    
    // Check wallet balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log('💰 Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    if (balance < 0.1 * LAMPORTS_PER_SOL) {
        console.log('⚠️ Low balance. Run: solana airdrop 2 --url devnet');
        return;
    }
    
    // Setup provider
    const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
    });
    anchor.setProvider(provider);
    
    try {
        // Load the program
        const idl = require('./target/idl/vibes_presale.json');
        const programId = new anchor.web3.PublicKey(idl.metadata.address);
        const program = new anchor.Program(idl, programId, provider);
        
        console.log('📋 Program ID:', programId.toString());
        
        // Create VIBES token mint (for testing)
        console.log('🪙 Creating VIBES token mint...');
        const vibesMint = anchor.web3.Keypair.generate();
        
        const createMintTx = await connection.requestAirdrop(
            vibesMint.publicKey,
            0.01 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(createMintTx);
        
        // Initialize presale
        console.log('⚙️ Initializing presale contract...');
        
        const [presaleConfig] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from('presale_config')],
            programId
        );
        
        const [presaleVault] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from('presale_vault')],
            programId
        );
        
        // Set listing timestamp to 1 hour from now for testing
        const listingTimestamp = new anchor.BN(Math.floor(Date.now() / 1000) + 3600);
        
        // Rates: 1000 VIBES per SOL, 1 VIBES per USDC (simplified for testing)
        const solToVibesRate = new anchor.BN(1000);
        const usdcToVibesRate = new anchor.BN(1);
        
        const initTx = await program.methods
            .initializePresale(listingTimestamp, solToVibesRate, usdcToVibesRate)
            .accounts({
                presaleConfig,
                authority: wallet.publicKey,
                vibesMint: vibesMint.publicKey,
                presaleVault,
                systemProgram: SystemProgram.programId,
            })
            .signers([vibesMint])
            .rpc();
        
        console.log('✅ Presale initialized!');
        console.log('📄 Transaction:', initTx);
        
        // Output configuration for .env file
        console.log('\n🔧 Add these to your .env file:');
        console.log('=====================================');
        console.log(`NEXT_PUBLIC_PRESALE_PROGRAM_ID=${programId.toString()}`);
        console.log(`NEXT_PUBLIC_TOKEN_MINT_ADDRESS=${vibesMint.publicKey.toString()}`);
        console.log(`NEXT_PUBLIC_PRESALE_CONFIG=${presaleConfig.toString()}`);
        console.log(`NEXT_PUBLIC_PRESALE_VAULT=${presaleVault.toString()}`);
        console.log('=====================================');
        
        // Save deployment info
        const deploymentInfo = {
            programId: programId.toString(),
            vibesMint: vibesMint.publicKey.toString(),
            presaleConfig: presaleConfig.toString(),
            presaleVault: presaleVault.toString(),
            listingTimestamp: listingTimestamp.toString(),
            deployedAt: new Date().toISOString(),
            network: 'devnet',
            deploymentTx: initTx,
        };
        
        require('fs').writeFileSync(
            '../deployment-info.json',
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('📁 Deployment info saved to deployment-info.json');
        console.log('🎉 Deploy completed successfully!');
        
    } catch (error) {
        console.error('❌ Deploy failed:', error);
        
        if (error.message.includes('insufficient funds')) {
            console.log('💡 Try: solana airdrop 2 --url devnet');
        }
        
        throw error;
    }
}

// Run deploy
if (require.main === module) {
    deployContract()
        .then(() => {
            console.log('🎯 Deploy script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Deploy script failed:', error);
            process.exit(1);
        });
}

module.exports = { deployContract };
