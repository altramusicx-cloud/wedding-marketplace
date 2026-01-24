// app\admin\layout.tsx
import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Admin Dashboard - Wedding Marketplace',
    description: 'Admin management panel',
}

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const supabase = await createClient()

    // 1. Cek user login
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Cek apakah admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()

    if (!profile?.is_admin) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <AdminSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 mt-6 lg:mt-0">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}