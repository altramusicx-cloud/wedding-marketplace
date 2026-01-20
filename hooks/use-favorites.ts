// File: hooks/use-favorites.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthState } from './use-auth-state'
import { toggleFavorite as serverToggleFavorite } from '@/lib/actions/favorites'

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isToggling, setIsToggling] = useState(false)
    const supabase = createClient()
    const { user, isLoading: authLoading } = useAuthState()

    // Load user's favorites
    const loadFavorites = useCallback(async () => {
        if (!user) {
            setFavorites([])
            setIsLoading(false)
            return
        }

        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('product_id')
                .eq('user_id', user.id)

            if (error) throw error

            const favoriteIds = data.map(item => item.product_id)
            setFavorites(favoriteIds)
        } catch (error) {
            console.error('Error loading favorites:', error)
        } finally {
            setIsLoading(false)
        }
    }, [user, supabase])

    // Initial load
    useEffect(() => {
        if (!authLoading) {
            loadFavorites()
        }
    }, [authLoading, loadFavorites])

    // Check if product is favorited
    const isFavorited = useCallback((productId: string) => {
        return favorites.includes(productId)
    }, [favorites])

    // Toggle favorite status
    const toggleFavorite = async (productId: string) => {
        if (!user) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
            return
        }

        if (isToggling) return

        try {
            setIsToggling(true)

            // Optimistic update
            const wasFavorited = isFavorited(productId)
            const newFavorites = wasFavorited
                ? favorites.filter(id => id !== productId)
                : [...favorites, productId]

            setFavorites(newFavorites)

            // Call server action
            const result = await serverToggleFavorite(productId)

            if (!result.success) {
                // Revert optimistic update if server fails
                setFavorites(prev =>
                    wasFavorited
                        ? [...prev, productId]
                        : prev.filter(id => id !== productId)
                )
                throw new Error('Failed to toggle favorite')
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            // Reload to sync with server
            loadFavorites()
        } finally {
            setIsToggling(false)
        }
    }

    return {
        favorites,
        isLoading: isLoading || authLoading,
        isToggling,
        isFavorited,
        toggleFavorite,
        refreshFavorites: loadFavorites
    }
}