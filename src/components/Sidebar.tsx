"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, Bell, User, MessageCircle, BarChart3, Coins } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { activeTab, setActiveTab, setViewingProfile, conversations } = useAppStore();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/create", icon: Plus, label: "Create" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/tokens", icon: Coins, label: "Tokens" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 hidden md:flex h-screen w-20 flex-col items-center border-r border-purple-900/30 bg-black py-6 z-40">
      <nav className="flex flex-col items-center gap-6 w-full">
        {/* Logo */}
        <Link href="/" className="mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#e11d48] via-[#c026d3] to-[#fbbf24] shadow-lg shadow-purple-900/50" />
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                active
                  ? "bg-purple-900/50 text-purple-400 shadow-lg shadow-purple-900/30"
                  : "text-gray-500 hover:bg-purple-900/20 hover:text-purple-300"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.href === "/messages" && totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e11d48] text-[10px] font-bold text-white">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
              {item.href === "/notifications" && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#e11d48]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}