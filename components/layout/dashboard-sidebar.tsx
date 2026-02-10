// File: components/layout/dashboard-sidebar.tsx
'use client'

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { userNavItems, vendorNavItems, type NavItem } from "@/types/navigation"
import { cn } from "@/lib/utils"
import { useAuthState } from "@/hooks/use-auth-state"
import { Button } from "@/components/ui/button"
import { LogOut, X } from "lucide-react"

interface DashboardSidebarProps {
    variant?: 'user' | 'vendor'
    collapsed?: boolean
    isMobileOpen?: boolean
    onClose?: () => void
}

export function DashboardSidebar({
    variant = 'user',
    collapsed = false,
    isMobileOpen = false,
    onClose
}: DashboardSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, signOut } = useAuthState()

    // Langsung tentukan nav items berdasarkan variant (Unified Mode)
    const navItems: NavItem[] = variant === 'vendor' ? vendorNavItems : userNavItems

    const filteredItems = navItems.filter(item => {
        if (variant === 'user') {
            return item.roles.includes('user')
        }
        if (variant === 'vendor') {
            return item.roles.includes('vendor')
        }
        return true
    })

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    // Desktop Sidebar - FIXED POSITION (benar-benar statis)
    const desktopSidebar = (
        <aside className={cn(
            "hidden lg:flex flex-col h-[calc(100vh-64px)] bg-white fixed left-0 top-16 z-30 w-60 border-r border-neutral-200",
            "overflow-y-auto"
        )}>
            {/* User Info */}
            {profile && (
                <div className="p-5 border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="font-semibold text-primary">
                                    {profile.full_name?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                                {profile.full_name || 'User'}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                                {variant === 'vendor' ? 'Vendor' : 'User'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {filteredItems.map((item) => {
                        // Skip duplicate dashboard items
                        if (item.id === 'dashboard' && variant === 'vendor') return null
                        if (item.id === 'vendor-dashboard' && variant === 'user') return null

                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' &&
                                item.href !== '/dashboard/vendor' &&
                                pathname?.startsWith(item.href))

                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                        "hover:bg-gray-100",
                                        isActive
                                            ? "bg-primary/10 text-gray-900 font-medium"
                                            : "text-gray-700"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 flex-shrink-0",
                                        isActive ? "text-primary" : "text-gray-500"
                                    )} />
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-auto bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Upgrade Banner untuk vendor */}
                {variant === 'vendor' && !collapsed && (
                    <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h4 className="font-medium text-sm mb-1 text-primary">Upgrade ke Pro</h4>
                        <p className="text-xs text-gray-600 mb-3">Dapatkan fitur analytics lengkap</p>
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">
                            Upgrade Sekarang
                        </Button>
                    </div>
                )}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                    size="sm"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    )

    // Mobile Sidebar - Overlay
    const mobileSidebar = (
        <>
            {/* Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 z-50 flex flex-col w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:hidden",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Header */}
                <div className="p-5 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold">{profile?.full_name || 'User'}</h3>
                            <p className="text-sm text-gray-500">
                                {variant === 'vendor' ? 'Vendor' : 'User'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {filteredItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm hover:bg-gray-100"
                                    onClick={onClose}
                                >
                                    <item.icon className="h-5 w-5 text-gray-500" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Logout */}
                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            handleLogout()
                            onClose?.()
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    )

    return (
        <>
            {desktopSidebar}
            {mobileSidebar}
        </>
    )
}