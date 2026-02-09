// File: components/layout/dashboard-sidebar.tsx
'use client'

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { userNavItems, vendorNavItems, type NavItem } from "@/types/navigation"
import { cn } from "@/lib/utils"
import { useAuthState } from "@/hooks/use-auth-state"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface DashboardSidebarProps {
    variant?: 'user' | 'vendor'
    collapsed?: boolean
}

export function DashboardSidebar({
    variant = 'user',
    collapsed = false
}: DashboardSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, signOut, dashboardMode, isVendor } = useAuthState()

    // Pastikan hanya render jika sesuai mode
    if (variant === 'vendor' && (!isVendor || dashboardMode !== 'vendor')) {
        return null
    }

    const navItems: NavItem[] = variant === 'vendor' ? vendorNavItems : userNavItems

    // Filter items berdasarkan role
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

    return (
        <aside className={cn(
            "hidden lg:flex flex-col h-full border-r bg-white",
            collapsed ? "w-16" : "w-64",
            variant === 'vendor' && !collapsed && "w-72" // Vendor lebih lebar
        )}>
            {/* User/Vendor Info */}
            {!collapsed && profile && (
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center",
                            variant === 'vendor' ? "bg-primary/20" : "bg-neutral-100"
                        )}>
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span className={cn(
                                    "font-semibold",
                                    variant === 'vendor' ? "text-primary" : "text-neutral-700"
                                )}>
                                    {profile.full_name?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm truncate">
                                {profile.full_name || 'User'}
                            </h3>
                            <p className="text-xs text-neutral-600 truncate">
                                {variant === 'vendor' ? 'Vendor' : 'User'}
                            </p>
                            {variant === 'vendor' && (
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-green-600">Online</span>
                                </div>
                            )}
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
                                        "hover:bg-neutral-100",  // sesuai roadmap
                                        isActive
                                            ? "bg-primary/10 text-neutral-800 font-medium border-r-2 border-primary"  // EXACT roadmap
                                            : "text-neutral-700"
                                    )}
                                    style={{ minHeight: '44px' }}  // Touch target untuk aksesibilitas
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 flex-shrink-0",
                                        isActive ? "text-primary" : "text-neutral-500"
                                    )} />

                                    {!collapsed && (
                                        <>
                                            <span className="flex-1 truncate">{item.label}</span>
                                            {item.badge && (
                                                <span className="ml-auto bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {item.badge === 'new' ? '!' : item.badge}
                                                </span>
                                            )}
                                        </>
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
                        <p className="text-xs text-neutral-600 mb-3">Dapatkan fitur analytics lengkap</p>
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">
                            Upgrade Sekarang
                        </Button>
                    </div>
                )}
            </nav>

            {/* Footer dengan logout */}
            {!collapsed && (
                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Button>
                </div>
            )}
        </aside>
    )
}