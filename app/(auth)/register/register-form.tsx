// app\(auth)\register\register-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/validation/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'

export default function RegisterForm() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            full_name: '',
            whatsapp_number: '',
        },
    })

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true)
        setFormError(null)

        try {
            // 1. Sign up dengan Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.full_name,
                        whatsapp_number: data.whatsapp_number,
                    }
                }
            })

            if (authError) {
                setFormError(authError.message)
                return
            }

            if (!authData.user) {
                setFormError('Gagal membuat akun. Silakan coba lagi.')
                return
            }

            // 2. Profile akan dibuat OTOMATIS oleh trigger di database
            // Tidak perlu insert manual ke profiles table

            // 3. Auto login setelah register
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (loginError) {
                setFormError(loginError.message)
                return
            }

            // 4. Redirect to dashboard
            router.push('/dashboard')
            router.refresh()

        } catch (err) {
            setFormError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{formError}</span>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        className={`w-full ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap *
                    </label>
                    <Input
                        id="full_name"
                        type="text"
                        placeholder="Nama lengkap Anda"
                        className={`w-full ${errors.full_name ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                        {...register('full_name')}
                    />
                    {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor WhatsApp *
                    </label>
                    <Input
                        id="whatsapp_number"
                        type="tel"
                        placeholder="6281234567890"
                        className={`w-full ${errors.whatsapp_number ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                        {...register('whatsapp_number')}
                    />
                    {errors.whatsapp_number && (
                        <p className="mt-1 text-sm text-red-600">{errors.whatsapp_number.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Gunakan format: 6281234567890 (tanpa + atau spasi)
                    </p>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Minimal 8 karakter"
                        className={`w-full ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Harus mengandung huruf kecil, huruf besar, dan angka
                    </p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password *
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Ketik ulang password"
                        className={`w-full ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p>
                    Dengan mendaftar, Anda menyetujui{' '}
                    <a href="#" className="text-blush hover:text-blush/80">
                        Syarat & Ketentuan
                    </a>{' '}
                    dan{' '}
                    <a href="#" className="text-blush hover:text-blush/80">
                        Kebijakan Privasi
                    </a>{' '}
                    kami.
                </p>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-sage hover:bg-sage/90 text-white"
            >
                {loading ? 'Membuat akun...' : 'Daftar Sekarang'}
            </Button>
        </form>
    )
}