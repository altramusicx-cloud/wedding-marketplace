// File: app/dashboard/layout.tsx (SERVER - AUTH ONLY)
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) redirect('/login')

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, is_vendor, is_admin')
            .eq('id', session.user.id)
            .single()

        if (!profile) redirect('/login')
        if (profile.is_admin) redirect('/admin')

        // NOTE: Jangan render user UI di sini. Hanya pass children.
        return <>{children}</>
    } catch (error) {
        console.error('DashboardLayout error:', error)
        redirect('/login')
    }
}