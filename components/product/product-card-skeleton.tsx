// components/product/product-card-skeleton.tsx
export function ProductCardSkeleton() {
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