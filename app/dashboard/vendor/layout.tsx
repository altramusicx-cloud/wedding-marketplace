// File: app/dashboard/vendor/layout.tsx
import { VendorSidebar } from "@/components/layout/vendor-sidebar"

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-ivory">
            {/* HAPUS Header dari sini */}
            <div className="flex">
                <VendorSidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}