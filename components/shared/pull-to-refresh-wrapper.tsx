// File: components/shared/pull-to-refresh-wrapper.tsx
'use client'

import { useRouter } from 'next/navigation'
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'
import { PullToRefreshIndicator } from '@/components/shared/pull-to-refresh-indicator'

interface PullToRefreshWrapperProps {
    children: React.ReactNode
}

export function PullToRefreshWrapper({ children }: PullToRefreshWrapperProps) {
    const router = useRouter()

    const handleRefresh = async () => {
        // Refresh halaman dengan router
        router.refresh()
        // Tunggu sebentar biar terasa refresh-nya
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    const { pullDistance, pullProgress, isRefreshing, shouldRefresh } = usePullToRefresh({
        onRefresh: handleRefresh,
        threshold: 80,
        enabled: true
    })

    return (
        <>
            <PullToRefreshIndicator
                pullDistance={pullDistance}
                pullProgress={pullProgress}
                isRefreshing={isRefreshing}
                shouldRefresh={shouldRefresh}
            />
            {children}
        </>
    )
}