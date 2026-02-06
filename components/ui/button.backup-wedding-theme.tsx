// File: components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // BASE STYLES (preserve existing)
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // === UPDATED VARIANT COLORS ===
        default: "bg-primary text-white hover:bg-primary-600", // Shopee Red
        destructive: "bg-error-500 text-white hover:bg-error-600",
        outline: "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900", // Shopee style outline
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200", // Light gray
        ghost: "text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-primary underline-offset-4 hover:underline",

        // === NEW VARIANTS FOR SHOPEE STYLE ===
        "primary-outline": "border border-primary text-primary bg-transparent hover:bg-primary-50",
        "success": "bg-success-500 text-white hover:bg-success-600",
        "warning": "bg-warning-500 text-white hover:bg-warning-600",
        "shopee-primary": "bg-primary text-white hover:bg-primary-600 font-semibold shadow-sm", // Main Shopee button
        "shopee-secondary": "bg-white text-primary border border-primary hover:bg-primary-50",

        // === CATEGORY BADGE VARIANT (untuk product card) ===
        category: "bg-primary text-white text-xs font-bold uppercase tracking-wide px-2 py-1", // EXACT styling
      },
      size: {
        // PRESERVE existing sizes
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "shopee-sm": "h-8 text-xs px-3", // Shopee small button
        "shopee-lg": "h-12 text-base px-6 font-medium", // Shopee large button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }