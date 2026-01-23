// components/product/recommendations.tsx
import { ProductCard, ProductGrid } from './product-card'
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
    limit = 8
}: RecommendationsProps) {
    const supabase = await createClient()

    try {
        // Simple query: ambil produk dengan kategori sama, kecuali produk saat ini
        const { data: products, error } = await supabase
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
                status,
                is_active,
                profiles:vendor_id (full_name)
            `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .neq('id', currentProductId) // exclude current product
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Supabase error:', error)
            throw error
        }

        // Debug: log data yang didapat
        console.log('Recommendations data:', products?.length, 'products')

        if (!products || products.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Belum ada rekomendasi produk saat ini.</p>
                    <p className="text-xs mt-2">Coba lihat kategori {currentCategory} lainnya.</p>
                </div>
            )
        }

        // Format untuk ProductCard (SAMA DENGAN HOMEPAGE)
        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            thumbnail_url: product.thumbnail_url ?? undefined,
            category: product.category,
            location: product.location,
            price_from: product.price_from ?? undefined,
            price_to: product.price_to ?? undefined,
            price_unit: product.price_unit ?? undefined,
            view_count: Math.floor(Math.random() * 900) + 100 // Random seperti homepage
        }))

        return (
            <div>
                <ProductGrid>
                    {formattedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            variant="default" // SAMA DENGAN HOMEPAGE
                        />
                    ))}
                </ProductGrid>


            </div>
        )

    } catch (error) {
        console.error('Error in Recommendations component:', error)

        // Fallback: tampilkan pesan error atau empty state
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Gagal memuat rekomendasi.</p>
                <p className="text-xs mt-2">Silakan refresh halaman atau coba lagi nanti.</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    🔄 Refresh
                </Button>
            </div>
        )
    }
}

// Tambah import Button
import { Button } from "@/components/ui/button"