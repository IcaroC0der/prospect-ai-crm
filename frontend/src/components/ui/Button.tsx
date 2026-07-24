import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--foreground)] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brand-black dark:bg-brand-creme text-brand-creme dark:text-brand-black hover:opacity-90": variant === "primary",
            "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] hover:bg-[var(--border-color)]": variant === "secondary",
            "border border-[var(--foreground)] bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]": variant === "outline",
            "hover:bg-[var(--border-color)] text-[var(--foreground)]": variant === "ghost",
            "h-12 px-6 py-3 text-xs": size === "default",
            "h-9 px-4 text-[10px]": size === "sm",
            "h-16 px-12 py-5 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
