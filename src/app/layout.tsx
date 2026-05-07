import type { Metadata, Viewport } from "next";
import "./globals.css";
import WalletProvider from "@/contexts/WalletProvider";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "SinSol — On-Chain Social on Solana",
  description: "SinSol is a fully on-chain social platform built on Solana with encrypted chat and zero gas fees",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SinSol",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <WalletProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
