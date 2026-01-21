// File: lib/actions/products.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Product, ProductWithVendor } from '@/types'

// ==========================================
// GET PRODUCTS (untuk homepage/categories)
// ==========================================
export async function getProducts({
    category,
    location,
    searchTerm,
    limit = 12,
    offset = 0,
    sortBy = 'newest'
}: {
    category?: string | null
    location?: string | null
    searchTerm?: string | null
    limit?: number
    offset?: number
    sortBy?: 'newest' | 'featured' | 'price_low' | 'price_high'
} = {}) {
    const supabase = await createClient()

    try {
        let query = supabase
            .from('products')
            .select(`
        *,
        profiles:vendor_id (
          id,
          full_name,
          whatsapp_number
        )
      `, { count: 'exact' })
            .eq('status', 'approved')
            .eq('is_active', true)

        // Filters
        if (category) {
            query = query.eq('category', category)
        }

        if (location) {
            query = query.eq('location', location)
        }

        if (searchTerm && searchTerm.trim()) {
            query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        }

        // Sorting
        switch (sortBy) {
            case 'featured':
                query = query.order('is_featured', { ascending: false })
                query = query.order('created_at', { ascending: false })
                break
            case 'price_low':
                query = query.order('price_from', { ascending: true, nullsFirst: false })
                break
            case 'price_high':
                query = query.order('price_from', { ascending: false, nullsFirst: false })
                break
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false })
        }

        // Pagination
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching products:', error)
            return {
                success: false,
                error: error.message,
                data: [],
                count: 0
            }
        }

        return {
            success: true,
            data: data as ProductWithVendor[],
            count: count || 0
        }
    } catch (error) {
        console.error('Unexpected error in getProducts:', error)
        return {
            success: false,
            error: 'Internal server error',
            data: [],
            count: 0
        }
    }
}

// ==========================================
// GET SIMILAR PRODUCTS (untuk recommendations)
// ==========================================
export async function getSimilarProducts({
    currentProductId,
    category,
    location,
    limit = 6
}: {
    currentProductId: string
    category: string
    location: string
    limit?: number
}) {
    const supabase = await createClient()

    try {
        // Query 1: Produk dengan category + location yang sama (prioritas tinggi)
        const { data: sameLocationProducts } = await supabase
            .from('products')
            .select(`
        *,
        profiles:vendor_id (
          id,
          full_name,
          whatsapp_number
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .eq('category', category)
            .eq('location', location)
            .neq('id', currentProductId)
            .order('created_at', { ascending: false })
            .limit(limit)

        // Jika kurang dari limit, ambil dari category yang sama tapi lokasi berbeda
        if ((sameLocationProducts?.length || 0) < limit) {
            const remaining = limit - (sameLocationProducts?.length || 0)

            const { data: sameCategoryProducts } = await supabase
                .from('products')
                .select(`
          *,
          profiles:vendor_id (
            id,
            full_name,
            whatsapp_number
          )
        `)
                .eq('status', 'approved')
                .eq('is_active', true)
                .eq('category', category)
                .neq('location', location)
                .neq('id', currentProductId)
                .order('created_at', { ascending: false })
                .limit(remaining)

            const combined = [
                ...(sameLocationProducts || []),
                ...(sameCategoryProducts || [])
            ]

            return {
                success: true,
                data: combined as ProductWithVendor[]
            }
        }

        return {
            success: true,
            data: (sameLocationProducts || []) as ProductWithVendor[]
        }
    } catch (error) {
        console.error('Error fetching similar products:', error)
        return {
            success: false,
            error: 'Failed to fetch similar products',
            data: []
        }
    }
}

// ==========================================
// GET VENDOR PRODUCTS (produk dari vendor yang sama)
// ==========================================
export async function getVendorProducts({
    vendorId,
    currentProductId,
    limit = 4
}: {
    vendorId: string
    currentProductId: string
    limit?: number
}) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        profiles:vendor_id (
          id,
          full_name,
          whatsapp_number
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .eq('vendor_id', vendorId)
            .neq('id', currentProductId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching vendor products:', error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }

        return {
            success: true,
            data: (data || []) as ProductWithVendor[]
        }
    } catch (error) {
        console.error('Unexpected error in getVendorProducts:', error)
        return {
            success: false,
            error: 'Internal server error',
            data: []
        }
    }
}

// ==========================================
// GET POPULAR PRODUCTS (berdasarkan contact_logs)
// ==========================================
export async function getPopularProducts({
    currentProductId,
    limit = 6
}: {
    currentProductId: string
    limit?: number
}) {
    const supabase = await createClient()

    try {
        // Ambil product_id yang paling banyak di-contact (7 hari terakhir)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const { data: contactCounts, error: countError } = await supabase
            .from('contact_logs')
            .select('product_id')
            .gte('contacted_at', sevenDaysAgo.toISOString())
            .neq('product_id', currentProductId)

        if (countError) {
            console.error('Error counting contacts:', countError)
            // Fallback: return newest products
            return getFallbackProducts(currentProductId, limit)
        }

        // Hitung popularity
        const productCounts = (contactCounts || []).reduce((acc, log) => {
            acc[log.product_id] = (acc[log.product_id] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        // Sort by count, ambil top product_ids
        const topProductIds = Object.entries(productCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id)

        // Jika tidak ada popular products, fallback ke newest
        if (topProductIds.length === 0) {
            return getFallbackProducts(currentProductId, limit)
        }

        // Fetch actual products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select(`
        *,
        profiles:vendor_id (
          id,
          full_name,
          whatsapp_number
        )
      `)
            .in('id', topProductIds)
            .eq('status', 'approved')
            .eq('is_active', true)

        if (productsError) {
            console.error('Error fetching popular products:', productsError)
            return getFallbackProducts(currentProductId, limit)
        }

        // Sort products by popularity count
        const sortedProducts = (products || []).sort((a, b) => {
            return (productCounts[b.id] || 0) - (productCounts[a.id] || 0)
        })

        return {
            success: true,
            data: sortedProducts as ProductWithVendor[]
        }
    } catch (error) {
        console.error('Unexpected error in getPopularProducts:', error)
        return getFallbackProducts(currentProductId, limit)
    }
}

// ==========================================
// FALLBACK: Newest Products
// ==========================================
async function getFallbackProducts(currentProductId: string, limit: number) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      profiles:vendor_id (
        id,
        full_name,
        whatsapp_number
      )
    `)
        .eq('status', 'approved')
        .eq('is_active', true)
        .neq('id', currentProductId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error in fallback products:', error)
        return {
            success: false,
            error: error.message,
            data: []
        }
    }

    return {
        success: true,
        data: (data || []) as ProductWithVendor[]
    }
}