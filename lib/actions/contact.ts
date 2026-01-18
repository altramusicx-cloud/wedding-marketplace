// File: lib/actions/contact.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ContactLog } from '@/types'

export async function logContact({
    vendorId,
    productId,
    productName,
    vendorName,
    userEmail,
    userName,
    userWhatsApp
}: {
    vendorId: string
    productId: string
    productName: string
    vendorName: string
    userEmail: string
    userName: string
    userWhatsApp: string
}) {
    const supabase = await createClient()

    try {
        // Cek apakah user sudah login
        const { data: { user } } = await supabase.auth.getUser()

        // Log contact ke database
        const { data, error } = await supabase
            .from('contact_logs')
            .insert({
                user_id: user?.id || null,
                vendor_id: vendorId,
                product_id: productId,
                user_name: userName,
                user_whatsapp: userWhatsApp,
                vendor_name: vendorName,
                product_name: productName,
                contact_method: 'whatsapp',
                status: 'contacted',
                contacted_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            console.error('Error logging contact:', error)
            return {
                success: false,
                error: error.message,
                code: 'DATABASE_ERROR'
            }
        }

        // Revalidate dashboard vendor untuk update stats
        revalidatePath(`/dashboard/vendor`)

        return {
            success: true,
            data: data as ContactLog,
            message: 'Contact berhasil dicatat'
        }

    } catch (error) {
        console.error('Unexpected error:', error)
        return {
            success: false,
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        }
    }
}

// Fungsi untuk mengambil contact logs (akan digunakan di dashboard)
export async function getContactLogs(vendorId: string, limit = 20) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('contact_logs')
            .select(`
        *,
        products:product_id (
          name,
          thumbnail_url
        )
      `)
            .eq('vendor_id', vendorId)
            .order('contacted_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching contact logs:', error)
            return { success: false, error: error.message }
        }

        return {
            success: true,
            data: data as (ContactLog & {
                products: { name: string; thumbnail_url: string | null }
            })[]
        }

    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal server error' }
    }
}