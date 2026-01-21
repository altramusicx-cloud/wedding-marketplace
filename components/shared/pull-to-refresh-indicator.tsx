// File: components/shared/pull-to-refresh-indicator.tsx
'use client'

import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PullToRefreshIndicatorProps {
    pullDistance: number
    pullProgress: number
    isRefreshing: boolean
    shouldRefresh: boolean
}

export function PullToRefreshIndicator({
    pullDistance,
    pullProgress,
    isRefreshing,
    shouldRefresh
}: PullToRefreshIndicatorProps) {
    // Don't show if not pulling
    if (pullDistance === 0 && !isRefreshing) {
        return null
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none"
            style={{
                transform: `translateY(${Math.min(pullDistance, 80)}px)`,
                transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
            }}
        >
            <div className="bg-white rounded-full shadow-lg p-3 mt-4">
                <RefreshCw
                    className={cn(
                        'h-6 w-6 text-blush transition-all duration-300',
                        isRefreshing && 'animate-spin',
                        shouldRefresh && !isRefreshing && 'rotate-180'
                    )}
                    style={{
                        transform: !isRefreshing && !shouldRefresh
                            ? `rotate(${pullProgress * 180}deg)`
                            : undefined
                    }}
                />
            </div>

            {/* Progress text */}
            <div className="absolute top-20 text-xs text-gray-600 font-medium">
                {isRefreshing
                    ? 'Memuat ulang...'
                    : shouldRefresh
                        ? 'Lepaskan untuk memuat ulang'
                        : 'Tarik ke bawah untuk memuat ulang'
                }
            </div>
        </div>
    )
}