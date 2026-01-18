// File: app/(public)/vendor/[id]/page.tsx
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard, ProductGrid } from "@/components/product/product-card"
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

// Mock data - nanti akan diambil dari database
const mockProduct = {
    id: "1",
    name: "Paket Photographer Premium",
    description: `Paket lengkap photography untuk pernikahan Anda. Termasuk:
• 8 jam shooting
• 500+ foto hasil edit
• 50 foto cetak premium
• Album hardcover
• Photographer berpengalaman 5+ tahun
• Free konsultasi konsep

Spesialis dalam berbagai gaya: traditional, modern, candid, dan artistic photography.`,
    category: "Photographer",
    location: "Banjarmasin, Kalimantan Selatan",
    price_from: 8000000,
    price_to: 12000000,
    price_unit: "paket",
    rating: 4.8,
    review_count: 42,
    vendor_name: "Studio Foto Elegant",
    vendor_since: "2020",
    vendor_rating: 4.9,
    vendor_review_count: 128,
    is_featured: true,
    features: [
        "Free konsultasi konsep",
        "Editing profesional",
        "Album cetak premium",
        "Fast delivery 2 minggu",
        "Revisi gratis 2x"
    ],
    inclusions: [
        "8 jam shooting",
        "500+ foto hasil edit",
        "50 foto cetak 10R",
        "Album hardcover",
        "USB premium"
    ]
}

const mockImages = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w-1200",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200"
]

const mockRelatedProducts = [
    {
        id: "2",
        name: "Venue Gedung Serba Guna",
        thumbnail_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
        category: "Venue",
        location: "Banjarbaru",
        price_from: 15000000,
        price_to: 25000000,
        rating: 4.6,
        review_count: 31,
        is_featured: true
    },
    {
        id: "3",
        name: "Dress Pengantin Modern",
        thumbnail_url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800",
        category: "Wedding Dress",
        location: "Banjarmasin",
        price_from: 5000000,
        rating: 4.9,
        review_count: 56,
        is_featured: false
    },
    {
        id: "4",
        name: "Catering 500 Pax",
        thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        category: "Catering",
        location: "Palangka Raya",
        price_from: 12000000,
        rating: 4.7,
        review_count: 89,
        is_featured: true
    }
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    // In production, fetch product by ID from database
    const product = mockProduct
    const images = mockImages
    const relatedProducts = mockRelatedProducts

    if (!product) {
        notFound()
    }

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
                        <ProductGallery images={images} productName={product.name} />
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl md:text-3xl font-bold text-charcoal">{product.name}</h1>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Heart className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span className="font-medium">{product.rating}</span>
                                        <span className="text-gray-600">({product.review_count} review)</span>
                                    </div>
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
                                    <span className="text-gray-600">/{product.price_unit}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Harga sudah termasuk PPN</p>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="h-4 w-4 text-blush" />
                                    <div>
                                        <p className="text-xs text-gray-600">Durasi</p>
                                        <p className="font-medium">8 Jam</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Users className="h-4 w-4 text-blush" />
                                    <div>
                                        <p className="text-xs text-gray-600">Kapasitas</p>
                                        <p className="font-medium">Unlimited</p>
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
                                            {product.vendor_name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{product.vendor_name}</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span>{product.vendor_rating}</span>
                                            </div>
                                            <span className="text-gray-600">• Vendor sejak {product.vendor_since}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Terverifikasi WeddingMarket</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Responsif (rata-rata 1 jam)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-3">Yang termasuk:</h3>
                                <ul className="space-y-2">
                                    {product.inclusions.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blush"></div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Contact Button - Sticky on mobile */}
                        {/* Contact Button - Sticky on mobile */}
                        <div className="sticky bottom-0 lg:static bg-white lg:bg-transparent border-t lg:border-0 p-4 lg:p-0">
                            <ContactButton
                                vendorId="temp-vendor-id-123"
                                vendorWhatsApp="+6281234567890"
                                productId={product.id}
                                productName={product.name}
                                vendorName={product.vendor_name || "Vendor"}
                                variant="large"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Deskripsi Produk</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="whitespace-pre-line">{product.description}</p>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3">Fitur Unggulan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {product.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews Section */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Ulasan ({product.review_count})</h2>
                                {/* Reviews akan diisi nanti */}
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada ulasan. Jadilah yang pertama!
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Similar Products */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Produk Serupa</h2>
                        <div className="space-y-4">
                            {relatedProducts.slice(0, 3).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    variant="compact"
                                />
                            ))}
                        </div>

                        {/* Vendor Other Products */}
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4">Produk Lain dari Vendor Ini</h2>
                            <div className="space-y-4">
                                {relatedProducts.slice(0, 2).map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        variant="compact"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}