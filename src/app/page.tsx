"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/usePrivyWallet";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Header from "@/components/Header";
import Feed from "@/components/Feed";
import Chat from "@/components/Chat";
import Payments from "@/components/Payments";
import Profile from "@/components/Profile";
import CreatorDashboard from "@/components/CreatorDashboard";
import Friends from "@/components/Friends";
import Tokens from "@/components/Tokens";
import Communities from "@/components/Communities";
import TrendingSidebar from "@/components/TrendingSidebar";
import ToastContainer from "@/components/Toast";
import Landing from "@/components/Landing";
import OnboardingDemo from "@/components/OnboardingDemo";
import ProfileSetup from "@/components/ProfileSetup";
import { useAppStore } from "@/lib/store";
import { useProgram } from "@/hooks/useProgram";

export default function Home() {
  const { activeTab, currentUser } = useAppStore();
  const { connected, publicKey } = useWallet();
  const program = useProgram();
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenDemo, setHasSeenDemo] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenDemo = localStorage.getItem("sinsol_onboarding_seen");
    setHasSeenDemo(!!hasSeenDemo);
    if (!hasSeenDemo && connected) {
      setShowOnboarding(true);
    }
  }, [connected]);

  useEffect(() => {
    if (!connected || !program || !publicKey || showOnboarding) return;
    if (currentUser) {
      setNeedsProfile(false);
      return;
    }
    let cancelled = false;
    const checkProfile = async () => {
      setCheckingProfile(true);
      try {
        const profile = await program.getProfile(publicKey);
        if (!cancelled) {
          setNeedsProfile(!profile);
        }
      } catch {
        if (!cancelled) setNeedsProfile(true);
      }
      if (!cancelled) setCheckingProfile(false);
    };
    checkProfile();
    return () => { cancelled = true; };
  }, [connected, program, publicKey, showOnboarding, currentUser]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-[28px] flex items-center justify-center mx-auto mb-3 bg-white/5 border border-white/10 overflow-hidden">
            <img src="/logo.png" alt="SinSol" className="w-full h-full object-contain p-2" />
          </div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">Loading SinSol...</p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-[#0A0A0A]">
        <ToastContainer />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Landing />
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("sinsol_onboarding_seen", "true");
    setShowOnboarding(false);
  };

  return (
    <>
      <ToastContainer />
      {showOnboarding && <OnboardingDemo onComplete={handleOnboardingComplete} />}
      {needsProfile && !showOnboarding && (
        <ProfileSetup onComplete={() => setNeedsProfile(false)} />
      )}
      <Sidebar />
      <div className="md:ml-20 lg:ml-22 h-screen flex flex-col bg-[#0A0A0A] overflow-hidden relative">
        {/* Red Background Blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 opacity-30">
          <div className="red-blob red-blob-crimson w-[40vw] h-[40vw] -top-[5%] -left-[5%]" />
          <div className="red-blob red-blob-maroon w-[30vw] h-[30vw] top-[15%] -right-[5%]" style={{ animationDelay: '3s' }} />
          <div className="red-blob red-blob-scarlet w-[25vw] h-[25vw] bottom-[10%] left-[25%]" style={{ animationDelay: '5s' }} />
        </div>
        
        <Header />
        <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 md:p-6 pb-[80px] md:pb-6 pt-0">
          {activeTab === "feed" && (
            <div className="flex gap-6 max-w-5xl mx-auto">
              <div className="flex-1 min-w-0">
                <Feed />
              </div>
              <div className="hidden lg:block sticky top-0 self-start pt-0">
                <TrendingSidebar />
              </div>
            </div>
          )}
          {activeTab === "chat" && <Chat />}
          {activeTab === "friends" && <Friends />}
          {activeTab === "tokens" && <Tokens />}
          {activeTab === "communities" && <Communities />}
          {activeTab === "payments" && <Payments />}
          {activeTab === "dashboard" && <CreatorDashboard />}
          {activeTab === "profile" && <Profile />}
        </main>
      </div>
      <MobileNav />
    </>
  );
}