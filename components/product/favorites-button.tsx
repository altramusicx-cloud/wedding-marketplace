// File: components/product/favorites-button.tsx
"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toggleFavorite, checkIsFavorited } from '@/lib/actions/favorites'
import { useAuthState } from '@/hooks/use-auth-state'
import { useState, useEffect } from 'react'

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
    size = "default",
    className,
    showLabel = false,
    onToggle
}: FavoritesButtonProps) {
    const { isAuthenticated, profile, isLoading: authLoading } = useAuthState()
    const [isFavoritedState, setIsFavoritedState] = useState(false)
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState(false)

    console.log('🔵 FavoritesButton:', {
        productId,
        isAuthenticated,
        profileId: profile?.id,
        authLoading
    })

    // Check initial favorite status
    useEffect(() => {
        async function checkFavoriteStatus() {
            if (!profile?.id) {
                console.log('🟡 No profile, skipping favorite check')
                setIsFavoritedState(false)
                setLoading(false)
                return
            }

            try {
                console.log('🟡 Checking favorite for user:', profile.id, 'product:', productId)
                const favorited = await checkIsFavorited(productId)
                console.log('🟡 Favorite status:', favorited)
                setIsFavoritedState(favorited)
            } catch (error) {
                console.error('🔴 Error checking favorite:', error)
                setIsFavoritedState(false)
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            checkFavoriteStatus()
        }
    }, [productId, profile?.id, authLoading])

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        console.log('🟡 FavoritesButton clicked:', {
            productId,
            isAuthenticated,
            currentState: isFavoritedState
        })

        if (!isAuthenticated) {
            console.log('🟡 Redirecting to login')
            window.location.href = `/login?redirect=/vendor/${productId}`
            return
        }

        if (loading || toggling) {
            console.log('🟡 Button busy, skipping')
            return
        }

        setToggling(true)
        try {
            console.log('🟡 Calling toggleFavorite server action')
            const { success, favorited } = await toggleFavorite(productId)
            console.log('🟡 Server response:', { success, favorited })

            if (success) {
                const newState = favorited
                setIsFavoritedState(newState)
                if (onToggle) {
                    onToggle(newState)
                }
            }
        } catch (error) {
            console.error('🔴 Error toggling favorite:', error)
        } finally {
            setToggling(false)
        }
    }

    const isLoading = loading || authLoading || toggling

    // ICON VARIANT - untuk product detail page
    if (variant === "icon") {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={cn(
                    "inline-flex items-center justify-center rounded-full",
                    "bg-white border shadow-sm",
                    "transition-all duration-200",
                    isFavoritedState
                        ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                        : "border-neutral-300 text-neutral-400 hover:text-red-500 hover:border-red-200",
                    size === "sm" && "h-7 w-7",
                    size === "default" && "h-8 w-8",
                    size === "lg" && "h-10 w-10",
                    isLoading && "opacity-50 cursor-not-allowed",
                    className
                )}
                aria-label={isFavoritedState ? "Remove from favorites" : "Add to favorites"}
                title={isFavoritedState ? "Hapus dari favorit" : "Tambahkan ke favorit"}
            >
                {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    <Heart
                        className={cn(
                            size === "sm" && "h-3.5 w-3.5",
                            size === "default" && "h-4 w-4",
                            size === "lg" && "h-5 w-5",
                            isFavoritedState && "fill-current"
                        )}
                    />
                )}
            </button>
        )
    }

    // BUTTON VARIANT - untuk halaman lain
    return (
        <Button
            variant="outline"
            size={size}
            onClick={handleClick}
            disabled={isLoading}
            className={cn(
                "gap-2",
                isFavoritedState && "border-red-200 bg-red-50 hover:bg-red-100",
                className
            )}
        >
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <Heart
                    className={cn(
                        "h-4 w-4",
                        isFavoritedState && "fill-red-500 text-red-500"
                    )}
                />
            )}
            {showLabel && (
                <span>
                    {isFavoritedState ? "Favorited" : "Add to favorites"}
                </span>
            )}
        </Button>
    )
}