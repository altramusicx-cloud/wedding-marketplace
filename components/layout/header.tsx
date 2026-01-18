// File: components/layout/header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Search,
    Heart,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const { user, profile, isLoading, signOut, isAuthenticated } = useAuth()

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/categories/venue', label: 'Venue' },
        { href: '/categories/photographer', label: 'Fotografer' },
        { href: '/categories/catering', label: 'Katering' },
        { href: '/categories/decoration', label: 'Dekorasi' },
    ]

    // File: components/layout/header.tsx (UPDATE handleLogout)
    const handleLogout = async () => {
        await signOut()
        // signOut() sudah handle redirect ke '/'
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container-custom">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-blush flex items-center justify-center">
                                <Heart className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-charcoal hidden sm:inline-block">
                                WeddingMarket
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-blush',
                                    pathname === item.href ? 'text-blush' : 'text-gray-700'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search Button */}
                        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Favorites */}
                        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                            <Heart className="h-5 w-5" />
                        </Button>

                        {/* Auth Section */}
                        {isLoading ? (
                            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            {profile?.avatar_url ? (
                                                <img
                                                    src={profile.avatar_url}
                                                    alt={profile.full_name}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <span className="hidden md:inline text-sm font-medium">
                                            {profile?.full_name?.split(' ')[0] || 'User'}
                                        </span>
                                        <ChevronDown className="h-4 w-4" />
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
                                                <User className="mr-2 h-4 w-4" />
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
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" asChild size="sm">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild size="sm" className="bg-blush hover:bg-blush/90 text-charcoal">
                                    <Link href="/register">Daftar</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t py-4">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg',
                                        pathname === item.href
                                            ? 'bg-blush-light text-blush-dark'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                                    {item.label}
                                </Link>
                            ))}

                            {/* Mobile Auth Links */}
                            {!isAuthenticated && (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="mr-3 h-5 w-5" />
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center px-3 py-2 text-sm font-medium bg-blush text-charcoal hover:bg-blush/90 rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="mr-3 h-5 w-5" />
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}