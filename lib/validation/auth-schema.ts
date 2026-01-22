// lib\validation\auth-schema.ts
import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email wajib diisi')
        .email('Format email tidak valid'),
    password: z
        .string()
        .min(1, 'Password wajib diisi')
        .min(8, 'Password minimal 8 karakter')
})

// Register validation schema  
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email wajib diisi')
        .email('Format email tidak valid'),
    password: z
        .string()
        .min(1, 'Password wajib diisi')
        .min(8, 'Password minimal 8 karakter')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password harus mengandung huruf besar, huruf kecil, dan angka'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Konfirmasi password wajib diisi'),
    full_name: z
        .string()
        .min(1, 'Nama lengkap wajib diisi')
        .min(3, 'Nama minimal 3 karakter')
        .max(100, 'Nama maksimal 100 karakter'),
    whatsapp_number: z
        .string()
        .min(1, 'Nomor WhatsApp wajib diisi')
        .regex(
            /^628[1-9][0-9]{6,9}$/,  // HANYA 628xxxx, TIDAK BISA 08xxxx atau +628
            'Format harus 628xxxxxxxxxx (contoh: 6281234567890)'
        )
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword']
})

// Types
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>