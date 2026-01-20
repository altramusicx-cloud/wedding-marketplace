// app/(public)/vendor/[id]/page.tsx
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { uploadImage } from '@/utils/upload-image'
import { ProductCard } from "@/components/product/product-card"
import { FavoritesButton } from "@/components/product/favorites-button"
import {
    ArrowLeft,
    MapPin,
    Star,
    Calendar,
    Users,
    CheckCircle,
    Share2,
    Heart
} from "lucide-react"
import Link from "next/link"
import { ProductGallery } from "@/components/product/product-gallery"
import { ContactButton } from "@/components/product/contact-button"
import { Recommendations } from '@/components/product/recommendations'
import { createClient } from '@/lib/supabase/server'

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const productId = id

    // Deklarasi supabase SETELAH await params
    const supabase = await createClient()

    // Fetch real product data from database
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            profiles:vendor_id (
                id,
                full_name,
                whatsapp_number,
                created_at,
                is_vendor
            ),
            product_images (*)
        `)
        .eq('id', productId)
        .eq('status', 'approved')
        .eq('is_active', true)
        .single()


    if (error || !product) {
        notFound()
    }

    const vendor = product.profiles
    const images = product.product_images || []

    // Format functions
    const formatPrice = () => {
        if (product.price_from && product.price_to) {
            return `Rp ${formatNumber(product.price_from)} - Rp ${formatNumber(product.price_to)}`
        } else if (product.price_from) {
            return `Rp ${formatNumber(product.price_from)}`
        }
        return "Hubungi untuk harga"
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num)
    }

    // Extract first few images for gallery
    interface ProductImage {
        id: string
        url: string
        // tambah properties lain jika ada
    }

    const galleryImages = images.slice(0, 4).map((img: ProductImage) => img.url)

    // If no images from database, use fallback
    const displayImages = galleryImages.length > 0 ? galleryImages : [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200'
    ]

    return (
        <div className="min-h-screen bg-ivory">
            {/* Breadcrumb */}
            <div className="border-b bg-white">
                <div className="container-custom py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                            <Link href="/" className="text-gray-600 hover:text-blush">
                                Beranda
                            </Link>
                        </Button>
                        <span className="text-gray-400">/</span>
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                            <Link href="/categories" className="text-gray-600 hover:text-blush">
                                Kategori
                            </Link>
                        </Button>
                        <span className="text-gray-400">/</span>
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                            <Link href={`/categories/${product.category.toLowerCase()}`} className="text-gray-600 hover:text-blush">
                                {product.category}
                            </Link>
                        </Button>
                        <span className="text-gray-400">/</span>
                        <span className="text-charcoal font-medium truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-2">
                        <ProductGallery images={displayImages} productName={product.name} />
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl md:text-3xl font-bold text-charcoal">{product.name}</h1>
                                    <FavoritesButton
                                        productId={product.id}
                                        variant="icon"
                                        size="default"
                                    />
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{product.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="p-4 bg-white border rounded-lg">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-charcoal">{formatPrice()}</span>
                                    {product.price_unit && (
                                        <span className="text-gray-600">/{product.price_unit}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Harga sudah termasuk PPN</p>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="h-4 w-4 text-blush" />
                                    <div>
                                        <p className="text-xs text-gray-600">Kategori</p>
                                        <p className="font-medium">{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Users className="h-4 w-4 text-blush" />
                                    <div>
                                        <p className="text-xs text-gray-600">Lokasi</p>
                                        <p className="font-medium">{product.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Info */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-blush flex items-center justify-center">
                                        <span className="font-bold text-charcoal">
                                            {vendor?.full_name?.charAt(0) || 'V'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{vendor?.full_name || 'Vendor'}</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                <span>Terverifikasi WeddingMarket</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Vendor sejak {new Date(vendor?.created_at || '').getFullYear()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Responsif via WhatsApp</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Button */}
                        <div className="sticky bottom-0 lg:static bg-white lg:bg-transparent border-t lg:border-0 p-4 lg:p-0">
                            <ContactButton
                                vendorId={vendor?.id || ''}
                                vendorWhatsApp={vendor?.whatsapp_number || '+6281234567890'}
                                productId={product.id}
                                productName={product.name}
                                vendorName={vendor?.full_name || 'Vendor'}
                                variant="large"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Details & Recommendations */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Deskripsi Produk</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="whitespace-pre-line">{product.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recommendations Sidebar */}
                    <div>
                        <Recommendations
                            currentProductId={product.id}
                            currentCategory={product.category}
                            currentLocation={product.location}
                            vendorId={vendor?.id || ''}
                            limit={4}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}