"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.07] hover:border-white/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-white/[0.06] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Primary CTA: gold gradient with a light sweep on hover.
        custom:
          "overflow-hidden bg-[linear-gradient(110deg,hsl(var(--amber)),hsl(var(--gold))_55%,hsl(var(--amber)))] text-[hsl(240_25%_6%)] font-semibold shadow-[0_10px_40px_-12px_hsl(var(--gold)/0.85)] hover:shadow-[0_16px_50px_-10px_hsl(var(--gold)/0.95)] hover:brightness-110",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const isCta = variant === "custom"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), "group/btn")}
      ref={ref}
      {...props}>
      {isCta && !asChild ? (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/35 blur-md opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100 group-hover/btn:animate-sweep"
          />
          <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
