// File: app/dashboard/auth-test/page.tsx
'use client'

import { useAuthState } from '@/hooks/use-auth-state'

export default function AuthTestPage() {
    const { user, profile, isLoading, isVendor, dashboardMode } = useAuthState()

    console.log('Auth State:', { user, profile, isLoading, isVendor, dashboardMode })

    if (isLoading) {
        return <div>Loading auth state...</div>
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Auth Test</h1>
            <pre>{JSON.stringify({
                hasUser: !!user,
                hasProfile: !!profile,
                isLoading,
                isVendor,
                dashboardMode,
                profile: profile ? {
                    id: profile.id,
                    email: profile.email,
                    full_name: profile.full_name,
                    is_vendor: profile.is_vendor,
                    is_admin: profile.is_admin
                } : null
            }, null, 2)}</pre>
        </div>
    )
}