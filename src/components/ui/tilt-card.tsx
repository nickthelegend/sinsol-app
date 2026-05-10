"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnabled?: boolean;
  scale?: number;
}

export function TiltCard({
  children,
  className,
  tiltAmount = 10,
  glareEnabled = true,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -tiltAmount;
    const rotateY = ((x - centerX) / centerX) * tiltAmount;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden",
        "transition-transform duration-200 ease-out",
        "will-change-transform",
        className
      )}
      style={{ transform }}
    >
      {children}
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          }}
        />
      )}
    </div>
  );
}

// 3D Card with premium styling
interface Premium3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function Premium3DCard({ children, className, glowColor = "rgba(220, 38, 60, 0.3)" }: Premium3DCardProps) {
  return (
    <TiltCard className={cn("group", className)}>
      <div
        className={cn(
          "relative w-full h-full",
          "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
          "border border-white/10",
          "rounded-2xl",
          "backdrop-blur-xl",
          "overflow-hidden"
        )}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </TiltCard>
  );
}
