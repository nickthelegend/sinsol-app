"use client";

import { cn } from "@/lib/utils";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "red" | "green" | "amber" | "blue" | "purple";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  shimmer?: boolean;
  className?: string;
}

export function AnimatedBadge({
  children,
  variant = "default",
  size = "md",
  pulse = false,
  shimmer = false,
  className,
}: AnimatedBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const variantClasses = {
    default: "bg-white/10 text-zinc-300 border-white/10",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border",
        "transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        pulse && "animate-pulse",
        shimmer && "relative overflow-hidden",
        className
      )}
    >
      {shimmer && (
        <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
      {pulse && !shimmer && (
        <span className={cn("w-1.5 h-1.5 rounded-full", variant === "default" ? "bg-zinc-400" : "bg-current")} />
      )}
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// Status badge with dot
interface StatusBadgeProps {
  status: "online" | "offline" | "away" | "busy";
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: "bg-emerald-500", label: "Online" },
    offline: { color: "bg-zinc-500", label: "Offline" },
    away: { color: "bg-amber-500", label: "Away" },
    busy: { color: "bg-red-500", label: "Busy" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-zinc-400",
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", config.color, status === "online" && "animate-pulse")} />
      {label || config.label}
    </span>
  );
}
