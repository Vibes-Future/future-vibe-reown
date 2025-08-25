import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfills para el navegador
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };
    }
    
    return config;
  },
  experimental: {
    // Optimizar para bibliotecas complejas como Solana
    optimizePackageImports: ['@solana/web3.js', '@coral-xyz/anchor']
  }
};

export default nextConfig;
