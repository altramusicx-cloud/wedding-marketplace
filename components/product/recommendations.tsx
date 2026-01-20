// components/product/recommendations.tsx
import { ProductCard } from './product-card'
import { createClient } from '@/lib/supabase/server'

interface RecommendationsProps {
    currentProductId: string
    currentCategory: string
    currentLocation: string
    vendorId: string
    limit?: number
}

export async function Recommendations({
    currentProductId,
    currentCategory,
    currentLocation,
    vendorId,
    limit = 6
}: RecommendationsProps) {
    const supabase = await createClient()

    try {
        // 1. Fetch similar products (same category, different location optional)
        const { data: similarProducts } = await supabase
            .from('products')
            .select(`
        id,
        name,
        thumbnail_url,
        category,
        location,
        price_from,
        price_to,
        price_unit,
        created_at,
        profiles:vendor_id (
          full_name
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .eq('category', currentCategory)
            .neq('id', currentProductId)
            .order('created_at', { ascending: false })
            .limit(limit)

        // 2. Fetch vendor's other products
        const { data: vendorProducts } = await supabase
            .from('products')
            .select(`
        id,
        name,
        thumbnail_url,
        category,
        location,
        price_from,
        price_to,
        price_unit,
        created_at,
        profiles:vendor_id (
          full_name
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .eq('vendor_id', vendorId)
            .neq('id', currentProductId)
            .order('created_at', { ascending: false })
            .limit(4)

        // 3. Fetch popular products (based on contact logs)
        const { data: popularProducts } = await supabase
            .from('products')
            .select(`
        id,
        name,
        thumbnail_url,
        category,
        location,
        price_from,
        price_to,
        price_unit,
        created_at,
        profiles:vendor_id (
          full_name
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .neq('id', currentProductId)
            .order('created_at', { ascending: false })
            .limit(4)

        const sections = [
            {
                title: 'Produk Serupa',
                products: similarProducts || [],
                condition: similarProducts && similarProducts.length > 0
            },
            {
                title: 'Produk Lain dari Vendor Ini',
                products: vendorProducts || [],
                condition: vendorProducts && vendorProducts.length > 0
            },
            {
                title: 'Produk Populer',
                products: popularProducts || [],
                condition: popularProducts && popularProducts.length > 0
            }
        ]

        return (
            <div className="space-y-8">
                {sections.map((section, index) => (
                    section.condition ? (
                        <div key={index} className="space-y-4">
                            <h3 className="text-xl font-bold text-charcoal">{section.title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {section.products.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            thumbnail_url: product.thumbnail_url || '',
                                            category: product.category,
                                            location: product.location,
                                            price_from: product.price_from,
                                            price_to: product.price_to,
                                            vendor_name: product.profiles?.[0]?.full_name || 'Vendor',
                                        }}
                                        variant="compact"
                                        showFavorite={true}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
        )
    } catch (error) {
        console.error('Error fetching recommendations:', error)
        return (
            <div className="text-center py-8 text-gray-500">
                Rekomendasi tidak tersedia saat ini.
            </div>
        )
    }
}