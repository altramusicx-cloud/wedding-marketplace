'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validation/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'

export function LoginForm() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true)
        setFormError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) {
                setFormError(error.message)
                return
            }

            // ✅ BENAR: Redirect ke home, biarkan middleware handle role-based redirect
            router.replace('/')
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
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        className={`w-full ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`w-full ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blush hover:bg-blush/90 text-charcoal"
            >
                {loading ? 'Memproses...' : 'Masuk'}
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Atau</span>
                </div>
            </div>

            <div className="text-center text-sm text-gray-600">
                <p>
                    Lupa password?{' '}
                    <button
                        type="button"
                        className="font-medium text-blush hover:text-blush/80"
                        onClick={() => {
                            // TODO: Implement reset password
                            alert('Fitur reset password akan segera hadir!')
                        }}
                    >
                        Reset password
                    </button>
                </p>
            </div>
        </form>
    )
}