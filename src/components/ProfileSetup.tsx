"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, User, AtSign, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { useAppStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { useWallet } from "@/hooks/usePrivyWallet";
import { checkUsername } from "@/lib/reserved-usernames";

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { setCurrentUser } = useAppStore();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameReserved, setUsernameReserved] = useState(false);
  const [reservedNeedsCode, setReservedNeedsCode] = useState(false);
  const [reservedReason, setReservedReason] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showInviteInput, setShowInviteInput] = useState(false);
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset invite state when username changes
  useEffect(() => {
    setShowInviteInput(false);
    setInviteCode("");
  }, [username]);

  // Debounced username availability check
  useEffect(() => {
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    setUsernameChecked(false);
    setUsernameTaken(false);
    setUsernameReserved(false);
    setReservedNeedsCode(false);
    setReservedReason("");
    if (!username.trim() || username.trim().length < 2 || !program) return;

    // Check reserved list first (instant, no RPC)
    const reserved = checkUsername(username.trim(), inviteCode || undefined);
    if (reserved.blocked) {
      setUsernameReserved(true);
      setReservedNeedsCode(!!reserved.needsCode);
      setReservedReason(reserved.reason || "This username is reserved");
      setCheckingUsername(false);
      setUsernameChecked(true);
      return;
    }

    setCheckingUsername(true);
    usernameTimer.current = setTimeout(async () => {
      try {
        const taken = await program.isUsernameTaken(username.trim(), publicKey ?? undefined);
        setUsernameTaken(taken);
        setUsernameChecked(true);
      } catch {
        setUsernameChecked(false);
      }
      setCheckingUsername(false);
    }, 500);
    return () => { if (usernameTimer.current) clearTimeout(usernameTimer.current); };
  }, [username, program, publicKey, inviteCode]);

  // No wallet funding needed — treasury sponsors all transactions directly

  const handleCreate = async () => {
    if (!program || !publicKey || !username.trim() || !displayName.trim()) return;
    if (usernameTaken) {
      toast("error", "Username taken", "Try a different username");
      return;
    }
    if (usernameReserved) {
      toast("error", "Username reserved", reservedReason || "This username is reserved");
      return;
    }
    setLoading(true);
    try {
      const sig = await program.createProfile(
        username.trim(),
        displayName.trim(),
        bio.trim() || "gm ☀️",
        inviteCode || undefined
      );
      toast("success", "Profile created on Solana!", `TX: ${sig.slice(0, 8)}...`);

      setCurrentUser({
        publicKey: publicKey.toBase58(),
        username: username.trim(),
        displayName: displayName.trim(),
        avatar: "🧑‍💻",
        bio: bio.trim() || "gm ☀️",
        isPrivate: false,
        followerCount: 0,
        followingCount: 0,
        createdAt: Date.now(),
      });

      onComplete();
    } catch (err: any) {
      console.error("Profile creation error:", err);
      toast("error", "Failed to create profile", err?.message?.slice(0, 60));
    }
    setLoading(false);
  };

  const handleSkip = () => {
    if (!publicKey) return;
    const addr = publicKey.toBase58();
    setCurrentUser({
      publicKey: addr,
      username: addr.slice(0, 8),
      displayName: addr.slice(0, 4) + "..." + addr.slice(-4),
      avatar: "🧑‍💻",
      bio: "gm ☀️",
      isPrivate: false,
      followerCount: 0,
      followingCount: 0,
      createdAt: Date.now(),
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0a0a0a] rounded-t-[24px] sm:rounded-[24px] border border-red-500/15 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.65),0_0_60px_rgba(220,38,38,0.08)] w-full sm:max-w-md overflow-hidden animate-slide-up sm:animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative px-5 sm:px-6 py-6 sm:py-8 text-center border-b border-white/[0.06] bg-gradient-to-b from-red-950/50 via-[#0f0a0c] to-[#0a0a0a]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_90%_80%_at_50%_-20%,rgba(220,38,38,0.35),transparent_55%)]"
          />
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/10 border border-red-500/25 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-[0_0_24px_rgba(220,38,38,0.2)]">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
          </div>
          <h2 className="relative text-lg sm:text-xl font-premium-headline tracking-[0.12em] text-white">Welcome to SinSol</h2>
          <p className="relative text-xs sm:text-sm text-zinc-400 mt-2 font-light tracking-wide">Set up your public profile — stored on Solana</p>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-[#0a0a0a]" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}>
          <div>
            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3 h-3 text-red-400/80" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="satoshi"
              maxLength={16}
              className={`w-full bg-zinc-950/80 border rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition-colors ${
                usernameChecked && !checkingUsername
                  ? usernameTaken
                    ? "border-red-500/60 focus:ring-red-500/25 focus:border-red-500"
                    : "border-emerald-600/50 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                  : "border-white/[0.08] focus:ring-red-500/20 focus:border-red-500/40"
              }`}
            />
            {username.trim().length >= 2 && (
              <div className="mt-1 space-y-1.5">
                {checkingUsername ? (
                  <span className="text-[11px] text-zinc-500">Checking...</span>
                ) : usernameChecked ? (
                  usernameReserved ? (
                    <div>
                      <span className="text-[11px] text-amber-400/90 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> {reservedReason}
                      </span>
                      {reservedNeedsCode && !showInviteInput && (
                        <button
                          type="button"
                          onClick={() => setShowInviteInput(true)}
                          className="text-[11px] text-red-400 hover:text-red-300 mt-0.5 font-medium"
                        >
                          Have an invite code?
                        </button>
                      )}
                      {showInviteInput && (
                        <input
                          type="text"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase().trim())}
                          placeholder="Enter invite code"
                          className="w-full mt-1.5 bg-zinc-950/80 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40"
                        />
                      )}
                    </div>
                  ) : usernameTaken ? (
                    <span className="text-[11px] text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Username taken
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-400/90 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Available
                    </span>
                  )
                ) : null}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3 text-red-400/80" /> Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Satoshi Nakamoto"
              maxLength={24}
              className="w-full bg-zinc-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-red-400/80" /> Bio <span className="text-zinc-600 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Builder, creator, dreamer..."
              maxLength={64}
              rows={2}
              className="w-full bg-zinc-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 resize-none"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!username.trim() || !displayName.trim() || loading || usernameTaken || usernameReserved || checkingUsername}
            className="connect-wallet-cta w-full py-3.5 text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none flex items-center justify-center gap-2 shadow-[0_8px_28px_rgba(220,38,38,0.35)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating on Solana...
              </>
            ) : (
              "Create Profile"
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-xs text-zinc-500 hover:text-red-400/90 transition-colors tracking-wide"
          >
            Skip for now — use wallet address as name
          </button>

          <p className="text-[10px] text-center text-zinc-600 flex items-center justify-center gap-1.5 tracking-wide">
            <Shield className="w-2.5 h-2.5 text-red-500/50 shrink-0" /> Your profile is stored as a PDA on Solana — you own it
          </p>
        </div>
      </div>
    </div>
  );
}
