// File: lib/actions/admin.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveProduct(productId: string) {
    const supabase = await createClient()

    try {
        // Update product status to approved
        const { data, error } = await supabase
            .from('products')
            .update({
                status: 'approved',
                approved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single()

        if (error) {
            console.error('Error approving product:', error)
            return { success: false, error: error.message }
        }

        // Revalidate pages
        revalidatePath('/admin/products')
        revalidatePath('/admin')
        revalidatePath('/categories')
        revalidatePath('/')

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal server error' }
    }
}

export async function rejectProduct(productId: string, reason: string) {
    const supabase = await createClient()

    try {
        // Update product status to rejected
        const { data, error } = await supabase
            .from('products')
            .update({
                status: 'rejected',
                rejected_at: new Date().toISOString(),
                rejection_reason: reason,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single()

        if (error) {
            console.error('Error rejecting product:', error)
            return { success: false, error: error.message }
        }

        // Revalidate pages
        revalidatePath('/admin/products')
        revalidatePath('/admin')

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal server error' }
    }
}

export async function getAdminStats() {
    const supabase = await createClient()

    try {
        const [
            { count: pendingProducts },
            { count: totalVendors },
            { count: todayContacts },
            { count: totalProducts }
        ] = await Promise.all([
            supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_vendor', true),
            supabase.from('contact_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
            supabase.from('products').select('*', { count: 'exact', head: true })
        ])

        return {
            success: true,
            data: {
                pendingProducts: pendingProducts || 0,
                totalVendors: totalVendors || 0,
                todayContacts: todayContacts || 0,
                totalProducts: totalProducts || 0
            }
        }
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return { success: false, error: 'Internal server error' }
    }
}