// File: components/layout/vendor-dashboard-layout.tsx
'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { DashboardContainer } from "@/components/layout/dashboard-container"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { VendorBottomNav } from "@/components/layout/vendor-bottom-nav"
import { ModeToggle } from "@/components/layout/mode-toggle"
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
                showModeToggle={true}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex min-h-[calc(100vh-64px)]">
                <DashboardSidebar
                    variant="vendor"
                    isMobileOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="flex-1 lg:ml-60">
                    <DashboardContainer className={cn("py-6", className)}>
                        {/* Welcome header untuk vendor */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-neutral-900">
                                Dashboard Vendor
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Selamat datang, {serverProfile?.full_name || 'Vendor'}! Kelola bisnis wedding Anda.
                            </p>

                            {/* Mode indicator */}
                            <div className="flex items-center gap-4 mt-4">
                                <div className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium",
                                    dashboardMode === 'vendor'
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "bg-blue-100 text-blue-700 border border-blue-200"
                                )}>
                                    {dashboardMode === 'vendor' ? 'Vendor Mode' : 'User Mode'}
                                </div>

                                <ModeToggle currentMode={dashboardMode} />
                            </div>
                        </div>

                        {/* Main content */}
                        {children}
                    </DashboardContainer>
                </main>
            </div>

            <VendorBottomNav />
        </div>
    )
}