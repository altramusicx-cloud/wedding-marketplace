// lib/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { registerSchema, type RegisterFormData } from '@/lib/validation/auth-schema'

// Register action dengan validation
export async function registerUser(formData: RegisterFormData) {
    const supabase = await createClient()

    try {
        // Validate input dengan Zod
        const validatedData = registerSchema.parse(formData)

        // Sign up dengan Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            options: {
                data: {
                    full_name: validatedData.full_name,
                    whatsapp_number: validatedData.whatsapp_number,
                }
            }
        })

        if (authError) {
            console.error('Auth error:', authError)
            return {
                success: false,
                error: authError.message,
                code: 'AUTH_ERROR'
            }
        }

        if (!authData.user) {
            return {
                success: false,
                error: 'Gagal membuat akun',
                code: 'USER_CREATION_FAILED'
            }
        }

        // Auto login setelah register
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        })

        if (loginError) {
            return {
                success: false,
                error: loginError.message,
                code: 'AUTO_LOGIN_FAILED'
            }
        }

        // Revalidate paths
        revalidatePath('/dashboard')
        revalidatePath('/')

        return {
            success: true,
            message: 'Akun berhasil dibuat!',
            userId: authData.user.id
        }

    } catch (error: any) {
        console.error('Register error:', error)

        // Zod validation error
        if (error.errors) {
            return {
                success: false,
                error: error.errors[0]?.message || 'Validasi gagal',
                code: 'VALIDATION_ERROR'
            }
        }

        return {
            success: false,
            error: error.message || 'Terjadi kesalahan',
            code: 'INTERNAL_ERROR'
        }
    }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: {
    full_name?: string
    whatsapp_number?: string
}) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            return {
                success: false,
                error: error.message
            }
        }

        revalidatePath('/dashboard')
        revalidatePath('/profile')

        return {
            success: true,
            data
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Terjadi kesalahan'
        }
    }
}

// Become vendor action
export async function becomeVendor(userId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                is_vendor: true,
                vendor_since: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            return {
                success: false,
                error: error.message
            }
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/vendor')

        return {
            success: true,
            data
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Terjadi kesalahan'
        }
    }
}