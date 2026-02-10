'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { Bell, Menu, X, Heart, User, LogOut, ShoppingBag, ChevronDown, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
    variant?: 'user' | 'vendor'
    onMenuClick?: () => void
    isSidebarOpen?: boolean
}

export function DashboardHeader({
    variant = 'user',
    onMenuClick,
    isSidebarOpen = false
}: DashboardHeaderProps) {
    const { profile, signOut } = useAuthState()
    const router = useRouter()
    const isMobile = useMediaQuery('(max-width: 1024px)') // lg breakpoint

    const getInitials = () => {
        if (!profile?.full_name) return 'U'
        return profile.full_name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
            <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
                {/* Left: Mobile Menu Button & Logo */}
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuClick}
                            className="mr-1"
                            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                        >
                            {isSidebarOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    )}

                    {/* Brand Logo/Title - Konsisten dengan Home Header */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-lg font-semibold text-neutral-900 hover:text-primary transition-colors">
                            WeddingMarket
                        </h1>
                    </Link>

                    {/* STEP 16: Context Badge */}
                    {/* Modern Context Badge */}
                    <Badge
                        variant={variant === 'user' ? "default" : "secondary"}
                        className={cn(
                            "ml-2 hidden sm:inline-flex text-xs font-medium px-3 py-1",
                            variant === 'user'
                                ? "bg-primary text-white"
                                : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        )}
                    >
                        <div className="flex items-center gap-1.5">
                            {variant === 'user' ? (
                                <>
                                    <User className="h-3 w-3" />
                                    <span>User Mode</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-3 w-3" />
                                    <span>Vendor Mode</span>
                                </>
                            )}
                        </div>
                    </Badge>
                </div>

                {/* Right: Actions */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    {/* User Avatar with Dropdown - BACKGROUND PUTIH */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-9 px-2 hover:bg-neutral-100 text-neutral-900"
                            >
                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                    {profile?.avatar_url ? (
                                        <Avatar className="h-7 w-7 border border-neutral-200">
                                            <AvatarImage
                                                src={profile.avatar_url}
                                                alt={profile.full_name || 'User'}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                {getInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <User className="h-3 w-3 text-primary" />
                                    )}
                                </div>
                                {!isMobile && (
                                    <>
                                        <span className="text-sm font-medium">
                                            {profile?.full_name?.split(' ')[0] || 'User'}
                                        </span>
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                    </>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 bg-white border border-neutral-200 shadow-lg"
                        >
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {profile?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs leading-none text-neutral-500">
                                        {profile?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* STEP 17: Enhanced Dropdown Items with Checkmarks */}
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="flex items-center justify-between w-full cursor-pointer">
                                    <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        Dashboard Saya
                                    </div>
                                    {variant === 'user' && <Check className="h-3 w-3 text-primary" />}
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/vendor" className="flex items-center justify-between w-full cursor-pointer">
                                    <div className="flex items-center">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Dashboard Vendor
                                    </div>
                                    {variant === 'vendor' && <Check className="h-3 w-3 text-primary" />}
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="w-full cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Pengaturan
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}