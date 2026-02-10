// File: app/dashboard/vendor/layout.tsx (REPLACE existing)
import { VendorDashboardLayout } from '@/components/layout/vendor-dashboard-layout'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserProfile } from '@/hooks/use-auth-state'

export default async function VendorDashboardLayoutServer({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        // 1. Get session
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            console.log('🔴 No session, redirect to login')
            redirect('/login')
        }

        console.log('🔍 Vendor layout - Session user ID:', session.user.id)

        // 2. Get profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, email, full_name, whatsapp_number, is_vendor, is_admin, avatar_url')
            .eq('id', session.user.id)
            .single()

        if (error) {
            console.error('🔴 Profile fetch error:', error)
            redirect('/dashboard')
        }

        if (!profile) {
            console.log('🔴 Profile not found')
            redirect('/login')
        }

        // DEBUG LOG - TAMBAHKAN INI
        console.log('🔍 Vendor layout profile check:', {
            profileId: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            is_vendor: profile.is_vendor,
            is_admin: profile.is_admin,
            rawData: profile
        })


        // 4. Admin redirect (tetap ada)
        if (profile.is_admin) {
            console.log('🔴 Admin user, redirect to /admin')
            redirect('/admin')
        }

        // 5. Transform to UserProfile
        const userProfile: UserProfile = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            whatsapp_number: profile.whatsapp_number,
            is_vendor: profile.is_vendor,
            is_admin: profile.is_admin,
            avatar_url: profile.avatar_url || undefined
        }

        console.log('🟢 /dashboard/vendor LAYOUT: Rendering VENDOR dashboard for:', profile.email)

        // 6. /dashboard/vendor → HANYA VendorDashboardLayout
        return (
            <VendorDashboardLayout
                serverProfile={userProfile}
                serverIsVendor={true}
            >
                {children}
            </VendorDashboardLayout>
        )

    } catch (error) {
        console.error('🔴 VendorDashboardLayout error:', error)
        redirect('/dashboard')
    }
}