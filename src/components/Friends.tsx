"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, UserCheck, Users, RefreshCw, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@/hooks/usePrivyWallet";
import { PublicKey } from "@solana/web3.js";
import { clearRpcCache } from "@/lib/program";

interface SearchResult {
  owner: string;
  username: string;
  displayName: string;
}

export default function Friends() {
  const { isConnected, navigateToProfile } = useAppStore();
  const program = useProgram();
  const { publicKey } = useWallet();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [followingUser, setFollowingUser] = useState<string | null>(null);
  const [unfollowingUser, setUnfollowingUser] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"search" | "following" | "followers">("search");

  // Fetch follow data
  const fetchFollowData = async () => {
    if (!program || !publicKey) return;
    setLoading(true);
    clearRpcCache();
    try {
      const [followingList, followersList, profiles] = await Promise.all([
        program.getFollowing(publicKey),
        program.getFollowers(publicKey),
        program.getAllProfiles(),
      ]);

      setFollowing(followingList);
      setFollowers(followersList);

      const map: Record<string, any> = {};
      profiles.forEach((p: any) => { map[p.owner] = p; });
      setProfileMap(map);
    } catch (err) {
      console.error("Failed to fetch follow data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFollowData();
  }, [program, publicKey]);

  // Search by username
  const handleSearch = async () => {
    if (!searchQuery.trim() || !program) return;
    setSearching(true);
    try {
      const results = await program.searchByUsername(searchQuery.trim());
      const myAddr = publicKey?.toBase58() || "";
      setSearchResults(results.filter((r) => r.owner !== myAddr));
    } catch (err) {
      console.error("Search error:", err);
    }
    setSearching(false);
  };

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(handleSearch, 400);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, program]);

  // Follow user
  const handleFollow = async (targetAddress: string) => {
    if (!program || followingUser) return;
    setFollowingUser(targetAddress);
    try {
      const targetPubkey = new PublicKey(targetAddress);
      await program.followUser(targetPubkey);
      toast("success", "Following! 🎉", "You're now following this user");
      setSearchQuery("");
      setSearchResults([]);
      await fetchFollowData();
    } catch (err: any) {
      console.error("Follow error:", err);
      if (err?.message?.includes("User rejected")) {
        toast("error", "Cancelled", "You rejected the transaction");
      } else if (err?.message?.includes("already in use") || err?.message?.includes("AlreadyFollowing")) {
        toast("error", "Already following", "You're already following this user");
      } else {
        toast("error", "Failed to follow", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setFollowingUser(null);
  };

  // Unfollow user
  const handleUnfollow = async (targetAddress: string) => {
    if (!program || unfollowingUser) return;
    setUnfollowingUser(targetAddress);
    try {
      const targetPubkey = new PublicKey(targetAddress);
      await program.unfollowUser(targetPubkey);
      toast("success", "Unfollowed", "You've unfollowed this user");
      await fetchFollowData();
    } catch (err: any) {
      console.error("Unfollow error:", err);
      if (err?.message?.includes("User rejected")) {
        toast("error", "Cancelled", "You rejected the transaction");
      } else {
        toast("error", "Failed to unfollow", err?.message?.slice(0, 80) || "Please try again");
      }
    }
    setUnfollowingUser(null);
  };

  // Helper: get follow status of a search result
  const getFollowStatus = (ownerAddr: string): "none" | "following" | "follows_you" | "mutual" => {
    const iFollow = following.includes(ownerAddr);
    const theyFollow = followers.includes(ownerAddr);
    if (iFollow && theyFollow) return "mutual";
    if (iFollow) return "following";
    if (theyFollow) return "follows_you";
    return "none";
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="premium-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/30 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Souls</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">Connect your wallet to discover creators and follow them on-chain.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Section Tabs */}
      <div className="flex gap-1 bg-zinc-900/50 rounded-xl p-1 border border-white/[0.06]">
        {[
          { id: "search" as const, label: "Discover", icon: Search, count: 0 },
          { id: "following" as const, label: "Following", icon: UserPlus, count: following.length },
          { id: "followers" as const, label: "Followers", icon: Users, count: followers.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === tab.id
                ? "bg-zinc-800/80 text-red-400 border border-red-500/20 shadow-lg shadow-red-900/10"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" strokeWidth={2} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                activeSection === tab.id ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search / Discover Section */}
      {activeSection === "search" && (
        <div className="space-y-3">
          <div className="premium-card p-4">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={2} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or display name..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {searching && (
              <div className="flex items-center justify-center py-6">
                <RefreshCw className="w-4 h-4 animate-spin text-red-400 mr-2" strokeWidth={2} />
                <span className="text-sm text-zinc-500">Searching on-chain profiles...</span>
              </div>
            )}

            {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-600">No users found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {searchResults.map((result) => {
                  const status = getFollowStatus(result.owner);
                  return (
                    <div key={result.owner} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 hover:bg-zinc-800/50 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                      <button type="button" onClick={() => navigateToProfile(result.owner)} className="flex-shrink-0 cursor-pointer">
                      {profileMap[result.owner]?.avatarUrl ? (
                        <img src={profileMap[result.owner].avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/[0.08] flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900/30 to-red-950/20 border border-white/[0.08] flex items-center justify-center text-sm font-semibold text-red-400 flex-shrink-0">
                          {(result.displayName || result.username || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => navigateToProfile(result.owner)} className="font-semibold text-white text-sm truncate hover:text-red-400 transition-colors cursor-pointer">{result.displayName || result.username}</button>
                          {status === "mutual" && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium border border-red-500/20">Mutual</span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500">@{result.username}</span>
                      </div>
                      <div className="flex-shrink-0">
                        {(status === "following" || status === "mutual") ? (
                          <button
                            onClick={() => handleUnfollow(result.owner)}
                            disabled={unfollowingUser === result.owner}
                            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 bg-zinc-900/50 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                          >
                            {unfollowingUser === result.owner ? (
                              <><RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Unfollowing...</>
                            ) : (
                              <><UserCheck className="w-3.5 h-3.5" strokeWidth={2} /> Following</>
                            )}
                          </button>
                        ) : status === "follows_you" ? (
                          <button
                            onClick={() => handleFollow(result.owner)}
                            disabled={followingUser === result.owner}
                            className="inline-flex items-center gap-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-red-900/20"
                          >
                            {followingUser === result.owner ? (
                              <><RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Following...</>
                            ) : (
                              <><UserPlus className="w-3.5 h-3.5" strokeWidth={2} /> Follow Back</>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollow(result.owner)}
                            disabled={followingUser === result.owner}
                            className="inline-flex items-center gap-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-red-900/20"
                          >
                            {followingUser === result.owner ? (
                              <><RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Following...</>
                            ) : (
                              <><UserPlus className="w-3.5 h-3.5" strokeWidth={2} /> Follow</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {searchQuery.length < 2 && !searching && (
            <div className="premium-card p-6 text-center">
              <Search className="w-8 h-8 text-zinc-600 mx-auto mb-2" strokeWidth={2} />
              <p className="text-sm text-zinc-500">Discover creators by their username or display name</p>
              <p className="text-xs text-zinc-600 mt-1">Type at least 2 characters to start searching</p>
            </div>
          )}
        </div>
      )}

      {/* Following Section */}
      {activeSection === "following" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Following</h3>
            <button
              onClick={fetchFollowData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={2} />
              Refresh
            </button>
          </div>

          {following.length === 0 ? (
            <div className="premium-card p-6 text-center">
              <UserPlus className="w-8 h-8 text-zinc-600 mx-auto mb-2" strokeWidth={2} />
              <p className="text-sm text-zinc-500">Not following anyone yet</p>
              <p className="text-xs text-zinc-600 mt-1">Search for creators to follow!</p>
            </div>
          ) : (
            following.map((addr) => {
              const profile = profileMap[addr];
              const name = profile?.displayName || addr.slice(0, 4) + "..." + addr.slice(-4);
              const username = profile?.username || addr.slice(0, 8);
              const theyFollowBack = followers.includes(addr);
              return (
                <div key={addr} className="premium-card p-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigateToProfile(addr)} className="flex-shrink-0 cursor-pointer">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover border border-white/[0.08] flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-900/30 to-red-950/20 border border-white/[0.08] flex items-center justify-center text-sm font-semibold text-red-400 flex-shrink-0">
                        {name.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => navigateToProfile(addr)} className="font-semibold text-white text-sm truncate hover:text-red-400 transition-colors cursor-pointer">{name}</button>
                        <span className="text-xs text-zinc-500">@{username}</span>
                        {theyFollowBack && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium border border-red-500/20">Mutual</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-red-400/80 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/15">
                          <Globe className="w-2 h-2" strokeWidth={2} /> chain
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnfollow(addr)}
                      disabled={unfollowingUser === addr}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 bg-zinc-900/50 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 px-3 py-2 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
                    >
                      {unfollowingUser === addr ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                      ) : (
                        <UserMinus className="w-3.5 h-3.5" strokeWidth={2} />
                      )}
                      {unfollowingUser === addr ? "Unfollowing..." : "Unfollow"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Followers Section */}
      {activeSection === "followers" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Followers</h3>
            <button
              onClick={fetchFollowData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={2} />
              Refresh
            </button>
          </div>

          {followers.length === 0 ? (
            <div className="premium-card p-6 text-center">
              <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2" strokeWidth={2} />
              <p className="text-sm text-zinc-500">No followers yet</p>
              <p className="text-xs text-zinc-600 mt-1">When someone follows you, they&apos;ll appear here</p>
            </div>
          ) : (
            followers.map((addr) => {
              const profile = profileMap[addr];
              const name = profile?.displayName || addr.slice(0, 4) + "..." + addr.slice(-4);
              const username = profile?.username || addr.slice(0, 8);
              const iFollowThem = following.includes(addr);
              return (
                <div key={addr} className="premium-card p-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigateToProfile(addr)} className="flex-shrink-0 cursor-pointer">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover border border-white/[0.08] flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-900/30 to-red-950/20 border border-white/[0.08] flex items-center justify-center text-sm font-semibold text-red-400 flex-shrink-0">
                        {name.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => navigateToProfile(addr)} className="font-semibold text-white text-sm truncate hover:text-red-400 transition-colors cursor-pointer">{name}</button>
                        <span className="text-xs text-zinc-500">@{username}</span>
                        {iFollowThem && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium border border-red-500/20">Mutual</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-zinc-500">Follows you</span>
                      </div>
                    </div>
                    {iFollowThem ? (
                      <button
                        onClick={() => handleUnfollow(addr)}
                        disabled={unfollowingUser === addr}
                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 bg-zinc-900/50 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 px-3 py-2 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
                      >
                        {unfollowingUser === addr ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" strokeWidth={2} />
                        )}
                        {unfollowingUser === addr ? "..." : "Following"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(addr)}
                        disabled={followingUser === addr}
                        className="inline-flex items-center gap-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-all disabled:opacity-50 flex-shrink-0 shadow-lg shadow-red-900/20"
                      >
                        {followingUser === addr ? (
                          <><RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Following...</>
                        ) : (
                          <><UserPlus className="w-3.5 h-3.5" strokeWidth={2} /> Follow Back</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
