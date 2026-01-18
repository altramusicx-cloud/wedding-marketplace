// File: types/user.ts (SESUAI BLUEPRINT - tambah ContactLog)
export interface ContactLog {
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

export interface UserProfile {
    id: string
    email: string
    full_name: string
    whatsapp_number: string
    is_vendor: boolean
    avatar_url: string | null
    bio: string | null
    vendor_since: string | null
    created_at: string
    updated_at: string
    last_login: string | null
}