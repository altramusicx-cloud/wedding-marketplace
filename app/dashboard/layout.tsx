// File: app/dashboard/layout.tsx
import { UserDashboardLayout } from '@/components/layout/user-dashboard-layout'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserProfile } from '@/hooks/use-auth-state'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        // 1. Get session
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            redirect('/login')
        }

        // 2. Get profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, full_name, whatsapp_number, is_vendor, is_admin, avatar_url')
            .eq('id', session.user.id)
            .single()

        if (!profile) {
            redirect('/login')
        }

        // 3. Admin redirect
        if (profile.is_admin) {
            redirect('/admin')
        }

        // 4. Transform to UserProfile
        const userProfile: UserProfile = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            whatsapp_number: profile.whatsapp_number,
            is_vendor: profile.is_vendor,
            is_admin: profile.is_admin,
            avatar_url: profile.avatar_url || undefined
        }

        console.log('🟢 /dashboard LAYOUT: Rendering USER dashboard')

        // 5. /dashboard → SELALU render USER layout
        // Baik user biasa MAUPUN vendor di user mode
        return (
            <UserDashboardLayout
                serverProfile={userProfile}
                serverIsVendor={profile.is_vendor}
            >
                {children}
            </UserDashboardLayout>
        )

    } catch (error) {
        console.error('🔴 DashboardLayout error:', error)
        redirect('/login')
    }
}