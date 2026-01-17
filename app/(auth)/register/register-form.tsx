'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        whatsapp: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok')
            setLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError('Password minimal 8 karakter')
            setLoading(false)
            return
        }

        try {
            // 1. Sign up dengan Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        whatsapp_number: formData.whatsapp,
                    }
                }
            })

            if (authError) {
                setError(authError.message)
                return
            }

            if (!authData.user) {
                setError('Gagal membuat akun. Silakan coba lagi.')
                return
            }

            // 2. Profile akan dibuat OTOMATIS oleh trigger di database
            // Tidak perlu insert manual ke profiles table

            // 3. Auto login setelah register
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })

            if (loginError) {
                setError(loginError.message)
                return
            }

            // 4. Redirect to dashboard
            router.push('/dashboard')
            router.refresh()

        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        required
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap *
                    </label>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nama lengkap Anda"
                        required
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor WhatsApp *
                    </label>
                    <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="6281234567890"
                        required
                        className="w-full"
                    />
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
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimal 8 karakter"
                        required
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password *
                    </label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Ketik ulang password"
                        required
                        className="w-full"
                    />
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