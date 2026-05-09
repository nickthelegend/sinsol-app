"use client";

import { cn } from "@/lib/utils";
import { ElementType, ComponentPropsWithoutRef, forwardRef } from "react";

interface SparkButtonProps<T extends ElementType = "button"> {
  as?: T;
  color?: string;
  speed?: string;
  className?: string;
  children?: React.ReactNode;
}

const SparkButton = forwardRef<
  HTMLButtonElement,
  SparkButtonProps & Omit<ComponentPropsWithoutRef<"button">, keyof SparkButtonProps>
>(({ as, className, color, speed = "5s", children, ...props }, ref) => {
  const Component = as || "button";
  const glowColor = color || "rgba(220, 38, 60, 0.8)";
  const content = children ?? "Click me";
  const pulseMs = speed;
  const spinMs =
    typeof speed === "string" && speed.endsWith("s")
      ? `${Math.max(2, parseFloat(speed) * 1.6)}s`
      : "8s";

  return (
    <Component
      ref={ref}
      className={cn(
        "relative isolate inline-flex items-center justify-center",
        "py-4 px-8 rounded-2xl font-semibold text-base",
        "text-white cursor-pointer",
        "transition-[transform,box-shadow] duration-300",
        "hover:shadow-[0_0_32px_-4px_rgba(220,38,38,0.35)]",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        /* Glow must bleed past edges — never clip it */
        "overflow-visible",
        className
      )}
      {...props}
    >
      {/* Soft outer halo (not clipped) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-[inherit] opacity-50 blur-2xl animate-glow-pulse will-change-[transform,opacity]"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${glowColor} 0%, transparent 65%)`,
          animationDuration: pulseMs,
        }}
      />
      {/* Spinning rim light */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-3px] z-[1] rounded-[inherit] opacity-35 mix-blend-screen animate-glow-spin will-change-transform"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${glowColor} 70deg, transparent 140deg, transparent 360deg)`,
          animationDuration: spinMs,
        }}
      />
      {/* Solid face */}
      <span
        aria-hidden
        className="absolute inset-0 z-[2] rounded-[inherit] border border-white/10 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg shadow-black/40"
      />
      <span className="relative z-[3]">{content}</span>
    </Component>
  );
});

SparkButton.displayName = "SparkButton";

export { SparkButton };
