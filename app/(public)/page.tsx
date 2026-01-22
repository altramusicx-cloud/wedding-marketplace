// app/(public)/page.tsx (SIMPLIFIED VERSION)
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { SearchBar } from '@/components/shared/search-bar'
import { Container } from '@/components/layout/container'
import { ProductGridInfinite } from '@/components/product/product-grid-infinite'
import { ProductGrid, ProductCard } from '@/components/product/product-card'
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton'
import { generateMetadata } from '@/lib/utils/generate-metadata'

export const metadata = generateMetadata({
    title: 'Temukan Vendor Wedding Terbaik di Kalimantan',
    description: 'Cari dan bandingkan vendor pernikahan terpercaya di Kalimantan. Foto, dekorasi, catering, venue, dan masih banyak lagi. Hubungi langsung via WhatsApp!',
    url: '/',
})

export const revalidate = 3600

// Simple helper function
function getVendorName(product: any): string {
    if (!product.profiles) return 'Vendor'

    if (Array.isArray(product.profiles)) {
        return product.profiles[0]?.full_name || 'Vendor'
    }

    return product.profiles.full_name || 'Vendor'
}

export default async function HomePage() {
    const supabase = await createClient()

    try {
        // Single optimized query
        const { data: allProducts, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                slug,
                description,
                category,
                location,
                price_from,
                price_to,
                price_unit,
                thumbnail_url,
                created_at,
                is_featured,
                is_active,
                status,
                profiles:vendor_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(30)

        if (error) throw error

        const products = allProducts || []

        // Client-side filtering
        const featuredProducts = products.filter(p => p.is_featured).slice(0, 8)
        const recentProducts = products.slice(0, 12)
        const initialInfiniteProducts = products.slice(0, 12)

        // Categories count
        const categoryCounts = products.reduce((acc: Record<string, number>, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1
            return acc
        }, {})

        return (
            <div className="min-h-screen bg-ivory">
                <HeroSection />


                <Container className="py-8">
                    {/* Featured Products */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-charcoal">Produk Unggulan</h2>
                            <a href="/categories?sort=featured" className="text-blush hover:text-blush-dark font-medium">
                                Lihat semua →
                            </a>
                        </div>
                        <ProductGrid>
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            thumbnail_url: product.thumbnail_url,
                                            category: product.category,
                                            location: product.location,
                                            price_from: product.price_from,
                                            price_to: product.price_to,
                                            price_unit: product.price_unit,

                                        }}

                                    />

                                ))
                            ) : (
                                Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                            )}
                        </ProductGrid>
                    </section>

                    {/* Recent Products */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-charcoal">Produk Terbaru</h2>
                            <a href="/categories?sort=newest" className="text-blush hover:text-blush-dark font-medium">
                                Lihat semua →
                            </a>
                        </div>
                        <ProductGrid>
                            {recentProducts.length > 0 ? (
                                recentProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            thumbnail_url: product.thumbnail_url,
                                            category: product.category,
                                            location: product.location,
                                            price_from: product.price_from,
                                            price_to: product.price_to,
                                            price_unit: product.price_unit,

                                        }}

                                    />
                                ))
                            ) : (
                                Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                            )}
                        </ProductGrid>
                    </section>

                    {/* Infinite Scroll */}
                    <section className="mb-12">
                        <ProductGridInfinite
                            initialProducts={initialInfiniteProducts}
                            title="Jelajahi Semua Produk"
                            showViewAll={false}
                        />
                    </section>

                    {/* Stats */}
                    <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div><div className="text-4xl font-bold text-blush mb-2">{products.length}+</div><div className="text-gray-600">Produk Terdaftar</div></div>
                            <div><div className="text-4xl font-bold text-sage mb-2">{Object.keys(categoryCounts).length || 0}</div><div className="text-gray-600">Kategori</div></div>
                            <div><div className="text-4xl font-bold text-dusty-rose mb-2">500+</div><div className="text-gray-600">Pesanan Sukses</div></div>
                        </div>
                    </section>
                </Container>
            </div>
        )
    } catch (error) {
        console.error('Error in homepage:', error)
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-charcoal mb-4">Terjadi Kesalahan</h1>
                        <p className="text-gray-600">Silakan coba beberapa saat lagi.</p>
                    </div>
                </Container>
            </div>
        )
    }
}