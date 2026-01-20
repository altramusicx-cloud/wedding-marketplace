// File: components/product/product-card-skeleton.tsx
import { Card, CardContent } from "@/components/ui/card"

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200" />

            {/* Content skeleton */}
            <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
            </CardContent>
        </Card>
    )
}