import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/providers/ContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIBES Token Presale - Solana DeFi",
  description: "Participa en el presale de VIBES con precios dinámicos mensuales. Compra con SOL y gana recompensas a través del staking en Solana blockchain.",
  keywords: ["VIBES", "Solana", "Presale", "Staking", "DeFi", "Crypto", "Web3", "Token", "Blockchain"],
  authors: [{ name: "VIBES Team" }],
  openGraph: {
    title: "VIBES Token Presale - Solana DeFi",
    description: "Participa en el presale de VIBES con precios dinámicos mensuales. Compra con SOL y gana recompensas a través del staking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
