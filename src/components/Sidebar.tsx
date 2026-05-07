"use client";

import { useState } from "react";
import { Home, MessageCircle, Users, Coins, Globe, Wallet, BarChart3, User, Bell, Plus, TrendingUp } from "lucide-react";
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
    <aside className="fixed left-0 top-0 hidden md:flex h-screen w-20 flex-col items-center border-r border-purple-900/30 bg-black py-6 z-40">
      <nav className="flex flex-col items-center gap-1 w-full px-3">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick("feed")}
          className="mb-4"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#e11d48] via-[#c026d3] to-[#fbbf24] shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 transition-shadow" />
        </button>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                isActive
                  ? "bg-purple-900/50 text-purple-400 shadow-lg shadow-purple-900/30"
                  : "text-gray-500 hover:bg-purple-900/20 hover:text-purple-300"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.id === "chat" && totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e11d48] text-[10px] font-bold text-white">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}

        {/* Trending at bottom */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => handleNavClick("feed")}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-gray-500 hover:bg-purple-900/20 hover:text-purple-300"
          >
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </aside>
  );
}