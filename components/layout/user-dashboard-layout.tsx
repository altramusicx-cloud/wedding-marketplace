// File: components/layout/user-dashboard-layout.tsx
'use client'

import { useAuthState } from "@/hooks/use-auth-state"
import { DashboardContentContainer } from "@/components/layout/dashboard-container" // ✅ CHANGED
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { UserBottomNav } from "@/components/layout/user-bottom-nav"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/hooks/use-auth-state"
import { useEffect, useState } from "react"

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


                <main className="flex-1 px-4 sm:pl-6 lg:pl-60">
                    <DashboardContentContainer className={cn("py-6", className)}> {/* ✅ CHANGED */}

                        {/* Main content */}
                        {children}
                    </DashboardContentContainer>
                </main>
            </div>

            <UserBottomNav />
        </div>
    )
}