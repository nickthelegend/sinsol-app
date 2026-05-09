import * as React from "react";
import { cn } from "@/lib/utils";

export interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, type, icon, rightElement, error, errorMessage, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div
          className={cn(
            "relative flex items-center",
            "h-11 w-full rounded-xl",
            "bg-white/[0.03] border border-white/10",
            "transition-all duration-200",
            "focus-within:bg-white/[0.05] focus-within:border-red-500/30",
            "focus-within:shadow-lg focus-within:shadow-red-500/5",
            error && "border-red-500/50 focus-within:border-red-500",
            className
          )}
        >
          {icon && (
            <div className="absolute left-3 text-zinc-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex-1 h-full bg-transparent px-3 text-sm text-white placeholder:text-zinc-500",
              "focus:outline-none",
              icon && "pl-10",
              rightElement && "pr-10"
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-zinc-500">
              {rightElement}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";

// Premium Textarea component
const PremiumTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean; errorMessage?: string }
>(({ className, error, errorMessage, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl",
          "bg-white/[0.03] border border-white/10",
          "px-3 py-2 text-sm text-white placeholder:text-zinc-500",
          "transition-all duration-200",
          "focus:bg-white/[0.05] focus:border-red-500/30 focus:outline-none",
          "focus:shadow-lg focus:shadow-red-500/5",
          "resize-y",
          error && "border-red-500/50 focus:border-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1.5 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
});

PremiumTextarea.displayName = "PremiumTextarea";

export { PremiumInput, PremiumTextarea };
