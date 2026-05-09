"use client";

import { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter 
} from "./glass-card";
import { GlowingButton } from "./glowing-button";
import { SparkButton } from "./spark-button";
import { PremiumInput, PremiumTextarea } from "./premium-input";
import { TiltCard, Premium3DCard } from "./tilt-card";
import { AnimatedBadge, StatusBadge } from "./animated-badge";
import { FloatingActionButton } from "./floating-action-button";
import { IconButton } from "./icon-button";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Lock, 
  Wallet, 
  Plus, 
  Send,
  Home,
  User,
  Settings,
  Bell,
  Search,
  Heart,
  Share2,
  MessageCircle
} from "lucide-react";
import { 
  LightningBoltIcon, 
  TokensIcon, 
  LockClosedIcon,
  RocketIcon,
  PersonIcon,
  DashboardIcon
} from "@radix-ui/react-icons";

export function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Premium Components</h1>
          <p className="text-zinc-400">Beautiful, polished components from Magic MCP (21st.dev)</p>
        </div>

        {/* Glass Card */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Glass Card</h2>
          <GlassCard className="max-w-md">
            <GlassCardHeader>
              <GlassCardTitle>Welcome Back</GlassCardTitle>
              <GlassCardDescription>
                Sign in to your account to continue
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <PremiumInput placeholder="Enter your email" type="email" />
              <PremiumInput placeholder="Enter your password" type="password" />
            </GlassCardContent>
            <GlassCardFooter className="flex gap-3">
              <GlowingButton className="flex-1">Sign In</GlowingButton>
            </GlassCardFooter>
          </GlassCard>
        </section>

        {/* Glowing Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Glowing Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <GlowingButton variant="red">Red Glow</GlowingButton>
            <GlowingButton variant="blue">Blue Glow</GlowingButton>
            <GlowingButton variant="green">Green Glow</GlowingButton>
            <GlowingButton variant="amber">Amber Glow</GlowingButton>
          </div>
        </section>

        {/* Spark Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Spark Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <SparkButton color="rgba(220, 38, 60, 0.8)">
              <Zap className="w-4 h-4 mr-2" />
              Premium
            </SparkButton>
            <SparkButton color="rgba(37, 99, 235, 0.8)">
              <Shield className="w-4 h-4 mr-2" />
              Secure
            </SparkButton>
            <SparkButton color="rgba(16, 185, 129, 0.8)">
              <Lock className="w-4 h-4 mr-2" />
              Encrypted
            </SparkButton>
          </div>
        </section>

        {/* Premium Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Premium Inputs</h2>
          <div className="max-w-md space-y-4">
            <PremiumInput 
              placeholder="Search..." 
              icon={<Search className="w-4 h-4" />}
            />
            <PremiumInput 
              placeholder="Enter amount..." 
              icon={<Wallet className="w-4 h-4" />}
              rightElement={<span className="text-xs text-zinc-500">SOL</span>}
            />
            <PremiumTextarea 
              placeholder="Write a message..."
              className="min-h-[100px]"
            />
          </div>
        </section>

        {/* 3D Tilt Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3D Tilt Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TiltCard className="h-48">
              <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-red-900/10 rounded-2xl border border-red-500/20 p-6 flex flex-col justify-between">
                <LightningBoltIcon className="w-8 h-8 text-red-400" />
                <div>
                  <h3 className="text-white font-semibold">Fast</h3>
                  <p className="text-zinc-400 text-sm">Lightning quick transactions</p>
                </div>
              </div>
            </TiltCard>
            <TiltCard className="h-48">
              <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 rounded-2xl border border-emerald-500/20 p-6 flex flex-col justify-between">
                <LockClosedIcon className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-white font-semibold">Secure</h3>
                  <p className="text-zinc-400 text-sm">End-to-end encryption</p>
                </div>
              </div>
            </TiltCard>
            <TiltCard className="h-48">
              <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-900/10 rounded-2xl border border-amber-500/20 p-6 flex flex-col justify-between">
                <TokensIcon className="w-8 h-8 text-amber-400" />
                <div>
                  <h3 className="text-white font-semibold">Premium</h3>
                  <p className="text-zinc-400 text-sm">Exclusive content access</p>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* Premium 3D Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Premium 3D Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Premium3DCard className="h-56" glowColor="rgba(220, 38, 60, 0.3)">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <AnimatedBadge variant="red" pulse>Live</AnimatedBadge>
                  <Heart className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">Creator Token</h3>
                  <p className="text-zinc-400 text-sm">Launch your own token and monetize your content.</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <SparkButton color="rgba(220, 38, 60, 0.6)" className="py-2 px-4 text-sm">
                    Launch
                  </SparkButton>
                </div>
              </div>
            </Premium3DCard>
          </div>
        </section>

        {/* Animated Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Animated Badges</h2>
          <div className="flex flex-wrap gap-3">
            <AnimatedBadge variant="default">Default</AnimatedBadge>
            <AnimatedBadge variant="red" pulse>Live</AnimatedBadge>
            <AnimatedBadge variant="green" shimmer>Premium</AnimatedBadge>
            <AnimatedBadge variant="amber">Beta</AnimatedBadge>
            <AnimatedBadge variant="blue">New</AnimatedBadge>
            <AnimatedBadge variant="purple">Pro</AnimatedBadge>
          </div>
        </section>

        {/* Status Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Status Badges</h2>
          <div className="flex flex-wrap gap-6">
            <StatusBadge status="online" />
            <StatusBadge status="offline" />
            <StatusBadge status="away" />
            <StatusBadge status="busy" />
          </div>
        </section>

        {/* Floating Action Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Floating Action Buttons</h2>
          <div className="flex flex-wrap gap-6 items-end">
            <FloatingActionButton size="sm" variant="default">
              <Plus className="w-4 h-4" />
            </FloatingActionButton>
            <FloatingActionButton size="md" variant="gradient">
              <Send className="w-6 h-6" />
            </FloatingActionButton>
            <FloatingActionButton size="lg" variant="glow">
              <Sparkles className="w-7 h-7" />
            </FloatingActionButton>
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Icon Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <IconButton variant="default"><Home className="w-5 h-5" /></IconButton>
            <IconButton variant="ghost"><User className="w-5 h-5" /></IconButton>
            <IconButton variant="outline"><Settings className="w-5 h-5" /></IconButton>
            <IconButton variant="solid"><Zap className="w-5 h-5" /></IconButton>
            <IconButton variant="soft"><Shield className="w-5 h-5" /></IconButton>
            <IconButton variant="default" badge={3}><Bell className="w-5 h-5" /></IconButton>
            <IconButton variant="default" isLoading><Home className="w-5 h-5" /></IconButton>
          </div>
        </section>

        {/* Radix Icons Showcase */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Radix Icons</h2>
          <div className="flex flex-wrap gap-3">
            <IconButton variant="default"><DashboardIcon className="w-5 h-5" /></IconButton>
            <IconButton variant="default"><LightningBoltIcon className="w-5 h-5" /></IconButton>
            <IconButton variant="default"><PersonIcon className="w-5 h-5" /></IconButton>
            <IconButton variant="default"><TokensIcon className="w-5 h-5" /></IconButton>
            <IconButton variant="default"><LockClosedIcon className="w-5 h-5" /></IconButton>
            <IconButton variant="default"><RocketIcon className="w-5 h-5" /></IconButton>
          </div>
        </section>
      </div>
    </div>
  );
}
