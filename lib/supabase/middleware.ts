import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function requireAuth() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return { supabase, user }
}

export async function requireAdmin() {
    const { supabase, user } = await requireAuth()

    // Check if user is admin (simple email check for now)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.email !== 'admin@weddingmarket.com') {
        redirect('/dashboard')
    }

    return { supabase, user, profile }
}