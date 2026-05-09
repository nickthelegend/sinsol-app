"use client";

import { Wallet, Zap } from "lucide-react";
import { useWallet } from "@/hooks/usePrivyWallet";
import { EtherealShadow } from "@/components/ui/etheral-shadow";
import { cn } from "@/lib/utils";

export default function Landing() {
  const { login, ready, authenticated } = useWallet();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden">
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden bg-white/5 border border-white/10">
            <img src="/logo.png" alt="SinSol" className="w-full h-full object-contain p-2" />
          </div>
          <span className="text-lg font-premium-headline text-white tracking-[0.2em]">SINSOL</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/docs"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400/90 transition-colors font-medium tracking-widest uppercase"
          >
            <Zap className="w-3 h-3 opacity-70" /> Docs
          </a>
          <a
            href="https://explorer.solana.com/address/8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400/90 transition-colors font-medium tracking-widest uppercase"
          >
            Program
          </a>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col min-h-[min(88vh,920px)]">
        <div className="absolute inset-0 z-0">
          <EtherealShadow
            color="rgba(220, 38, 60, 0.48)"
            animation={{ scale: 78, speed: 55 }}
            noise={{ opacity: 0.12, scale: 1.1 }}
            sizing="fill"
            className="w-full h-full min-h-[520px]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 text-center">
          <p className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-zinc-500 mb-8 sm:mb-10">
            Premium on Solana
          </p>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-premium-headline text-white tracking-[0.18em] leading-none mb-4 sm:mb-5">
            SINSOL
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed mb-12 sm:mb-14 font-light tracking-wide">
            On-chain social, encrypted DMs, and creator tokens — one wallet away.
          </p>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={login}
              disabled={!ready}
              className={cn(
                "connect-wallet-cta",
                "relative inline-flex items-center justify-center gap-3",
                "px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-semibold tracking-wide text-white rounded-[18px] min-w-[240px]",
                "shadow-[0_0_40px_rgba(220,38,38,0.45)]",
                "transition-transform duration-200 active:scale-[0.98]",
                "disabled:opacity-55 disabled:cursor-not-allowed disabled:animate-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
              )}
            >
              <Wallet className="w-5 h-5 shrink-0" aria-hidden />
              {!ready ? "Loading…" : authenticated ? "Connect Solana wallet" : "Connect wallet"}
            </button>
            {ready && (
              <p className="text-[11px] sm:text-xs text-red-300/75 font-medium tracking-[0.2em] uppercase">
                Tap to connect — your keys, your session
              </p>
            )}
          </div>

          <p className="mt-14 sm:mt-20 text-[10px] sm:text-[11px] text-zinc-600 tracking-[0.28em] uppercase max-w-lg">
            Encrypted · On-chain · Creator-owned
          </p>
        </div>
      </main>

      <footer className="relative z-20 border-t border-white/[0.06] px-4 sm:px-8 md:px-12 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto text-center sm:text-left">
          <p className="text-[10px] text-zinc-600 font-medium tracking-widest">8zCF4z…UE2z</p>
          <div className="flex items-center gap-6">
            <a href="/docs" className="text-[10px] text-zinc-500 hover:text-red-400/90 transition-colors tracking-widest uppercase">
              Docs
            </a>
            <a
              href="https://x.com/SinSol_lol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-red-400/90 transition-colors"
              aria-label="X"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/chandm1213/SinSol.lol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-red-400/90 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
