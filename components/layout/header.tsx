// File: components/layout/header.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    Home,
    Search,
    Heart,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ShoppingBag
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
import { SearchModal } from '@/components/shared/search-modal'
import { createClient } from '@/lib/supabase/client'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoadingVendor, setIsLoadingVendor] = useState(false)

    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const { user, profile, signOut, isLoading, isAuthenticated } = useAuthState()

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/categories/venue', label: 'Venue' },
        { href: '/categories/photographer', label: 'Fotografer' },
        { href: '/categories/catering', label: 'Katering' },
        { href: '/categories/decoration', label: 'Dekorasi' },
    ]

    const handleBecomeVendor = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsLoadingVendor(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_vendor: true,
                    vendor_since: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error

            // Refresh untuk update auth state
            router.refresh()
            // Redirect ke vendor dashboard
            router.push('/dashboard/vendor')

        } catch (error) {
            console.error('Failed to become vendor:', error)
            alert('Gagal menjadi vendor. Silakan coba lagi.')
        } finally {
            setIsLoadingVendor(false)
        }
    }

    const handleLogout = async () => {
        await signOut()
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/categories?search=${encodeURIComponent(searchQuery.trim())}`
        }
    }

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-lg bg-blush flex items-center justify-center">
                                    <Heart className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-xl text-charcoal hidden sm:inline-block">
                                    WeddingMarket
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Search Bar (HIDDEN ON MOBILE) */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Cari venue, photographer, catering..."
                                        className="pl-10 pr-4 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchModalOpen(true)}
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

                                {/* Become Vendor */}
                                {!profile?.is_vendor && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hidden lg:flex"
                                        onClick={handleBecomeVendor}
                                        disabled={isLoadingVendor}
                                    >
                                        <ShoppingBag className="h-3 w-3 mr-2" />
                                        {isLoadingVendor ? 'Memproses...' : 'Jadi Vendor'}
                                    </Button>
                                )}

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
                                                            width={28}  // h-7 = 28px
                                                            height={28} // w-7 = 28px
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
                                        <DropdownMenuContent align="end" className="w-56">
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

                                            {profile?.is_vendor && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard/vendor" className="w-full cursor-pointer">
                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                        Vendor Dashboard
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
                            <div className="flex md:hidden items-center gap-2">
                                {/* Mobile Search Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setIsSearchModalOpen(true)}
                                >
                                    <Search className="h-4 w-4" />
                                </Button>

                                {/* Mobile Menu Toggle */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t">
                            <div className="py-3">
                                {/* Mobile Navigation */}
                                <div className="mb-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center px-4 py-3 text-sm font-medium',
                                                pathname === item.href
                                                    ? 'bg-blush-light text-blush-dark'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            )}
                                        >
                                            {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Auth Section */}
                                {isLoading ? (
                                    <div className="px-4 py-3">
                                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ) : isAuthenticated ? (
                                    <>
                                        <div className="px-4 py-3 border-t">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    {profile?.avatar_url ? (
                                                        <Image
                                                            src={profile.avatar_url}
                                                            alt={profile.full_name}
                                                            width={40}  // h-10 = 40px
                                                            height={40} // w-10 = 40px
                                                            className="h-full w-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-5 w-5 text-gray-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{profile?.full_name || 'User'}</p>
                                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-100"
                                                >
                                                    <User className="mr-3 h-4 w-4" />
                                                    Dashboard
                                                </Link>

                                                {profile?.is_vendor && (
                                                    <Link
                                                        href="/dashboard/vendor"
                                                        className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-100"
                                                    >
                                                        <ShoppingBag className="mr-3 h-4 w-4" />
                                                        Vendor Dashboard
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                                                >
                                                    <LogOut className="mr-3 h-4 w-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-4 py-3 border-t space-y-2">
                                        <Link
                                            href="/login"
                                            className="block w-full text-center py-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="block w-full text-center py-2 bg-blush text-white rounded-lg hover:bg-blush-dark"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}

                                {/* Extra Links */}
                                <div className="px-4 py-3 border-t text-sm text-gray-600">
                                    <Link href="/about" className="block py-2">
                                        Tentang Kami
                                    </Link>
                                    <Link href="/contact" className="block py-2">
                                        Kontak
                                    </Link>
                                    <Link href="/help" className="block py-2">
                                        Bantuan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </>
    )
}