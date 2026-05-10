"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "solid" | "soft";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  isActive?: boolean;
  badge?: number | string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, isActive, badge, children, ...props }, ref) => {
    const variants = {
      default: cn(
        "bg-white/5 border border-white/10",
        "hover:bg-white/10 hover:border-white/20",
        "active:bg-white/15",
        "text-zinc-400 hover:text-white",
        "transition-all duration-200"
      ),
      ghost: cn(
        "bg-transparent border border-transparent",
        "hover:bg-white/5 hover:border-white/10",
        "active:bg-white/10",
        "text-zinc-500 hover:text-white",
        "transition-all duration-200"
      ),
      outline: cn(
        "bg-transparent border border-white/20",
        "hover:bg-white/5 hover:border-white/30",
        "active:bg-white/10",
        "text-zinc-400 hover:text-white",
        "transition-all duration-200"
      ),
      solid: cn(
        "bg-gradient-to-br from-red-500 to-red-700",
        "border border-red-400/30",
        "hover:from-red-400 hover:to-red-600",
        "active:from-red-600 active:to-red-800",
        "text-white shadow-lg shadow-red-900/25",
        "transition-all duration-200"
      ),
      soft: cn(
        "bg-red-500/10 border border-red-500/20",
        "hover:bg-red-500/20 hover:border-red-500/30",
        "active:bg-red-500/30",
        "text-red-400 hover:text-red-300",
        "transition-all duration-200"
      ),
    };

    const sizes = {
      xs: "w-7 h-7 rounded-lg",
      sm: "w-9 h-9 rounded-xl",
      md: "w-10 h-10 rounded-xl",
      lg: "w-12 h-12 rounded-2xl",
    };

    const iconSizes = {
      xs: "w-3.5 h-3.5",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          isActive && "bg-white/10 border-white/30 text-white",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className={cn("animate-spin", iconSizes[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
        
        {badge !== undefined && (
          <span className={cn(
            "absolute -top-1 -right-1",
            "min-w-[16px] h-4 px-1",
            "flex items-center justify-center",
            "bg-red-500 text-white text-[10px] font-bold",
            "rounded-full border-2 border-[#0A0A0A]",
            "animate-in zoom-in duration-200"
          )}>
            {badge}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
