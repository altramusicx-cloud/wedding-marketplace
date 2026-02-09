// File: components/layout/user-bottom-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Bell, User, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuthState } from '@/hooks/use-auth-state'

export function UserBottomNav() {
    const pathname = usePathname()
    const isMobile = useMediaQuery('(max-width: 768px)')
    const { isAuthenticated } = useAuthState()

    // Hanya tampil di mobile
    if (!isMobile) {
        return null
    }

    // Hide di auth pages, admin, dll
    const hideBottomNav =
        pathname.includes('/login') ||
        pathname.includes('/register') ||
        pathname.includes('/admin') ||
        pathname.includes('/api') ||
        pathname === '/404' ||
        pathname === '/500'

    if (hideBottomNav) {
        return null
    }

    const navItems = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: Home,
            isActive: pathname === '/dashboard' || pathname === '/dashboard/vendor'
        },
        {
            href: '/dashboard/favorites',
            label: 'Favorit',
            icon: Heart,
            isActive: pathname.startsWith('/dashboard/favorites'),
            requireAuth: true
        },
        {
            href: '/dashboard/contacts',
            label: 'Kontak',
            icon: MessageSquare,
            isActive: pathname.startsWith('/dashboard/contacts'),
            requireAuth: true
        },
        {
            href: '/dashboard/notifications',
            label: 'Notifikasi',
            icon: Bell,
            isActive: pathname.startsWith('/dashboard/notifications'),
            requireAuth: true
        },
        {
            href: '/dashboard/settings',
            label: 'Akun',
            icon: User,
            isActive: pathname.startsWith('/dashboard/settings')
        }
    ]

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe">
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => {
                        // Jika item require auth dan user belum login, redirect ke login
                        const href = item.requireAuth && !isAuthenticated
                            ? `/login?redirect=${encodeURIComponent(item.href)}`
                            : item.href

                        const Icon = item.icon
                        const isActive = item.isActive

                        return (
                            <Link
                                key={item.label}
                                href={href}
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
                                    WebkitTapHighlightColor: 'transparent' // Remove tap highlight on iOS
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

// Simple version untuk halaman tertentu
export function SimpleBottomNav() {
    const isMobile = useMediaQuery('(max-width: 768px)')

    if (!isMobile) return null

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe">
            <div className="h-16 flex items-center justify-center">
                <p className="text-xs text-neutral-500">Mobile Navigation</p>
            </div>
        </nav>
    )
}