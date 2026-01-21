// File: lib/supabase/types.ts

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    whatsapp_number: string
                    is_vendor: boolean
                    is_admin: boolean
                    vendor_since: string | null
                    avatar_url: string | null
                    bio: string | null
                    created_at: string
                    updated_at: string
                    last_login: string | null
                }
            }
            products: {
                Row: {
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
            }
            product_images: {
                Row: {
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
            }
            contact_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    vendor_id: string
                    product_id: string
                    contacted_at: string
                    contact_method: string
                    user_name: string
                    user_whatsapp: string
                    vendor_name: string
                    product_name: string
                    status: 'contacted' | 'replied' | 'booked' | 'cancelled'
                    notes: string | null
                    created_at: string
                }
            }
            favorites: {
                Row: {
                    user_id: string
                    product_id: string
                    created_at: string
                }
            }
        }
    }
}

// Helper types untuk query results
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ContactLog = Database['public']['Tables']['contact_logs']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']

// Product dengan relasi
export interface ProductWithVendor extends Product {
    profiles: Pick<Profile, 'id' | 'full_name' | 'whatsapp_number'> | null
}

export interface ProductWithImages extends Product {
    product_images: ProductImage[]
    profiles: Pick<Profile, 'id' | 'full_name' | 'whatsapp_number'> | null
}