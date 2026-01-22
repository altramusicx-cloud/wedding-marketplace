// File: app/(public)/categories/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/container'
import { ProductGrid, ProductCard } from '@/components/product/product-card' // ✅ Import benar
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton' // ✅ Tambahkan skeleton
import { SearchBar } from '@/components/shared/search-bar'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants/categories'
import { categorySearchSchema, type CategorySearchParams } from '@/lib/validation/category-schema'
import { buildSafeIlikeQuery } from '@/lib/utils/safe-search'
import { generateMetadata } from '@/lib/utils/generate-metadata'

export const metadata = generateMetadata({
    title: 'Kategori Vendor Wedding Kalimantan',
    description: 'Telusuri kategori vendor pernikahan di Kalimantan: fotografer, dekorasi, catering, venue, gaun pengantin, dan masih banyak lagi.',
    url: '/categories',
})

interface CategoriesPageProps {
    searchParams: Promise<CategorySearchParams>
}

export default async function CategoriesPage({
    searchParams
}: CategoriesPageProps) {
    // Validasi search params sesuai blueprint
    const validatedParams = categorySearchSchema.parse(await searchParams)
    const { search, category, sort = 'newest', page = 1 } = validatedParams

    const supabase = await createClient()
    const limit = 12 // ✅ UPDATE: 12 items (kelipatan 2,3,4 untuk grid konsisten)
    const offset = (page - 1) * limit

    // Build query dengan safety measures
    let query = supabase
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
      profiles:vendor_id (
  full_name,
  avatar_url
)
    `, { count: 'exact' })
        .eq('status', 'approved')
        .eq('is_active', true)

    // Apply safe search filter
    if (search && search.trim().length >= 2) {
        const safeQuery = buildSafeIlikeQuery(search, [
            'name',
            'description',
            'category',
            'location'
        ])
        query = query.or(safeQuery)
    }

    // Apply category filter
    if (category) {
        query = query.eq('category', category)
    }

    // Apply sorting
    switch (sort) {
        case 'featured':
            query = query.order('is_featured', { ascending: false })
            break
        case 'price_low':
            query = query.order('price_from', { ascending: true, nullsFirst: false }) // ✅
            break
        case 'price_high':
            query = query.order('price_from', { ascending: false, nullsFirst: false }) // ✅
            break
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: products, error, count } = await query

    if (error) {
        console.error('Error fetching products:', error)
        throw new Error('Failed to load products')
    }

    const totalPages = count ? Math.ceil(count / limit) : 1

    return (
        <div className="min-h-screen bg-ivory">


            <Container className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Categories & Filters */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Categories */}
                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-lg text-charcoal mb-4">Kategori</h3>
                            <div className="space-y-2">
                                {CATEGORIES.map((cat) => (
                                    <a
                                        key={cat.id}
                                        href={`/categories?${new URLSearchParams({
                                            ...validatedParams,
                                            category: cat.id,
                                            page: '1'
                                        }).toString()}`}
                                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors ${category === cat.id ? 'bg-blush-light text-blush-dark' : ''
                                            }`}
                                    >
                                        <span className="font-medium">{cat.name}</span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {cat.count}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-lg text-charcoal mb-4">Urutkan</h3>
                            <div className="space-y-2">
                                {SORT_OPTIONS.map((option) => (
                                    <a
                                        key={option.id}
                                        href={`/categories?${new URLSearchParams({
                                            ...validatedParams,
                                            sort: option.id,
                                            page: '1'
                                        }).toString()}`}
                                        className={`block p-2 rounded-lg hover:bg-gray-50 transition-colors ${sort === option.id ? 'bg-blush-light text-blush-dark' : ''
                                            }`}
                                    >
                                        {option.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - Products */}
                    <main className="lg:col-span-3">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-charcoal mb-2">
                                {search
                                    ? `Hasil pencarian: "${search}"`
                                    : category
                                        ? `Kategori: ${CATEGORIES.find(c => c.id === category)?.name || category}`
                                        : 'Semua Produk'}
                            </h1>
                            <p className="text-gray-600">
                                Menampilkan {products?.length || 0} produk
                                {count && count > limit && ` dari total ${count} produk`}
                            </p>
                        </div>

                        {/* Products Grid */}
                        {products && products.length > 0 ? (
                            <>
                                <ProductGrid>
                                    {products.map((product) => (
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
                                                // HAPUS vendor_name karena tidak ada di interface
                                                // view_count bisa ditambahkan jika ada di database
                                            }}
                                        />
                                    ))}
                                </ProductGrid>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8">
                                        {page > 1 && (
                                            <a
                                                href={`/categories?${new URLSearchParams({
                                                    ...validatedParams,
                                                    page: (page - 1).toString()
                                                }).toString()}`}
                                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                            >
                                                ← Sebelumnya
                                            </a>
                                        )}

                                        <span className="px-4 py-2 text-gray-600">
                                            Halaman {page} dari {totalPages}
                                        </span>

                                        {page < totalPages && (
                                            <a
                                                href={`/categories?${new URLSearchParams({
                                                    ...validatedParams,
                                                    page: (page + 1).toString()
                                                }).toString()}`}
                                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                            >
                                                Selanjutnya →
                                            </a>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            // ✅ SKELETON LOADING saat tidak ada data
                            <ProductGrid>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </ProductGrid>
                        )}
                    </main>
                </div>
            </Container>
        </div>
    )
}