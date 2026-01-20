// File: components/product/product-card.tsx
"use client"

import { Heart, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useFavorites } from '@/hooks/use-favorites'
import { useEffect, useState } from "react"

interface ProductCardProps {
    product: {
        id: string
        name: string
        thumbnail_url: string
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
}

export function ProductCard({
    product,
    variant = 'default',
    showFavorite = true,
    onFavoriteToggle,
    isFavorite: externalIsFavorite
}: ProductCardProps) {
    const { isFavorited, toggleFavorite } = useFavorites()
    const [imageUrl, setImageUrl] = useState("")

    // Force image URL update dengan cache busting
    useEffect(() => {
        console.log('🔄 Image URL Update:', product.name, product.thumbnail_url)
        if (product.thumbnail_url) {
            const url = `${product.thumbnail_url}?auto=format&fit=crop&w=400&h=400&v=${product.id}-${Date.now()}`
            setImageUrl(url)
        } else {
            setImageUrl("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop")
        }
    }, [product.thumbnail_url, product.id, product.name])

    // Gunakan external state jika ada, otherwise use hook
    const isFavorite = externalIsFavorite !== undefined
        ? externalIsFavorite
        : isFavorited(product.id)

    const handleFavoriteClick = (e: React.MouseEvent) => {
        console.log('FAVORITE CLICKED - Product ID:', product.id)
        e.stopPropagation()
        e.preventDefault()

        if (onFavoriteToggle) {
            onFavoriteToggle(product.id)
        } else {
            toggleFavorite(product.id)
        }
    }

    const formatPrice = () => {
        let priceText = ""

        if (product.price_from && product.price_to) {
            priceText = `Rp ${formatNumber(product.price_from)} - Rp ${formatNumber(product.price_to)}`
        } else if (product.price_from) {
            priceText = `Rp ${formatNumber(product.price_from)}`
        } else {
            priceText = "Hubungi untuk harga"
        }

        // Tambah price_unit jika ada
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

    return (
        <Card className={cn(
            "group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
            variant === 'featured' && "border-2 border-blush",
            variant === 'compact' && "shadow-sm"
        )}>
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop"
                        e.currentTarget.alt = "Image not available"
                    }}
                    decoding="async"
                    key={`img-${product.id}-${Date.now()}`}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.is_featured && (
                        <Badge className="bg-blush text-charcoal font-medium border-0">
                            Featured
                        </Badge>
                    )}
                    <Badge className={cn(
                        "font-medium border-0",
                        getCategoryColor(product.category)
                    )}>
                        {product.category}
                    </Badge>
                </div>

                {/* Favorite Button */}
                {showFavorite && (
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
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
            <CardContent className="p-4">
                <div className="space-y-3">
                    {/* Title & Location */}
                    <div>
                        <h3 className="font-semibold line-clamp-1 text-charcoal mb-1">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">{product.location}</span>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    {product.vendor_name && variant !== 'compact' && (
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                {product.vendor_name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-600 line-clamp-1">
                                {product.vendor_name}
                            </span>
                        </div>
                    )}

                    {/* Rating */}
                    {product.rating && variant !== 'compact' && (
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
                                {product.rating.toFixed(1)} ({product.review_count || 0} review)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg text-charcoal">
                                {formatPrice()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Footer/Actions */}
            {variant !== 'compact' && (
                <CardFooter className="p-4 pt-0">
                    <Button
                        asChild
                        className="w-full bg-blush hover:bg-blush/90 text-charcoal"
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

// Product Grid Wrapper
export function ProductGrid({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            className
        )}>
            {children}
        </div>
    )
}