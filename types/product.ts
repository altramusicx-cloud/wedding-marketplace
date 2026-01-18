// File: types/product.ts
export interface Product {
    id: string
    vendor_id: string
    name: string
    slug: string
    description: string
    category: string
    location: string
    price_from: number | null
    price_to: number | null
    price_unit: string | null
    status: 'pending' | 'approved' | 'rejected'
    is_featured: boolean
    is_active: boolean
    thumbnail_url: string | null
    created_at: string
    updated_at: string
    approved_at: string | null
    rejected_at: string | null
    rejection_reason: string | null
}

export interface ProductImage {
    id: string
    product_id: string
    url: string
    alt_text: string | null
    order_index: number
    original_size: number | null
    compressed_size: number | null
    format: string | null
    created_at: string
}

export interface ProductWithImages extends Product {
    product_images: ProductImage[]
    profiles?: {  // ← TAMBAH INI
        full_name: string
        whatsapp_number: string
    }
}

export interface Vendor {
    id: string
    full_name: string
    whatsapp_number: string
    avatar_url: string | null
    bio: string | null
    vendor_since: string | null
}

export interface ProductCardProps {
    product: Product
    variant?: 'default' | 'compact' | 'featured'
    showFavorite?: boolean
}