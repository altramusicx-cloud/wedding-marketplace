// File: components/product/recommendations.tsx
import { ProductCard } from './product-card'
import { getSimilarProducts, getVendorProducts, getPopularProducts } from '@/lib/actions/products'
import type { ProductWithVendor } from '@/types'

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
    // Fetch semua recommendations secara parallel
    const [similarResult, vendorResult, popularResult] = await Promise.all([
        getSimilarProducts({
            currentProductId,
            category: currentCategory,
            location: currentLocation,
            limit
        }),
        getVendorProducts({
            vendorId,
            currentProductId,
            limit: 4
        }),
        getPopularProducts({
            currentProductId,
            limit: 4
        })
    ])

    // Extract data
    const similarProducts = similarResult.success ? similarResult.data : []
    const vendorProducts = vendorResult.success ? vendorResult.data : []
    const popularProducts = popularResult.success ? popularResult.data : []

    // Jika semua section kosong, return empty state
    const hasAnyRecommendations =
        similarProducts.length > 0 ||
        vendorProducts.length > 0 ||
        popularProducts.length > 0

    if (!hasAnyRecommendations) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Belum ada rekomendasi produk saat ini.</p>
            </div>
        )
    }

    // Format product untuk ProductCard
    const formatProduct = (product: ProductWithVendor) => ({
        id: product.id,
        name: product.name,
        thumbnail_url: product.thumbnail_url ?? undefined,
        category: product.category,
        location: product.location,
        price_from: product.price_from ?? undefined,
        price_to: product.price_to ?? undefined,
        price_unit: product.price_unit ?? undefined,
        vendor_name: product.profiles?.full_name || 'Vendor',
        is_featured: product.is_featured
    })

    return (
        <div className="space-y-12">
            {/* Section 1: Similar Products */}
            {similarProducts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-charcoal">Produk Serupa</h3>
                        <span className="text-sm text-gray-500">
                            {similarProducts.length} produk
                        </span>
                    </div>

                    {/* Grid 2 kolom di mobile, 4 di desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {similarProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={formatProduct(product)}
                                variant="compact"

                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Section 2: Vendor's Other Products */}
            {vendorProducts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-charcoal">Produk Lain dari Vendor Ini</h3>
                        <span className="text-sm text-gray-500">
                            {vendorProducts.length} produk
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {vendorProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={formatProduct(product)}
                                variant="compact"

                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Section 3: Popular Products */}
            {popularProducts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-charcoal">Produk Populer</h3>
                        <span className="text-sm text-gray-500">
                            Paling banyak dihubungi minggu ini
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {popularProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={formatProduct(product)}
                                variant="compact"

                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}