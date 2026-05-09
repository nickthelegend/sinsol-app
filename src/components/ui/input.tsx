import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl px-4 py-2 text-sm text-white",
          "bg-gradient-to-b from-[#0a0a0a] to-[#151515]",
          "border border-red-500/20",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.05)]",
          "placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50",
          "transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };