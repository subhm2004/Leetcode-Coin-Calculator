"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground shadow-inner outline-none transition-all duration-300",
        "placeholder:text-muted-foreground/60",
        "hover:border-white/20 hover:bg-white/[0.05]",
        "focus-visible:border-[hsl(var(--gold)/0.6)] focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
