"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "glow";
  label?: string;
}

const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ children, className, size = "md", variant = "default", label, ...props }, ref) => {
    const sizes = {
      sm: "w-10 h-10",
      md: "w-14 h-14",
      lg: "w-16 h-16",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-7 h-7",
    };

    const variants = {
      default: cn(
        "bg-gradient-to-br from-red-500 to-red-700",
        "text-white",
        "shadow-lg shadow-red-500/30",
        "hover:shadow-xl hover:shadow-red-500/40",
        "hover:scale-110",
        "border border-red-400/30"
      ),
      gradient: cn(
        "bg-gradient-to-br from-red-500 via-rose-500 to-pink-600",
        "text-white",
        "shadow-lg shadow-rose-500/30",
        "hover:shadow-xl hover:shadow-rose-500/40",
        "hover:scale-110",
        "border border-rose-400/30"
      ),
      glow: cn(
        "bg-gradient-to-br from-red-500 to-red-700",
        "text-white",
        "shadow-[0_0_20px_rgba(220,38,60,0.5)]",
        "hover:shadow-[0_0_30px_rgba(220,38,60,0.6)]",
        "hover:scale-110",
        "border border-red-400/50"
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          "rounded-full",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
          "active:scale-95",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        <span className={cn("transition-transform duration-300", iconSizes[size])}>
          {children}
        </span>
        {label && (
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {label}
          </span>
        )}
      </button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton };
