"use client"

import { Heart, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useFavorites } from '@/hooks/use-favorites'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ProductCardSkeleton } from './product-card-skeleton'

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
        rating?: number
        review_count?: number
        is_featured?: boolean
        vendor_name?: string
    }
    variant?: 'default' | 'compact' | 'featured'
    showFavorite?: boolean
    onFavoriteToggle?: (productId: string) => void
    isFavorite?: boolean
    isLoading?: boolean
}

// ✅ STATIC FALLBACK IMAGE - AMAN untuk Next.js Image
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=600&fit=crop&auto=format"

// Format harga
const formatPrice = (product: ProductCardProps['product']) => {
    if (!product.price_from && !product.price_to) {
        return "Hubungi untuk harga"
    }

    let priceText = ""
    if (product.price_from && product.price_to) {
        priceText = `Rp ${formatNumber(product.price_from)} - Rp ${formatNumber(product.price_to)}`
    } else if (product.price_from) {
        priceText = `Rp ${formatNumber(product.price_from)}`
    }

    if (product.price_unit && priceText !== "Hubungi untuk harga") {
        priceText += `/${product.price_unit}`
    }
    return priceText
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
}

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        'venue': 'bg-blush/20 text-blush-dark',
        'photographer': 'bg-sage/20 text-sage-dark',
        'catering': 'bg-amber-100 text-amber-800',
        'decoration': 'bg-purple-100 text-purple-800',
        'dress': 'bg-pink-100 text-pink-800',
        'makeup': 'bg-rose-100 text-rose-800'
    }
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

export function ProductCard({
    product,
    variant = 'default',
    showFavorite = true,
    onFavoriteToggle,
    isFavorite: externalIsFavorite,
    isLoading = false
}: ProductCardProps) {
    // Deteksi mobile untuk compact mode
    const isMobile = useMediaQuery('(max-width: 768px)')
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

    const effectiveVariant = isMobile ? 'compact' : variant
    const isCompactMode = effectiveVariant === 'compact'

    const { isFavorited, toggleFavorite } = useFavorites()
    const isFavorite = externalIsFavorite !== undefined
        ? externalIsFavorite
        : isFavorited(product.id)

    // Skeleton loading
    if (isLoading) {
        return <ProductCardSkeleton />
    }

    // ✅ Image URL - Gunakan fallback jika tidak ada thumbnail
    const getImageUrl = () => {
        if (!product.thumbnail_url) {
            return FALLBACK_IMAGE
        }
        return product.thumbnail_url
    }

    const imageUrl = getImageUrl()

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (onFavoriteToggle) {
            onFavoriteToggle(product.id)
        } else {
            toggleFavorite(product.id)
        }
    }

    return (
        <Card className={cn(
            "group overflow-hidden",
            !prefersReducedMotion && "transition-all duration-200",
            "active:scale-[0.98] active:shadow-md", // Mobile tap feedback
            !prefersReducedMotion && !isCompactMode && "hover:shadow-lg hover:-translate-y-1", // Desktop hover
            variant === 'featured' && "border-2 border-blush",
            isCompactMode && "shadow-sm"
        )}>
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {/* ✅ Next.js Image dengan fallback aman */}
                <Image
                    src={imageUrl}
                    alt={product.name}
                    width={400}
                    height={400}
                    priority={product.is_featured || variant === 'featured'}
                    loading={product.is_featured || variant === 'featured' ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className={cn(
                        "w-full h-full object-cover",
                        !prefersReducedMotion && "transition-transform duration-300 group-hover:scale-105"
                    )}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = FALLBACK_IMAGE
                    }}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_featured && (
                        <Badge className="bg-blush text-charcoal font-medium border-0 text-xs">
                            Featured
                        </Badge>
                    )}
                    <Badge className={cn(
                        "font-medium border-0 text-xs",
                        getCategoryColor(product.category)
                    )}>
                        {product.category}
                    </Badge>
                </div>

                {/* Favorite Button */}
                {showFavorite && (
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-2 right-2 p-2 min-h-[44px] min-w-[44px] bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart
                            className={cn(
                                "h-5 w-5",
                                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                            )}
                        />
                    </button>
                )}
            </div>

            {/* Content Section */}
            <CardContent className="p-3">
                <div className="space-y-2">
                    {/* Title & Location */}
                    <div>
                        <h3 className="font-semibold line-clamp-2 text-charcoal text-sm mb-1 min-h-[2.5rem]">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">{product.location}</span>
                        </div>
                    </div>

                    {/* Vendor Info - Hide on compact mode */}
                    {product.vendor_name && !isCompactMode && (
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                {product.vendor_name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-600 line-clamp-1">
                                {product.vendor_name}
                            </span>
                        </div>
                    )}

                    {/* Rating - Hide on compact mode */}
                    {product.rating && !isCompactMode && (
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-3 w-3",
                                            i < Math.floor(product.rating!)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-600">
                                {product.rating.toFixed(1)} ({product.review_count || 0})
                            </span>
                        </div>
                    )}

                    {/* Price - Always visible */}
                    <div className="pt-1">
                        <p className="font-bold text-blush text-base">
                            {formatPrice(product)}
                        </p>
                    </div>
                </div>
            </CardContent>

            {/* Footer/Actions - Hide on compact mode */}
            {!isCompactMode && (
                <CardFooter className="p-3 pt-0">
                    <Button
                        asChild
                        className="w-full bg-blush hover:bg-blush/90 text-charcoal text-sm py-2"
                    >
                        <Link href={`/vendor/${product.id}`}>
                            Lihat Detail
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

// Product Grid Wrapper - OPTIMASI MOBILE (2 kolom di mobile)
export function ProductGrid({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn(
            "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
            className
        )}>
            {children}
        </div>
    )
}