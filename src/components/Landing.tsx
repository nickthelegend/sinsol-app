"use client";

import { useState, useEffect } from "react";
import { Shield, MessageCircle, Wallet, Lock, Users, ArrowRight, Zap, Sparkles, Activity, TrendingUp, Key, Crown } from "lucide-react";
import { useWallet } from "@/hooks/usePrivyWallet";
import { useAppStore } from "@/lib/store";

const features = [
  {
    icon: Shield,
    title: "On-Chain Posts",
    description: "Your content lives forever on Solana — permanent, censorship-resistant, and fully owned by you.",
    color: "#DC2626",
    bgColor: "#1F0F0F",
    preview: {
      type: "post",
      author: "You",
      content: "Just launched exclusive content on SinSol. Permanent. Owned by me.",
      badge: "On-Chain",
    },
  },
  {
    icon: Crown,
    title: "Creator Tokens",
    description: "Launch your own token. Monetize your exclusive content with zero fees for creators.",
    color: "#F59E0B",
    bgColor: "#1F1508",
    preview: {
      type: "token",
      name: "$SIN",
      price: "$0.042",
      change: "+124.8%",
    },
  },
  {
    icon: MessageCircle,
    title: "Encrypted DMs",
    description: "End-to-end encrypted with NaCl Box. Your conversations stay private — forever.",
    color: "#10B981",
    bgColor: "#081A12",
    preview: {
      type: "chat",
      messages: [
        { sender: "VIP Member", text: "Here's the exclusive content you requested..." },
        { sender: "You", text: "Thanks! Sending 5 USDC for the early access" },
        { sender: "system", text: "💵 5 USDC sent privately" },
      ],
    },
  },
  {
    icon: Wallet,
    title: "Premium Payments",
    description: "Accept payments from your fans. Fast, private, and settled on Solana.",
    color: "#EF4444",
    bgColor: "#1F0808",
    preview: {
      type: "payment",
      steps: ["Select tier", "Fan sends payment", "Unlock exclusive content"],
    },
  },
];

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { login, ready, authenticated } = useWallet();
  const { theme, toggleTheme } = useAppStore();
  const [stats, setStats] = useState<{
    profiles: number; posts: number; follows: number;
    reactions: number; comments: number; transactions: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => { if (!data.error) setStats(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden">
      {/* Animated Red Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="red-blob red-blob-crimson w-[60vw] h-[60vw] -top-[15%] -left-[15%] opacity-40" />
        <div className="red-blob red-blob-maroon w-[50vw] h-[50vw] top-[5%] -right-[10%] opacity-30" style={{ animationDelay: '2s' }} />
        <div className="red-blob red-blob-scarlet w-[40vw] h-[40vw] -bottom-[5%] left-[25%] opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[24px] premium-orb flex items-center justify-center">
            <span className="text-2xl sm:text-3xl">🔥</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-premium-headline text-white tracking-wider">SINSOL</h1>
            <p className="text-[9px] sm:text-[10px] text-gray-500 -mt-0.5 tracking-widest uppercase">Premium on Solana</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/docs" className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors font-medium tracking-wide">
            <Zap className="w-3 h-3" /> Docs
          </a>
          <a href="https://explorer.solana.com/address/8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors font-medium tracking-wide">
            <Zap className="w-3 h-3" /> Program
          </a>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
          >
            <span className="text-lg">🌙</span>
          </button>
          <button
            onClick={login}
            disabled={!ready}
            className="premium-button flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[16px] disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            {authenticated ? "Enter" : "Connect"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-12 md:py-20">
        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-5 sm:mb-6 premium-card border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-medium text-gray-400 tracking-widest uppercase">Built on Solana · Zero Gas</span>
        </div>

        {/* Title */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-premium-headline text-center text-white tracking-wider leading-none mb-4 sm:mb-5">
          OWN YOUR{""}
          <span className="block premium-gradient-text">CONTENT</span>
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 text-center max-w-xl mt-4 leading-relaxed px-2 font-light">
          Premium on-chain social. Exclusive content. Encrypted DMs. Creator tokens. No middlemen. No limits.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full sm:w-auto">
          <div className="w-full sm:w-auto flex justify-center">
            <button
              onClick={login}
              disabled={!ready}
              className="premium-button flex items-center gap-3 px-10 py-5 text-base font-bold rounded-[20px] disabled:opacity-50 hover:-translate-y-1 active:scale-[0.96]"
            >
              <Wallet className="w-5 h-5" /> {authenticated ? "Enter SinSol" : "Get Started"}
            </button>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("features");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="premium-button-secondary flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-300 rounded-[16px]"
          >
            See how it works <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 mt-10 sm:mt-14 w-full sm:w-auto justify-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 justify-center font-medium tracking-wide">
            <div className="w-7 h-7 rounded-xl icon-orb-scarlet flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
            <span>E2E Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 justify-center font-medium tracking-wide">
            <div className="w-7 h-7 rounded-xl icon-orb-red flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span>On-Chain Posts</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 justify-center font-medium tracking-wide">
            <div className="w-7 h-7 rounded-xl icon-orb-dark-red flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Zero Gas Fees</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 justify-center font-medium tracking-wide">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Key className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Creator Tokens</span>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      {stats && (
        <div className="relative z-10 px-4 sm:px-6 md:px-12 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-red-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Live On-Chain Stats</p>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
              {[
                { label: "CREATORS", value: stats.profiles, icon: "👑", color: "#DC2626" },
                { label: "TRANSACTIONS", value: stats.transactions, icon: "⚡", color: "#10B981" },
              ].map((stat, i) => (
                <div key={i} className="premium-orb rounded-[24px] p-5 sm:p-6 text-center hover:scale-105 transition-transform">
                  <span className="text-3xl">{stat.icon}</span>
                  <p className="text-3xl sm:text-4xl font-premium-headline mt-2" style={{ color: stat.color }}>
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div id="features" className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-premium-headline text-white mb-3 tracking-wider">
              PREMIUM FEATURES
            </h3>
            <p className="text-sm sm:text-base text-gray-500">Everything you need. Nothing you don't.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start">
            {/* Feature tabs */}
            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                const isActive = i === activeFeature;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`touch-active w-full text-left p-4 sm:p-5 rounded-[24px] border transition-all duration-300 ${
                      isActive
                        ? "bg-white/5 border-red-500/30 shadow-lg shadow-red-900/10"
                        : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: feature.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-white font-premium-headline tracking-wide">{feature.title}</p>
                        <p className={`text-sm mt-1 transition-all duration-300 ${
                          isActive ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-4 ml-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feature preview */}
            <div className="premium-card rounded-[32px] p-5 sm:p-8 min-h-[280px] sm:min-h-[380px] flex items-center justify-center">
              {features[activeFeature].preview.type === "post" && (
                <div className="w-full animate-fade-in">
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-900/30 to-red-800/20 flex items-center justify-center text-2xl">😈</div>
                      <div>
                        <p className="text-base font-bold text-white">You</p>
                        <span className="text-[10px] font-bold text-red-400 bg-red-900/20 px-2.5 py-0.5 rounded-full">
                          ON-CHAIN
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{features[activeFeature].preview.content}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm text-gray-500">
                      <span>❤️ 42</span>
                      <span>💬 18</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 justify-center text-xs text-red-400">
                    <Shield className="w-3 h-3" />
                    <span className="font-medium">Permanently on Solana</span>
                  </div>
                </div>
              )}

              {features[activeFeature].preview.type === "token" && (
                <div className="w-full animate-fade-in">
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white font-premium-headline">CREATOR TOKEN</p>
                        <p className="text-xs text-gray-500">Launch your own $SIN token</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Token Name", value: "$SIN" },
                        { label: "Price", value: "$0.042" },
                        { label: "24h Change", value: "+124.8%", positive: true },
                      ].map((item, j) => (
                        <div key={j} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className={`text-sm font-bold ${item.positive ? 'text-emerald-500' : 'text-white'}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 text-center">
                      <p className="text-xs text-gray-600">Launch at zero cost · Earn from every transaction</p>
                    </div>
                  </div>
                </div>
              )}

              {features[activeFeature].preview.type === "chat" && (
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-green-900/20 flex items-center justify-center text-lg">👑</div>
                      <div>
                        <p className="text-sm font-bold text-white">VIP Member</p>
                        <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold"><Lock className="w-2 h-2" /> E2E Encrypted</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {(features[activeFeature].preview as any).messages.map((msg: any, j: number) => (
                        <div key={j} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                          {msg.sender === "system" ? (
                            <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-2xl text-xs font-bold">
                              {msg.text}
                            </div>
                          ) : (
                            <div className={`px-4 py-2 rounded-2xl text-xs max-w-[220px] ${
                              msg.sender === "You"
                                ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                                : "bg-white/10 text-gray-300"
                            }`}>
                              {msg.text}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {features[activeFeature].preview.type === "payment" && (
                <div className="w-full animate-fade-in">
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-2xl icon-orb-red flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-base font-bold text-white font-premium-headline">PREMIUM PAYMENT</p>
                    </div>
                    <div className="space-y-3">
                      {(features[activeFeature].preview as any).steps.map((step: string, j: number) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white ${
                            j < 2 ? "icon-orb-red" : "bg-emerald-600"
                          }`}>
                            {j + 1}
                          </div>
                          <div className="flex-1 bg-white/5 rounded-xl px-4 py-2.5">
                            <p className="text-sm font-medium text-gray-300">{step}</p>
                          </div>
                          {j < 2 && <Lock className="w-4 h-4 text-gray-600" />}
                          {j === 2 && <Sparkles className="w-4 h-4 text-emerald-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-premium-headline text-white mb-8 sm:mb-10 tracking-wider">
            HOW IT WORKS
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="premium-card rounded-[24px] p-6 sm:p-7 text-center hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 rounded-2xl icon-orb-red flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-premium-headline text-white">1</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-premium-headline tracking-wide">CONNECT WALLET</h4>
              <p className="text-sm text-gray-500">Sign in with your wallet. No email, no verification. Just you.</p>
            </div>
            <div className="premium-card rounded-[24px] p-6 sm:p-7 text-center hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-premium-headline text-white">2</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-premium-headline tracking-wide">CREATE CONTENT</h4>
              <p className="text-sm text-gray-500">Post on-chain. Launch your token. Build your empire.</p>
            </div>
            <div className="premium-card rounded-[24px] p-6 sm:p-7 text-center hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 rounded-2xl icon-orb-scarlet flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-premium-headline text-white">3</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-premium-headline tracking-wide">MONETIZE</h4>
              <p className="text-sm text-gray-500">Accept payments. Launch tokens. Earn from your fans.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-16 text-center">
        <div className="premium-card max-w-lg mx-auto rounded-[32px] p-8 sm:p-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[32px] premium-orb flex items-center justify-center mx-auto mb-5 animate-breathe">
            <span className="text-4xl sm:text-5xl">🔥</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-premium-headline text-white mb-3 tracking-wider">
            READY TO START?
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
            Connect your wallet and start building your premium on-chain presence.
          </p>
          <button
            onClick={login}
            disabled={!ready}
            className="premium-button flex items-center gap-2 px-8 py-4 text-base font-bold rounded-[24px] disabled:opacity-50 mx-auto hover:-translate-y-1 active:scale-[0.96]"
          >
            <Wallet className="w-5 h-5" /> {authenticated ? "Enter SinSol" : "Connect Wallet"}
          </button>
          <p className="text-xs text-gray-600 mt-5 font-medium tracking-wide">
            Program: 8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-12 py-5 sm:py-6">
        <div className="premium-card rounded-[24px] px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-bold text-white font-premium-headline tracking-wider">SINSOL</span>
            </div>
            <div className="flex items-center gap-5">
              <a href="/docs" className="text-gray-500 hover:text-red-400 transition-colors text-sm font-medium">Docs</a>
              <a href="https://x.com/SinSol_lol" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-400 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com/chandm1213/SinSol.lol" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-400 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <p className="text-[10px] sm:text-xs text-gray-600 text-center font-medium tracking-wide">Premium on-chain social built on Solana</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}