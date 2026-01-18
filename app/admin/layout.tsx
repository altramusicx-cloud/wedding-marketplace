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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('=== ADMIN LAYOUT DEBUG ===')
    console.log('1. Auth getUser - User:', user?.id, user?.email)
    console.log('2. Auth getUser - Error:', authError)

    if (!user) {
        console.log('3. No user found, redirecting to login')
        redirect('/login')
    }

    // 2. Cek apakah admin
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, is_vendor, email, full_name')
        .eq('id', user.id)
        .maybeSingle() // pakai maybeSingle, bukan single

    console.log('4. Profile query - Data:', profile)
    console.log('5. Profile query - Error:', profileError)
    console.log('6. Is admin?', profile?.is_admin)
    console.log('7. Is vendor?', profile?.is_vendor)
    console.log('=== END DEBUG ===')

    // 3. Jika bukan admin, redirect
    if (!profile?.is_admin) {
        console.log('8. NOT ADMIN, redirecting to dashboard')
        redirect('/dashboard')
    }

    // 4. Jika sampai sini, user adalah admin
    console.log('9. ADMIN ACCESS GRANTED')
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