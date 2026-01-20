// File: components/product/product-grid-infinite.tsx
'use client'

import { ProductCard, ProductGrid } from '@/components/product/product-card'
import { LoadingSpinner, ProductCardSkeleton } from '@/components/shared/loading-spinner'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

interface ProductGridInfiniteProps {
    initialProducts: any[]
    category?: string | null
    searchTerm?: string | null
    title?: string
    showViewAll?: boolean
    className?: string
}

export function ProductGridInfinite({
    initialProducts,
    category = null,
    searchTerm = null,
    title,
    showViewAll = true,
    className
}: ProductGridInfiniteProps) {
    const {
        products,
        isLoadingMore,
        hasMore,
        error,
        loadMore,
        retry,
        observerRef
    } = useInfiniteScroll({
        initialProducts,
        category,
        searchTerm
    })

    // Show empty state jika tidak ada produk sama sekali
    if (products.length === 0 && !isLoadingMore) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">
                    Tidak ada produk ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                    {category ? `Tidak ada produk dalam kategori "${category}"` : 'Coba gunakan kata kunci lain'}
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Muat Ulang
                </Button>
            </div>
        )
    }

    return (
        <div className={className}>
            {/* Title Section */}
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
                    {showViewAll && products.length > 0 && (
                        <a
                            href="/categories"
                            className="text-blush hover:text-blush-dark font-medium text-sm"
                        >
                            Lihat semua →
                        </a>
                    )}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium mb-2">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={retry}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                                <RefreshCw className="h-3 w-3 mr-2" />
                                Coba Lagi
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Grid */}
            <ProductGrid>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            ...product,
                            vendor_name: product.profiles?.full_name
                        }}
                        showFavorite={true}
                    />
                ))}

                {/* Loading Skeletons */}
                {isLoadingMore && (
                    <>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="animate-pulse">
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </>
                )}
            </ProductGrid>

            {/* Load More Trigger (Intersection Observer target) */}
            {hasMore && !isLoadingMore && !error && (
                <div
                    ref={observerRef}
                    className="h-10 w-full"
                    aria-hidden="true"
                />
            )}

            {/* Load More Button (Fallback for older browsers) */}
            {hasMore && !isLoadingMore && !error && (
                <div className="text-center mt-8">
                    <Button
                        variant="outline"
                        onClick={loadMore}
                        className="border-blush text-blush hover:bg-blush-light"
                    >
                        Muat Produk Lainnya
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                        Scroll ke bawah untuk memuat lebih banyak
                    </p>
                </div>
            )}

            {/* Loading More Spinner */}
            {isLoadingMore && (
                <div className="text-center py-8">
                    <LoadingSpinner
                        size="lg"
                        text="Memuat produk..."
                    />
                </div>
            )}

            {/* No More Products */}
            {!hasMore && products.length > 0 && (
                <div className="text-center py-8 border-t">
                    <p className="text-gray-600">
                        Tidak ada produk lagi untuk ditampilkan
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Menampilkan {products.length} produk
                    </p>
                </div>
            )}
        </div>
    )
}