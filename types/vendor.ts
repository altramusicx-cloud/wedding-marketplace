// File: types/vendor.ts (SESUAI BLUEPRINT)
export interface Vendor {
    id: string
    full_name: string
    whatsapp_number: string
    avatar_url: string | null
    bio: string | null
    vendor_since: string | null
}

export interface VendorStats {
    total_products: number
    total_contacts: number
    approval_rate: number
    average_response_time: number
}