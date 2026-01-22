// lib/validation/vendor-schema.ts
import { z } from 'zod'

// Schema untuk update vendor profile
export const vendorProfileSchema = z.object({
    bio: z
        .string()
        .max(500, 'Bio maksimal 500 karakter')
        .optional()
        .default(''),

    avatar_url: z
        .string()
        .url('URL avatar tidak valid')
        .optional()
        .nullable()
        .default(null),

    business_name: z
        .string()
        .min(3, 'Nama usaha minimal 3 karakter')
        .max(100, 'Nama usaha maksimal 100 karakter')
        .optional(),

    business_address: z
        .string()
        .max(200, 'Alamat usaha maksimal 200 karakter')
        .optional(),

    website: z
        .string()
        .url('URL website tidak valid')
        .optional()
        .nullable()
        .default(null),

    instagram: z
        .string()
        .regex(/^[a-zA-Z0-9._]{1,30}$/, 'Username Instagram tidak valid')
        .optional()
        .nullable()
        .default(null),

    experience_years: z
        .number()
        .min(0, 'Tahun pengalaman minimal 0')
        .max(50, 'Tahun pengalaman maksimal 50')
        .optional()
        .default(0)
})

// Schema untuk menjadi vendor (upgrade dari user ke vendor)
export const becomeVendorSchema = z.object({
    agree_terms: z
        .boolean()
        .refine(val => val === true, {
            message: 'Anda harus menyetujui syarat dan ketentuan'
        }),

    business_info: z
        .string()
        .min(20, 'Deskripsi usaha minimal 20 karakter')
        .max(500, 'Deskripsi usaha maksimal 500 karakter')
})

// Types
export type VendorProfileData = z.infer<typeof vendorProfileSchema>
export type BecomeVendorData = z.infer<typeof becomeVendorSchema>