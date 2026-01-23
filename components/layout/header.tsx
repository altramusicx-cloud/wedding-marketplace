// components/layout/header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
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
    Search
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
import { Container } from './container' // ← TAMBAH IMPORT

export function Header() {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
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
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                {/* GANTI: container mx-auto px-4 → Container component */}
                <Container size="xl" className="py-0"> {/* py-0 karena ada h-16 di dalam */}
                    <div className="flex h-16 items-center justify-between gap-3">
                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <div className="h-7 w-7 rounded-lg bg-blush flex items-center justify-center">
                                    <Heart className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-lg text-charcoal hidden sm:inline-block ml-2">
                                    WeddingMarket
                                </span>
                            </Link>
                        </div>

                        {/* MOBILE: SearchBar kecil */}
                        <div className="flex-1 md:hidden">
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="relative" ref={searchRef}>
                                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                                    <Input
                                        type="search"
                                        placeholder="Cari..."
                                        className="pl-8 pr-3 h-9 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Cari venue, photographer, catering..."
                                        className="pl-10 pr-4 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2">
                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center gap-4">
                                {/* Favorites */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="h-9 w-9"
                                >
                                    <Link href="/dashboard?tab=favorites">
                                        <Heart className="h-4 w-4" />
                                    </Link>
                                </Button>

                                {/* Auth Section */}
                                {isLoading ? (
                                    <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
                                ) : isAuthenticated ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-9 px-2">
                                                <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                                    {profile?.avatar_url ? (
                                                        <Image
                                                            src={profile.avatar_url}
                                                            alt={profile.full_name}
                                                            width={28}
                                                            height={28}
                                                            className="h-full w-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-3 w-3 text-gray-600" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium hidden lg:inline-block">
                                                    {profile?.full_name?.split(' ')[0] || 'User'}
                                                </span>
                                                <ChevronDown className="h-3 w-3 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {profile?.full_name || 'User'}
                                                    </p>
                                                    <p className="text-xs leading-none text-gray-500">
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

                                            {profile?.is_vendor ? (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard/vendor" className="w-full cursor-pointer">
                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                        Vendor Dashboard
                                                    </Link>
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard/vendor/register" className="w-full cursor-pointer">
                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                        Jadi Vendor
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}

                                            {profile?.is_admin && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin" className="w-full cursor-pointer">
                                                        <User className="mr-2 h-4 w-4" />
                                                        Admin Panel
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
                                        <Button variant="ghost" asChild size="sm">
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button asChild size="sm" className="bg-blush hover:bg-blush/90 text-charcoal">
                                            <Link href="/register">Daftar</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Actions */}
                            <div className="flex md:hidden items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setIsFilterModalOpen(true)}
                                >
                                    <Filter className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container> {/* ← PAKAI Container component */}
            </header>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
            />
        </>
    )
}