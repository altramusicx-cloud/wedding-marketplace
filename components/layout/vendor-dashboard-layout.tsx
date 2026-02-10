// File: components/layout/vendor-dashboard-layout.tsx
'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { DashboardContentContainer } from "@/components/layout/dashboard-container" // ✅ CHANGED
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { VendorBottomNav } from "@/components/layout/vendor-bottom-nav"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/hooks/use-auth-state"
import { useEffect, useState } from "react"

interface VendorDashboardLayoutProps {
    children: React.ReactNode
    title?: string
    className?: string
    serverProfile: UserProfile
    serverIsVendor: boolean
}

export function VendorDashboardLayout({
    children,
    title,
    className,
    serverProfile,
    serverIsVendor
}: VendorDashboardLayoutProps) {
    const { dashboardMode, isLoading, setDashboardMode, isVendor } = useAuthState()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Set dashboardMode to 'vendor' when this layout mounts
    useEffect(() => {
        if (isVendor) {
            setDashboardMode('vendor')
        }
    }, [isVendor, setDashboardMode])

    // Log untuk debugging
    useEffect(() => {
        console.log('🔵 VendorDashboardLayout rendering at /dashboard/vendor', {
            isLoading,
            dashboardMode,
            serverIsVendor
        })
    }, [isLoading, dashboardMode, serverIsVendor])

    return (
        <div className="min-h-screen bg-white">
            <DashboardHeader
                variant="vendor"
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex min-h-[calc(100vh-64px)]">
                <DashboardSidebar
                    variant="vendor"
                    isMobileOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />


                <main className="flex-1 px-4 sm:pl-6 lg:pl-60">
                    <DashboardContentContainer className={cn("py-6", className)}> {/* ✅ CHANGED */}
                        {/* Welcome header untuk vendor */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-neutral-900">
                                Dashboard Vendor
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Selamat datang, {serverProfile?.full_name || 'Vendor'}! Kelola bisnis wedding Anda.
                            </p>

                            {/* ✅ REMOVED: Mode indicator section (whole block) */}
                        </div>

                        {/* Main content */}
                        {children}
                    </DashboardContentContainer>
                </main>
            </div>

            <VendorBottomNav />
        </div>
    )
}