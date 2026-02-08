// components/layout/header.tsx - REVISI FINAL
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Heart,
    User,
    LogOut,
    Filter,
    ChevronDown,
    ShoppingBag,
    Search,
    Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthState } from '@/hooks/use-auth-state'
import { cn } from '@/lib/utils'
import { FilterModal } from '@/components/shared/filter-modal'
import { Container } from './container'

export function Header() {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [hasNotifications, setHasNotifications] = useState(true)
    const searchRef = useRef<HTMLDivElement>(null)

    const pathname = usePathname()
    const { user, profile, signOut, isLoading, isAuthenticated } = useAuthState()

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/categories?search=${encodeURIComponent(searchQuery.trim())}`
        }
    }

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-primary border-b border-primary-dark">
                <Container size="xl" className="py-0">
                    {/* HEADER HEIGHT: Mobile tipis (h-12), Desktop normal (h-16) */}
                    <div className="flex h-12 lg:h-16 items-center justify-between gap-3">

                        {/* === DESKTOP ONLY: Logo (kiri) === */}
                        <div className="hidden lg:flex items-center flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Heart className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-lg text-white ml-2">
                                    WeddingMarket
                                </span>
                            </Link>
                        </div>

                        {/* === SEARCH BAR (Mobile & Tablet: full, Desktop: normal) === */}
                        <div className={cn(
                            "flex-1",
                            // Mobile & Tablet: full width
                            "w-full md:w-full",
                            // Desktop: normal width
                            "lg:max-w-2xl lg:mx-4"
                        )}>
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="relative" ref={searchRef}>
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Cari venue, photographer, catering..."
                                        // Mobile: height lebih kecil
                                        className="pl-10 pr-4 w-full bg-white border-white/30 focus:border-white h-9 lg:h-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* === RIGHT SIDE === */}
                        <div className="flex items-center gap-2">
                            {/* MOBILE & TABLET: Hanya Filter Button saja */}
                            <div className="flex lg:hidden items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    // Mobile: button lebih kecil
                                    className="h-9 w-9 hover:bg-white/10"
                                    onClick={() => setIsFilterModalOpen(true)}
                                >
                                    <Filter className="h-5 w-5 text-white" />
                                </Button>
                            </div>

                            {/* DESKTOP ONLY: Semua actions */}
                            <div className="hidden lg:flex items-center gap-4">
                                {/* Notifications */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="h-9 w-9 hover:bg-white/10 relative"
                                >
                                    <Link href="/notifications">
                                        <Bell className="h-4 w-4 text-white" />
                                        {hasNotifications && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-white text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                                                3
                                            </span>
                                        )}
                                    </Link>
                                </Button>

                                {/* Favorites */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="h-9 w-9 hover:bg-white/10"
                                >
                                    <Link href="/dashboard?tab=favorites">
                                        <Heart className="h-4 w-4 text-white" />
                                    </Link>
                                </Button>

                                {/* Auth Section */}
                                {isLoading ? (
                                    <div className="h-9 w-24 bg-white/20 rounded animate-pulse"></div>
                                ) : isAuthenticated ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-9 px-2 hover:bg-white/10 text-white">
                                                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mr-2">
                                                    {profile?.avatar_url ? (
                                                        <Image
                                                            src={profile.avatar_url}
                                                            alt={profile.full_name}
                                                            width={28}
                                                            height={28}
                                                            className="h-full w-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {profile?.full_name?.split(' ')[0] || 'User'}
                                                </span>
                                                <ChevronDown className="h-3 w-3 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-white border border-neutral-200 shadow-lg">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {profile?.full_name || 'User'}
                                                    </p>
                                                    <p className="text-xs leading-none text-neutral-500">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="w-full cursor-pointer">
                                                    <User className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>

                                            {/* HAPUS "Jadi Vendor" dan "Admin Panel" - hanya untuk vendor */}
                                            {profile?.is_vendor && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard/vendor" className="w-full cursor-pointer">
                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                        Vendor Dashboard
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            asChild
                                            size="sm"
                                            className="border-white text-white bg-transparent hover:bg-transparent"
                                        >
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            asChild
                                            size="sm"
                                            className="border-white text-white bg-transparent hover:bg-transparent"
                                        >
                                            <Link href="/register">Daftar</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
            />
        </>
    )
}
