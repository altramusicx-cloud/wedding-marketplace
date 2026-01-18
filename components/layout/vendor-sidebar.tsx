// File: components/layout/vendor-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Package,
    BarChart3,
    MessageSquare,
    Settings,
    User,
    Calendar,
    DollarSign,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
    { href: "/dashboard/vendor", label: "Overview", icon: Home },
    { href: "/dashboard/vendor/products", label: "Produk", icon: Package },
    { href: "/dashboard/vendor/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/vendor/messages", label: "Pesan", icon: MessageSquare },
    { href: "/dashboard/vendor/bookings", label: "Booking", icon: Calendar },
    { href: "/dashboard/vendor/earnings", label: "Pendapatan", icon: DollarSign },
    { href: "/dashboard/vendor/settings", label: "Settings", icon: Settings },
]

export function VendorSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-64 border-r bg-white">
            {/* Vendor Info */}
            <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blush flex items-center justify-center">
                        <User className="h-6 w-6 text-charcoal" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Vendor Name</h3>
                        <p className="text-sm text-gray-600">Wedding Photographer</p>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-green-600">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/dashboard/vendor" && pathname?.startsWith(item.href))

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                        isActive
                                            ? "bg-blush/20 text-charcoal font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5",
                                        isActive ? "text-blush" : "text-gray-500"
                                    )} />
                                    {item.label}
                                    {item.label === "Pesan" && (
                                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            3
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Upgrade Banner */}
                <div className="mt-8 p-4 bg-sage/10 rounded-lg border border-sage/30">
                    <h4 className="font-medium text-sm mb-1">Upgrade ke Pro</h4>
                    <p className="text-xs text-gray-600 mb-3">Dapatkan fitur analytics lengkap</p>
                    <Button size="sm" className="w-full bg-sage hover:bg-sage/90 text-white">
                        Upgrade Sekarang
                    </Button>
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                </Button>
            </div>
        </aside>
    )
}