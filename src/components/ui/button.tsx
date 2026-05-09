import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[16px] text-sm font-semibold tracking-wide transition-all duration-200 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "premium-button text-white shadow-lg hover:-translate-y-0.5 active:scale-[0.96]",
        destructive: "premium-button-secondary bg-red-900/30 text-red-400 border-red-800/30 hover:bg-red-900/50 hover:border-red-700/50",
        outline: "premium-button-secondary border border-red-900/30 text-red-400 hover:bg-red-900/20 hover:border-red-700/50",
        secondary: "premium-button-secondary text-gray-200 bg-gray-800/50 border border-gray-700/30",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5",
        link: "text-red-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base",
        xl: "h-14 rounded-[28px] px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };