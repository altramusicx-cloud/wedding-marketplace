// File: hooks/use-auth.ts (FULL FIX)
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
    id: string
    email: string
    full_name: string
    whatsapp_number: string
    is_vendor: boolean
    is_admin: boolean
    avatar_url?: string
}

export function useAuthState() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null) // ← INI HARUS ADA
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                setUser(session.user)
                // Fetch profile jika user ada
                try {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()

                    setProfile(profileData)
                } catch (error) {
                    console.log('Profile fetch skipped')
                }
            }

            setIsLoading(false)
        }

        initializeAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user)
                    try {
                        const { data: profileData } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()

                        setProfile(profileData)
                    } catch (error) {
                        console.log('Profile fetch skipped on auth change')
                    }
                } else {
                    setUser(null)
                    setProfile(null)
                }
                setIsLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase])

    const signOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return {
        user,
        profile,
        isLoading,
        signOut,
        isAuthenticated: !!user,
        isVendor: profile?.is_vendor || false,
        isAdmin: profile?.is_admin || false
    }
}