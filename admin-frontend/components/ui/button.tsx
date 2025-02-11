import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2 text-md",
        sm: "h-8 rounded-md px-4 py-3 text-xs text-lg",
        lg: "rounded-md px-8 py-3 text-xl",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  asChild?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    const computedClassName = cn(
      buttonVariants({ variant, size, className }),
      disabled
        ? "cursor-not-allowed opacity-50 pointer-events-none"
        : "cursor-pointer",
    );

    return (
      <Comp
        className={computedClassName}
        ref={ref}
        aria-disabled={disabled}
        {...(asChild ? { disabled } : {})}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
