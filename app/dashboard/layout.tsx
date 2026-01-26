// app/dashboard/layout.tsx - USER DASHBOARD LAYOUT
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header untuk dashboard (bisa beda variant nanti) */}
            <Header />
            
            <main className="p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
