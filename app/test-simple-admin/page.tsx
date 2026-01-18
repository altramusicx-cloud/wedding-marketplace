// File: app/test-simple-admin/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestSimpleAdmin() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Not logged in</div>
    }

    // Direct query tanpa RLS check
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Simple Admin Test</h1>
            <div className="mt-4 space-y-2">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>User ID:</strong> {user.id}</div>
                <div><strong>is_admin:</strong> {profile?.is_admin ? 'TRUE' : 'FALSE'}</div>
                <div><strong>Profile exists:</strong> {profile ? 'YES' : 'NO'}</div>
            </div>

            {profile?.is_admin ? (
                <div className="mt-4 p-4 bg-green-100 rounded">
                    ✅ User is ADMIN. <a href="/admin" className="text-blue-600 underline">Go to Admin</a>
                </div>
            ) : (
                <div className="mt-4 p-4 bg-red-100 rounded">
                    ❌ User is NOT ADMIN. is_admin = {profile?.is_admin ? 'true' : 'false'}
                </div>
            )}
        </div>
    )
}