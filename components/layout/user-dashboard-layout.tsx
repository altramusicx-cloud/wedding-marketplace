// File: components/layout/user-dashboard-layout.tsx (UPDATE LOADING UI)
'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { DashboardContainer } from "@/components/layout/dashboard-container"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { UserBottomNav } from "@/components/layout/user-bottom-nav"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/hooks/use-auth-state"
import { useEffect } from "react"
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

    useEffect(() => {
        console.log('🔵 UserDashboardLayout rendering at /dashboard', {
            isLoading,
            dashboardMode,
            serverIsVendor
        })
    }, [isLoading, dashboardMode, serverIsVendor])

    // === SIMPLE: /dashboard SELALU render user layout ===

    return (
        <div className="min-h-screen bg-neutral-50">
            <DashboardHeader variant="user" />

            <div className="flex min-h-[calc(100vh-64px)]">
                <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200">
                    <DashboardSidebar variant="user" />
                </aside>

                <main className="flex-1">
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

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 bg-blue-400 rounded-full animate-pulse mr-3"></div>
                                    <p className="text-sm text-blue-700">
                                        Menyiapkan dashboard Anda...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Main content */}
                        <div className={cn(
                            "transition-opacity duration-300",
                            isLoading ? "opacity-70" : "opacity-100"
                        )}>
                            {children}
                        </div>
                    </DashboardContainer>
                </main>
            </div>

            <UserBottomNav />
        </div>
    )
}