"use client";

import { TrendingUp } from "lucide-react";
import { 
  DashboardIcon,
  MixIcon,
  TokensIcon,
  GlobeIcon,
  BackpackIcon,
  ActivityLogIcon,
  PersonIcon,
  LightningBoltIcon,
  ThickArrowUpIcon
} from "@radix-ui/react-icons";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

// UNIQUE SIDEBAR NAV - Using Radix icons
const navItems = [
  { id: "feed", label: "Timeline", Icon: MixIcon },
  { id: "chat", label: "Whispers", Icon: LightningBoltIcon },
  { id: "friends", label: "Souls", Icon: PersonIcon },
  { id: "tokens", label: "Coins", Icon: TokensIcon },
  { id: "communities", label: "Circle", Icon: GlobeIcon },
  { id: "payments", label: "Tribute", Icon: BackpackIcon },
  { id: "dashboard", label: "Studio", Icon: DashboardIcon },
  { id: "profile", label: "Identity", Icon: PersonIcon },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, setViewingProfile, conversations } = useAppStore();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleNavClick = (tabId: string) => {
    if (tabId === "profile") setViewingProfile(null);
    setActiveTab(tabId);
  };

  return (
    <aside className="fixed left-0 top-0 hidden md:flex h-screen w-20 lg:w-[88px] flex-col items-center bg-[#080808]/95 backdrop-blur-2xl border-r border-white/[0.03] py-5 z-40">
      <nav className="flex flex-col items-center gap-2.5 w-full px-2">
        {/* Logo - Premium */}
        <button 
          onClick={() => handleNavClick("feed")}
          className="mb-6 group"
        >
          <div className="h-[52px] w-[52px] rounded-[26px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] group-hover:border-red-500/30 group-hover:shadow-lg group-hover:shadow-red-500/10 transition-all duration-500 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="SinSol" className="w-full h-full object-contain p-2.5 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </button>

        {navItems.map((item) => {
          const { Icon } = item;
          const isActive = activeTab === item.id;
          return (
            <IconButton
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              variant={isActive ? "solid" : "ghost"}
              size="md"
              badge={item.id === "chat" && totalUnread > 0 ? (totalUnread > 9 ? "9+" : totalUnread) : undefined}
              className={cn(
                "rounded-[18px]",
                !isActive && "text-zinc-600 hover:text-red-400"
              )}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
            </IconButton>
          );
        })}

        {/* Trending at bottom */}
        <div className="mt-auto pt-4">
          <IconButton
            onClick={() => handleNavClick("feed")}
            variant="ghost"
            size="md"
            className="rounded-[18px] text-zinc-600 hover:text-red-400"
            aria-label="Trending"
          >
            <ThickArrowUpIcon className="w-5 h-5" />
          </IconButton>
        </div>
      </nav>
    </aside>
  );
}