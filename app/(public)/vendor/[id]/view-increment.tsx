'use client'

import { useEffect } from 'react'
import { useAuthState } from '@/hooks/use-auth-state'

export function ViewIncrement({ productId }: { productId: string }) {
    const { user, isLoading } = useAuthState()

    useEffect(() => {
        // Increment view hanya jika user login dan bukan loading
        if (!isLoading && user?.id) {
            const incrementView = async () => {
                try {
                    // Simple POST tanpa body, API akan ambil user dari session
                    const response = await fetch(`/api/products/${productId}/view`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    })

                    // Optional: Log untuk debugging
                    if (!response.ok) {
                        console.debug('View increment failed:', await response.text())
                    }
                } catch (error) {
                    // Silent fail, tidak critical untuk UX
                    console.debug('View increment error (non-critical):', error)
                }
            }

            // Delay sedikit agar tidak block rendering
            const timer = setTimeout(incrementView, 500)
            return () => clearTimeout(timer)
        }
    }, [productId, user?.id, isLoading])

    // Component ini tidak render apa-apa (invisible)
    return null
}