// File: app/(public)/page.tsx
// UPDATE: Import ProductGrid & ProductCard dari file yang sama
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { SearchBar } from '@/components/shared/search-bar'
import { Container } from '@/components/layout/container'
import { ProductGridInfinite } from '@/components/product/product-grid-infinite'
import { ProductGrid, ProductCard } from '@/components/product/product-card' // UPDATE IMPORT
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton' // NEW IMPORT

export default async function HomePage() {
    const supabase = await createClient()

    try {
        // Fetch featured products (approved and featured)
        const { data: featuredProducts, error: featuredError } = await supabase
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
        profiles:vendor_id (
          full_name,
          avatar_url
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(8)

        console.log('=== HOMEPAGE DEBUG DETAIL ===')
        featuredProducts?.forEach((p: any, i: number) => {
            console.log(`Product ${i}:`, {
                id: p.id,
                name: p.name,
                thumbnail_url: p.thumbnail_url,
                thumbnail_url_short: p.thumbnail_url?.substring(0, 50) + '...'
            })
        })

        if (featuredError) {
            console.error('Error fetching featured products:', featuredError)
        }

        // Fetch recent products (for "Produk Terbaru" section)
        const { data: recentProducts, error: recentError } = await supabase
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
        profiles:vendor_id (
          full_name,
          avatar_url
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(12) // TETAP 12 untuk static section

        if (recentError) {
            console.error('Error fetching recent products:', recentError)
        }

        // Fetch initial products for infinite scroll (12 pertama)
        const { data: initialInfiniteProducts, error: infiniteError } = await supabase
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
        profiles:vendor_id (
          full_name,
          avatar_url
        )
      `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(12)

        if (infiniteError) {
            console.error('Error fetching initial infinite products:', infiniteError)
        }

        // Fetch categories count
        const { data: categories, error: categoriesError } = await supabase
            .from('products')
            .select('category')
            .eq('status', 'approved')
            .eq('is_active', true)

        if (categoriesError) {
            console.error('Error fetching categories:', categoriesError)
        }

        // Count products per category
        const categoryCounts = categories?.reduce((acc: Record<string, number>, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
        }, {}) || {}

        return (
            <div className="min-h-screen bg-ivory">
                {/* Hero Section */}
                <HeroSection />

                {/* Search Bar */}
                <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
                    <Container className="py-4">
                        <SearchBar />
                    </Container>
                </div>

                {/* Main Content */}
                <Container className="py-8">
                    {/* Categories */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-charcoal">Jelajahi Kategori</h2>
                            <a
                                href="/categories"
                                className="text-blush hover:text-blush-dark font-medium"
                            >
                                Lihat semua →
                            </a>
                        </div>
                        <CategoryGrid categoryCounts={categoryCounts} />
                    </section>

                    {/* Featured Products */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-charcoal">Produk Unggulan</h2>
                            <a
                                href="/categories?sort=featured"
                                className="text-blush hover:text-blush-dark font-medium"
                            >
                                Lihat semua →
                            </a>
                        </div>

                        {/* UPDATE: Gunakan ProductGrid baru */}
                        <ProductGrid>
                            {featuredProducts && featuredProducts.length > 0 ? (
                                featuredProducts.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            vendor_name: Array.isArray(product.profiles)
                                                ? product.profiles[0]?.full_name
                                                : product.profiles?.full_name
                                        }}
                                        showFavorite={true}
                                    />
                                ))
                            ) : (
                                // Skeleton loading jika tidak ada data
                                Array.from({ length: 4 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))
                            )}
                        </ProductGrid>
                    </section>

                    {/* Recent Products (TETAP STATIC 12) */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-charcoal">Produk Terbaru</h2>
                            <a
                                href="/categories?sort=newest"
                                className="text-blush hover:text-blush-dark font-medium"
                            >
                                Lihat semua →
                            </a>
                        </div>

                        {/* UPDATE: Gunakan ProductGrid baru */}
                        <ProductGrid>
                            {recentProducts && recentProducts.length > 0 ? (
                                recentProducts.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            vendor_name: Array.isArray(product.profiles)
                                                ? product.profiles[0]?.full_name
                                                : product.profiles?.full_name
                                        }}
                                        showFavorite={true}
                                    />
                                ))
                            ) : (
                                // Skeleton loading
                                Array.from({ length: 6 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))
                            )}
                        </ProductGrid>
                    </section>

                    {/* NEW: Infinite Scroll Products Section */}
                    <section className="mb-12">
                        <ProductGridInfinite
                            initialProducts={initialInfiniteProducts || []}
                            title="Jelajahi Semua Produk"
                            showViewAll={false}
                        />
                    </section>

                    {/* Stats Section */}
                    <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-blush mb-2">
                                    {categories?.length || 0}+
                                </div>
                                <div className="text-gray-600">Produk Terdaftar</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-sage mb-2">
                                    {Object.keys(categoryCounts).length || 0}
                                </div>
                                <div className="text-gray-600">Kategori</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-dusty-rose mb-2">
                                    500+
                                </div>
                                <div className="text-gray-600">Pesanan Sukses</div>
                            </div>
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