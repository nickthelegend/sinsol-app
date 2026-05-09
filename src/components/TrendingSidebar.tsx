"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Flame, Users } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@/hooks/usePrivyWallet";
import ProfileHoverCard from "@/components/ProfileHoverCard";

/** Parse paid post prefix */
function parsePaidContent(content: string): string {
  if (content.startsWith("PAID|")) {
    const secondPipe = content.indexOf("|", content.indexOf("|") + 1);
    if (secondPipe !== -1) return content.substring(secondPipe + 1);
  }
  return content;
}

/** Strip media URLs and clean up post text for preview */
function getPreviewText(content: string): string {
  let text = parsePaidContent(content);
  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, "").trim();
  // Remove REPOST| prefix
  if (text.startsWith("REPOST|")) {
    const pipe = text.indexOf("|", 7);
    text = pipe !== -1 ? "🔁 " + text.substring(pipe + 1) : text;
  }
  return text.slice(0, 80) + (text.length > 80 ? "…" : "");
}

interface TrendingPost {
  publicKey: string;
  author: string;
  content: string;
  likes: number;
  commentCount: number;
  createdAt: number;
  score: number;
}

export default function TrendingSidebar() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [trending, setTrending] = useState<TrendingPost[]>([]);
  const [topCreators, setTopCreators] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, users: 0, polls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!program || !publicKey) return;
    let cancelled = false;

    const fetch = async () => {
      try {
        const [posts, profiles, polls] = await Promise.all([
          program.getAllPosts(),
          program.getAllProfiles(),
          program.getAllPolls(),
        ]);

        if (cancelled) return;

        // Filter out community posts
        const publicPosts = posts.filter(
          (p: any) => !p.content.startsWith("COMM|") && (!p.isPrivate || p.content.startsWith("PAID|"))
        );

        // Score posts: likes + comments*2
        const scored: TrendingPost[] = publicPosts.map((p: any) => {
          const likes = parseInt(p.likes) || 0;
          const comments = parseInt(p.commentCount) || 0;
          return {
            publicKey: p.publicKey,
            author: p.author,
            content: p.content,
            likes,
            commentCount: comments,
            createdAt: Number(p.createdAt),
            score: likes + comments * 2,
          };
        });

        // Top 5 by score (must have at least some engagement, or just top 5)
        const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 5);
        setTrending(sorted);

        // Top creators by follower count
        const profileMap: Record<string, any> = {};
        profiles.forEach((p: any) => { profileMap[p.owner] = p; });

        const creators = profiles
          .filter((p: any) => p.owner !== publicKey?.toBase58())
          .sort((a: any, b: any) => (parseInt(b.followerCount || "0") || 0) - (parseInt(a.followerCount || "0") || 0))
          .slice(0, 5);
        setTopCreators(creators);

        setStats({
          posts: publicPosts.length,
          users: profiles.length,
          polls: polls.length,
        });
      } catch (err) {
        console.error("Trending fetch error:", err);
      }
      if (!cancelled) setLoading(false);
    };

    fetch();
    // Refresh every 60s
    const interval = setInterval(fetch, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [program, publicKey]);

  const scrollToPost = (postKey: string) => {
    const el = document.getElementById(`post-${postKey}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-red-500/70", "ring-offset-2", "ring-offset-[#0A0A0A]");
      setTimeout(() => el.classList.remove("ring-2", "ring-red-500/70", "ring-offset-2", "ring-offset-[#0A0A0A]"), 2500);
    }
  };

  if (loading) {
    return (
      <div className="w-72 flex-shrink-0 space-y-4">
        <div className="rounded-[var(--clay-radius-lg)] border border-white/[0.08] bg-[#0c0c0c] p-4 shadow-[0_0_0_1px_rgba(220,38,38,0.06)] animate-pulse">
          <div className="h-5 bg-white/[0.06] rounded-lg w-28 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-white/[0.06] rounded w-full" />
                <div className="h-3 bg-white/[0.06] rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sidebarCardClass =
    "rounded-[var(--clay-radius-lg)] border border-white/[0.08] bg-[#0c0c0c] overflow-hidden shadow-[0_0_0_1px_rgba(220,38,38,0.05)]";
  const sidebarHeaderClass =
    "px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-red-950/35 via-zinc-950/80 to-zinc-950/90";

  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      {/* Trending Posts */}
      <div className={sidebarCardClass}>
        <div className={sidebarHeaderClass}>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-white tracking-[0.18em] uppercase">Trending</span>
          </div>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {trending.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-zinc-500">No trending posts yet</p>
            </div>
          ) : (
            trending.map((post, idx) => {
              const preview = getPreviewText(post.content);
              if (!preview) return null;
              return (
                <button
                  key={post.publicKey}
                  onClick={() => scrollToPost(post.publicKey)}
                  className="w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-[11px] font-bold text-red-500/70 mt-0.5 w-4 flex-shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-zinc-200 leading-snug line-clamp-2 group-hover:text-red-300/95 transition-colors">
                        {preview}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                          <Heart className="w-3 h-3 text-red-500/40" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                          <MessageCircle className="w-3 h-3 text-zinc-600" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Who to Follow */}
      {topCreators.length > 0 && (
        <div className={sidebarCardClass}>
          <div className={sidebarHeaderClass}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" />
              <span className="text-xs font-semibold text-white tracking-[0.14em] uppercase">Who to Follow</span>
            </div>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {topCreators.slice(0, 4).map((creator: any) => (
              <ProfileHoverCard
                key={creator.owner}
                walletAddress={creator.owner}
                profile={creator}
              >
                <div className="px-4 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    {creator.avatarUrl ? (
                      <img src={creator.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-950/90 to-zinc-900 flex items-center justify-center text-xs font-bold text-red-400/90 flex-shrink-0 ring-1 ring-red-500/20">
                        {(creator.displayName || creator.username || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-zinc-100 truncate">
                        {creator.displayName || creator.username}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        @{creator.username}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-500 flex-shrink-0 tabular-nums">
                      {parseInt(creator.followerCount || "0") || 0} followers
                    </span>
                  </div>
                </div>
              </ProfileHoverCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
