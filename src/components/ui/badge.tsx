import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-2xl px-3 py-1 text-xs font-bold transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30",
        secondary: "bg-gradient-to-b from-purple-900 to-purple-950 text-purple-200 shadow-lg shadow-purple-500/20",
        destructive: "bg-gradient-to-b from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30",
        outline: "border border-purple-500/30 text-purple-300 bg-purple-900/20",
        success: "bg-gradient-to-b from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30",
        warning: "bg-gradient-to-b from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/30",
        info: "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };