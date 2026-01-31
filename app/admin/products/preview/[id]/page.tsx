import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    MapPin,
    User,
    Calendar,
    DollarSign,
    Package,
    Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import Image from 'next/image'

interface PageProps {
    params: Promise<{ id: string }>
}

// Server Actions
async function approveProduct(id: string) {
    'use server'
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Approve error:', error)
        throw new Error('Gagal approve produk')
    }

    redirect('/admin/products?status=approved')
}

async function rejectProduct(id: string) {
    'use server'
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .update({
            status: 'rejected',
            rejected_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Reject error:', error)
        throw new Error('Gagal reject produk')
    }

    redirect('/admin/products?status=rejected')
}

export default async function ProductPreviewPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // ✅ QUERY LENGKAP setelah RLS policy dibuat
    const { data: product } = await supabase
        .from('products')
        .select(`
            *,
            product_images (*),
            profiles:vendor_id (
                id,
                full_name,
                whatsapp_number,
                email,
                bio
            )
        `)
        .eq('id', id)
        .single()

    if (!product) {
        notFound()
    }

    // Log untuk verifikasi
    console.log('✅ [RLS FIXED] Product data loaded:', {
        productId: product.id,
        totalImages: product.product_images?.length || 0,
        thumbnailExists: !!product.thumbnail_url,
        vendorName: product.profiles?.full_name || 'Unknown'
    })

    // Gabungkan semua gambar (thumbnail + product_images)
    const allImages = [
        product.thumbnail_url,
        ...(product.product_images?.map((img: any) => img.url) || [])
    ].filter((url, index, self) =>
        url && self.indexOf(url) === index // Hapus duplikat
    )

    const approveAction = approveProduct.bind(null, id)
    const rejectAction = rejectProduct.bind(null, id)

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <Button variant="ghost" asChild className="mb-2">
                        <Link href="/admin/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke List Pending
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Preview Produk</h1>
                    <p className="text-gray-600">Review detail produk sebelum approval</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <form action={rejectAction}>
                        <Button
                            type="submit"
                            variant="destructive"
                            className="gap-2 min-w-[120px]"
                            size="lg"
                        >
                            <XCircle className="h-4 w-4" />
                            Tolak
                        </Button>
                    </form>

                    <form action={approveAction}>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 gap-2 min-w-[120px]"
                            size="lg"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Setujui
                        </Button>
                    </form>
                </div>
            </div>

            {/* Success Alert - Setelah RLS Fix */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                        <p className="font-medium text-green-800">✅ RLS Policy Aktif</p>
                        <p className="text-sm text-green-700">
                            Admin sekarang dapat mengakses {allImages.length} gambar untuk produk ini.
                            {product.product_images?.length || 0} gambar dari tabel product_images + thumbnail.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* All Product Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Semua Gambar Produk ({allImages.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allImages.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {allImages.map((url, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square rounded-lg overflow-hidden border bg-gray-100 relative group"
                                            >
                                                <Image
                                                    src={url}
                                                    alt={`${product.name} - gambar ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    {url === product.thumbnail_url ? '⭐' : `#${index}`}
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white text-xs truncate">
                                                        {url === product.thumbnail_url ? 'Thumbnail utama' : `Gambar ${index + 1}`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                                        <p>📊 <strong>Statistik Gambar:</strong></p>
                                        <p>• Total gambar unik: {allImages.length}</p>
                                        <p>• Dari tabel product_images: {product.product_images?.length || 0} gambar</p>
                                        <p>• Thumbnail: {product.thumbnail_url ? '✅ Ada' : '❌ Tidak ada'}</p>
                                        {product.product_images?.length === 0 && (
                                            <p className="text-amber-600">⚠️ Data gambar hanya ada di thumbnail, tidak di tabel product_images.</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">Tidak ada gambar tersedia</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Detail Produk
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Nama Produk</h3>
                                <p className="text-gray-800 text-lg font-medium">{product.name}</p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Deskripsi</h3>
                                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                    <p className="text-gray-800 whitespace-pre-line">{product.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Kategori</h3>
                                    <Badge variant="outline" className="capitalize">
                                        {product.category}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Lokasi</h3>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="truncate">{product.location}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Harga</h3>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                        {product.price_from ? (
                                            <span>
                                                Rp {product.price_from.toLocaleString('id-ID')}
                                                {product.price_to && (
                                                    <> - Rp {product.price_to.toLocaleString('id-ID')}</>
                                                )}
                                                <span className="text-gray-500 text-sm ml-2">
                                                    / {product.price_unit || 'paket'}
                                                </span>
                                            </span>
                                        ) : (
                                            'Harga tidak ditentukan'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Vendor & Metadata */}
                <div className="space-y-6">
                    {/* Vendor Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Info Vendor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Nama Vendor</h3>
                                <p className="text-gray-900 font-medium">
                                    {product.profiles?.full_name || 'Tidak diketahui'}
                                </p>
                            </div>

                            {product.profiles?.email && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">Email</h3>
                                    <p className="text-gray-900">{product.profiles.email}</p>
                                </div>
                            )}

                            {product.profiles?.whatsapp_number && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">WhatsApp</h3>
                                    <p className="text-gray-900 font-mono">
                                        {product.profiles.whatsapp_number}
                                    </p>
                                </div>
                            )}

                            {product.profiles?.bio && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">Bio</h3>
                                    <p className="text-gray-900 text-sm">{product.profiles.bio}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Metadata
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">ID Produk</h3>
                                <p className="text-gray-900 text-sm font-mono truncate">{product.id}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Status</h3>
                                <Badge
                                    variant={
                                        product.status === 'pending' ? 'secondary' :
                                            product.status === 'approved' ? 'default' : 'destructive'
                                    }
                                    className="mt-1"
                                >
                                    {product.status.toUpperCase()}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Dibuat</h3>
                                <p className="text-gray-900">
                                    {new Date(product.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}