// File: components/product/favorites-button.tsx
"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/hooks/use-favorites"
import { Button } from "@/components/ui/button"

interface FavoritesButtonProps {
    productId: string
    variant?: "icon" | "button"
    size?: "sm" | "default" | "lg"
    className?: string
    showLabel?: boolean
    onToggle?: (isFavorited: boolean) => void
}

export function FavoritesButton({
    productId,
    variant = "icon",
    size = "default",  // UBAH: "md" → "default"
    className,
    showLabel = false,
    onToggle
}: FavoritesButtonProps) {
    const { isFavorited, toggleFavorite, isLoading } = useFavorites()

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        const newState = !isFavorited(productId)
        toggleFavorite(productId)

        if (onToggle) {
            onToggle(newState)
        }
    }

    const isFavoritedState = isFavorited(productId)

    // ICON VARIANT - menggunakan HTML button, bukan Button component
    if (variant === "icon") {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={cn(
                    "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                aria-label={isFavoritedState ? "Remove from favorites" : "Add to favorites"}
            >
                <Heart
                    className={cn(
                        "h-5 w-5 transition-colors",
                        isFavoritedState
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-gray-600"
                    )}
                />
            </button>
        )
    }

    // BUTTON VARIANT - menggunakan shadcn/ui Button component
    return (
        <Button
            variant="outline"
            size={size}  // size sudah "sm" | "default" | "lg" (sesuai shadcn)
            onClick={handleClick}
            disabled={isLoading}
            className={cn(
                "gap-2",
                isFavoritedState && "border-red-200 bg-red-50 hover:bg-red-100",
                className
            )}
        >
            <Heart
                className={cn(
                    "h-4 w-4",
                    isFavoritedState && "fill-red-500 text-red-500"
                )}
            />
            {showLabel && (
                <span>
                    {isFavoritedState ? "Favorited" : "Add to favorites"}
                </span>
            )}
        </Button>
    )
}