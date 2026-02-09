// File: components/layout/vendor-bottom-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, BarChart3, MessageSquare, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuthState } from '@/hooks/use-auth-state'

export function VendorBottomNav() {
    const pathname = usePathname()
    const isMobile = useMediaQuery('(max-width: 768px)')
    const { dashboardMode, isVendor } = useAuthState()

    // Hanya tampil di mobile DAN hanya jika di vendor mode
    if (!isMobile || !isVendor || dashboardMode !== 'vendor') {
        return null
    }

    // Hide di non-vendor pages
    const hideBottomNav =
        pathname.includes('/login') ||
        pathname.includes('/register') ||
        pathname.includes('/admin') ||
        pathname.includes('/api') ||
        pathname === '/404' ||
        pathname === '/500' ||
        !pathname.startsWith('/dashboard/vendor')

    if (hideBottomNav) {
        return null
    }

    const navItems = [
        {
            href: '/dashboard/vendor',
            label: 'Dashboard',
            icon: Home,
            isActive: pathname === '/dashboard/vendor'
        },
        {
            href: '/dashboard/vendor/products',
            label: 'Produk',
            icon: Package,
            isActive: pathname.startsWith('/dashboard/vendor/products')
        },
        {
            href: '/dashboard/vendor/messages',
            label: 'Pesan',
            icon: MessageSquare,
            isActive: pathname.startsWith('/dashboard/vendor/messages')
        },
        {
            href: '/dashboard/vendor/analytics',
            label: 'Analitik',
            icon: BarChart3,
            isActive: pathname.startsWith('/dashboard/vendor/analytics')
        },
        {
            href: '/dashboard/vendor/settings',
            label: 'Toko',
            icon: Store,
            isActive: pathname.startsWith('/dashboard/vendor/settings')
        }
    ]

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe">
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = item.isActive

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1',
                                    'transition-colors duration-200',
                                    'active:bg-neutral-100',
                                    isActive
                                        ? 'text-primary' // Shopee red (#d0011b)
                                        : 'text-neutral-500 hover:text-primary'
                                )}
                                style={{
                                    minHeight: '44px', // Touch target
                                    WebkitTapHighlightColor: 'transparent'
                                }}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.label}</span>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute top-0 h-1 w-12 bg-primary rounded-b-full"></div>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Spacer untuk prevent content tertutup bottom nav */}
            <div className="h-16" aria-hidden="true" />
        </>
    )
}

// Simple version untuk testing
export function SimpleVendorBottomNav() {
    const isMobile = useMediaQuery('(max-width: 768px)')

    if (!isMobile) return null

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe">
            <div className="h-16 flex items-center justify-center">
                <p className="text-xs text-primary font-medium">Vendor Dashboard</p>
            </div>
        </nav>
    )
}