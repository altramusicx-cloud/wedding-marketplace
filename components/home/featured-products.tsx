// components/home/featured-products.tsx
'use client'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    slug: string
    description: string
    category: string
    location: string
    price_from?: number
    price_to?: number
    price_unit?: string
    thumbnail_url?: string
    created_at: string
    profiles?: {
        full_name: string
        avatar_url?: string
    }[]
}

interface FeaturedProductsProps {
    products: Product[]
    title: string
    variant?: 'carousel' | 'grid'
    showViewAll?: boolean
}

export function FeaturedProducts({
    products,
    title,
    variant = 'carousel',
    showViewAll = true
}: FeaturedProductsProps) {

    console.log('🔄 FeaturedProducts rendering:', products.length, 'products')
    products.forEach((p: any, i: number) => {
        console.log(`  ${i}: ${p.id} - ${p.name}`)
    })

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">Belum ada produk tersedia</div>
                <Button asChild variant="outline">
                    <Link href="/categories">Jelajahi Kategori</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-charcoal">{title}</h3>
                {showViewAll && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/categories" className="flex items-center gap-1">
                            Lihat semua
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </div>

            {variant === 'carousel' ? (
                <div className="relative">
                    <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
                        {products.map((product) => (
                            <div key={`card-${product.id}-${product.thumbnail_url}`} className="min-w-[280px] max-w-[280px]">
                                <ProductCard product={{
                                    id: product.id,
                                    name: product.name,
                                    thumbnail_url: product.thumbnail_url || '',
                                    category: product.category,
                                    location: product.location,
                                    price_from: product.price_from,
                                    price_to: product.price_to,
                                    vendor_name: product.profiles?.[0]?.full_name || 'Vendor',
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={`${product.id}-${product.thumbnail_url}`}
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
                        />
                    ))}
                </div>
            )}
        </div>
    )
}