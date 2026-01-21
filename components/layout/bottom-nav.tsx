// File: components/layout/bottom-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthState } from '@/hooks/use-auth-state'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { SearchModal } from '@/components/shared/search-modal'

export function BottomNav() {
    const pathname = usePathname()
    const { isAuthenticated, profile } = useAuthState()
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

    // Hide bottom nav di halaman auth dan admin
    const hideBottomNav = pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/admin')

    // Hanya tampil di mobile
    if (!isMobile || hideBottomNav) {
        return null
    }

    const navItems = [
        {
            href: '/',
            label: 'Home',
            icon: Home,
            isActive: pathname === '/'
        },
        {
            href: '/categories',
            label: 'Kategori',
            icon: ShoppingBag,
            isActive: pathname.startsWith('/categories')
        },
        {
            href: '#search',
            label: 'Cari',
            icon: Search,
            isActive: false,
            onClick: (e: React.MouseEvent) => {
                e.preventDefault()
                setIsSearchModalOpen(true)
            }
        },
        {
            href: '/dashboard?tab=favorites',
            label: 'Favorit',
            icon: Heart,
            isActive: pathname === '/dashboard' && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tab') === 'favorites',
            requireAuth: true
        },
        {
            href: profile?.is_vendor ? '/dashboard/vendor' : '/dashboard',
            label: 'Akun',
            icon: User,
            isActive: pathname.startsWith('/dashboard'),
            requireAuth: false
        }
    ]

    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => {
                        // Jika item require auth dan user belum login, redirect ke login
                        const href = item.requireAuth && !isAuthenticated
                            ? `/login?redirect=${encodeURIComponent(item.href)}`
                            : item.href

                        const Icon = item.icon
                        const isActive = item.isActive

                        if (item.onClick) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className={cn(
                                        'flex flex-col items-center justify-center gap-1',
                                        'transition-colors duration-200',
                                        'active:bg-gray-100',
                                        isActive
                                            ? 'text-blush'
                                            : 'text-gray-600 hover:text-blush'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </button>
                            )
                        }

                        return (
                            <Link
                                key={item.label}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1',
                                    'transition-colors duration-200',
                                    'active:bg-gray-100',
                                    isActive
                                        ? 'text-blush'
                                        : 'text-gray-600 hover:text-blush'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Spacer untuk prevent content tertutup bottom nav */}
            <div className="h-16" aria-hidden="true" />

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </>
    )
}