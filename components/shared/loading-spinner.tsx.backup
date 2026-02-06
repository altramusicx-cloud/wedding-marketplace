// File: components/shared/loading-spinner.tsx
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
    text?: string
    fullScreen?: boolean
}

export function LoadingSpinner({
    size = "md",
    className,
    text,
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16"
    }

    const spinner = (
        <div className={cn(
            "flex flex-col items-center justify-center gap-3",
            fullScreen && "min-h-screen",
            className
        )}>
            <Loader2 className={cn(
                "animate-spin text-blush",
                sizeClasses[size]
            )} />
            {text && (
                <p className="text-sm text-charcoal/70 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-ivory/80 backdrop-blur-sm">
                {spinner}
            </div>
        )
    }

    return spinner
}

// Skeleton loading component untuk placeholder
export function Skeleton({
    className,
    count = 1
}: {
    className?: string
    count?: number
}) {
    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={cn(
                "animate-pulse rounded-md bg-gray-200",
                className
            )}
        />
    ))

    return <>{skeletons}</>
}

// Product card skeleton khusus
export function ProductCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square rounded-lg bg-gray-200 mb-3" />
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
        </div>
    )
}