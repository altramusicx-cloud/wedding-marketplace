// File: app/dashboard/vendor/layout.tsx
import { VendorSidebar } from "@/components/layout/vendor-sidebar"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, is_vendor')
        .eq('id', user.id)
        .single()

    // 🔥 FIX: Block admin from vendor dashboard
    if (profile?.is_admin === true) {
        redirect('/admin')
    }

    // Block non-vendor users
    if (profile?.is_vendor !== true) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-ivory">
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