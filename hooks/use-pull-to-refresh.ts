// File: hooks/use-pull-to-refresh.ts
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void> | void
    threshold?: number // Minimum pull distance to trigger refresh (default: 80px)
    resistance?: number // Pull resistance (default: 2.5)
    enabled?: boolean // Enable/disable pull-to-refresh
}

export function usePullToRefresh({
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    enabled = true
}: UsePullToRefreshOptions) {
    const [pullDistance, setPullDistance] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [canPull, setCanPull] = useState(false)

    const touchStartY = useRef(0)
    const touchCurrentY = useRef(0)

    const handleTouchStart = useCallback((e: TouchEvent) => {
        // Only allow pull-to-refresh if scrolled to top
        if (window.scrollY === 0) {
            setCanPull(true)
            touchStartY.current = e.touches[0].clientY
        }
    }, [])

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!canPull || isRefreshing || !enabled) return

        touchCurrentY.current = e.touches[0].clientY
        const distance = touchCurrentY.current - touchStartY.current

        // Only pull down (positive distance)
        if (distance > 0) {
            // Apply resistance formula
            const resistedDistance = distance / resistance
            setPullDistance(resistedDistance)

            // Prevent default scrolling when pulling
            if (resistedDistance > 10) {
                e.preventDefault()
            }
        }
    }, [canPull, isRefreshing, enabled, resistance])

    const handleTouchEnd = useCallback(async () => {
        if (!canPull || !enabled) return

        setCanPull(false)

        // Trigger refresh if pulled beyond threshold
        if (pullDistance >= threshold && !isRefreshing) {
            setIsRefreshing(true)

            try {
                await onRefresh()
            } catch (error) {
                console.error('Pull-to-refresh error:', error)
            } finally {
                setIsRefreshing(false)
                setPullDistance(0)
            }
        } else {
            // Snap back
            setPullDistance(0)
        }

        touchStartY.current = 0
        touchCurrentY.current = 0
    }, [pullDistance, threshold, isRefreshing, onRefresh, canPull, enabled])

    useEffect(() => {
        if (!enabled) return

        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', handleTouchEnd, { passive: true })

        return () => {
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchEnd)
        }
    }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled])

    const pullProgress = Math.min(pullDistance / threshold, 1)
    const shouldRefresh = pullDistance >= threshold

    return {
        pullDistance,
        pullProgress, // 0 to 1
        isRefreshing,
        shouldRefresh,
        canPull
    }
}