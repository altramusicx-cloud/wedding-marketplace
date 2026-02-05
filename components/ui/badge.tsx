// File: components/ui/badge.tsx - Fixed version
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-white hover:bg-primary/80",
                secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
                destructive: "border-transparent bg-danger text-white hover:bg-danger/80",
                outline: "border border-neutral-300 text-neutral-900",
                category: "border-transparent bg-gold text-white hover:bg-gold-dark uppercase font-bold",
                success: "border-transparent bg-success text-white hover:bg-success/80",
                warning: "border-transparent bg-warning text-white hover:bg-warning/80",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { badgeVariants }
