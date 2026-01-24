//lib\supabase\middleware.ts

import { createClient } from './server'
import { redirect } from 'next/navigation'

// ✅ Fungsi untuk cek admin (yang kita butuhkan)
export async function checkIsAdmin() {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
            console.error('Auth error in checkIsAdmin:', authError)
            return {
                isAdmin: false,
                redirect: redirect('/login')
            }
        }

        if (!user) {
            return {
                isAdmin: false,
                redirect: redirect('/login')
            }
        }

        // Cek apakah user adalah admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Profile fetch error in checkIsAdmin:', profileError)
            return {
                isAdmin: false,
                redirect: redirect('/dashboard')
            }
        }

        console.log('🔍 Admin check for:', user.email, 'is_admin:', profile?.is_admin)

        if (!profile?.is_admin) {
            return {
                isAdmin: false,
                redirect: redirect('/dashboard')
            }
        }

        return {
            isAdmin: true,
            redirect: null,
            user,
            supabase
        }

    } catch (error) {
        console.error('Unexpected error in checkIsAdmin:', error)
        return {
            isAdmin: false,
            redirect: redirect('/dashboard')
        }
    }
}

// ✅ Fungsi untuk require auth (optional, jika dibutuhkan)
export async function requireAuth() {
    try {
        const supabase = await createClient()

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            redirect('/login')
        }

        return { user, supabase }

    } catch (error) {
        console.error('Error in requireAuth:', error)
        redirect('/login')
    }
}

// ✅ Fungsi untuk require admin (alternative)
export async function requireAdmin() {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            redirect('/login')
        }

        // Cek apakah user adalah admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Profile error in requireAdmin:', profileError)
            redirect('/dashboard')
        }

        if (!profile?.is_admin) {
            redirect('/dashboard')
        }

        return { user, supabase }

    } catch (error) {
        console.error('Unexpected error in requireAdmin:', error)
        redirect('/dashboard')
    }
}