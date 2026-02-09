// File: components/layout/dashboard-header.tsx
'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Bell, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
    variant?: 'user' | 'vendor'
    showModeToggle?: boolean
    onMenuClick?: () => void
    isSidebarOpen?: boolean
}

export function DashboardHeader({
    variant = 'user',
    showModeToggle = false,
    onMenuClick,
    isSidebarOpen = false
}: DashboardHeaderProps) {
    const { profile, dashboardMode } = useAuthState()
    const isMobile = useMediaQuery('(max-width: 1024px)') // lg breakpoint

    const getTitle = () => {
        if (variant === 'vendor') return 'Dashboard Vendor'
        return 'Dashboard Saya'
    }

    const getInitials = () => {
        if (!profile?.full_name) return 'U'
        return profile.full_name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
            <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
                {/* Left: Mobile Menu Button */}
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="mr-2 lg:hidden"
                        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    >
                        {isSidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                )}

                {/* Logo/Title */}
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-neutral-900">
                        {getTitle()}
                    </h1>
                    <p className="text-xs text-neutral-600 hidden sm:block">
                        {variant === 'vendor'
                            ? 'Kelola produk dan pantau performa bisnis Anda'
                            : 'Kelola favorit dan riwayat kontak Anda'
                        }
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Mode Toggle (untuk vendor) */}
                    {profile?.is_vendor && (
                        <div className={isMobile ? "lg:hidden" : "hidden lg:block"}>
                            <ModeToggle currentMode={dashboardMode} />
                        </div>
                    )}

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        aria-label="Notifikasi"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-neutral-200">
                            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>

                        {/* User name hanya di desktop */}
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium leading-none">
                                {profile?.full_name?.split(' ')[0] || 'User'}
                            </p>
                            <p className="text-xs text-neutral-500 leading-none">
                                {variant === 'vendor' ? 'Vendor' : 'User'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

// Simple Header variant untuk halaman yang tidak butuh kompleks
export function SimpleDashboardHeader({
    title,
    showBackButton = false
}: {
    title?: string
    showBackButton?: boolean
}) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white">
            <div className="flex h-14 items-center px-4 sm:px-6">
                {showBackButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="mr-2"
                    >
                        ←
                    </Button>
                )}
                <h1 className="text-lg font-semibold flex-1">
                    {title || 'Dashboard'}
                </h1>
            </div>
        </header>
    )
}