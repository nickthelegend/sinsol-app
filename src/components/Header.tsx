"use client";

import { Shield, LogOut, Wallet, Bell, Sun, Moon } from "lucide-react";
import { useWallet } from "@/hooks/usePrivyWallet";
import { useAppStore, AppNotification } from "@/lib/store";
import { useProgram } from "@/hooks/useProgram";
import { useEffect, useState, useRef } from "react";
import ProfileSetup from "@/components/ProfileSetup";
import { useNotifications } from "@/hooks/useNotifications";

// UNIQUE ROUTE NAMES - Different from Shyft.lol
const titles: Record<string, string> = {
  feed: "TIMELINE",
  chat: "WHISPERS",
  friends: "SOULS",
  payments: "TRIBUTE",
  dashboard: "STUDIO",
  profile: "IDENTITY",
};

const subtitles: Record<string, string> = {
  feed: "Your encrypted timeline",
  chat: "E2E encrypted DMs",
  friends: "Find & follow souls",
  payments: "Private payments",
  dashboard: "Creator analytics",
  profile: "Your on-chain identity",
};

export default function Header() {
  const { activeTab, setCurrentUser, setConnected, notifications, markAllNotificationsRead, setActiveTab, theme, toggleTheme, navigateToProfile, setFocusPostKey } = useAppStore();
  const { publicKey, connected, login, logout, ready, authenticated } = useWallet();
  const program = useProgram();
  const [showSetup, setShowSetup] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setConnected(connected);
  }, [connected, setConnected]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setProfileLoaded(false);
      setShowSetup(false);
      setCurrentUser(null);
      return;
    }

    if (!program || !ready) return;
    if (profileLoaded) return;

    let cancelled = false;
    setProfileLoaded(true);

    const loadProfile = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const profile = await program.getProfile(publicKey);
          if (cancelled) return;
          if (profile && profile.username && profile.displayName) {
            console.log("✅ Profile found on-chain:", profile.username);
            setCurrentUser({
              publicKey: publicKey.toBase58(),
              username: profile.username,
              displayName: profile.displayName,
              avatar: profile.avatarUrl || "😈",
              bio: profile.bio || "",
              isPrivate: profile.isPrivate || false,
              followerCount: Number(profile.followerCount?.toString() || 0),
              followingCount: Number(profile.followingCount?.toString() || 0),
              createdAt: Number(profile.createdAt?.toString() || Date.now()),
              avatarUrl: profile.avatarUrl || "",
              bannerUrl: profile.bannerUrl || "",
            });
            setShowSetup(false);
            return;
          } else {
            console.log("📝 No profile found — showing setup");
            if (!cancelled) setShowSetup(true);
            return;
          }
        } catch (err: any) {
          console.warn(`Profile check attempt ${attempt + 1} failed:`, err?.message?.slice(0, 60));
          if (attempt < 2) await new Promise(r => setTimeout(r, 1500));
        }
      }
      if (!cancelled) {
        console.warn("❌ Profile check failed after 3 attempts — showing setup");
        setShowSetup(true);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [connected, publicKey, program, ready, profileLoaded, setCurrentUser]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  const notifIcon = (type: string) => {
    switch (type) {
      case "like": return "❤️";
      case "comment": return "💬";
      case "reaction": return "😈";
      case "repost": return "🔁";
      case "follow": return "👤";
      case "mention": return "🏷️";
      case "tip": return "💵";
      default: return "🔔";
    }
  };

  const notifMessage = (n: AppNotification) => {
    switch (n.type) {
      case "like": return <><strong>{n.actorName}</strong> liked your post</>;
      case "comment": return <><strong>{n.actorName}</strong> commented: &quot;{n.commentText}&quot;</>;
      case "reaction": return <><strong>{n.actorName}</strong> reacted to your post</>;
      case "repost": return <><strong>{n.actorName}</strong> reposted your post</>;
      case "follow": return <><strong>{n.actorName}</strong> followed you</>;
      case "mention": return <><strong>{n.actorName}</strong> mentioned you{n.commentText ? `: "${n.commentText}"` : ""}</>;
      case "tip": return <><strong>💵 {n.postPreview}</strong> — you got tipped!</>;
      default: return <><strong>{n.actorName}</strong> interacted with your content</>;
    }
  };

  const timeAgo = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  return (
    <>
      <header className="relative z-10 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="md:hidden w-11 h-11 sm:w-12 sm:h-12 rounded-[20px] premium-orb flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">🔥</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-premium-headline text-white tracking-wider">{titles[activeTab] || "TIMELINE"}</h2>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate tracking-wide">
                <span className="sm:hidden">{subtitles[activeTab] || "Encrypted"}</span>
                <span className="hidden sm:inline">Sin on Solana</span>
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2 flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
            >
              <span className="text-lg">🌙</span>
            </button>

            {/* Notification Bell */}
            {connected && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) {
                      markAllNotificationsRead();
                    }
                  }}
                  className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all hover:scale-105"
                >
                  <Bell className="w-4 h-4 text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold flex items-center justify-center px-1 animate-pulse shadow-lg shadow-red-500/30">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] premium-card z-50 overflow-hidden border border-white/10">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                      <h3 className="font-bold text-[15px] text-white font-premium-headline tracking-wide">NOTIFICATIONS</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead()}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-[60vh]">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <div className="text-4xl mb-3">🔔</div>
                          <p className="text-sm text-gray-500">No notifications yet</p>
                          <p className="text-xs text-gray-600 mt-2 max-w-[280px] mx-auto">When someone interacts with your content, you'll see it here.</p>
                        </div>
                      ) : (
                        notifications.slice(0, 30).map((n) => (
                          <div
                            key={n.id}
                            className={`w-full flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0 ${!n.read ? "bg-red-900/10" : ""}`}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (n.actorAddress && n.actorAddress !== "unknown" && n.actorAddress !== "") {
                                  navigateToProfile(n.actorAddress);
                                  setShowNotifications(false);
                                }
                              }}
                              className="flex-shrink-0 mt-0.5 cursor-pointer"
                            >
                              {n.actorAvatarUrl ? (
                                <img src={n.actorAvatarUrl} alt="" className="w-10 h-10 rounded-2xl object-cover border border-white/10" />
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-900/30 to-red-800/20 flex items-center justify-center text-sm border border-white/10">
                                  {n.type === "tip" ? "💵" : (n.actorName?.charAt(0)?.toUpperCase() || notifIcon(n.type))}
                                </div>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (n.type === "follow" && n.actorAddress) {
                                  navigateToProfile(n.actorAddress);
                                } else if (n.postKey) {
                                  setFocusPostKey(n.postKey);
                                  setActiveTab("feed");
                                }
                                setShowNotifications(false);
                              }}
                              className="flex-1 min-w-0 text-left cursor-pointer"
                            >
                              <p className="text-[13px] text-gray-300 leading-relaxed font-medium">
                                {notifMessage(n)}
                              </p>
                              {n.postPreview && n.type !== "follow" && n.type !== "mention" && (
                                <p className="text-[11px] text-gray-600 mt-1 truncate">
                                  {n.postPreview.startsWith("RT|") ? "Repost" : n.postPreview}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-600 mt-1">{timeAgo(n.timestamp)}</p>
                            </button>
                            {!n.read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wallet button */}
            {connected ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 rounded-[16px] hover:bg-white/10 hover:border-red-500/30 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
                <button
                  onClick={login}
                  disabled={!ready}
                  className="premium-button flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-[16px] disabled:opacity-50"
                >
                  {authenticated ? "Connecting..." : "Connect"}
                </button>
            )}
          </div>
        </div>
      </header>

      {showSetup && connected && (
        <ProfileSetup onComplete={() => setShowSetup(false)} />
      )}
    </>
  );
}