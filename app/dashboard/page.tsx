// app/dashboard/page.tsx - FULL FIXED VERSION
import { requireAuth } from '@/lib/supabase/middleware'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Phone, Heart, Package } from 'lucide-react'
import Link from 'next/link' // 🔥 IMPORTANT: Add this import

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const { supabase, user } = await requireAuth()

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get user stats
    const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: contactCount } = await supabase
        .from('contact_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-charcoal mb-2">
                        Selamat datang, {profile?.full_name || 'Pengguna'}!
                    </h1>
                    <p className="text-gray-600">
                        Kelola akun dan aktivitas Anda di WeddingMarket
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blush-light flex items-center justify-center">
                                <User className="h-6 w-6 text-blush" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status Akun</p>
                                <p className="text-xl font-bold text-charcoal">
                                    {profile?.is_vendor ? 'Vendor' : 'Pengguna'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-sage-light flex items-center justify-center">
                                <Heart className="h-6 w-6 text-sage" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Favorit</p>
                                <p className="text-xl font-bold text-charcoal">
                                    {favoritesCount || 0}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blush-light flex items-center justify-center">
                                <Phone className="h-6 w-6 text-blush" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Kontak Dikirim</p>
                                <p className="text-xl font-bold text-charcoal">
                                    {contactCount || 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-charcoal mb-6">
                                Informasi Profil
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        <p className="text-lg font-semibold text-charcoal">
                                            {profile?.full_name || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <p className="text-lg font-semibold text-charcoal">
                                            {profile?.email || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor WhatsApp
                                    </label>
                                    <p className="text-lg font-semibold text-charcoal">
                                        {profile?.whatsapp_number || '-'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bio
                                    </label>
                                    <p className="text-gray-600">
                                        {profile?.bio || 'Belum ada bio. Tambahkan bio untuk memperkenalkan diri.'}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <Button asChild className="bg-blush hover:bg-blush/90 text-charcoal">
                                        <Link href="/dashboard/profile">
                                            Edit Profil
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div>
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-bold text-charcoal mb-4">
                                Akses Cepat
                            </h3>

                            <div className="space-y-3">
                                {!profile?.is_vendor && (
                                    <Button asChild className="w-full justify-start bg-sage hover:bg-sage/90 text-white">
                                        <Link href="/dashboard/become-vendor">
                                            <Package className="mr-2 h-4 w-4" />
                                            Jadi Vendor
                                        </Link>
                                    </Button>
                                )}

                                {profile?.is_vendor && (
                                    <Button asChild className="w-full justify-start bg-sage hover:bg-sage/90 text-white">
                                        {/* 🔥 FIX: Tambah Link ke dashboard vendor */}
                                        <Link href="/dashboard/vendor">
                                            <Package className="mr-2 h-4 w-4" />
                                            Dashboard Vendor
                                        </Link>
                                    </Button>
                                )}

                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href="/dashboard/favorites">
                                        <Heart className="mr-2 h-4 w-4" />
                                        Favorit Saya
                                    </Link>
                                </Button>

                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href="/dashboard/contact-history">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Riwayat Kontak
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-charcoal mb-4">
                                Status Akun
                            </h3>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member sejak</span>
                                    <span className="font-medium">
                                        {profile?.created_at
                                            ? new Date(profile.created_at).toLocaleDateString('id-ID')
                                            : '-'}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-medium ${profile?.is_vendor ? 'text-sage' : 'text-blush'}`}>
                                        {profile?.is_vendor ? 'Vendor' : 'Pengguna'}
                                    </span>
                                </div>

                                {profile?.is_vendor && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vendor sejak</span>
                                        <span className="font-medium">
                                            {profile.vendor_since
                                                ? new Date(profile.vendor_since).toLocaleDateString('id-ID')
                                                : '-'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}