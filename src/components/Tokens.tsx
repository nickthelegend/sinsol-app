"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Coins,
  Rocket,
  TrendingUp,
  ExternalLink,
  Loader2,
  RefreshCw,
  DollarSign,
  Wallet,
  ChevronRight,
  Star,
  BarChart3,
  Shield,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useWallet, pollConfirmation, getSharedConnection } from "@/hooks/usePrivyWallet";
import { toast } from "@/components/Toast";
import TokenLaunch from "@/components/TokenLaunch";
import TokenTrade from "@/components/TokenTrade";
import { formatSOL, BAGS_REF_CODE } from "@/lib/bags";
import { VersionedTransaction, Transaction } from "@solana/web3.js";

interface TokenItem {
  name: string;
  symbol: string;
  description: string;
  image: string;
  tokenMint: string;
  status: string;
  twitter?: string;
  website?: string;
  launchWallet?: string;
}

interface ClaimablePosition {
  baseMint: string;
  totalClaimableLamportsUserShare?: string;
  virtualPoolClaimableAmount?: string;
  dammPoolClaimableAmount?: string;
}

export default function Tokens() {
  const { publicKey, signTransaction } = useWallet();
  const { isConnected } = useAppStore();
  const [tab, setTab] = useState<"discover" | "my-tokens" | "earnings">("discover");
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [myTokens, setMyTokens] = useState<TokenItem[]>([]);
  const [claimable, setClaimable] = useState<ClaimablePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyTokens, setLoadingMyTokens] = useState(false);
  const [loadingFees, setLoadingFees] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bags?action=feed");
      const data = await res.json();
      if (data.success && Array.isArray(data.response)) {
        setTokens(data.response);
      }
    } catch (err) {
      console.error("Failed to fetch token feed:", err);
    }
    setLoading(false);
  }, []);

  const fetchClaimable = useCallback(async () => {
    if (!publicKey) return;
    setLoadingFees(true);
    try {
      const res = await fetch(`/api/bags?action=fees&wallet=${publicKey.toBase58()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.response)) {
        setClaimable(data.response);
      }
    } catch (err) {
      console.error("Failed to fetch claimable:", err);
    }
    setLoadingFees(false);
  }, [publicKey]);

  // Fetch user's tokens via dedicated endpoint (fee-admin mints + feed launchWallet match)
  const fetchMyTokens = useCallback(async () => {
    if (!publicKey) return;
    setLoadingMyTokens(true);
    try {
      const walletStr = publicKey.toBase58();
      const res = await fetch(`/api/bags?action=user-tokens&wallet=${walletStr}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.response)) {
        setMyTokens(data.response);
      }
    } catch (err) {
      console.error("Failed to fetch my tokens:", err);
    }
    setLoadingMyTokens(false);
  }, [publicKey]);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);

  useEffect(() => {
    if (tab === "earnings" && publicKey) fetchClaimable();
  }, [tab, publicKey, fetchClaimable]);

  useEffect(() => {
    if (tab === "my-tokens" && publicKey) fetchMyTokens();
  }, [tab, publicKey, fetchMyTokens]);

  const totalClaimableSOL = claimable.reduce((sum, p) => {
    const amount = Number(p.totalClaimableLamportsUserShare || p.virtualPoolClaimableAmount || 0)
      + Number(p.dammPoolClaimableAmount || 0);
    return sum + amount;
  }, 0);

  const handleClaim = async (tokenMint: string) => {
    if (!publicKey || !signTransaction) return;
    try {
      toast("info", "Creating claim transaction...");
      const res = await fetch("/api/bags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim", walletAddress: publicKey.toBase58(), tokenMint }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const txList: { unsignedTxBase64: string }[] = data.response;
      if (!txList || txList.length === 0) throw new Error("No claim transactions returned");

      const connection = getSharedConnection();

      toast("info", `Signing ${txList.length} claim transaction(s)...`);

      for (const txData of txList) {
        const buf = Buffer.from(txData.unsignedTxBase64, "base64");
        // Try VersionedTransaction first, fallback to legacy Transaction
        let tx: VersionedTransaction | Transaction;
        try {
          tx = VersionedTransaction.deserialize(buf);
        } catch {
          tx = Transaction.from(buf);
        }
        const signed = await signTransaction(tx);
        const sig = await connection.sendRawTransaction(signed.serialize());
        await pollConfirmation(connection, sig);
      }

      toast("success", "Fees claimed! Check your wallet. 🎉");
      fetchClaimable();
    } catch (err: any) {
      console.error("Claim error:", err);
      toast("error", err.message || "Failed to claim fees");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl icon-orb-red flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Creator Tokens</h1>
            <p className="text-xs text-zinc-500">Launch, trade & earn — powered by Bags.fm</p>
          </div>
        </div>
        <button
          onClick={() => setShowLaunchModal(true)}
          className="premium-button flex items-center gap-1.5 py-2 px-4 text-white rounded-xl font-medium text-sm transition"
        >
          <Rocket className="w-4 h-4" />
          Launch Token
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-800 rounded-xl p-1">
        {([
          { id: "discover" as const, label: "Discover", icon: TrendingUp },
          { id: "my-tokens" as const, label: "My Tokens", icon: Wallet },
          { id: "earnings" as const, label: "Earnings", icon: DollarSign },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition ${
              tab === id ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Discover Tab */}
      {tab === "discover" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-400">Trending Tokens</h2>
            <button onClick={fetchTokens} className="p-1.5 hover:bg-white/5 rounded-lg transition">
              <RefreshCw className={`w-4 h-4 text-zinc-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-red-400/90 animate-spin" />
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <Coins className="w-7 h-7 text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-zinc-400">No tokens found</p>
              <p className="text-xs text-zinc-500 mt-1">Be the first to launch a creator token!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tokens.slice(0, 20).map((token, i) => (
                <button
                  key={token.tokenMint}
                  onClick={() => setSelectedToken(token)}
                  className="w-full flex items-center gap-3 p-3 bg-[#141414] rounded-2xl border border-white/10 hover:border-red-500/25 hover:shadow-sm transition text-left"
                >
                  <span className="text-xs font-medium text-zinc-500 w-5">{i + 1}</span>
                  {token.image ? (
                    <img src={token.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-800 to-rose-950 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{token.symbol?.[0] || "?"}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-white truncate">{token.name}</span>
                      <span className="text-xs text-zinc-500">${token.symbol}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{token.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      token.status === "MIGRATED" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20"
                        : token.status === "PRE_GRAD" ? "bg-amber-900/30 text-amber-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {token.status === "MIGRATED" ? "Live" : token.status === "PRE_GRAD" ? "Pre-Grad" : token.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Tokens Tab */}
      {tab === "my-tokens" && (
        <div>
          {!isConnected ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-950/35 border border-red-500/15 flex items-center justify-center mx-auto mb-3">
                  <Wallet className="w-7 h-7 text-red-400/90" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Connect your wallet</p>
                <p className="text-xs text-zinc-500 mt-1">to see your tokens</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Launch CTA */}
              <div className="bg-[#141414] rounded-2xl border border-white/10 p-4 sm:p-5 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-red-950/40 border border-red-500/15 flex items-center justify-center">
                    <Star className="w-4 h-4 text-red-400/90" />
                  </div>
                  <span className="text-sm font-semibold text-white">Launch Your Token</span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Create your own token and earn fees every time someone trades it.
                </p>
                <button
                  onClick={() => setShowLaunchModal(true)}
                  className="premium-button flex items-center gap-1.5 py-2 px-4 text-white rounded-xl font-medium text-xs transition"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Launch Token
                </button>
              </div>

              {/* User's Tokens List */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-400">Your Tokens</h2>
                <button onClick={fetchMyTokens} className="p-1.5 hover:bg-white/5 rounded-lg transition">
                  <RefreshCw className={`w-4 h-4 text-zinc-500 ${loadingMyTokens ? "animate-spin" : ""}`} />
                </button>
              </div>

              {loadingMyTokens ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-red-400/90 animate-spin" />
                </div>
              ) : myTokens.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                    <Coins className="w-6 h-6 text-zinc-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-400">No tokens yet</p>
                  <p className="text-xs text-zinc-500 mt-1">Launch a token or trade to see it here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myTokens.map((token) => (
                    <button
                      key={token.tokenMint}
                      onClick={() => setSelectedToken(token)}
                      className="w-full flex items-center gap-3 p-3 bg-[#141414] rounded-2xl border border-white/10 hover:border-red-500/25 hover:shadow-sm transition text-left"
                    >
                      {token.image ? (
                        <img src={token.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-800 to-rose-950 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{token.symbol?.[0] || "?"}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white truncate">{token.name}</span>
                          <span className="text-xs text-zinc-500">${token.symbol}</span>
                        </div>
                        {token.description && (
                          <p className="text-xs text-zinc-500 truncate">{token.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          token.status === "MIGRATED" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20"
                            : token.status === "PRE_GRAD" ? "bg-amber-900/30 text-amber-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {token.status === "MIGRATED" ? "Live" : token.status === "PRE_GRAD" ? "Pre-Grad" : token.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-zinc-500 text-center py-4">
                <a href={`https://bags.fm/?ref=${BAGS_REF_CODE}`} target="_blank" rel="noopener noreferrer" className="text-red-400/90 hover:text-red-300 hover:underline">
                  Browse all tokens on Bags.fm →
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Earnings Tab */}
      {tab === "earnings" && (
        <div>
          {!isConnected ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-950/35 border border-red-500/15 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-7 h-7 text-red-400/90" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Connect your wallet</p>
                <p className="text-xs text-zinc-500 mt-1">to see your earnings</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-[#141414] rounded-2xl border border-white/10 p-4 sm:p-5 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-red-950/40 border border-red-500/15 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-red-400/90" />
                      </div>
                      <span className="text-xs font-medium text-zinc-500">Total Claimable</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatSOL(totalClaimableSOL)} <span className="text-sm font-medium text-zinc-500">SOL</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                      <Shield className="w-2.5 h-2.5 text-red-400/70" /> Fee earnings from token trading
                    </p>
                  </div>
                  <button onClick={fetchClaimable} className="p-2 hover:bg-white/5 rounded-lg transition">
                    <RefreshCw className={`w-4 h-4 text-zinc-500 ${loadingFees ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {loadingFees ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-red-400/90 animate-spin" />
                </div>
              ) : claimable.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-zinc-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-400">No claimable fees yet</p>
                  <p className="text-xs text-zinc-500 mt-1">Launch a token and get trading volume to earn fees</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {claimable.map((position) => {
                    const claimableAmount = Number(
                      position.totalClaimableLamportsUserShare || position.virtualPoolClaimableAmount || 0
                    ) + Number(position.dammPoolClaimableAmount || 0);
                    return (
                      <div key={position.baseMint} className="flex items-center justify-between p-3 bg-[#141414] rounded-2xl border border-white/10">
                        <div>
                          <p className="text-xs font-mono text-zinc-500">
                            {position.baseMint.slice(0, 8)}...{position.baseMint.slice(-8)}
                          </p>
                          <p className="text-sm font-semibold text-white">{formatSOL(claimableAmount)} SOL</p>
                        </div>
                        <button
                          onClick={() => handleClaim(position.baseMint)}
                          disabled={claimableAmount <= 0}
                          className="py-1.5 px-3 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-xl text-xs font-medium hover:from-red-600 hover:to-red-800 border border-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Claim
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Token Detail / Trade Modal */}
      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#141414] rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-white/10">
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                {selectedToken.image ? (
                  <img src={selectedToken.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-800 to-rose-950 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{selectedToken.symbol?.[0]}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white">{selectedToken.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">${selectedToken.symbol}</span>
                    <a href={`https://bags.fm/${selectedToken.tokenMint}`} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400/90 hover:text-red-300 hover:underline flex items-center gap-0.5">
                      Bags <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <button onClick={() => setSelectedToken(null)} className="p-2 hover:bg-white/5 rounded-lg">✕</button>
              </div>
              {selectedToken.description && <p className="text-xs text-zinc-500 mt-2">{selectedToken.description}</p>}
            </div>
            <div className="p-4">
              <TokenTrade tokenMint={selectedToken.tokenMint} tokenSymbol={selectedToken.symbol} tokenImage={selectedToken.image} compact />
            </div>
          </div>
        </div>
      )}

      {/* Launch Modal */}
      {showLaunchModal && (
        <TokenLaunch
          onClose={() => setShowLaunchModal(false)}
          onSuccess={(mint) => { setShowLaunchModal(false); fetchTokens(); toast("success", "Your token is live!"); }}
          username={useAppStore.getState().currentUser?.username}
        />
      )}
    </div>
  );
}
