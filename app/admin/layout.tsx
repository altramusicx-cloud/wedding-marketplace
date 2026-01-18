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
        .single()

    // 3. Jika bukan admin, redirect
    if (!profile?.is_admin) {
        redirect('/dashboard')
    }

    // 4. Jika sampai sini, user adalah admin
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}