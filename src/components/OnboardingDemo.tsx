"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X, Lock, MessageCircle, Zap, User, Shield } from "lucide-react";

interface OnboardingDemoProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "Welcome to SinSol",
    subtitle: "On-Chain Social on Solana",
    description: "Your posts, chats, and identity — all living on the blockchain",
    icon: Shield,
    gradient: "from-red-600 to-red-950",
    highlightText: "Zero gas fees · Powered by Solana",
  },
  {
    id: 2,
    title: "On-Chain Feed",
    subtitle: "Share Your Thoughts",
    description: "Post on-chain for everyone to see. Build your social graph with followers and following.",
    icon: Lock,
    gradient: "from-rose-500 to-red-950",
    features: ["On-Chain Posts", "Social Graph", "Session Keys"],
  },
  {
    id: 3,
    title: "Encrypted Messaging",
    subtitle: "Chat Securely",
    description: "End-to-end encrypted messages using NaCl Box. Only you and your recipient can read them.",
    icon: MessageCircle,
    gradient: "from-red-500 via-rose-900 to-zinc-950",
    features: ["E2E Encrypted", "On-Chain Messages", "Key Exchange"],
  },
  {
    id: 4,
    title: "Instant Payments",
    subtitle: "Send SOL to Friends",
    description: "Send SOL directly to anyone on Solana. Fast, cheap, and recorded on-chain.",
    icon: Zap,
    gradient: "from-amber-500 to-red-900",
    features: ["Direct SOL Transfers", "On-Chain Records", "Instant Settlement"],
  },
  {
    id: 5,
    title: "On-Chain Identity",
    subtitle: "Your Profile",
    description: "Build your reputation on-chain while maintaining privacy where it matters.",
    icon: User,
    gradient: "from-rose-400 to-red-950",
    features: ["Verifiable Profile", "Follow Network", "On-Chain Identity"],
  },
  {
    id: 6,
    title: "Ready to Begin?",
    subtitle: "Own Your Social",
    description: "Start sharing, chatting, and transacting — all fully on-chain with zero gas fees.",
    icon: Shield,
    gradient: "from-red-500 to-rose-950",
    cta: true,
  },
];

const iconWrapClass =
  "w-20 h-20 rounded-2xl bg-red-950/40 border border-red-500/20 shadow-[0_0_32px_rgba(220,38,38,0.12)] backdrop-blur-sm flex items-center justify-center mb-6 animate-fade-in";

export default function OnboardingDemo({ onComplete }: OnboardingDemoProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        onComplete();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentSlide, onComplete]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_60px_rgba(220,38,38,0.06)] overflow-hidden border border-red-500/10">
        {/* Close Button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close onboarding"
        >
          <X className="w-6 h-6 text-zinc-400" />
        </button>

        {/* Content */}
        <div className="relative min-h-[500px] flex flex-col">
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-5`} />

          {/* Main Content */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
            {/* Icon */}
            <div className={iconWrapClass}>
              <Icon className="w-10 h-10 text-red-400" strokeWidth={1.75} />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-premium-headline tracking-[0.08em] text-white mb-2 animate-fade-in">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className={`text-lg font-semibold bg-gradient-to-r ${slide.gradient} text-transparent bg-clip-text mb-4 animate-fade-in`}>
              {slide.subtitle}
            </p>

            {/* Description */}
            <p className="text-zinc-400 text-lg mb-8 max-w-md animate-fade-in">
              {slide.description}
            </p>

            {/* Features List */}
            {slide.features && (
              <div className="space-y-3 mb-8 w-full max-w-sm">
                {slide.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.gradient}`} />
                    <span className="text-zinc-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Highlight Text */}
            {slide.highlightText && (
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-950/50 to-zinc-900/60 rounded-full mb-8 border border-red-500/20">
                <p className="text-sm font-medium text-zinc-200 tracking-wide">{slide.highlightText}</p>
              </div>
            )}
          </div>

          {/* Progress & Controls */}
          <div className="relative border-t border-white/[0.06] px-8 py-6 bg-zinc-950/80">
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? `h-3 w-8 bg-gradient-to-r ${slide.gradient}`
                      : "h-2.5 w-2.5 bg-zinc-600 hover:bg-zinc-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <p className="text-center text-sm text-zinc-400 mb-6">
              {currentSlide + 1} of {slides.length}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={onComplete}
                className="px-6 py-2.5 rounded-lg text-zinc-400 font-semibold hover:bg-white/10 transition-colors"
              >
                Skip
              </button>

              {currentSlide < slides.length - 1 && (
                <button
                  onClick={handleNext}
                  className={`px-8 py-2.5 rounded-lg bg-gradient-to-r ${slide.gradient} text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2`}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentSlide === slides.length - 1 && (
                <button
                  onClick={onComplete}
                  className={`px-8 py-2.5 rounded-lg bg-gradient-to-r ${slide.gradient} text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2`}
                >
                  Start Exploring <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Auto-play Indicator */}
            {currentSlide < slides.length - 1 && (
              <div className="mt-4 text-center text-xs text-zinc-500">
                Slides advance automatically
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
