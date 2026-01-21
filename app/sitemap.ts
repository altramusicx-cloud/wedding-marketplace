// app/sitemap.ts
import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://weddingmarket.com'
    const supabase = await createClient()

    // 1. Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
    ]

    // 2. Dynamic routes: Products
    try {
        const { data: products } = await supabase
            .from('products')
            .select('id, updated_at, status, is_active')
            .eq('status', 'approved')
            .eq('is_active', true)
            .limit(1000) // Batasi untuk sitemap size

        const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
            url: `${baseUrl}/vendor/${product.id}`,
            lastModified: new Date(product.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        // 3. Combine all routes
        return [...staticRoutes, ...productRoutes]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return static routes saja jika error
        return staticRoutes
    }
}