"use client";

import { useState } from "react";
import { Home, MessageCircle, Users, Coins, Globe, Wallet, BarChart3, User, TrendingUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// UNIQUE SIDEBAR NAV - Different labels from Shyft.lol
const navItems = [
  { id: "feed", label: "Timeline", icon: Home },
  { id: "chat", label: "Whispers", icon: MessageCircle },
  { id: "friends", label: "Souls", icon: Users },
  { id: "tokens", label: "Coins", icon: Coins },
  { id: "communities", label: "Circle", icon: Globe },
  { id: "payments", label: "Tribute", icon: Wallet },
  { id: "dashboard", label: "Studio", icon: BarChart3 },
  { id: "profile", label: "Identity", icon: User },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, setViewingProfile, conversations } = useAppStore();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleNavClick = (tabId: string) => {
    if (tabId === "profile") setViewingProfile(null);
    setActiveTab(tabId);
  };

  return (
    <aside className="fixed left-0 top-0 hidden md:flex h-screen w-20 lg:w-22 flex-col items-center bg-[#0A0A0A]/90 backdrop-blur-xl border-r border-white/5 py-4 z-40">
      <nav className="flex flex-col items-center gap-2 w-full px-3">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick("feed")}
          className="mb-4 group"
        >
          <div className="h-12 w-12 lg:h-13 lg:w-13 rounded-[24px] bg-white/5 border border-white/10 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="SinSol" className="w-full h-full object-contain p-2" />
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
                "relative flex h-12 w-12 lg:h-13 lg:w-13 items-center justify-center rounded-[20px] transition-all duration-200",
                isActive
                  ? "premium-button text-white shadow-lg shadow-red-500/20"
                  : "text-gray-500 hover:bg-white/5 hover:text-red-400 hover:scale-105 bg-transparent"
              )}
            >
              <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
              {item.id === "chat" && totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-[10px] font-bold text-white shadow-md shadow-red-500/30">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}

        {/* Trending at bottom */}
        <div className="mt-auto pt-6">
          <button
            onClick={() => handleNavClick("feed")}
            className="flex h-12 w-12 lg:h-13 lg:w-13 items-center justify-center rounded-[20px] text-gray-500 hover:bg-white/5 hover:text-red-400 hover:scale-105 transition-all duration-200 bg-transparent"
          >
            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>
      </nav>
    </aside>
  );
}