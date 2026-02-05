// components/product/product-card.tsx
'use client'

import { Eye, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProductCardProps {
    product: {
        id: string
        name: string
        thumbnail_url?: string
        category: string
        location: string
        price_from?: number
        price_to?: number
        price_unit?: string
        view_count?: number
        is_featured?: boolean
    }
    variant?: 'default' | 'compact' | 'featured'
    isLoading?: boolean
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop"

const formatPrice = (price?: number) => {
    if (!price) return "0"
    return new Intl.NumberFormat('id-ID').format(price)
}

const formatLocation = (location: string) => {
    if (!location) return ['-', '-']
    const parts = location.split(',')
    if (parts.length >= 2) {
        return [parts[0].trim(), parts[1].trim()]
    }
    return [location.trim(), '-']
}

// Skeleton langsung di file ini
function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-[3px] overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-1.5 space-y-0.5">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
        </div>
    )
}

export function ProductCard({
    product,
    variant = 'default',
    isLoading = false
}: ProductCardProps) {
    const isMobile = useMediaQuery('(max-width: 768px)')
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

    const effectiveVariant = isMobile ? 'compact' : variant
    const isCompactMode = effectiveVariant === 'compact'

    if (isLoading) {
        return <ProductCardSkeleton />
    }

    const getImageUrl = () => {
        if (!product.thumbnail_url) {
            return FALLBACK_IMAGE
        }
        return product.thumbnail_url
    }

    const imageUrl = getImageUrl()
    const [city, district] = formatLocation(product.location)
    const displayPrice = product.price_from || product.price_to || 0
    const viewCount = product.view_count || Math.floor(Math.random() * 900) + 100

    return (
        <Link
            href={`/vendor/${product.id}`}
            className="block outline-none focus:outline-none"
            aria-label={`View ${product.name} details`}
        >
            {/* CARD SHOPEE STYLE - DIV BIASA */}
            <div className={cn(
                "bg-white border border-[#E5E5E5] rounded-[3px] overflow-hidden",
                "shadow-sm hover:shadow-md transition-shadow duration-200",
                prefersReducedMotion ? "" : "active:scale-[0.98]",
                "cursor-pointer"
            )}>
                {/* Image Section - NO GAP */}
                <div className="relative aspect-square">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '3px 3px 0 0' }}
                        sizes="(max-width: 640px) 50vw, 20vw"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = FALLBACK_IMAGE
                        }}
                    />

                    {/* Badge Kategori - kiri atas (diperbesar) */}
                    <span className="bg-[#EE4D2D] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-br-[2px]">
                        {product.category}
                    </span>

                    {/* Viewer Count - kanan atas (diperbesar, sejajar) 
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-2 bg-[#EE4D2D] text-white rounded-[2px] px-1.5 py-0.5">
                        <Eye className="h-2.5 w-2.5" />
                        <span className="text-[9px] font-medium">{viewCount.toLocaleString('id-ID')}</span>
                    </div>*/}
                </div>

                {/* Content Section - FIXED SPACING */}
                <div className="p-1.5 space-y-1">
                    {/* Title - FIXED HEIGHT 2 lines max */}
                    <h3 className="font-normal text-[#212121] text-[11px] leading-tight line-clamp-2 h-8">
                        {product.name}
                    </h3>

                    {/* Location - SINGLE LINE */}
                    <div className="flex items-center gap-1">
                        <MapPin className="h-2 w-2 text-[#757575] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] text-[#757575] truncate">
                                {city}
                            </div>
                            {district !== '-' && (
                                <div className="text-[8px] text-[#757575] truncate pl-0.5">
                                    {district}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Label */}
                    <div className="text-[8px] text-[#757575]">
                        Harga mulai
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline">
                        <span className="text-[#EE4D2D] font-bold text-[13px] leading-none">
                            Rp{formatPrice(displayPrice)}
                        </span>
                        {product.price_unit && (
                            <span className="text-[#757575] text-[10px] ml-0.5">
                                /{product.price_unit}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

// Product Grid - SHOPEE STYLE
export function ProductGrid({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn(
            "grid grid-cols-2 gap-2",
            "sm:grid-cols-3 sm:gap-3",
            "md:grid-cols-4 md:gap-3",
            "lg:grid-cols-5 lg:gap-3",
            className
        )}>
            {children}
        </div>
    )
}

// Export skeleton juga
export { ProductCardSkeleton }