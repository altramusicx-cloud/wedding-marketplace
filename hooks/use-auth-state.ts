// File: hooks/use-auth-state.ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// === FIX: TAMBAHKAN 'export' ===
export interface UserProfile {  // ✅ ADD 'export'
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
    const [profile, setProfile] = useState<UserProfile | null>(null) // ← Pakai UserProfile
    const [isLoading, setIsLoading] = useState(true)


    // === NEW: Dashboard mode state ===
    const [dashboardMode, setDashboardModeState] = useState<'user' | 'vendor'>('user')

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

                // === NEW: Initialize dashboard mode based on localStorage ===
                if (typeof window !== 'undefined') {
                    const savedMode = localStorage.getItem('dashboard-mode')
                    if (savedMode === 'user' || savedMode === 'vendor') {
                        setDashboardModeState(savedMode)
                    } else if (profileData.is_vendor) {
                        // Default untuk vendor: user mode
                        setDashboardModeState('user')
                        localStorage.setItem('dashboard-mode', 'user')
                    }
                }
            }
        } catch (error) {
            console.log('Profile fetch skipped:', error)
            setProfile(null)
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
                    setDashboardModeState('user') // Reset mode jika logout
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
                    setDashboardModeState('user') // Reset mode jika logout
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

    // === NEW: Function to set dashboard mode ===
    const setDashboardMode = (mode: 'user' | 'vendor') => {
        if (!profile?.is_vendor && mode === 'vendor') {
            console.warn('User is not a vendor, cannot switch to vendor mode')
            return
        }

        setDashboardModeState(mode)
        if (typeof window !== 'undefined') {
            localStorage.setItem('dashboard-mode', mode)
        }
    }

    return {
        user,
        profile, // ← Type: UserProfile | null
        isLoading,
        signOut,
        isAuthenticated: !!user,
        isVendor: profile?.is_vendor || false,
        isAdmin: profile?.is_admin || false,
        dashboardMode,
        setDashboardMode,
    }
}