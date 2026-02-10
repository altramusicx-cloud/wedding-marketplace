// File: components/layout/mode-toggle.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { User, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthState } from '@/hooks/use-auth-state'
import { useRouter, usePathname } from 'next/navigation'

interface ModeToggleProps {
    currentMode: 'user' | 'vendor'
    variant?: 'default' | 'compact'
}

export function ModeToggle({
    currentMode,
    variant = 'default'
}: ModeToggleProps) {
    const [mode, setMode] = useState<'user' | 'vendor'>(currentMode)
    const { setDashboardMode, isVendor, profile } = useAuthState()
    const router = useRouter()
    const pathname = usePathname()

    // Sync dengan perubahan currentMode dari parent
    useEffect(() => {
        setMode(currentMode)
    }, [currentMode])

    // Jika bukan vendor, jangan render toggle
    if (!isVendor) {
        return null
    }

    const switchMode = (newMode: 'user' | 'vendor') => {
        if (mode === newMode) return // Already in this mode

        console.log('🔄 Switching mode:', { from: mode, to: newMode })

        // Update local state
        setMode(newMode)
        setDashboardMode(newMode)

        // Show loading state event
        const event = new CustomEvent('dashboard-mode-switching', {
            detail: { from: mode, to: newMode }
        })
        window.dispatchEvent(event)

        // Redirect berdasarkan mode dan current path
        setTimeout(() => {
            if (newMode === 'vendor') {
                // Jika sudah di /dashboard/vendor, refresh saja
                if (pathname.startsWith('/dashboard/vendor')) {
                    router.refresh()
                } else {
                    router.push('/dashboard/vendor')
                }
            } else {
                // Jika sudah di /dashboard, refresh saja
                if (pathname === '/dashboard' || pathname.startsWith('/dashboard/') && !pathname.startsWith('/dashboard/vendor')) {
                    router.refresh()
                } else {
                    router.push('/dashboard')
                }
            }
        }, 50)
    }

    // Helper untuk determine jika di vendor route
    const isInVendorRoute = pathname.startsWith('/dashboard/vendor')

    // Compact variant untuk mobile/space constrained
    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                <Button
                    variant={mode === 'user' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => switchMode('user')}
                    className={cn(
                        "px-2 min-w-0",
                        mode === 'user' && "bg-white shadow-sm",
                        isInVendorRoute && mode === 'user' && "opacity-70" // Jika di vendor route tapi user mode
                    )}
                    aria-label="Switch to User Mode"
                    title="User Mode - Akses dashboard pengguna"
                >
                    <User className="h-3 w-3" />
                </Button>

                <Button
                    variant={mode === 'vendor' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => switchMode('vendor')}
                    className={cn(
                        "px-2 min-w-0",
                        mode === 'vendor' && "bg-white shadow-sm",
                        !isInVendorRoute && mode === 'vendor' && "opacity-70" // Jika di user route tapi vendor mode
                    )}
                    aria-label="Switch to Vendor Mode"
                    title="Vendor Mode - Kelola produk dan bisnis"
                >
                    <ShoppingBag className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    // Default variant
    return (
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
            <Button
                variant={mode === 'user' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchMode('user')}
                className={cn(
                    "px-3",
                    mode === 'user' && "bg-white shadow-sm",
                    isInVendorRoute && mode === 'user' && "opacity-70"
                )}
                aria-label="Switch to User Mode"
                title="Switch ke User Mode"
            >
                <User className="h-4 w-4 mr-2" />
                User
                {isInVendorRoute && mode === 'user' && (
                    <span className="ml-2 text-xs text-neutral-500">(redirect)</span>
                )}
            </Button>

            <Button
                variant={mode === 'vendor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchMode('vendor')}
                className={cn(
                    "px-3",
                    mode === 'vendor' && "bg-white shadow-sm",
                    !isInVendorRoute && mode === 'vendor' && "opacity-70"
                )}
                aria-label="Switch to Vendor Mode"
                title="Switch ke Vendor Mode"
            >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Vendor
                {!isInVendorRoute && mode === 'vendor' && (
                    <span className="ml-2 text-xs text-neutral-500">(redirect)</span>
                )}
            </Button>
        </div>
    )
}

// Simple indicator untuk show current mode
export function ModeIndicator() {
    const { dashboardMode, isVendor } = useAuthState()

    if (!isVendor) return null

    return (
        <div className="flex items-center gap-2 text-sm">
            <div className={cn(
                "h-2 w-2 rounded-full",
                dashboardMode === 'user' ? "bg-blue-500" : "bg-primary"
            )} />
            <span className="font-medium">
                {dashboardMode === 'user' ? 'User Mode' : 'Vendor Mode'}
            </span>
        </div>
    )
}

// Helper component untuk mode status badge
export function ModeBadge() {
    const { dashboardMode, isVendor } = useAuthState()
    const pathname = usePathname()

    if (!isVendor) return null

    const isInCorrectRoute =
        (dashboardMode === 'vendor' && pathname.startsWith('/dashboard/vendor')) ||
        (dashboardMode === 'user' && !pathname.startsWith('/dashboard/vendor'))

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            dashboardMode === 'vendor'
                ? "bg-primary/10 text-primary"
                : "bg-blue-100 text-blue-700",
            !isInCorrectRoute && "animate-pulse border border-amber-300"
        )}>
            <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                dashboardMode === 'vendor' ? "bg-primary" : "bg-blue-500"
            )} />
            {dashboardMode === 'vendor' ? 'Vendor Mode' : 'User Mode'}
            {!isInCorrectRoute && (
                <span className="text-[10px] text-amber-600">(mismatch)</span>
            )}
        </div>
    )
}