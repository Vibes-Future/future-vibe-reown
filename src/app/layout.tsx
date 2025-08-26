import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "@/providers/ContextProvider";
import { lexend, poppins, roboto } from "@/config/font";

export const metadata: Metadata = {
  title: 'Future Vibe ($VIBES) - Unique token that supports charitable causes and fulfills social responsibility',
  description: 'FutureVibes is the first project of its kind. As a pioneer, it combines conventional charities with digitalization and new digital technologies to enable maximum support for people with restricted mobility. It is the first and unique meme coin with a social usability.',
  keywords: ["VIBES", "Solana", "Presale", "Staking", "DeFi", "Crypto", "Web3", "Token", "Blockchain", "Charity", "Social Responsibility"],
  authors: [{ name: "Future Vibe Team" }],
  openGraph: {
    title: 'Future Vibe ($VIBES) - Unique token that supports charitable causes',
    description: 'FutureVibes combines conventional charities with digitalization and new digital technologies.',
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
        className={`${lexend?.variable} ${roboto?.variable} ${poppins?.variable} antialiased bg-primary-4 text-foundation-blue-20`}
      >
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
