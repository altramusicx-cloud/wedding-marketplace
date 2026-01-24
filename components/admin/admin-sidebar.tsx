// components\admin\admin-sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Users,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    User,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthState } from '@/hooks/use-auth-state'

const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/vendors', label: 'Vendors', icon: Users },
    { href: '/admin/logs', label: 'Contact Logs', icon: MessageSquare },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { signOut, user } = useAuthState()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const handleNavClick = () => {
        setIsMobileOpen(false)
    }

    return (
        <>
            {/* Mobile Header - DALAM CONTAINER SAMA */}
            <div className="lg:hidden bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                        >
                            {isMobileOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>

                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-lg bg-blush flex items-center justify-center">
                                <span className="text-white font-bold text-sm">W</span>
                            </div>
                            <span className="ml-2 font-semibold text-gray-900">Admin</span>
                        </div>

                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar - DALAM CONTAINER SAMA */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                    {/* Logo */}
                    <div className="mb-6">
                        <Link href="/admin" className="flex items-center">
                            <div className="h-8 w-8 rounded-lg bg-blush flex items-center justify-center">
                                <span className="text-white font-bold">W</span>
                            </div>
                            <span className="ml-3 text-lg font-semibold text-gray-900">Admin Panel</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user?.email?.split('@')[0] || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={signOut}
                                className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <div className={cn(
                "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col pt-14">
                    {/* Mobile Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className={cn(
                                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile Logout */}
                    <div className="border-t border-gray-200 px-4 py-4">
                        <Button
                            variant="ghost"
                            onClick={signOut}
                            className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}