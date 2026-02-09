// File: app/dashboard/debug/page.tsx
'use client'

export default function DebugPage() {
    console.log('🔍 DebugPage rendering...')

    return (
        <div style={{ padding: '20px', background: '#f0f0f0' }}>
            <h1 style={{ color: 'red' }}>DEBUG PAGE</h1>
            <p>Time: {new Date().toISOString()}</p>
            <p>Jika ini muncul, Next.js routing bekerja.</p>
        </div>
    )
}