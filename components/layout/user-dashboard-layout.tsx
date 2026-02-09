// File: components/layout/user-dashboard-layout.tsx
'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { DashboardContainer } from "@/components/layout/dashboard-container"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { UserBottomNav } from "@/components/layout/user-bottom-nav"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/hooks/use-auth-state"
import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/layout/mode-toggle"

interface UserDashboardLayoutProps {
    children: React.ReactNode
    showBackButton?: boolean
    title?: string
    className?: string
    serverProfile: UserProfile
    serverIsVendor: boolean
}

export function UserDashboardLayout({
    children,
    showBackButton,
    title,
    className,
    serverProfile,
    serverIsVendor
}: UserDashboardLayoutProps) {
    const { dashboardMode, isLoading } = useAuthState()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        console.log('🔵 UserDashboardLayout rendering at /dashboard', {
            isLoading,
            dashboardMode,
            serverIsVendor
        })
    }, [isLoading, dashboardMode, serverIsVendor])

    return (
        <div className="min-h-screen bg-neutral-50">
            <DashboardHeader
                variant="user"
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex min-h-[calc(100vh-64px)]">
                <DashboardSidebar
                    variant="user"
                    isMobileOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="flex-1 lg:ml-60"> {/* ml-60 untuk offset sidebar desktop */}
                    <DashboardContainer className={cn("py-6", className)}>
                        {/* Welcome header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-neutral-900">
                                Dashboard Saya
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Selamat datang, {serverProfile?.full_name || 'User'}!
                            </p>

                            {/* Vendor badge jika vendor */}
                            {serverIsVendor && (
                                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-primary/10 rounded-lg">
                                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                                    <span className="text-sm font-medium text-primary">
                                        Anda adalah Vendor
                                    </span>
                                    <ModeToggle currentMode={dashboardMode} variant="compact" />
                                </div>
                            )}
                        </div>

                        {/* Main content */}
                        {children}
                    </DashboardContainer>
                </main>
            </div>

            <UserBottomNav />
        </div>
    )
}