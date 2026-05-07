"use client";

import { useState } from "react";
import { Home, MessageCircle, Users, Coins, Globe, Wallet, BarChart3, User, TrendingUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "feed", label: "Home", icon: Home },
  { id: "chat", label: "Messages", icon: MessageCircle },
  { id: "friends", label: "People", icon: Users },
  { id: "tokens", label: "Tokens", icon: Coins },
  { id: "communities", label: "Communities", icon: Globe },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, setViewingProfile, conversations } = useAppStore();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleNavClick = (tabId: string) => {
    if (tabId === "profile") setViewingProfile(null);
    setActiveTab(tabId);
  };

  return (
    <aside className="fixed left-0 top-0 hidden md:flex h-screen w-24 flex-col items-center bg-black/50 backdrop-blur-xl border-r border-purple-900/20 py-6 z-40">
      <nav className="flex flex-col items-center gap-3 w-full px-4">
        {/* Logo - Clay Orb Style */}
        <button 
          onClick={() => handleNavClick("feed")}
          className="mb-6 group"
        >
          <div className="h-14 w-14 rounded-[28px] bg-gradient-to-br from-[#e11d48] via-[#c026d3] to-[#fbbf24] shadow-xl shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
        </button>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-[24px] transition-all duration-300",
                isActive
                  ? "bg-gradient-to-b from-pink-600 to-pink-700 shadow-lg shadow-pink-500/30 text-white"
                  : "text-gray-400 hover:bg-purple-900/30 hover:text-white hover:scale-105"
              )}
            >
              <Icon className="h-6 w-6" />
              {item.id === "chat" && totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-600 text-[11px] font-bold text-white shadow-lg shadow-red-500/40">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
              {item.id === "notifications" && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-b from-pink-500 to-pink-600 shadow-lg shadow-pink-500/50" />
              )}
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}

        {/* Trending at bottom */}
        <div className="mt-auto pt-8">
          <button
            onClick={() => handleNavClick("feed")}
            className="flex h-14 w-14 items-center justify-center rounded-[24px] text-gray-400 hover:bg-purple-900/30 hover:text-white hover:scale-105 transition-all duration-300"
          >
            <TrendingUp className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </aside>
  );
}