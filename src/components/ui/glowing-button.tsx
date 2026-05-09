"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GlowingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  glowColor?: string;
  variant?: "default" | "red" | "blue" | "green" | "amber";
}

function hexToRgba(hex: string, alpha: number = 1): string {
  let hexValue = hex.replace("#", "");

  if (hexValue.length === 3) {
    hexValue = hexValue
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(220, 38, 60, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const GlowingButton = forwardRef<HTMLButtonElement, GlowingButtonProps>(
  ({ children, className, glowColor, variant = "red", ...props }, ref) => {
    const colorMap = {
      default: "#DC2626",
      red: "#DC2626",
      blue: "#2563EB",
      green: "#10B981",
      amber: "#F59E0B",
    };

    const actualGlowColor = glowColor || colorMap[variant];
    const glowColorRgba = hexToRgba(actualGlowColor);
    const glowColorVia = hexToRgba(actualGlowColor, 0.075);
    const glowColorTo = hexToRgba(actualGlowColor, 0.2);

    return (
      <button
        ref={ref}
        style={
          {
            "--glow-color": glowColorRgba,
            "--glow-color-via": glowColorVia,
            "--glow-color-to": glowColorTo,
          } as React.CSSProperties
        }
        className={cn(
          "relative inline-flex items-center justify-center",
          "h-11 px-6 rounded-xl font-semibold text-sm",
          "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900",
          "text-white border border-white/10",
          "shadow-lg shadow-black/40",
          "overflow-hidden transition-all duration-300",
          "hover:shadow-xl hover:shadow-black/50",
          "active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Glow effect
          "after:inset-0 after:absolute after:rounded-[inherit]",
          "after:bg-gradient-to-r after:from-transparent after:from-40%",
          "after:via-[var(--glow-color-via)] after:to-[var(--glow-color-to)]",
          "after:via-70% after:-z-10",
          // Edge glow
          "before:absolute before:w-[3px] before:h-[60%]",
          "before:bg-[var(--glow-color)] before:right-0 before:rounded-l",
          "before:shadow-[-2px_0_10px_var(--glow-color)]",
          "hover:before:translate-x-full before:transition-all before:duration-300",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

GlowingButton.displayName = "GlowingButton";

export { GlowingButton };
