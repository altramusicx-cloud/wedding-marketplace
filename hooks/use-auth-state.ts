'use client'

import { useEffect, useState, useCallback } from 'react'
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
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (profileData) {
                setProfile(profileData)
            }
        } catch (error) {
            console.log('Profile fetch skipped:', error)
            setProfile(null) // Explicitly set to null on error
        }
    }, [supabase])

    useEffect(() => {
        let isMounted = true

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!isMounted) return

                if (session?.user) {
                    setUser(session.user)
                    await fetchProfile(session.user.id)
                } else {
                    setUser(null)
                    setProfile(null)
                }
            } catch (error) {
                console.log('Auth init error:', error)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        initializeAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return

                if (session?.user) {
                    setUser(session.user)
                    await fetchProfile(session.user.id)
                } else {
                    setUser(null)
                    setProfile(null)
                }
                setIsLoading(false)
            }
        )

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [supabase, fetchProfile])

    const signOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return {
        user,
        profile, // ✅ Always null or UserProfile, never undefined
        isLoading,
        signOut,
        isAuthenticated: !!user,
        isVendor: profile?.is_vendor || false,
        isAdmin: profile?.is_admin || false
    }
}