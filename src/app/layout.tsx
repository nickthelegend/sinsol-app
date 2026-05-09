import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit, Montserrat } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/contexts/WalletProvider";
import ThemeProvider from "@/components/ThemeProvider";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SinSol — Premium On-Chain Social",
  description: "SinSol is a premium on-chain social platform built on Solana. Exclusive content, encrypted DMs, and creator tokens.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${outfit.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning className="antialiased font-premium-body">
        <WalletProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}