// File: components/admin/admin-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Users,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Product Approval', icon: Package },
    { href: '/admin/vendors', label: 'Vendor Management', icon: Users },
    { href: '/admin/contacts', label: 'Contact Logs', icon: MessageSquare },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { signOut } = useAuth()

    return (
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
            <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 px-4 mb-8">
                    <Link href="/admin" className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-blush flex items-center justify-center mr-3">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="font-bold text-lg text-charcoal">Admin Panel</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blush-light text-blush-dark'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                )}
                            >
                                <Icon className={cn(
                                    'mr-3 h-5 w-5',
                                    isActive ? 'text-blush' : 'text-gray-500'
                                )} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="px-4 mt-auto pt-4 border-t">
                    <Button
                        variant="ghost"
                        onClick={signOut}
                        className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    )
}