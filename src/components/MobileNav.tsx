"use client";

import { Newspaper, MessageCircle, Wallet, User, Coins } from "lucide-react";
import { useAppStore } from "@/lib/store";

// UNIQUE MOBILE NAV - Different from Shyft.lol
const navItems = [
  { id: "feed", label: "Timeline", icon: Newspaper },
  { id: "chat", label: "Whispers", icon: MessageCircle },
  { id: "tokens", label: "Coins", icon: Coins },
  { id: "payments", label: "Tribute", icon: Wallet },
  { id: "profile", label: "Me", icon: User },
];

export default function MobileNav() {
  const { activeTab, setActiveTab, setViewingProfile, conversations } = useAppStore();
  const handleNavClick = (tabId: string) => {
    if (tabId === "profile") setViewingProfile(null);
    setActiveTab(tabId);
  };
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[56px] py-2 px-3 rounded-[20px] transition-all duration-200 ${
                isActive 
                  ? "text-red-400" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-red-500/10 rounded-[20px] shadow-inner shadow-red-500/10" />
              )}
              <div className="relative">
                <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.id === "chat" && totalUnread > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-md shadow-red-500/30">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? "text-red-400" : "text-gray-500"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}