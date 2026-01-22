// lib/validation/product-schema.ts
import { z } from 'zod'

// Categories
const CATEGORIES = [
    'venue', 'photographer', 'catering', 'decoration',
    'dress', 'makeup', 'music', 'invitation'
] as const

// Price units
const PRICE_UNITS = [
    'paket', 'per jam', 'per orang', 'custom'
] as const

// Main product schema
export const productSchema = z.object({
    name: z
        .string()
        .min(3, 'Nama produk minimal 3 karakter')
        .max(100, 'Nama produk maksimal 100 karakter'),

    description: z
        .string()
        .min(20, 'Deskripsi minimal 20 karakter')
        .max(2000, 'Deskripsi maksimal 2000 karakter'),

    category: z.enum(CATEGORIES),

    location: z
        .string()
        .min(3, 'Lokasi minimal 3 karakter')
        .max(100, 'Lokasi maksimal 100 karakter'),

    price_from: z.coerce
        .number()
        .min(0, 'Harga minimal 0')
        .optional()
        .nullable()
        .default(null),

    price_to: z.coerce
        .number()
        .min(0, 'Harga minimal 0')
        .optional()
        .nullable()
        .default(null),

    price_unit: z.enum(PRICE_UNITS).default('paket')
}).refine(data => {
    if (data.price_from !== null && data.price_to !== null) {
        return data.price_to >= data.price_from
    }
    return true
}, {
    message: 'Harga maksimal harus lebih besar dari harga minimal',
    path: ['price_to']
})

// Types
export type ProductFormData = z.infer<typeof productSchema>