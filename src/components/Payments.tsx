"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, ArrowDownLeft, Shield, Lock, Send, DollarSign, ExternalLink, Eye, EyeOff, ChevronDown, Wallet, Check, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { usePrivatePayment } from "@/hooks/usePrivatePayment";
import { useMagicBlockPayment, type PaymentVisibility } from "@/hooks/useMagicBlockPayment";
import type { Payment } from "@/types";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Payments() {
  const { payments: localPayments, isConnected } = useAppStore();
  const [showSendForm, setShowSendForm] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"public" | "private">("public");
  const { sendPayment, step: paymentStep, error: paymentError, txSignature, reset: resetPayment } = usePrivatePayment();
  const { sendPrivatePayment, step: mbStep, error: mbError, txSignature: mbTxSignature, reset: resetMb } = useMagicBlockPayment();

  // Unified step/error/sig based on current mode
  const activeStep = paymentMode === "private" ? mbStep : paymentStep;
  const activeError = paymentMode === "private" ? mbError : paymentError;
  const activeTxSig = paymentMode === "private" ? mbTxSignature : txSignature;
  const activeReset = paymentMode === "private" ? resetMb : resetPayment;

  // Payment records from local state
  const [loadingOnChain, setLoadingOnChain] = useState(false);

  const loadOnChainPayments = useCallback(async () => {
    // Payments are tracked locally
    setLoadingOnChain(false);
  }, []);

  // Load on-chain payments on mount and when program becomes available
  useEffect(() => {
    if (isConnected) {
      loadOnChainPayments();
    }
  }, [isConnected, loadOnChainPayments]);

  // Reload after a payment is sent
  useEffect(() => {
    if (activeStep === "done") {
      const timer = setTimeout(() => loadOnChainPayments(), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, loadOnChainPayments]);

  // Use local payment records
  const allPayments = (() => {
    return [...localPayments].sort((a, b) => b.timestamp - a.timestamp);
  })();

  const totalSent = allPayments.filter((p) => p.sender === "me").reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = allPayments.filter((p) => p.recipient === "me").reduce((sum, p) => sum + p.amount, 0);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-red-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Tribute</h3>
          <p className="text-sm text-zinc-500">Connect your wallet to send and receive payments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="premium-card p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" strokeWidth={2} />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-zinc-500">Total Sent</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">{totalSent.toFixed(2)} <span className="text-xs sm:text-sm font-medium text-zinc-500">SOL</span></p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1.5">
            <Shield className="w-2.5 h-2.5" strokeWidth={2} /> On-chain transfers
          </p>
        </div>
        <div className="premium-card p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" strokeWidth={2} />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-zinc-500">Received</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">{totalReceived.toFixed(2)} <span className="text-xs sm:text-sm font-medium text-zinc-500">SOL</span></p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1.5">
            <Shield className="w-2.5 h-2.5" strokeWidth={2} /> Received on-chain
          </p>
        </div>
      </div>

      {/* Send Payment */}
      <div className="premium-card overflow-hidden">
        <button
          onClick={() => setShowSendForm(!showSendForm)}
          className="touch-active w-full flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5 hover:bg-white/[0.02] active:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/20">
              <Send className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Send Tribute</p>
              <p className="text-[10px] sm:text-[11px] text-zinc-500">Send SOL or private USDC to creators</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform flex-shrink-0 ${showSendForm ? "rotate-180" : ""}`} strokeWidth={2} />
        </button>

        {showSendForm && (
          <div className="px-4 sm:px-5 pb-5 sm:pb-6 space-y-4 animate-fade-in border-t border-white/[0.06]">
            {/* Payment Mode Toggle */}
            <div className="pt-4">
              <label className="text-xs font-medium text-zinc-500 mb-2 block">Payment Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setPaymentMode("public"); activeReset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                    paymentMode === "public"
                      ? "bg-red-500/15 border-red-500/30 text-red-400 shadow-lg shadow-red-900/10"
                      : "bg-zinc-900/50 border-white/[0.08] text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                  Public (SOL)
                </button>
                <button
                  onClick={() => { setPaymentMode("private"); activeReset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                    paymentMode === "private"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-900/10"
                      : "bg-zinc-900/50 border-white/[0.08] text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400"
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" strokeWidth={2} />
                  Private (USDC)
                </button>
              </div>
              {paymentMode === "private" && (
                <p className="text-[10px] text-emerald-400/80 mt-2 flex items-center gap-1.5">
                  <Lock className="w-2.5 h-2.5" strokeWidth={2} /> Powered by MagicBlock — privacy via ephemeral rollups
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter Solana wallet address..."
                className="w-full bg-zinc-900/50 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Amount</label>
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/[0.08] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-red-500/30 focus-within:border-red-500/30 transition-all">
                <DollarSign className="w-4 h-4 text-zinc-600" strokeWidth={2} />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-zinc-600"
                />
                <span className="text-xs font-medium text-zinc-500">{paymentMode === "private" ? "USDC" : "SOL"}</span>
              </div>
            </div>

            {/* Payment Flow visualization */}
            {paymentMode === "public" ? (
              <div className="bg-zinc-900/30 rounded-xl p-4 space-y-2.5 border border-white/[0.06]">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Payment Flow</p>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Send SOL directly on Solana</span>
                  <Lock className="w-3 h-3 text-emerald-500 ml-auto" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Record payment on-chain</span>
                  <Lock className="w-3 h-3 text-emerald-500 ml-auto" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Confirmed on Solana</span>
                  <Shield className="w-3 h-3 text-emerald-500 ml-auto" strokeWidth={2} />
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/20 rounded-xl p-4 space-y-2.5 border border-emerald-500/20">
                <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <EyeOff className="w-3 h-3" strokeWidth={2} /> Private Payment Flow
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Build private tx via MagicBlock</span>
                  <Lock className="w-3 h-3 text-emerald-500 ml-auto" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Sign &amp; send through ephemeral rollup</span>
                  <EyeOff className="w-3 h-3 text-emerald-500 ml-auto" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>USDC arrives — amount hidden on-chain</span>
                  <Shield className="w-3 h-3 text-emerald-500 ml-auto" strokeWidth={2} />
                </div>
              </div>
            )}

            {/* Payment Status */}
            {activeStep !== "idle" && activeStep !== "done" && activeStep !== "error" && (
              <div className={`rounded-xl p-4 space-y-3 animate-fade-in border ${paymentMode === "private" ? "bg-emerald-950/10 border-emerald-500/20" : "bg-red-950/10 border-red-500/20"}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${paymentMode === "private" ? "border-emerald-500" : "border-red-500"}`} />
                  <span className={`text-sm font-medium ${paymentMode === "private" ? "text-emerald-400" : "text-red-400"}`}>
                    {paymentMode === "private" ? (
                      <>
                        {activeStep === "building" && "Building private transaction..."}
                        {activeStep === "signing" && "Sign to approve private transfer..."}
                        {activeStep === "sending" && "Sending through MagicBlock..."}
                        {activeStep === "confirming" && "Confirming private transfer..."}
                      </>
                    ) : (
                      <>
                        {activeStep === "sending" && "Sending SOL payment..."}
                        {activeStep === "confirming" && "Confirming transaction..."}
                        {activeStep === "recording" && "Recording payment on-chain..."}
                        {activeStep === "finalizing" && "Finalizing..."}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex gap-1">
                  {paymentMode === "private" ? (
                    <>
                      <div className={`h-1.5 flex-1 rounded-full ${["building", "signing", "sending", "confirming"].includes(activeStep) ? "bg-emerald-500" : "bg-zinc-800"}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${["signing", "sending", "confirming"].includes(activeStep) ? "bg-emerald-500" : "bg-zinc-800"}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${["sending", "confirming"].includes(activeStep) ? "bg-emerald-500" : "bg-zinc-800"}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${activeStep === "confirming" ? "bg-emerald-500" : "bg-zinc-800"}`} />
                    </>
                  ) : (
                    <>
                      <div className={`h-1.5 flex-1 rounded-full ${["sending", "confirming", "recording", "finalizing"].includes(activeStep) ? "bg-red-500" : "bg-zinc-800"}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${["confirming", "recording", "finalizing"].includes(activeStep) ? "bg-red-500" : "bg-zinc-800"}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${["recording", "finalizing"].includes(activeStep) ? "bg-red-500" : "bg-zinc-800"}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${activeStep === "finalizing" ? "bg-red-500" : "bg-zinc-800"}`} />
                    </>
                  )}
                </div>
              </div>
            )}

            {activeStep === "done" && activeTxSig && (
              <div className="bg-emerald-950/20 rounded-xl p-4 animate-fade-in border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">
                    {paymentMode === "private" ? "Private Payment Sent!" : "Payment Sent!"}
                  </span>
                  {paymentMode === "private" && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      <EyeOff className="w-2 h-2" strokeWidth={2} /> Private
                    </span>
                  )}
                </div>
                <a
                  href={`https://explorer.solana.com/tx/${activeTxSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  View on Explorer <ExternalLink className="w-3 h-3" strokeWidth={2} />
                </a>
                <button onClick={activeReset} className="mt-2 text-xs text-zinc-500 hover:text-white transition-colors">
                  Send another payment
                </button>
              </div>
            )}

            {activeStep === "error" && activeError && (
              <div className="bg-red-950/20 rounded-xl p-4 animate-fade-in border border-red-500/20">
                <p className="text-sm text-red-400 font-medium">Payment failed</p>
                <p className="text-xs text-red-400/70 mt-1">{activeError}</p>
                <button onClick={activeReset} className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                  Try again
                </button>
              </div>
            )}

            <button
              onClick={() => {
                if (paymentMode === "private") {
                  sendPrivatePayment(recipient, parseFloat(amount), "private");
                } else {
                  sendPayment(recipient, parseFloat(amount));
                }
              }}
              disabled={!recipient || !amount || !["idle", "done", "error"].includes(activeStep)}
              className="w-full py-3.5 text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg premium-button"
            >
              {["building", "signing", "sending", "confirming", "recording", "finalizing"].includes(activeStep)
                ? paymentMode === "private"
                  ? activeStep === "building" ? "Building Private Tx..."
                    : activeStep === "signing" ? "Waiting for Signature..."
                    : activeStep === "confirming" ? "Confirming..."
                    : "Processing..."
                  : activeStep === "recording" ? "Recording on-chain..."
                    : activeStep === "finalizing" ? "Finalizing..."
                    : "Processing..."
                : paymentMode === "private"
                  ? `Send Private ${amount || "0"} USDC`
                  : "Send Tribute"
              }
            </button>
            <p className="text-[10px] text-center text-zinc-600 flex items-center justify-center gap-1">
              {paymentMode === "private" ? (
                <><EyeOff className="w-2.5 h-2.5" strokeWidth={2} /> Private USDC transfer via MagicBlock</>
              ) : (
                <><Shield className="w-2.5 h-2.5" strokeWidth={2} /> Payment recorded on Solana</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="premium-card overflow-hidden">
        <button
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-red-400" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold text-white">How Tributes Work</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${showHowItWorks ? "rotate-180" : ""}`} strokeWidth={2} />
        </button>

        {showHowItWorks && (
          <div className="px-5 pb-5 border-t border-white/[0.06] pt-4 animate-fade-in">
            <div className="space-y-4">
              {/* Public Payment */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Eye className="w-3 h-3" strokeWidth={2} /> Public Payments (SOL)
                </p>
                <div className="space-y-3 pl-1">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-400">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Direct SOL Transfer</p>
                      <p className="text-xs text-zinc-500 mt-0.5">SOL is sent directly to your creator&apos;s wallet on Solana. Fast, secure, and cost-effective.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-400">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Payment Recorded On-Chain</p>
                      <p className="text-xs text-zinc-500 mt-0.5">The payment is recorded as a message so both participants can see the transaction history.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.06]" />

              {/* Private Payment */}
              <div>
                <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <EyeOff className="w-3 h-3" strokeWidth={2} /> Private Payments (USDC via MagicBlock)
                </p>
                <div className="space-y-3 pl-1">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-400">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Private Transaction Built</p>
                      <p className="text-xs text-zinc-500 mt-0.5">MagicBlock&apos;s API builds a privacy-preserving USDC transfer using ephemeral rollups (TEE-based).</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-400">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Sign &amp; Send</p>
                      <p className="text-xs text-zinc-500 mt-0.5">You sign the transaction — USDC is transferred with the amount hidden from on-chain observers.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-400">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Recipient Gets USDC</p>
                      <p className="text-xs text-zinc-500 mt-0.5">USDC arrives in the recipient&apos;s wallet. The transfer amount stays private — only sender and receiver know.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/30 rounded-xl p-3 mt-2 border border-white/[0.06]">
                <p className="text-xs text-zinc-500">
                  <span className="font-semibold text-white">Your Keys, Your Funds:</span> All payments are user-to-user. <span className="text-emerald-400 font-medium">You pay the fees, you sign the transaction — no middleman</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="premium-card">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Transaction History</h3>
            <p className="text-[10px] sm:text-[11px] text-zinc-500">All payments recorded on Solana</p>
          </div>
          <button
            onClick={loadOnChainPayments}
            disabled={loadingOnChain}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Refresh from blockchain"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-500 ${loadingOnChain ? "animate-spin" : ""}`} strokeWidth={2} />
          </button>
        </div>
        {loadingOnChain && allPayments.length === 0 && (
          <div className="px-5 py-8 text-center">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Loading payment records from blockchain...</p>
          </div>
        )}
        <div className="divide-y divide-white/[0.04]">
          {allPayments.map((payment) => {
            const isSent = payment.sender === "me";
            return (
              <div key={payment.id} className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-3 sm:py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  isSent ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                }`}>
                  {isSent ? (
                    <ArrowUpRight className="w-4 h-4 text-red-400" strokeWidth={2} />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">
                      {isSent ? "Sent" : "Received"} {payment.amount.toFixed(2)} {payment.token}
                    </p>
                    {payment.isPrivate && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                        <Lock className="w-2 h-2" strokeWidth={2} /> Private
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-600 truncate">
                    {isSent ? `To: ${payment.recipient}` : `From: ${payment.sender}`} · {timeAgo(payment.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold tabular-nums ${isSent ? "text-white" : "text-emerald-400"}`}>
                    {isSent ? "-" : "+"}{payment.amount.toFixed(2)}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    payment.status === "completed"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            );
          })}
          {!loadingOnChain && allPayments.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-zinc-600">No payment records yet</p>
              <p className="text-xs text-zinc-700 mt-1">Send a tribute to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
