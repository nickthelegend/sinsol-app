"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Repeat2, Globe, Send, Shield, RefreshCw, Image as ImageIcon, X, BadgeCheck, Trash2, Lock, Unlock, DollarSign, Loader2, Coins, TrendingUp, BarChart3, Clock, CheckCircle2, Pencil } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { RichContent, MediaBar, uploadMedia, isVideoFile } from "@/components/RichContent";
import { useProgram } from "@/hooks/useProgram";
import { useWallet, useConnection, pollConfirmation } from "@/hooks/usePrivyWallet";
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SinSolClient, clearRpcCache } from "@/lib/program";
import ProfileHoverCard from "@/components/ProfileHoverCard";

// Gold badge for OG / founder accounts
const GOLD_BADGE_USERNAMES = ["shaan", "sinsol"];

/** Feed list stagger — Framer Motion */
const feedStaggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};
const feedStaggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Parse a paid post: content starts with PAID|<price>|<actual content> */
function parsePaidPost(content: string): { isPaid: boolean; price: number; actualContent: string } {
  if (content.startsWith("PAID|")) {
    const firstPipe = content.indexOf("|");
    const secondPipe = content.indexOf("|", firstPipe + 1);
    if (secondPipe !== -1) {
      const price = parseFloat(content.substring(firstPipe + 1, secondPipe));
      const actualContent = content.substring(secondPipe + 1);
      if (!isNaN(price) && price > 0) {
        return { isPaid: true, price, actualContent };
      }
    }
  }
  return { isPaid: false, price: 0, actualContent: content };
}

/** Parse a community post: content starts with COMM|<communityId>|<actual content> */
export function parseCommunityPost(content: string): { isCommunity: boolean; communityId: number; actualContent: string } {
  if (content.startsWith("COMM|")) {
    const firstPipe = content.indexOf("|");
    const secondPipe = content.indexOf("|", firstPipe + 1);
    if (secondPipe !== -1) {
      const communityId = parseInt(content.substring(firstPipe + 1, secondPipe));
      const actualContent = content.substring(secondPipe + 1);
      if (!isNaN(communityId)) {
        return { isCommunity: true, communityId, actualContent };
      }
    }
  }
  return { isCommunity: false, communityId: 0, actualContent: content };
}

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


/** Reaction emoji map — dark-theme chips (production feed) */
const REACTIONS = [
  { emoji: "❤️", label: "Love", bg: "bg-red-500/15", text: "text-red-300", activeBg: "bg-red-500/30" },
  { emoji: "🔥", label: "Fire", bg: "bg-orange-500/15", text: "text-orange-300", activeBg: "bg-orange-500/30" },
  { emoji: "🚀", label: "Rocket", bg: "bg-rose-500/12", text: "text-rose-300", activeBg: "bg-rose-500/25" },
  { emoji: "😂", label: "Laugh", bg: "bg-amber-500/12", text: "text-amber-200", activeBg: "bg-amber-500/25" },
  { emoji: "👏", label: "Clap", bg: "bg-fuchsia-500/12", text: "text-fuchsia-300", activeBg: "bg-fuchsia-500/25" },
  { emoji: "💡", label: "Insightful", bg: "bg-emerald-500/12", text: "text-emerald-300", activeBg: "bg-emerald-500/25" },
];

/** Reusable on-chain post card with on-chain likes, comments & reactions */
export function OnChainPostCard({
  post,
  profile,
  isMe,
  program,
  allComments,
  allReactions,
  profileMap,
  onCommentAdded,
  onReactionAdded,
  onRepost,
  onDelete,
  defaultShowComments = false,
}: {
  post: any;
  profile: any;
  isMe: boolean;
  program: SinSolClient | null;
  allComments: { publicKey: string; post: string; author: string; commentIndex: string; content: string; createdAt: string }[];
  allReactions: { publicKey: string; post: string; user: string; reactionType: number }[];
  profileMap: Record<string, any>;
  onCommentAdded: () => void;
  onReactionAdded: () => void;
  onRepost: (content: string) => void;
  onDelete: () => void;
  defaultShowComments?: boolean;
}) {
  const { likedPosts, addLikedPost, isConnected, currentUser, navigateToProfile, unlockedPosts, addUnlockedPost, addPayment, postTips, addPostTip } = useAppStore();
  const { publicKey: walletKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [localLikeBoost, setLocalLikeBoost] = useState(0);
  const [reposting, setReposting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [flexing, setFlexing] = useState(false);
  const reduceMotion = useReducedMotion();
  // Paid post detection
  const { isPaid, price: postPrice, actualContent } = parsePaidPost(post.content);
  const isUnlocked = unlockedPosts.includes(post.publicKey) || isMe;

  const hasLiked = likedPosts.includes(post.publicKey);
  const postComments = allComments.filter((c) => c.post === post.publicKey)
    .sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
  const postReactions = allReactions.filter((r) => r.post === post.publicKey);
  const totalLikes = Number(post.likes || 0) + localLikeBoost;
  const totalComments = postComments.length;

  /** Unlock a paid post by sending SOL directly to the creator's wallet */
  const handleUnlock = async () => {
    if (!walletKey || !signTransaction || !connection || unlocking) return;
    setUnlocking(true);
    try {
      const creatorPubkey = new PublicKey(post.author);
      const lamports = Math.round(postPrice * LAMPORTS_PER_SOL);

      // Check balance
      const balance = await connection.getBalance(walletKey);
      if (balance < lamports + 10000) {
        toast("error", "Insufficient SOL", `You need at least ${postPrice} SOL to unlock this post.`);
        setUnlocking(false);
        return;
      }

      toast("privacy", "Unlocking...", `Sending ${postPrice} SOL to creator`);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletKey,
          toPubkey: creatorPubkey,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = walletKey;

      const signedTx = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false });

      // Poll for confirmation via HTTP — no WebSocket needed
      const confirmed = await pollConfirmation(connection, sig);

      // Always unlock — user already signed & sent the tx
      addUnlockedPost(post.publicKey);
      addPayment({
        id: sig,
        sender: "me",
        recipient: post.author,
        amount: postPrice,
        token: "SOL",
        status: "completed",
        isPrivate: false,
        timestamp: Date.now(),
        txSignature: sig,
      });

      if (confirmed) {
        toast("success", "Post unlocked! 🔓", `Paid ${postPrice} SOL — TX: ${sig.slice(0, 8)}...`);
      } else {
        toast("success", "Post unlocked! 🔓", `Payment sent — TX: ${sig.slice(0, 8)}...`);
      }
    } catch (err: any) {
      console.error("Unlock error:", err);
      if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request") || err?.message?.includes("User exited")) {
        toast("error", "Unlock cancelled", "You rejected the transaction");
      } else {
        toast("error", "Unlock failed", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setUnlocking(false);
  };

  const handleTip = async (amount: number) => {
    if (!walletKey || !signTransaction || !connection || tipping || isMe) return;
    if (amount <= 0 || isNaN(amount)) { toast("error", "Invalid tip", "Enter a valid SOL amount"); return; }
    setTipping(true);
    setShowTip(false);
    try {
      const creatorPubkey = new PublicKey(post.author);
      const lamports = Math.round(amount * LAMPORTS_PER_SOL);

      const balance = await connection.getBalance(walletKey);
      if (balance < lamports + 10000) {
        toast("error", "Insufficient SOL", `You need at least ${amount} SOL to send this tip.`);
        setTipping(false);
        return;
      }

      toast("privacy", "Sending tip...", `${amount} SOL → creator`);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletKey,
          toPubkey: creatorPubkey,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = walletKey;

      const signedTx = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false });

      // Poll for confirmation via HTTP — no WebSocket needed
      const tipConfirmed = await pollConfirmation(connection, sig);

      addPostTip(post.publicKey, amount);
      addPayment({
        id: sig,
        sender: "me",
        recipient: post.author,
        amount,
        token: "SOL",
        status: "completed",
        isPrivate: false,
        timestamp: Date.now(),
        txSignature: sig,
      });

      const authorName = profile?.username ? `@${profile.username}` : post.author.slice(0, 8);
      if (tipConfirmed) {
        toast("success", `Tipped ${amount} SOL! 💸`, `Sent to ${authorName} — TX: ${sig.slice(0, 8)}...`);
      } else {
        toast("success", `Tip sent! 💸`, `TX: ${sig.slice(0, 8)}... — confirming...`);
      }
      setTipAmount("");
    } catch (err: any) {
      console.error("Tip error:", err);
      if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request") || err?.message?.includes("User exited")) {
        toast("error", "Tip cancelled", "You rejected the transaction");
      } else {
        toast("error", "Tip failed", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setTipping(false);
  };

  const tipInfo = postTips[post.publicKey];

  // Group reactions by type
  const reactionCounts: Record<number, number> = {};
  let myReactionType: number | null = null;
  const myAddr = walletKey?.toBase58() || "";
  for (const r of postReactions) {
    reactionCounts[r.reactionType] = (reactionCounts[r.reactionType] || 0) + 1;
    if (r.user === myAddr) myReactionType = r.reactionType;
  }

  const displayName = profile?.displayName && profile.displayName !== "Anonymous"
    ? profile.displayName
    : post.author.slice(0, 4) + "..." + post.author.slice(-4);
  const username = profile?.username && profile.username !== "anon"
    ? profile.username
    : post.author.slice(0, 8);
  // Use actual on-chain username for badge color
  const realUsername = profile?.username || "";

  const handleLike = async () => {
    if (!program || !isConnected || hasLiked || liking) return;
    setLiking(true);
    try {
      const authorPubkey = new PublicKey(post.author);
      const postId = Number(post.postId);
      await program.likePost(authorPubkey, postId);
      addLikedPost(post.publicKey);
      setLocalLikeBoost((prev) => prev + 1);
      toast("success", "Liked! ❤️", "Recorded on-chain");
    } catch (err: any) {
      console.error("Like error:", err);
      const msg = err?.message || "";
      if (msg.includes("already in use") || msg.includes("0x0")) {
        // Already liked on-chain (e.g. liked from mobile) — silently mark as liked
        addLikedPost(post.publicKey);
      } else if (msg.includes("User rejected") || msg.includes("rejected the request")) {
        toast("error", "Like cancelled", "You rejected the transaction");
      } else if (msg.includes("insufficient") || msg.includes("0x1")) {
        toast("error", "Insufficient SOL", "Your wallet needs more SOL to interact.");
      } else {
        toast("error", "Like failed", msg.slice(0, 80) || "Please try again");
      }
    }
    setLiking(false);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!program || !walletKey) {
      toast("error", "Not ready", "Wallet or program not loaded yet. Please wait...");
      return;
    }
    if (commenting) return;
    setCommenting(true);
    try {
      const authorPubkey = new PublicKey(post.author);
      const postId = Number(post.postId);
      const commentIndex = Date.now();
      await program.createComment(authorPubkey, postId, commentIndex, commentText.trim());
      setCommentText("");
      toast("success", "Comment posted! 💬", "Your comment is on-chain");
      onCommentAdded();
    } catch (err: any) {
      console.error("Comment error:", err);
      if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request")) {
        toast("error", "Comment cancelled", "You rejected the transaction");
      } else if (err?.message?.includes("insufficient") || err?.message?.includes("0x1")) {
        toast("error", "Insufficient SOL", "Please try again.");
      } else {
        toast("error", "Comment failed", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setCommenting(false);
  };

  const handleReaction = async (reactionType: number) => {
    if (!program || !isConnected || reacting) return;
    setReacting(true);
    try {
      const authorPubkey = new PublicKey(post.author);
      const postId = Number(post.postId);
      await program.reactToPost(authorPubkey, postId, reactionType);
      setShowReactions(false);
      toast("success", `Reacted ${REACTIONS[reactionType].emoji}`, "Your reaction is on-chain!");
      onReactionAdded();
    } catch (err: any) {
      console.error("Reaction error:", err);
      if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request")) {
        toast("error", "Reaction cancelled", "You rejected the transaction");
      } else if (err?.message?.includes("insufficient") || err?.message?.includes("0x1")) {
        toast("error", "Insufficient SOL", "Your wallet needs more SOL to react.");
      } else {
        toast("error", "Reaction failed", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setReacting(false);
  };

  const handleRemoveReaction = async () => {
    if (!program || !isConnected || reacting || myReactionType === null) return;
    setReacting(true);
    try {
      const authorPubkey = new PublicKey(post.author);
      const postId = Number(post.postId);
      await program.removeReaction(authorPubkey, postId);
      toast("success", "Reaction removed", "Your reaction has been undone");
      onReactionAdded();
    } catch (err: any) {
      console.error("Remove reaction error:", err);
      if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request")) {
        toast("error", "Cancelled", "You rejected the transaction");
      } else {
        toast("error", "Failed to remove reaction", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setReacting(false);
  };

  return (
    <article className="premium-card p-4 sm:p-6 mb-5 sm:mb-6 hover-lift-seductive">
      {/* Author - Premium styling */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <ProfileHoverCard walletAddress={post.author} profile={profile}>
        <button
          type="button"
          onClick={() => navigateToProfile(post.author)}
          className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 text-left group cursor-pointer"
        >
        {profile?.avatarUrl ? (
          <div className="relative flex-shrink-0">
            <img src={profile.avatarUrl} alt={displayName} className="w-12 h-12 sm:w-14 sm:h-14 rounded-[22px] object-cover border-2 border-white/10 shadow-xl shadow-black/40 flex-shrink-0 group-hover:scale-105 group-hover:border-red-500/30 transition-all duration-300" />
            {isPaid && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-2 border-[#0A0A0A]">
                <Lock className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[20px] flex items-center justify-center text-lg sm:text-xl border-2 border-white/10 shadow-lg flex-shrink-0 group-hover:ring-2 group-hover:ring-red-500/40 transition-all duration-300 ${
            isMe
              ? "bg-gradient-to-br from-red-900/40 to-red-800/25"
              : "bg-gradient-to-br from-zinc-800 to-zinc-900"
          }`}>
            {displayName.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-[15px] tracking-tight truncate group-hover:text-red-400 transition-colors duration-300">{displayName}</span>
            <BadgeCheck className={`w-4 h-4 flex-shrink-0 ${GOLD_BADGE_USERNAMES.includes(realUsername.toLowerCase()) ? "text-amber-400" : "text-red-500"}`} />
            <span className="text-[13px] text-zinc-500 truncate group-hover:text-zinc-400 transition-colors duration-300">@{username}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500">
              {post.createdAt !== "0" ? timeAgo(Number(post.createdAt) * 1000) : "just now"}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-400/90 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/10">
              <Globe className="w-2.5 h-2.5" /> chain
            </span>
            {isPaid && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" /> {postPrice} SOL
              </span>
            )}
          </div>
        </div>
        </button>
        </ProfileHoverCard>
      </div>

      {/* Inline edit modal - Premium */}
      {editing && (
        <div className="mb-4 pl-0 sm:pl-[68px]">
          <div className="relative">
            <textarea
              autoFocus
              value={editText}
              onChange={e => setEditText(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/40 text-white text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition-all"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-zinc-600">{editText.length}/500</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-zinc-500">Edit your post</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >Cancel</button>
              <button
                disabled={savingEdit || !editText.trim() || editText.trim() === (localContent ?? post.content)}
                onClick={async () => {
                  if (!program || !editText.trim()) return;
                  setSavingEdit(true);
                  try {
                    await program.editPost(Number(post.postId), editText.trim());
                    setLocalContent(editText.trim());
                    setEditing(false);
                    toast("success", "Post updated ✏️", "Edit saved on-chain");
                  } catch (err: any) {
                    if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request")) {
                      toast("error", "Edit cancelled", "You rejected the transaction");
                    } else {
                      toast("error", "Edit failed", err?.message?.slice(0, 80) || "Please try again");
                    }
                  }
                  setSavingEdit(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold premium-button text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-3 pl-0 sm:pl-14">
        {(() => {
          // Determine the content to render (use localContent if edited, actualContent for paid posts that are unlocked)
          const renderContent = localContent ?? (isPaid && isUnlocked ? actualContent : post.content);

          // Paid post — locked state (Premium seductive styling)
          if (isPaid && !isUnlocked) {
            const previewText = actualContent.slice(0, 50).replace(/\n/g, " ");
            return (
              <div className="relative rounded-2xl overflow-hidden">
                {/* Blurred preview with vignette */}
                <div className="select-none pointer-events-none relative" style={{ filter: "blur(12px) saturate(0.6)", WebkitFilter: "blur(12px) saturate(0.6)" }}>
                  <p className="text-[16px] text-zinc-400 leading-relaxed px-1">
                    {previewText}{actualContent.length > 50 ? "…" : ""}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>
                
                {/* Premium Unlock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/50 to-black/30 backdrop-blur-sm">
                  <motion.div
                    className="relative px-6 py-6 text-center max-w-[320px] mx-4"
                    initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 26 }}
                  >
                    {/* Glowing orb behind lock */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] w-24 h-24 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
                    
                    {/* Lock icon with premium styling */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/50 border border-red-400/30">
                      <Lock className="w-7 h-7 text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                    </div>
                    
                    {/* Premium text */}
                    <p className="text-sm font-premium-headline tracking-[0.15em] text-red-400/90 mb-1">EXCLUSIVE CONTENT</p>
                    <p className="text-xs text-zinc-500 mb-5 leading-relaxed max-w-[240px] mx-auto">
                      Direct payment to creator
                      <span className="block text-zinc-600 mt-0.5">Zero platform fees</span>
                    </p>
                    
                    {/* Price display */}
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                      <span className="text-2xl font-bold text-white tabular-nums">{postPrice}</span>
                      <span className="text-sm font-medium text-zinc-500">SOL</span>
                    </div>
                    
                    {/* Premium unlock button */}
                    <motion.button
                      type="button"
                      onClick={handleUnlock}
                      disabled={unlocking || !isConnected}
                      whileTap={reduceMotion || unlocking || !isConnected ? undefined : { scale: 0.97 }}
                      className="unlock-cta-production touch-active w-full px-5 py-3.5 rounded-xl text-white text-[15px] font-semibold disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                    >
                      {unlocking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing…</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Unlock Now</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
                {/* Spacer */}
                <div className="h-32" />
              </div>
            );
          }

          // Paid post — unlocked (Premium badge styling)
          if (isPaid && isUnlocked) {
            return (
              <div>
                {!isMe && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300/90 bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border border-emerald-500/25 px-3 py-1 rounded-full mb-3">
                    <Unlock className="w-3 h-3" />
                    <span>Unlocked</span>
                  </div>
                )}
                {isMe && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-300/90 bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
                    <DollarSign className="w-3 h-3" />
                    <span>Premium · {postPrice} SOL</span>
                  </div>
                )}
                <RichContent content={actualContent} />
              </div>
            );
          }

          // New format: RT|@author|content
          if (renderContent.startsWith("RT|")) {
            const parts = renderContent.split("|");
            const rtAuthor = parts[1] || "";
            const rtContent = parts.slice(2).join("|");
            // Find the wallet address for the repost author so we can navigate to their profile
            const rtUsername = rtAuthor.replace(/^@/, "").toLowerCase();
            const rtWallet = Object.entries(profileMap).find(([, p]) => p?.username?.toLowerCase() === rtUsername)?.[0];
            return (
              <div>
                <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 mb-2">
                  <Repeat2 className="w-3.5 h-3.5 text-red-400/80" />
                  <span>Reposted from {rtWallet ? (
                    <button type="button" onClick={() => navigateToProfile(rtWallet)} className="font-semibold text-white hover:text-red-400 transition-colors cursor-pointer">{rtAuthor}</button>
                  ) : (
                    <span className="font-semibold text-white">{rtAuthor}</span>
                  )}</span>
                </div>
                <div className="border border-white/10 rounded-xl px-4 py-3 bg-black/30">
                  <RichContent content={rtContent} />
                </div>
              </div>
            );
          }
          // Legacy format: 🔁 Repost from @user:\n\n"content"
          const legacyMatch = renderContent.match(/^\u{1F501}\s*Repost from (@\w+):\s*[\\n]*\s*"?([\s\S]*?)"?\s*$/u);
          if (legacyMatch) {
            const rtAuthor = legacyMatch[1];
            const rtContent = legacyMatch[2].replace(/\\n/g, '').replace(/^"|"$/g, '').trim();
            const rtUsername = rtAuthor.replace(/^@/, "").toLowerCase();
            const rtWallet = Object.entries(profileMap).find(([, p]) => p?.username?.toLowerCase() === rtUsername)?.[0];
            return (
              <div>
                <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 mb-2">
                  <Repeat2 className="w-3.5 h-3.5 text-red-400/80" />
                  <span>Reposted from {rtWallet ? (
                    <button type="button" onClick={() => navigateToProfile(rtWallet)} className="font-semibold text-white hover:text-red-400 transition-colors cursor-pointer">{rtAuthor}</button>
                  ) : (
                    <span className="font-semibold text-white">{rtAuthor}</span>
                  )}</span>
                </div>
                <div className="border border-white/10 rounded-xl px-4 py-3 bg-black/30">
                  <RichContent content={rtContent} />
                </div>
              </div>
            );
          }
          return <RichContent content={renderContent} />;
        })()}
      </div>

      {/* Reaction pills - Premium styling */}
      {postReactions.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-0 sm:pl-[68px] mb-4">
          {Object.entries(reactionCounts).map(([typeStr, count]) => {
            const typeIdx = Number(typeStr);
            const r = REACTIONS[typeIdx];
            if (!r) return null;
            const isMyReaction = myReactionType === typeIdx;
            return (
              <span
                key={typeIdx}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all duration-300 ${
                  isMyReaction
                    ? `${r.activeBg} ${r.text} border-current shadow-sm`
                    : `${r.bg} ${r.text} border-transparent hover:border-white/10`
                }`}
              >
                <span className="text-sm">{r.emoji}</span>
                <span className="tabular-nums">{count}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Actions — Premium styling, hidden for locked posts */}
      {isPaid && !isUnlocked ? (
        <div className="flex items-center gap-3 pl-0 sm:pl-[68px] border-t border-white/10 pt-4 mt-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-900/50 flex items-center justify-center">
            <Lock className="w-4 h-4 text-zinc-600" />
          </div>
          <span className="text-xs text-zinc-600">Unlock to interact</span>
        </div>
      ) : (
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pl-0 sm:pl-[68px] border-t border-white/10 pt-4 mt-1">
        <button
          onClick={handleLike}
          disabled={!isConnected || hasLiked || liking}
          className={`touch-active flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
            hasLiked
              ? "text-red-400 bg-red-500/15 border border-red-500/20"
              : liking
                ? "text-red-300 bg-red-500/10 opacity-70"
                : "text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent"
          } disabled:cursor-not-allowed`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${hasLiked ? "fill-red-500 text-red-500 scale-110" : ""} ${liking ? "animate-pulse" : ""}`} />
          <span className="tabular-nums">{totalLikes || ""}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`touch-active flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
            showComments
              ? "text-red-300 bg-red-500/15 border border-red-500/20"
              : "text-zinc-500 hover:text-red-300 hover:bg-white/5 border border-transparent"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="tabular-nums">{totalComments || ""}</span>
        </button>

        {/* Reaction button - Premium */}
        <div className="relative">
          <button
            onClick={() => myReactionType !== null ? handleRemoveReaction() : setShowReactions(!showReactions)}
            disabled={!isConnected || reacting}
            className={`touch-active flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
              myReactionType !== null
                ? `${REACTIONS[myReactionType]?.text || "text-zinc-400"} ${REACTIONS[myReactionType]?.bg || "bg-white/5"} border border-current/20 hover:opacity-80`
                : showReactions
                  ? "text-orange-300 bg-orange-500/15 border border-orange-500/20"
                  : "text-zinc-500 hover:text-orange-300 hover:bg-orange-500/10 border border-transparent"
            } disabled:cursor-not-allowed`}
            title={myReactionType !== null ? "Click to remove reaction" : "React"}
          >
            <span className="text-sm">{myReactionType !== null ? REACTIONS[myReactionType]?.emoji : "😀"}</span>
            {postReactions.length > 0 && <span className="tabular-nums">{postReactions.length}</span>}
          </button>

          {/* Reaction picker popup - Premium glass */}
          <AnimatePresence>
            {showReactions && !reacting && myReactionType === null && (
              <motion.div
                className="absolute bottom-full left-0 mb-2 flex gap-1 glass-dark rounded-2xl shadow-2xl border border-white/10 p-2.5 z-50"
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.94 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 30 }}
              >
                {REACTIONS.map((r, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleReaction(idx)}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.65 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: reduceMotion ? 0 : idx * 0.035, type: "spring", stiffness: 500, damping: 22 }}
                    whileHover={reduceMotion ? undefined : { scale: 1.15 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${r.bg} hover:brightness-125 transition-all duration-200`}
                    title={r.label}
                  >
                    {r.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {reacting && (
              <motion.div
                className="absolute bottom-full left-0 mb-2 glass-dark rounded-2xl border border-white/10 px-4 py-2 z-50"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-xs text-zinc-400 animate-pulse">{myReactionType !== null ? "Removing…" : "Sending…"}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip button — Premium styling, hidden on own posts */}
        {!isMe && (
          <div className="relative">
            <button
              onClick={() => setShowTip(!showTip)}
              disabled={!isConnected || tipping}
              className={`touch-active flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                tipping
                  ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/20 opacity-60"
                  : showTip
                    ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/20"
                    : tipInfo?.myTip
                      ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/25"
                      : "text-zinc-500 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent"
              } disabled:cursor-not-allowed`}
              title="Send tribute"
            >
              <Coins className={`w-4 h-4 ${tipping ? "animate-pulse" : ""}`} />
              <span className="tabular-nums">{tipInfo ? `${tipInfo.totalAmount.toFixed(2)}` : "Tip"}</span>
            </button>

            {/* Tip picker popup - Premium */}
            <AnimatePresence>
            {showTip && !tipping && (
              <motion.div
                className="absolute bottom-full left-0 mb-2 glass-dark rounded-2xl border border-emerald-500/20 p-4 z-50 min-w-[240px] shadow-2xl"
                initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 28 }}
              >
                <p className="text-xs font-medium text-zinc-300 mb-3 tracking-wide">Send tribute to creator</p>
                <div className="flex gap-2 mb-3">
                  {[0.01, 0.05, 0.1, 0.5].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleTip(amt)}
                      className="flex-1 px-2 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/25 hover:border-emerald-500/40 transition-all duration-200"
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    placeholder="Custom amount"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs border border-white/10 bg-black/50 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/30 transition-all"
                    onKeyDown={(e) => { if (e.key === "Enter" && tipAmount) handleTip(parseFloat(tipAmount)); }}
                  />
                  <button
                    type="button"
                    onClick={() => tipAmount && handleTip(parseFloat(tipAmount))}
                    disabled={!tipAmount}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-900/30"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}

        {/* Repost — blocked for paid posts */}
        {isPaid ? (
          <button
            disabled
            className="touch-active flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-700 opacity-40 cursor-not-allowed"
            title="Exclusive content cannot be reposted"
          >
            <Repeat2 className="w-4 h-4" />
          </button>
        ) : (
        <button
          disabled={reposting || !isConnected}
          onClick={async () => {
            if (reposting || !program || !walletKey) return;
            setReposting(true);
            try {
              const authorName = profile?.username ? `@${profile.username}` : post.author.slice(0, 8);
              const preview = post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content;
              const repostContent = `RT|${authorName}|${preview}`;
              onRepost(repostContent);
              toast("success", "Reposted! 🔁", "Creating on-chain repost...");
            } catch (err: any) {
              toast("error", "Repost failed", err?.message?.slice(0, 80) || "Try again");
            }
            setReposting(false);
          }}
          className="touch-active flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all duration-300 disabled:opacity-40"
        >
          <Repeat2 className={`w-4 h-4 ${reposting ? "animate-spin" : ""}`} />
        </button>
        )}

        {/* Share — Premium styling */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const authorName = profile?.username ? `@${profile.username}` : post.author.slice(0, 8);
            const postUrl = `https://www.sinsol.lol/post/${post.author}-${post.postId}`;
            let rawText = post.content || "";
            if (rawText.startsWith("PAID|")) rawText = "🔒 Exclusive content";
            else if (rawText.startsWith("COMM|")) rawText = rawText.split("|").slice(2).join("|");
            else if (rawText.startsWith("RT|")) rawText = rawText.split("|").slice(2).join("|");
            const cleanText = rawText
              .replace(/https?:\/\/[^\s]+/g, "")
              .replace(/\b(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-zA-Z0-9]{50,})\b/g, "")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 100);
            const caption = cleanText
              ? `"${cleanText}" — ${authorName} on @SinSol_lol ⚡\n\n`
              : `Check out ${authorName}'s exclusive content on @SinSol_lol ⚡\n\n`;
            const shareText = `${caption}${postUrl}`;
            if (navigator.share) {
              try {
                await navigator.share({ title: `${authorName} on SinSol`, text: caption.trim(), url: postUrl });
              } catch {}
            } else {
              await navigator.clipboard.writeText(shareText);
              toast("success", "Link copied! ⚡", "Ready to share");
            }
          }}
          className="touch-active flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-red-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Edit (own posts only) */}
        {isMe && !isPaid && (
          <button
            onClick={() => {
              setEditText(localContent ?? post.content);
              setEditing(true);
            }}
            className="touch-active flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        {/* Delete (own posts only) */}
        {isMe && (
          <button
            disabled={deleting}
            onClick={async () => {
              if (deleting || !program || !walletKey) return;
              if (!confirm("Delete this post? This is permanent and on-chain.")) return;
              setDeleting(true);
              try {
                const postId = Number(post.postId);
                await program.deletePost(postId);
                toast("success", "Post deleted 🗑️", "Removed from chain, rent refunded");
                onDelete();
              } catch (err: any) {
                console.error("Delete error:", err);
                if (err?.message?.includes("User rejected") || err?.message?.includes("rejected the request")) {
                  toast("error", "Delete cancelled", "You rejected the transaction");
                } else {
                  toast("error", "Delete failed", err?.message?.slice(0, 80) || "Please try again");
                }
              }
              setDeleting(false);
            }}
            className={`touch-active flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
              deleting
                ? "text-red-400 bg-red-500/15 border border-red-500/20 opacity-60"
                : "text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            } disabled:cursor-not-allowed`}
          >
            <Trash2 className={`w-4 h-4 ${deleting ? "animate-pulse" : ""}`} />
          </button>
        )}

        {/* Flex Earnings — Premium styling */}
        {isMe && (
          <button
            disabled={flexing}
            onClick={async () => {
              if (flexing || !walletKey) return;
              setFlexing(true);
              try {
                const res = await fetch(`/api/tips-received?wallet=${walletKey.toBase58()}`);
                const data = await res.json();
                if (!res.ok || !data.totalSol) {
                  toast("error", "Couldn't fetch earnings", data.error || "Try again");
                  setFlexing(false);
                  return;
                }
                const myName = currentUser?.username || profile?.username || "someone";
                const amt = data.totalSol;
                const count = data.tipCount;
                const flexUrl = `https://www.sinsol.lol/tip?user=${encodeURIComponent(myName)}&amount=${amt}&tips=${count}`;
                const flexText = `💸 @${myName} earned ${amt} SOL in tips on SinSol!\n\nGet tipped for your posts →\n\n${flexUrl}`;
                if (navigator.share) {
                  try {
                    await navigator.share({ title: `💸 @${myName} earned ${amt} SOL on SinSol`, text: flexText });
                  } catch {}
                } else {
                  await navigator.clipboard.writeText(flexText);
                  toast("success", "Copied to clipboard! 💸", "Paste on X to flex");
                }
              } catch (err: any) {
                toast("error", "Flex failed", err?.message?.slice(0, 60) || "Try again");
              }
              setFlexing(false);
            }}
            className={`touch-active flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
              flexing
                ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/20 opacity-60"
                : "text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/25"
            }`}
            title="Share earnings"
          >
            <TrendingUp className={`w-4 h-4 ${flexing ? "animate-pulse" : ""}`} />
            <span>{flexing ? "Loading..." : "Flex"}</span>
          </button>
        )}

        <a
          href={`https://explorer.solana.com/address/${post.publicKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[10px] text-zinc-600 hover:text-red-400/80 transition-colors duration-300"
        >
          View on-chain
        </a>
      </div>
      )}

      {/* On-chain comments section — Premium styling */}
      {showComments && !(isPaid && !isUnlocked) && (
        <div className="mt-4 pl-0 sm:pl-[68px] space-y-3">
          {postComments.length === 0 && !commenting && (
            <p className="text-xs text-zinc-600 text-center py-4">No comments yet — be the first.</p>
          )}
          {postComments.map((comment) => {
            const commenterProfile = profileMap[comment.author];
            const commenterName = commenterProfile?.displayName || comment.author.slice(0, 4) + "..." + comment.author.slice(-4);
            const isMyComment = comment.author === myAddr;
            return (
              <div key={comment.publicKey} className="flex gap-3 animate-fade-in group">
                <ProfileHoverCard walletAddress={comment.author} profile={commenterProfile}>
                <button type="button" onClick={() => navigateToProfile(comment.author)} className="flex-shrink-0 group/avatar cursor-pointer">
                {commenterProfile?.avatarUrl ? (
                  <img src={commenterProfile.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 group-hover/avatar:ring-2 group-hover/avatar:ring-red-500/30 transition-all duration-300" />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 group-hover/avatar:ring-2 group-hover/avatar:ring-red-500/30 transition-all duration-300 ${
                    isMyComment ? "bg-red-500/20 text-red-200" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {commenterName.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                </button>
                </ProfileHoverCard>
                <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl px-3.5 py-2.5 group-hover:border-white/10 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => navigateToProfile(comment.author)} className="text-xs font-semibold text-white hover:text-red-400 transition-colors duration-300 cursor-pointer">{isMyComment ? "You" : commenterName}</button>
                    <span className="text-[10px] text-zinc-600">
                      {Number(comment.createdAt) > 0 ? timeAgo(Number(comment.createdAt) * 1000) : "just now"}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-red-400/70 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/15">
                      <Globe className="w-2 h-2" /> chain
                    </span>
                    {isMyComment && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!program || !walletKey) return;
                          if (!confirm("Delete this comment?")) return;
                          try {
                            const postAuthor = new PublicKey(post.author);
                            const postId = Number(post.postId);
                            const commentIdx = Number(comment.commentIndex);
                            await program.deleteComment(postAuthor, postId, commentIdx);
                            toast("success", "Comment deleted 🗑️", "Removed from chain");
                            onCommentAdded();
                          } catch (err: any) {
                            console.error("Delete comment error:", err);
                            toast("error", "Delete failed", err?.message?.slice(0, 80) || "Try again");
                          }
                        }}
                        className="ml-auto text-zinc-700 hover:text-red-400 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-zinc-300 mt-1 leading-relaxed"><RichContent content={comment.content} className="[&_p]:text-xs [&_p]:leading-relaxed" /></div>
                </div>
              </div>
            );
          })}
          {isConnected && (
            <div className="flex gap-3 items-center pt-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  maxLength={100}
                  placeholder={commenting ? "Posting on-chain..." : "Write a comment..."}
                  disabled={commenting}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 disabled:opacity-50 placeholder:text-zinc-600 transition-all"
                />
                {commentText.length > 70 && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600">{100 - commentText.length}</span>}
              </div>
              <button
                onClick={handleComment}
                disabled={!commentText.trim() || commenting}
                className="touch-active w-10 h-10 rounded-xl premium-button text-white flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0 shadow-lg shadow-red-900/20"
              >
                {commenting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/** On-chain Poll Card with vote buttons, progress bars, countdown */
function PollCard({
  poll,
  profile,
  isMe,
  program,
  myVote,
  onVoted,
}: {
  poll: any;
  profile: any;
  isMe: boolean;
  program: SinSolClient | null;
  myVote: { voted: boolean; choice?: number } | null;
  onVoted: () => void;
}) {
  const { isConnected, navigateToProfile } = useAppStore();
  const reduceMotion = useReducedMotion();
  const [voting, setVoting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [localVote, setLocalVote] = useState<number | null>(null);

  const now = Date.now();
  const hasEnded = poll.isClosed || now >= poll.endsAt;
  const hasVoted = myVote?.voted || localVote !== null;
  const votedChoice = localVote ?? myVote?.choice;
  const showResults = hasVoted || hasEnded;

  const options = [
    { label: poll.optionA, votes: poll.votesA },
    { label: poll.optionB, votes: poll.votesB },
    ...(poll.numOptions >= 3 ? [{ label: poll.optionC, votes: poll.votesC }] : []),
    ...(poll.numOptions >= 4 ? [{ label: poll.optionD, votes: poll.votesD }] : []),
  ];

  const totalVotes = (localVote !== null ? poll.totalVotes + 1 : poll.totalVotes) || 0;

  // Countdown
  const timeLeft = poll.endsAt - now;
  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "Ended";
    const hrs = Math.floor(timeLeft / 3_600_000);
    const mins = Math.floor((timeLeft % 3_600_000) / 60_000);
    if (hrs > 24) return `${Math.floor(hrs / 24)}d ${hrs % 24}h left`;
    if (hrs > 0) return `${hrs}h ${mins}m left`;
    return `${mins}m left`;
  };

  const handleVote = async (choice: number) => {
    if (!program || voting || hasVoted || hasEnded) return;
    setVoting(true);
    try {
      const creatorPk = new PublicKey(poll.creator);
      await program.votePoll(creatorPk, poll.pollId, choice);
      setLocalVote(choice);
      toast("success", "Vote recorded on-chain! 🗳️");
      setTimeout(() => onVoted(), 1500);
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("User rejected") || msg.includes("rejected the request")) {
        // silent
      } else if (msg.includes("already ended") || msg.includes("PollAlreadyEnded")) {
        toast("error", "Poll has ended");
      } else if (msg.includes("AlreadyInitialized")) {
        toast("error", "You already voted on this poll");
        setLocalVote(0); // show results
      } else {
        toast("error", "Vote failed", msg.slice(0, 100));
      }
    }
    setVoting(false);
  };

  const handleClose = async () => {
    if (!program || closing) return;
    setClosing(true);
    try {
      await program.closePoll(poll.pollId);
      toast("success", "Poll closed");
      setTimeout(() => onVoted(), 1500);
    } catch (err: any) {
      toast("error", "Close failed", err?.message?.slice(0, 80));
    }
    setClosing(false);
  };

  return (
    <div className="premium-card p-5 sm:p-6 mb-5 sm:mb-6 hover-lift-seductive">
      {/* Header - Premium */}
      <div className="flex items-center gap-4 mb-4">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="w-11 h-11 rounded-[22px] object-cover cursor-pointer border border-white/10 shadow-lg shadow-black/40 hover:border-fuchsia-500/30 transition-all duration-300"
            onClick={() => navigateToProfile(poll.creator)}
          />
        ) : (
          <div
            className="w-11 h-11 rounded-[22px] bg-gradient-to-br from-fuchsia-900/30 to-fuchsia-950/50 flex items-center justify-center text-lg font-semibold text-fuchsia-200 cursor-pointer border border-white/10"
            onClick={() => navigateToProfile(poll.creator)}
          >
            {(profile?.displayName || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-[15px] text-white truncate cursor-pointer hover:text-fuchsia-400 transition-colors duration-300"
              onClick={() => navigateToProfile(poll.creator)}
            >
              {profile?.displayName || poll.creator.slice(0, 8)}
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/25">
              <BarChart3 className="w-3 h-3 text-fuchsia-400" />
              <span className="text-[10px] font-medium text-fuchsia-300 uppercase tracking-wider">Poll</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
            <span>{timeAgo(poll.createdAt)}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className={hasEnded ? "text-red-400 font-medium" : "text-emerald-400 font-medium"}>
                {formatTimeLeft()}
              </span>
            </div>
          </div>
        </div>
        {isMe && !poll.isClosed && (
          <button
            type="button"
            onClick={handleClose}
            disabled={closing}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5"
          >
            {closing ? "Ending…" : "End Poll"}
          </button>
        )}
      </div>

      {/* Question - Premium typography */}
      <p className="text-[17px] font-medium text-white mb-4 leading-snug">{poll.question}</p>

      {/* Options - Premium styling */}
      <div className="space-y-2.5">
        {options.map((opt, i) => {
          const optVotes = (localVote === i ? opt.votes + 1 : opt.votes) || 0;
          const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isMyVote = votedChoice === i;
          const isWinner = showResults && optVotes === Math.max(...options.map((o, j) => (localVote === j ? o.votes + 1 : o.votes) || 0));

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => handleVote(i)}
              disabled={showResults || voting || !isConnected}
              whileTap={reduceMotion || showResults || voting || !isConnected ? undefined : { scale: 0.992 }}
              className={`relative w-full text-left rounded-xl border transition-all duration-300 overflow-hidden ${
                showResults
                  ? isMyVote
                    ? "border-fuchsia-500/40 bg-fuchsia-500/10"
                    : "border-white/[0.08] bg-zinc-900/30"
                  : "border-white/[0.08] bg-zinc-900/20 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/5 cursor-pointer"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {showResults && (
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-xl ${
                    isWinner ? "bg-gradient-to-r from-fuchsia-600/25 to-fuchsia-800/15" : "bg-white/[0.03]"
                  }`}
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.68, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <div className="relative flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {showResults && isMyVote && (
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium truncate ${
                    showResults && isWinner ? "text-white" : "text-zinc-300"
                  }`}>
                    {opt.label}
                  </span>
                </div>
                {showResults && (
                  <span className={`text-sm font-semibold flex-shrink-0 ml-2 tabular-nums ${
                    isWinner ? "text-fuchsia-300" : "text-zinc-500"
                  }`}>
                    {pct}%
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer - Premium */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
        <span className="text-xs text-zinc-500">
          <span className="text-zinc-400 font-medium">{totalVotes}</span> vote{totalVotes !== 1 ? "s" : ""}
        </span>
        {voting && (
          <span className="text-xs text-fuchsia-400 animate-pulse flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" /> Recording…
          </span>
        )}
      </div>
    </div>
  );
}

export default function Feed() {
  const { isConnected, currentUser, focusPostKey, setFocusPostKey, navigateToProfile } = useAppStore();
  const [newPost, setNewPost] = useState("");
  const program = useProgram();
  const { publicKey } = useWallet();
  const [onchainPosts, setOnchainPosts] = useState<any[]>([]);
  const [loadingOnchain, setLoadingOnchain] = useState(false);
  const [profileMap, setProfileMap] = useState<Record<string, any>>({});
  const [allComments, setAllComments] = useState<any[]>([]);
  const [allReactions, setAllReactions] = useState<any[]>([]);

  const [posting, setPosting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaIsVideo, setMediaIsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPaidPost, setIsPaidPost] = useState(false);
  const [paidPrice, setPaidPrice] = useState("0.01");

  // Poll creation state
  const [isPollMode, setIsPollMode] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState("24"); // hours
  const [creatingPoll, setCreatingPoll] = useState(false);

  // Poll display state
  const [allPolls, setAllPolls] = useState<any[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, { voted: boolean; choice?: number }>>({});
  const reduceMotion = useReducedMotion();

  // @mention click handler — resolves username → wallet and navigates to profile
  useEffect(() => {
    (window as any).__sinsolMentionClick = (username: string) => {
      const lower = username.toLowerCase();
      const entry = Object.entries(profileMap).find(([, p]) => p?.username?.toLowerCase() === lower);
      if (entry) {
        navigateToProfile(entry[0]);
      } else {
        toast("error", `User @${username} not found`);
      }
    };
    return () => { delete (window as any).__sinsolMentionClick; };
  }, [profileMap, navigateToProfile]);

  // Focus post from notification click — scroll to post and open comments
  useEffect(() => {
    if (!focusPostKey || onchainPosts.length === 0) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`post-${focusPostKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-red-500/70", "ring-offset-2", "ring-offset-[#0A0A0A]");
        setTimeout(() => el.classList.remove("ring-2", "ring-red-500/70", "ring-offset-2", "ring-offset-[#0A0A0A]"), 3000);
      }
      setFocusPostKey(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [focusPostKey, onchainPosts, setFocusPostKey]);

  // Fetch all public posts from Solana
  const fetchOnchainPosts = async () => {
    if (!program || !publicKey) return;
    setLoadingOnchain(true);
    try {
      const [allMapped, profiles, comments, reactions, polls, myLikedPosts] = await Promise.all([
        program.getAllPosts(),
        program.getAllProfiles(),
        program.getAllComments(),
        program.getAllReactions(),
        program.getAllPolls(),
        program.getLikedPostsByUser(publicKey),
      ]);

      // Seed the liked posts store from on-chain data (catches cross-device likes e.g. from mobile)
      myLikedPosts.forEach(postKey => useAppStore.getState().addLikedPost(postKey));

      setAllComments(comments);
      setAllReactions(reactions);
      setAllPolls(polls);

      // Show all posts: free (public) + paid (private with PAID| prefix), exclude community posts
      const visiblePosts = allMapped.filter((p: any) => !p.content.startsWith("COMM|") && (!p.isPrivate || p.content.startsWith("PAID|")));

      setOnchainPosts(visiblePosts.sort((a: any, b: any) => Number(b.createdAt) - Number(a.createdAt)));
      
      const map: Record<string, any> = {};
      profiles.forEach((p: any) => { map[p.owner] = p; });
      setProfileMap(map);

      // Check user's votes on all polls
      if (polls.length > 0) {
        const voteMap: Record<string, { voted: boolean; choice?: number }> = {};
        for (const poll of polls) {
          try {
            const result = await program.hasVoted(new PublicKey(poll.pubkey), publicKey);
            voteMap[poll.pubkey] = result;
          } catch {
            voteMap[poll.pubkey] = { voted: false };
          }
        }
        setMyVotes(voteMap);
      }
    } catch (err) {
      console.error("Failed to fetch on-chain posts:", err);
    }
    setLoadingOnchain(false);
  };

  useEffect(() => {
    fetchOnchainPosts();
  }, [program, publicKey]);

  // Auto-refresh feed every 30s — posts (like counts), comments, reactions
  useEffect(() => {
    if (!program || !publicKey) return;
    const interval = setInterval(() => {
      refreshFeed();
    }, 30_000);
    return () => clearInterval(interval);
  }, [program, publicKey]);

  // Refresh posts + comments + reactions (updates like counts, new posts, etc.)
  const refreshFeed = async () => {
    if (!program) return;
    try {
      const [allMapped, comments, reactions, polls] = await Promise.all([
        program.getAllPosts(),
        program.getAllComments(),
        program.getAllReactions(),
        program.getAllPolls(),
      ]);
      setAllComments(comments);
      setAllReactions(reactions);
      setAllPolls(polls);
      const visiblePosts = allMapped.filter((p: any) => !p.content.startsWith("COMM|") && (!p.isPrivate || p.content.startsWith("PAID|")));
      setOnchainPosts(visiblePosts.sort((a: any, b: any) => Number(b.createdAt) - Number(a.createdAt)));
    } catch (err) {
      console.error("Failed to refresh feed:", err);
    }
  };

  // Legacy alias for components that call refreshInteractions
  const refreshInteractions = refreshFeed;

  const handlePost = async () => {
    if ((!newPost.trim() && !mediaFile) || posting) return;
    if (!program || !publicKey) {
      toast("error", "Wallet not connected", "Please connect your wallet to post");
      return;
    }

    const postId = Date.now();
    let content = newPost;

    setPosting(true);
    setNewPost("");

    try {
      // Upload media first if attached
      if (mediaFile) {
        const label = mediaIsVideo ? "video" : "image";
        toast("privacy", `Uploading ${label}...`, `Hosting your ${label} on IPFS`);
        try {
          const mediaUrl = await uploadMedia(mediaFile);
          content = content.trim() ? `${content.trim()}\n${mediaUrl}` : mediaUrl;
          setMediaPreview(null);
          setMediaFile(null);
          setMediaIsVideo(false);
        } catch (err: any) {
          toast("error", `${mediaIsVideo ? "Video" : "Image"} upload failed`, err.message || "Try again");
          setPosting(false);
          setNewPost(content);
          return;
        }
      }

      toast("privacy", "Posting...", "Publishing to your feed");

      if (!publicKey || program.provider.wallet.publicKey?.toBase58() !== publicKey.toBase58()) {
        throw new Error("Wallet disconnected during post creation");
      }

      const profile = await program.getProfile(publicKey);
      if (!profile) {
        throw new Error("You need to create a profile first. Go to the Profile tab to set up your account.");
      }

      // Prepend PAID| prefix for paid posts
      if (isPaidPost) {
        const price = parseFloat(paidPrice);
        if (isNaN(price) || price <= 0) {
          toast("error", "Invalid price", "Please enter a valid price greater than 0");
          setPosting(false);
          setNewPost(content);
          return;
        }
        content = `PAID|${price}|${content}`;
      }

      const sig = await program.createPost(postId, content, isPaidPost);
      toast("success", isPaidPost ? `Paid post live! 🔒 ${paidPrice} SOL` : "Post confirmed on Solana", `TX: ${sig.slice(0, 8)}...`);

      // Reset paid post state
      setIsPaidPost(false);
      setPaidPrice("0.01");

      setTimeout(() => fetchOnchainPosts(), 1500);
    } catch (err: any) {
      console.error("On-chain post error:", err);
      const errorMsg = err?.message?.slice(0, 150) || "Unknown error";

      setNewPost(content);
      
      if (errorMsg.includes("User rejected") || errorMsg.includes("rejected the request")) {
        toast("error", "Post cancelled", "You rejected the transaction");
      } else if (errorMsg.includes("need to create a profile")) {
        toast("error", "Profile required", errorMsg);
      } else if (errorMsg.includes("Provided seeds")) {
        toast("error", "Account error", "Account setup issue - make sure your profile is created and try again");
      } else if (errorMsg.includes("insufficient funds") || errorMsg.includes("insufficient") || errorMsg.includes("for rent")) {
        toast("error", "Insufficient SOL", "Your wallet needs more SOL to pay for this transaction. Fund your wallet from the Profile tab.");
      } else if (errorMsg.includes("simulation failed")) {
        toast("error", "Transaction failed", errorMsg.includes("Provided seeds") ? "PDA derivation issue - reconnect wallet" : "Please try again or check your wallet connection");
      } else {
        toast("error", "On-chain post failed", errorMsg);
      }
    } finally {
      setPosting(false);
    }
  };

  const handleCreatePoll = async () => {
    if (!program || !publicKey || creatingPoll) return;
    const filledOptions = pollOptions.filter(o => o.trim());
    if (!pollQuestion.trim()) { toast("error", "Enter a question"); return; }
    if (filledOptions.length < 2) { toast("error", "Need at least 2 options"); return; }

    setCreatingPoll(true);
    try {
      const profile = await program.getProfile(publicKey);
      if (!profile) { toast("error", "Profile required", "Create a profile first"); setCreatingPoll(false); return; }

      const pollId = Date.now();
      const durationHours = parseFloat(pollDuration) || 24;
      const endsAt = Math.floor(Date.now() / 1000) + Math.round(durationHours * 3600);

      toast("privacy", "Creating poll...", "Publishing to Solana");
      await program.createPoll(pollId, pollQuestion.trim(), filledOptions.map(o => o.trim()), endsAt);
      toast("success", "Poll live on-chain! 📊");

      // Reset
      setIsPollMode(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setPollDuration("24");
      setTimeout(() => fetchOnchainPosts(), 1500);
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("User rejected") || msg.includes("rejected the request")) {
        // silent
      } else {
        toast("error", "Poll creation failed", msg.slice(0, 100));
      }
    }
    setCreatingPoll(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
      {/* Compose — Premium creator-first glass */}
      {isConnected && (
        <motion.div
          className="feed-compose-glow premium-card border border-red-500/20 p-4 sm:p-6 rounded-[var(--clay-radius-xl)]"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-4">
            {(() => {
              const myAvatar = (publicKey && profileMap[publicKey.toBase58()]?.avatarUrl) || currentUser?.avatarUrl;
              const myName = (publicKey && profileMap[publicKey.toBase58()]?.displayName) || currentUser?.displayName;
              if (myAvatar) return <img src={myAvatar} alt="" className="w-11 h-11 rounded-[22px] object-cover border border-white/10 shadow-lg shadow-black/40 flex-shrink-0" />;
              if (myName) return <div className="w-11 h-11 rounded-[22px] bg-gradient-to-br from-red-900/50 to-red-950/80 flex items-center justify-center text-lg font-semibold text-red-200 flex-shrink-0 border border-white/10">{myName.charAt(0).toUpperCase()}</div>;
              return <div className="w-11 h-11 rounded-[22px] bg-zinc-800/50 animate-pulse flex-shrink-0 border border-white/10" />;
            })()}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-medium">Create exclusive content</p>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                maxLength={200}
                placeholder="Share something they can't get anywhere else…"
                className="w-full resize-none bg-transparent text-[16px] text-zinc-100 focus:outline-none placeholder:text-zinc-600 min-h-[60px] sm:min-h-[80px] leading-relaxed"
              />
              <AnimatePresence mode="popLayout">
                {mediaPreview && (
                  <motion.div
                    key={mediaPreview}
                    className="relative mt-3 rounded-2xl overflow-hidden border border-white/10 inline-block shadow-xl shadow-black/40"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94, y: 4 }}
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                  >
                    {mediaIsVideo ? (
                      <video src={mediaPreview} className="max-h-[240px] max-w-full object-cover rounded-2xl" controls muted />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="max-h-[240px] max-w-full object-cover rounded-2xl" />
                    )}
                    <button
                      type="button"
                      onClick={() => { setMediaPreview(null); setMediaFile(null); setMediaIsVideo(false); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/95 transition-all duration-300 border border-white/10 shadow-lg"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {newPost.length > 140 && (
            <div className="flex justify-end mt-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
                newPost.length > 180 ? "border-red-500/60 text-red-400 bg-red-500/10" : "border-white/10 text-zinc-500"
              }`}>
                {200 - newPost.length}
              </div>
            </div>
          )}
          <AnimatePresence>
            {isPaidPost && (
              <motion.div
                key="compose-paid"
                className="flex items-center gap-3 mt-4 px-4 py-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/5 overflow-hidden"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-200">Premium Content</p>
                  <p className="text-[10px] text-amber-400/70">Set your unlock price</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={paidPrice}
                    onChange={(e) => setPaidPrice(e.target.value)}
                    min="0.001"
                    step="0.01"
                    className="w-24 text-sm font-semibold text-amber-100 bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    placeholder="0.01"
                  />
                  <span className="text-sm font-semibold text-amber-400">SOL</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isPollMode && (
            <motion.div
              key="compose-poll"
              className="mt-4 p-4 rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-950/20 to-purple-950/10 space-y-3"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-fuchsia-400" />
                </div>
                <span className="text-xs font-semibold text-fuchsia-200 tracking-wide">Community Poll</span>
              </div>
              <input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                maxLength={200}
                placeholder="Ask your audience something…"
                className="w-full px-4 py-2.5 text-sm bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-500/30 text-white placeholder:text-zinc-600 transition-all"
              />
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-xs font-semibold text-fuchsia-400">{String.fromCharCode(65 + i)}</span>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[i] = e.target.value;
                      setPollOptions(next);
                    }}
                    maxLength={50}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 px-4 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-500/30 text-white placeholder:text-zinc-600 transition-all"
                  />
                  {i >= 2 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="text-xs font-medium text-fuchsia-400/90 hover:text-fuchsia-300 transition-colors px-2 py-1 rounded-lg hover:bg-fuchsia-500/10"
                  >
                    + Add option
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Clock className="w-4 h-4 text-fuchsia-400/70" />
                  <select
                    value={pollDuration}
                    onChange={(e) => setPollDuration(e.target.value)}
                    className="text-xs font-medium text-fuchsia-100 bg-black/50 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                  >
                    <option value="1">1 hour</option>
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">1 day</option>
                    <option value="72">3 days</option>
                    <option value="168">7 days</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreatePoll}
                disabled={creatingPoll || !pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2}
                className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-red-600 hover:from-fuchsia-500 hover:to-red-500 text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-fuchsia-900/30 border border-white/10"
              >
                {creatingPoll ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</span>
                ) : (
                  "Publish Poll"
                )}
              </button>
            </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 gap-3">
            <div className="flex items-center gap-2">
              <MediaBar
                onMediaSelected={(url, file) => {
                  setMediaPreview(url);
                  if (file) {
                    setMediaFile(file);
                    setMediaIsVideo(isVideoFile(file));
                  }
                }}
                disabled={posting || uploading}
              />
              <button
                type="button"
                onClick={() => { setIsPaidPost(!isPaidPost); if (!isPaidPost) setIsPollMode(false); }}
                className={`touch-active flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  isPaidPost
                    ? "text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-lg shadow-amber-900/10"
                    : "text-zinc-500 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent"
                }`}
                title={isPaidPost ? "Make free" : "Premium content"}
              >
                {isPaidPost ? <Lock className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                <span className="hidden sm:inline font-medium">{isPaidPost ? "Premium" : "Monetize"}</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsPollMode(!isPollMode); if (!isPollMode) setIsPaidPost(false); }}
                className={`touch-active flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  isPollMode
                    ? "text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-900/10"
                    : "text-zinc-500 hover:text-fuchsia-300 hover:bg-fuchsia-500/10 border border-transparent"
                }`}
                title="Poll"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Poll</span>
              </button>
            </div>
            {uploading && (
              <span className="text-xs text-red-400/90 animate-pulse font-medium">Uploading…</span>
            )}
            <motion.button
              type="button"
              onClick={handlePost}
              disabled={(!newPost.trim() && !mediaFile) || posting}
              whileTap={
                reduceMotion || posting || (!newPost.trim() && !mediaFile)
                  ? undefined
                  : { scale: 0.97 }
              }
              className={`touch-active px-6 py-3 text-white text-[15px] font-semibold rounded-full disabled:opacity-40 disabled:cursor-not-allowed shadow-xl ${
                isPaidPost
                  ? "premium-button shadow-amber-900/30"
                  : "premium-button"
              }`}
            >
              {posting ? "Publishing…" : isPaidPost ? `Publish · ${paidPrice} SOL` : "Publish"}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Posts - Premium empty state */}
      {!isConnected && (
        <div className="premium-card rounded-[var(--clay-radius-2xl)] p-10 text-center border border-red-500/20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/25 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-red-500/15">
            <Shield className="w-9 h-9 text-red-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-premium-headline text-white tracking-[0.1em] mb-3">SINSOL</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">Connect your wallet to publish exclusive content, engage with creators, and earn on-chain.</p>
        </div>
      )}

      {/* On-chain public posts from all users */}
      {isConnected && (
        <motion.div
          className="mt-2"
          {...(reduceMotion
            ? { initial: false }
            : {
                variants: feedStaggerContainer,
                initial: "hidden",
                animate: "show",
              })}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-red-400/80" />
              </div>
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.2em]">Timeline</span>
            </div>
            <button
              type="button"
              onClick={fetchOnchainPosts}
              disabled={loadingOnchain}
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 disabled:opacity-50 transition-colors font-medium px-3 py-1.5 rounded-xl hover:bg-white/5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOnchain ? "animate-spin" : ""}`} />
              {loadingOnchain ? "Loading…" : "Refresh"}
            </button>
          </div>

          {onchainPosts.length === 0 && allPolls.length === 0 && !loadingOnchain && (
            <div className="premium-card rounded-2xl p-10 text-center border border-white/10">
              <p className="text-sm text-zinc-500">No posts yet. Create your first exclusive drop above.</p>
            </div>
          )}

          {/* Merge posts and polls into a single timeline sorted by createdAt */}
          {(() => {
            const feedItems: { type: "post" | "poll"; data: any; createdAt: number }[] = [
              // posts: createdAt is unix seconds on-chain → convert to ms
              ...onchainPosts.map(p => ({ type: "post" as const, data: p, createdAt: Number(p.createdAt) * 1000 })),
              // polls: createdAt already converted to ms in getAllPolls()
              ...allPolls.map(p => ({ type: "poll" as const, data: p, createdAt: Number(p.createdAt) })),
            ].sort((a, b) => b.createdAt - a.createdAt);

            return feedItems.map((item) => {
              if (item.type === "poll") {
                const poll = item.data;
                const profile = profileMap[poll.creator];
                const isMe = publicKey ? poll.creator === publicKey.toBase58() : false;
                return (
                  <motion.div
                    key={`poll-${poll.pubkey}`}
                    {...(reduceMotion ? { initial: false } : { variants: feedStaggerItem })}
                  >
                    <PollCard
                      poll={poll}
                      profile={profile}
                      isMe={isMe}
                      program={program}
                      myVote={myVotes[poll.pubkey] || null}
                      onVoted={() => {
                        setTimeout(() => fetchOnchainPosts(), 1500);
                      }}
                    />
                  </motion.div>
                );
              }
              const post = item.data;
              const profile = profileMap[post.author];
              const isMe = publicKey ? post.author === publicKey.toBase58() : false;
              return (
                <motion.div
                  key={post.publicKey}
                  id={`post-${post.publicKey}`}
                  className="rounded-2xl"
                  {...(reduceMotion ? { initial: false } : { variants: feedStaggerItem })}
                >
                  <OnChainPostCard
                    post={post}
                    profile={profile}
                    isMe={isMe}
                    program={program}
                    allComments={allComments}
                    allReactions={allReactions}
                    profileMap={profileMap}
                    onCommentAdded={refreshInteractions}
                    onReactionAdded={refreshInteractions}
                    defaultShowComments={focusPostKey === post.publicKey}
                    onRepost={async (content: string) => {
                      if (!program || !publicKey) return;
                      const postId = Date.now();
                      try {
                        await program.createPost(postId, content, false);
                        toast("success", "Repost published! 🔁", "On-chain");
                        setTimeout(() => fetchOnchainPosts(), 1500);
                      } catch (err: any) {
                        toast("error", "Repost failed", err?.message?.slice(0, 80) || "Try again");
                      }
                    }}
                    onDelete={() => {
                      setTimeout(() => fetchOnchainPosts(), 1500);
                    }}
                  />
                </motion.div>
              );
            });
          })()}
        </motion.div>
      )}
    </div>
  );
}
