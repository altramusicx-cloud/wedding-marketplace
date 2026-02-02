// types/product.ts - Clean and consistent product type definitions
// Aligned with Supabase database schema

// === BASE TYPES ===
export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type ProductCategory = 'venue' | 'photographer' | 'catering' | 'decoration' | 'dress' | 'makeup' | 'music' | 'invitation' | 'other'
export type PriceUnit = 'paket' | 'per jam' | 'per orang' | 'custom'

// === IMAGE TYPE ===
export interface ProductImage {
  id: string
  url: string
  alt_text?: string
  is_primary?: boolean
  product_id?: string
  created_at?: string
  order_index?: number
}

// === MAIN PRODUCT INTERFACE ===
// Matches Supabase 'products' table schema
export interface Product {
  // Core fields
  id: string
  name: string
  description?: string
  
  // Categorization
  category: ProductCategory
  tags?: string[]
  location: string
  
  // Vendor relation
  vendor_id: string
  vendor_name?: string
  
  // Pricing
  price_from?: number | null
  price_to?: number | null  
  price_unit?: PriceUnit
  currency?: string
  
  // Status & visibility
  status: ProductStatus
  is_active: boolean
  is_featured?: boolean
  is_approved?: boolean  // Derived from status === 'approved'
  
  // Media
  thumbnail_url?: string
  images?: ProductImage[]
  
  // Metadata
  views?: number
  rating?: number
  slug?: string
  
  // Timestamps
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

// === DERIVED TYPES ===

// For product cards/lists (lightweight)
export interface ProductCard {
  id: string
  name: string
  thumbnail_url?: string
  category: ProductCategory
  location: string
  price_from?: number
  price_to?: number
  price_unit?: PriceUnit
  vendor_name?: string
  is_featured?: boolean
  status: ProductStatus
  rating?: number
}

// For forms
export interface ProductFormData {
  name: string
  description: string
  category: ProductCategory
  location: string
  price_from?: string | number | null
  price_to?: string | number | null
  price_unit?: PriceUnit
  tags?: string[]
  images?: (File | string)[]  // Files for new, URLs for existing
  is_featured?: boolean
  is_active?: boolean
}

// For filters/search
export interface ProductFilters {
  category?: ProductCategory
  location?: string
  min_price?: number
  max_price?: number
  is_featured?: boolean
  status?: ProductStatus
  search?: string
  vendor_id?: string
}

// API responses
export interface ProductResponse {
  data: Product | Product[]
  success: boolean
  message?: string
  error?: string
}

export interface ProductsPaginated {
  data: Product[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Type guards
export function isProduct(obj: any): obj is Product {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string'
}

export function isProductCard(obj: any): obj is ProductCard {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string'
}


export type ProductWithVendor = Product & {
  vendor: {
    id: string
    name: string
    email: string
  }
}

