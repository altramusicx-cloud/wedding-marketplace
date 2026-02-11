// File: app/dashboard/favorites/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from '@/hooks/use-auth-state'
import { UserDashboardLayout } from '@/components/layout/user-dashboard-layout'
import { Container } from '@/components/layout/container'
import { ProductCard, ProductGrid } from '@/components/product/product-card'
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton'
import { getFavoriteProducts } from '@/lib/actions/favorites'
import { createClient } from '@/lib/supabase/client'
import { Heart, Filter, ChevronDown, TrendingUp } from 'lucide-react'

export default function FavoritesPage() {
    const { profile, isLoading: authLoading } = useAuthState()
    const [products, setProducts] = useState<any[]>([])
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingRecommendations, setLoadingRecommendations] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
    const [sortBy, setSortBy] = useState<string>('newest')

    // Calculate stats
    const categories = [...new Set(products.map(p => p.category))]
    const maxPrice = products.length > 0
        ? Math.max(...products.map(p => p.price_from || 0))
        : 0

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        async function loadFavorites() {
            if (!profile?.id) return

            setLoading(true)
            try {
                const data = await getFavoriteProducts()
                if (isMounted) {
                    setProducts(data)

                    // Load recommendations based on favorites
                    if (data.length > 0) {
                        await loadRecommendations(data)
                    }
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error loading favorites:', error)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        async function loadRecommendations(favProducts: any[]) {
            setLoadingRecommendations(true)
            try {
                const supabase = createClient()
                const favoriteCategories = [...new Set(favProducts.map(p => p.category))]
                const excludeIds = favProducts.map(p => p.id)

                const { data: recommendations } = await supabase
                    .from('products')
                    .select(`
            id, name, thumbnail_url, category, location,
            price_from, price_to, price_unit
          `)
                    .eq('status', 'approved')
                    .eq('is_active', true)
                    .not('id', 'in', `(${excludeIds.join(',')})`)
                    .in('category', favoriteCategories.length > 0 ? favoriteCategories : ['venue', 'photographer', 'decoration'])
                    .order('view_count', { ascending: false })
                    .limit(8)

                if (recommendations) {
                    setRecommendedProducts(recommendations)
                }
            } catch (error) {
                console.error('Error loading recommendations:', error)
            } finally {
                setLoadingRecommendations(false)
            }
        }

        if (!authLoading && profile?.id) {
            loadFavorites()
        }

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [authLoading, profile])

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            case 'oldest':
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
            case 'price-low':
                return (a.price_from || 0) - (b.price_from || 0)
            case 'price-high':
                return (b.price_from || 0) - (a.price_from || 0)
            case 'name':
                return a.name.localeCompare(b.name)
            default:
                return 0
        }
    })

    // Filter by category
    const filteredProducts = selectedCategory === 'Semua'
        ? sortedProducts
        : sortedProducts.filter(p => p.category === selectedCategory)

    if (authLoading || !profile) {
        return (
            <UserDashboardLayout
                serverProfile={profile!}
                serverIsVendor={!!profile?.is_vendor}
            >
                <Container className="py-6">
                    <h1 className="text-2xl font-bold mb-6">Favorit Saya</h1>
                    <ProductGrid>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </ProductGrid>
                </Container>
            </UserDashboardLayout>
        )
    }

    return (
        <UserDashboardLayout
            serverProfile={profile}
            serverIsVendor={!!profile?.is_vendor}
        >
            <Container className="py-6">
                {/* ========== ENHANCED HEADER SECTION ========== */}
                <div className="mb-8">
                    {/* Main Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Favorit Saya</h1>
                            <p className="text-neutral-600 mt-1">
                                Kelola produk yang telah Anda simpan
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm bg-white appearance-none pr-10"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="oldest">Terlama</option>
                                    <option value="price-low">Harga: Rendah ke Tinggi</option>
                                    <option value="price-high">Harga: Tinggi ke Rendah</option>
                                    <option value="name">Nama A-Z</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white border border-neutral-200 rounded-lg">
                        <div className="text-center sm:text-left">
                            <div className="text-2xl font-bold text-primary">{products.length}</div>
                            <div className="text-sm text-neutral-600">Total Favorit</div>
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="text-2xl font-bold text-sage">{categories.length}</div>
                            <div className="text-sm text-neutral-600">Kategori</div>
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="text-2xl font-bold text-dusty-rose">
                                {maxPrice > 0 ? `Rp${maxPrice.toLocaleString('id-ID')}` : '-'}
                            </div>
                            <div className="text-sm text-neutral-600">Harga Tertinggi</div>
                        </div>
                    </div>
                </div>

                {/* ========== FILTER BAR ========== */}
                {products.length > 0 && (
                    <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-neutral-500" />
                                <span className="text-sm font-medium text-neutral-700">Filter Kategori</span>
                            </div>
                            {selectedCategory !== 'Semua' && (
                                <button
                                    className="text-sm text-primary hover:text-primary-dark"
                                    onClick={() => setSelectedCategory('Semua')}
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['Semua', ...categories].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${selectedCategory === cat
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========== FAVORITES GRID ========== */}
                {loading ? (
                    <div className="mb-12">
                        <ProductGrid>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </ProductGrid>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="mb-12 text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                            <Heart className="h-12 w-12 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-3">
                            {selectedCategory === 'Semua' ? 'Belum Ada Favorit' : 'Tidak Ada Produk di Kategori Ini'}
                        </h3>
                        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                            {selectedCategory === 'Semua'
                                ? 'Simpan produk yang Anda sukai dengan mengklik ikon hati pada produk. Favorit akan membantu Anda membandingkan dan memilih vendor dengan mudah.'
                                : `Tidak ada produk favorit dalam kategori "${selectedCategory}". Coba kategori lain.`
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="/categories"
                                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                            >
                                Jelajahi Produk
                            </a>
                            <a
                                href="/"
                                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50"
                            >
                                Lihat Rekomendasi
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="mb-12">
                        <ProductGrid>
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        thumbnail_url: product.thumbnail_url || undefined,
                                        category: product.category,
                                        location: product.location,
                                        price_from: product.price_from || undefined,
                                        price_to: product.price_to || undefined,
                                        price_unit: product.price_unit || undefined,
                                    }}
                                />
                            ))}
                        </ProductGrid>
                    </div>
                )}

                {/* ========== RECOMMENDATIONS SECTION ========== */}
                {(!loading && (products.length > 0 || recommendedProducts.length > 0)) && (
                    <section className="pt-8 border-t border-neutral-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">
                                    {products.length > 0 ? 'Rekomendasi Untuk Anda' : 'Produk Populer'}
                                </h2>
                                <p className="text-neutral-600 mt-1">
                                    {products.length > 0
                                        ? 'Produk lain yang mungkin Anda suka'
                                        : 'Mulai jelajahi vendor wedding terbaik'
                                    }
                                </p>
                            </div>
                            <a
                                href="/categories"
                                className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                            >
                                Lihat semua <TrendingUp className="h-4 w-4" />
                            </a>
                        </div>

                        {loadingRecommendations ? (
                            <ProductGrid>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </ProductGrid>
                        ) : recommendedProducts.length > 0 ? (
                            <ProductGrid>
                                {recommendedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            thumbnail_url: product.thumbnail_url || undefined,
                                            category: product.category,
                                            location: product.location,
                                            price_from: product.price_from || undefined,
                                            price_to: product.price_to || undefined,
                                            price_unit: product.price_unit || undefined,
                                        }}
                                    />
                                ))}
                            </ProductGrid>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-neutral-500">Belum ada rekomendasi tersedia</p>
                            </div>
                        )}
                    </section>
                )}
            </Container>
        </UserDashboardLayout>
    )
}