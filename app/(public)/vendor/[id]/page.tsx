// app/(public)/vendor/[id]/page.tsx
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductSchema } from '@/components/seo/product-schema'
import { FavoritesButton } from "@/components/product/favorites-button"
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Eye,
    CheckCircle,
    Share2
} from "lucide-react"
import Link from "next/link"
import { ProductGallery } from "@/components/product/product-gallery"
import { ContactButton } from "@/components/product/contact-button"
import { StickyBottomBar } from "@/components/product/sticky-bottom-bar"
import { Recommendations } from '@/components/product/recommendations'
import { Container } from "@/components/layout/container"
import { ProductGrid } from "@/components/product/product-card"
import { createClient } from '@/lib/supabase/server'
import { generateProductMetadata } from '@/lib/utils/generate-metadata'

// Dynamic metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    try {
        const { data: product } = await supabase
            .from('products')
            .select('name, description, thumbnail_url, status, is_active')
            .eq('id', id)
            .eq('status', 'approved')
            .eq('is_active', true)
            .single()

        if (!product) {
            return {
                title: 'Produk Tidak Ditemukan',
                description: 'Produk wedding tidak ditemukan atau tidak tersedia.',
            }
        }

        return generateProductMetadata(
            product.name,
            product.description,
            product.thumbnail_url || undefined
        )
    } catch (error) {
        return {
            title: 'Detail Produk Wedding',
            description: 'Detail vendor dan produk wedding di Kalimantan.',
        }
    }
}

// Helper function untuk format harga (Shopee style)
const formatPrice = (priceFrom?: number | null, priceTo?: number | null, priceUnit?: string | null) => {
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num)

    if (priceFrom && priceTo) {
        return `Rp${formatNumber(priceFrom)} - Rp${formatNumber(priceTo)}`
    } else if (priceFrom) {
        return `Rp${formatNumber(priceFrom)}`
    }
    return "Hubungi untuk harga"
}

// Helper function untuk format lokasi dengan line breaks
const formatLocation = (location: string) => {
    if (!location) return null

    const parts = location.split(',').map(part => part.trim())

    return parts.map((part, index) => (
        <span key={index}>
            {part}{index < parts.length - 1 ? ',' : ''}
            {index < parts.length - 1 && <br />}
        </span>
    ))
}

// Generate random viewer count (like Shopee)
const getViewerCount = () => {
    const counts = [124, 356, 892, 1205, 2341, 567, 1890]
    const randomCount = counts[Math.floor(Math.random() * counts.length)]
    return randomCount.toLocaleString('id-ID')
}

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const productId = id
    const supabase = await createClient()

    // Fetch product data
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

    // Prepare gallery images
    const galleryImages = images.slice(0, 4).map((img: any) => img.url)
    const displayImages = galleryImages.length > 0 ? galleryImages : [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200'
    ]

    // Format vendor year
    const vendorYear = vendor?.created_at
        ? new Date(vendor.created_at).getFullYear()
        : new Date().getFullYear()

    // Get viewer count
    const viewerCount = getViewerCount()

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Header - Shopee Style */}
            <div className="sticky top-0 bg-white border-b border-[#E5E5E5] z-50 px-4 py-3 lg:hidden">
                <div className="flex items-center justify-between">
                    <Link href="/" className="p-1">
                        <ArrowLeft className="h-5 w-5 text-[#212121]" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Bagikan"
                        >
                            <Share2 className="h-4 w-4 text-[#757575]" />
                        </Button>
                        <FavoritesButton
                            productId={product.id}
                            variant="icon"
                            className="h-8 w-8"
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Breadcrumb */}
            <div className="hidden lg:block border-b border-[#E5E5E5] bg-white">
                <Container size="xl" className="py-4 md:py-6">
                    <div className="flex items-center gap-2 text-[13px]">
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                            <Link href="/" className="text-[#757575] hover:text-[#EE4D2D]">
                                Beranda
                            </Link>
                        </Button>
                        <span className="text-[#E5E5E5]">/</span>
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                            <Link href="/categories" className="text-[#757575] hover:text-[#EE4D2D]">
                                Kategori
                            </Link>
                        </Button>
                        <span className="text-[#E5E5E5]">/</span>
                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                            <Link href={`/categories/${product.category.toLowerCase()}`} className="text-[#757575] hover:text-[#EE4D2D]">
                                {product.category}
                            </Link>
                        </Button>
                        <span className="text-[#E5E5E5]">/</span>
                        <span className="text-[#212121] font-medium truncate text-[13px]">{product.name}</span>
                    </div>
                </Container>
            </div>

            {/* Main Content - SAMA CONTAINER DENGAN HOMEPAGE */}
            <Container size="xl" className="py-4 md:py-6">
                {/* Product Layout - Desktop: Gallery lebih kecil (Shopee style) */}
                <div className="lg:flex lg:gap-8">
                    {/* Gallery Section - Desktop: Width 45% */}
                    <div className="lg:w-[45%] lg:flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <ProductGallery
                                images={displayImages}
                                productName={product.name}
                            />
                        </div>
                    </div>

                    {/* Product Info Section - Desktop: Width 55% */}
                    <div className="flex-1 mt-4 lg:mt-0">
                        {/* Product Title - Desktop only */}
                        <div className="hidden lg:block mb-4">
                            <h1 className="text-[17px] font-medium text-[#212121] leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Category Badge - Shopee Style */}
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-1 bg-[#EE4D2D]/10 text-[#EE4D2D] text-[11px] px-2 py-1 rounded-[2px]">
                                <Calendar className="h-3 w-3" />
                                {product.category}
                            </span>
                        </div>

                        {/* Price Card - Shopee Style */}
                        <div className="bg-white border border-[#E5E5E5] rounded-[3px] p-3 mb-4">
                            <div className="text-[11px] text-[#757575] mt-2">
                                Harga mulai
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[13px] font-bold text-[#EE4D2D] leading-none">
                                    {formatPrice(product.price_from, product.price_to)}
                                </span>
                                {product.price_unit && (
                                    <span className="text-[13px] text-[#757575]">
                                        /{product.price_unit}
                                    </span>
                                )}
                            </div>

                        </div>

                        {/* Quick Info Grid - Hanya Kategori (User pindah ke atas) */}
                        <div className="grid grid-cols-1 gap-2 mb-4">
                            <div className="flex items-center gap-2 p-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-[3px]">
                                <Calendar className="h-3.5 w-3.5 text-[#757575]" />
                                <div>
                                    <div className="text-[9px] text-[#757575]">Kategori</div>
                                    <div className="text-[11px] text-[#212121]">{product.category}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 mb-4">
                            <div className="flex items-center gap-2 p-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-[3px]">
                                <Eye className="h-3.5 w-3.5 text-[#757575]" />
                                <span className="text-[11px] text-[#757575]">
                                    {viewerCount} dilihat
                                </span>
                            </div>
                        </div>

                        {/* Location with MapPin - Line Breaks */}
                        <div className="mb-4 flex items-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#757575] mt-0.5 flex-shrink-0" />
                            <div className="text-[11px] text-[#757575] leading-tight">
                                {formatLocation(product.location)}
                            </div>
                        </div>

                        {/* Vendor Info Card - Shopee Style Size */}
                        <div className="bg-white border border-[#E5E5E5] rounded-[3px] p-3 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-[#F7CAC9] flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-[#212121] text-[16px]">
                                        {vendor?.full_name?.charAt(0) || 'V'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-[13px] text-[#212121] truncate">
                                        {vendor?.full_name || 'Vendor'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[11px] mt-1">
                                        <div className="flex items-center gap-1 text-[#00B14F]">
                                            <CheckCircle className="h-3 w-3" />
                                            <span>Terverifikasi</span>
                                        </div>
                                        <span className="text-[#E5E5E5]">•</span>
                                        <span className="text-[#757575]">
                                            Vendor sejak {vendorYear}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5 text-[11px] text-[#757575]">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-3.5 w-3.5 text-[#00B14F]" />
                                    <span>Responsif via WhatsApp</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-3.5 w-3.5 text-[#00B14F]" />
                                    <span>Produk asli Kalimantan</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Contact Button - Shopee Style */}
                        <div className="hidden lg:block">
                            <ContactButton
                                vendorId={vendor?.id || ''}
                                vendorWhatsApp={vendor?.whatsapp_number || ''}
                                productId={product.id}
                                productName={product.name}
                                vendorName={vendor?.full_name || 'Vendor'}
                                variant="large"
                                className="w-full h-12 rounded-[3px] bg-[#EE4D2D] hover:bg-[#D73211] text-white font-medium text-[15px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Description Card - Shopee Style Size */}
                <div className="mt-6">
                    <div className="bg-white border border-[#E5E5E5] rounded-[3px] p-4">
                        <h2 className="text-[15px] font-medium text-[#212121] mb-3">
                            📝 Deskripsi Produk
                        </h2>
                        <div className="text-[13px] text-[#212121] leading-relaxed whitespace-pre-line">
                            {product.description}
                        </div>
                    </div>
                </div>

                {/* Recommendations - SAMA DENGAN HOMEPAGE */}
                <div className="mt-8">
                    <div className="mb-4">
                        <h2 className="text-[15px] font-medium text-[#212121]">
                            🔄 Produk Serupa
                        </h2>
                        <div className="text-[11px] text-[#757575] mt-1">
                            Lihat produk lain yang mungkin Anda sukai
                        </div>
                    </div>

                    {/* Rekomendasi akan di-fetch di Recommendations component */}
                    <Recommendations
                        currentProductId={product.id}
                        currentCategory={product.category}
                        currentLocation={product.location}
                        vendorId={vendor?.id || ''}
                        limit={8}
                    />
                </div>
            </Container>

            {/* Mobile Sticky Bottom Bar - Shopee Style */}
            <StickyBottomBar
                vendorId={vendor?.id || ''}
                vendorWhatsApp={vendor?.whatsapp_number || ''}
                productId={product.id}
                productName={product.name}
                vendorName={vendor?.full_name || 'Vendor'}
            />

            {/* SEO Structured Data */}
            <ProductSchema
                product={{
                    name: product.name,
                    description: product.description,
                    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://weddingmarket.com'}/vendor/${product.id}`,
                    image: displayImages,
                    priceFrom: product.price_from || undefined,
                    priceTo: product.price_to || undefined,
                    priceUnit: product.price_unit || undefined,
                    category: product.category,
                    location: product.location,
                    vendorName: vendor?.full_name || 'Vendor',
                    vendorUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://weddingmarket.com'}/vendor/${vendor?.id}`,
                }}
            />
        </div>
    )
}