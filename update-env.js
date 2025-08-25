// Quick script to update .env.local with a temporary Reown Project ID
const fs = require('fs');

const envPath = '.env.local';
let envContent = fs.readFileSync(envPath, 'utf8');

// Add a placeholder Reown Project ID if missing
if (envContent.includes('NEXT_PUBLIC_REOWN_PROJECT_ID=\n')) {
    envContent = envContent.replace(
        'NEXT_PUBLIC_REOWN_PROJECT_ID=\n',
        'NEXT_PUBLIC_REOWN_PROJECT_ID=placeholder_for_testing\n'
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env.local with placeholder Reown Project ID');
    console.log('💡 For production, get real Project ID from https://cloud.reown.com/');
} else {
    console.log('ℹ️ Reown Project ID already configured');
}

console.log('\n🎯 Current Smart Contract Configuration:');
console.log('=======================================');

const lines = envContent.split('\n');
lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_PRESALE_') || line.startsWith('NEXT_PUBLIC_TOKEN_')) {
        console.log(line);
    }
});

console.log('\n🚀 Ready to restart app with blockchain mode!');
