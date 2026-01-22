// app/categories/[slug]/page.tsx
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ProductCard, ProductGrid } from "@/components/product/product-card"
import { Filter, Search, MapPin } from "lucide-react"

// Mock data for categories
const CATEGORIES = {
    'venue': {
        name: 'Venue',
        description: 'Temukan venue pernikahan terbaik di Kalimantan',
        icon: '🏛️',
        color: 'bg-blush/20 text-blush-dark'
    },
    'photographer': {
        name: 'Photographer',
        description: 'Photographer profesional untuk moment spesial Anda',
        icon: '📸',
        color: 'bg-sage/20 text-sage-dark'
    },
    'catering': {
        name: 'Catering',
        description: 'Catering lezat untuk tamu undangan',
        icon: '🍽️',
        color: 'bg-amber-100 text-amber-800'
    },
    'decoration': {
        name: 'Decoration',
        description: 'Dekorasi pernikahan yang memukau',
        icon: '🎨',
        color: 'bg-purple-100 text-purple-800'
    },
    'wedding-dress': {
        name: 'Wedding Dress',
        description: 'Gaun pengantin elegan dan modern',
        icon: '👰',
        color: 'bg-pink-100 text-pink-800'
    },
    'makeup-artist': {
        name: 'Makeup Artist',
        description: 'Makeup artist profesional untuk hari spesial',
        icon: '💄',
        color: 'bg-rose-100 text-rose-800'
    }
}

// Mock products data
const MOCK_PRODUCTS = [
    {
        id: "1",
        name: "Paket Photographer Premium",
        thumbnail_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        category: "Photographer",
        location: "Banjarmasin",
        price_from: 8000000,
        price_to: 12000000,
        rating: 4.8,
        review_count: 42,
        is_featured: true,
        vendor_name: "Studio Foto Elegant"
    },
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
        is_featured: true,
        vendor_name: "Gedung Mewah"
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
        is_featured: false,
        vendor_name: "Butik Pengantin"
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
        is_featured: true,
        vendor_name: "Catering Royal"
    },
    {
        id: "5",
        name: "Dekorasi Rustic Theme",
        thumbnail_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
        category: "Decoration",
        location: "Samarinda",
        price_from: 7500000,
        price_to: 15000000,
        rating: 4.5,
        review_count: 23,
        is_featured: false,
        vendor_name: "Dekorasi Indah"
    },
    {
        id: "6",
        name: "Makeup Artist Profesional",
        thumbnail_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
        category: "Makeup Artist",
        location: "Balikpapan",
        price_from: 3500000,
        rating: 4.9,
        review_count: 67,
        is_featured: true,
        vendor_name: "Makeup Studio"
    }
]

const LOCATIONS = [
    "Semua Lokasi",
    "Banjarmasin",
    "Banjarbaru",
    "Palangka Raya",
    "Samarinda",
    "Balikpapan",
    "Pontianak"
]

const SORT_OPTIONS = [
    { value: "newest", label: "Terbaru" },
    { value: "popular", label: "Terpopuler" },
    { value: "price-low", label: "Harga Terendah" },
    { value: "price-high", label: "Harga Tertinggi" },
    { value: "rating", label: "Rating Tertinggi" }
]

// ✅ PERBAIKAN: Tambahkan async dan ubah tipe params menjadi Promise
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    // ✅ PERBAIKAN: Gunakan await untuk unwrap Promise
    const { slug } = await params
    const category = CATEGORIES[slug as keyof typeof CATEGORIES]

    if (!category) {
        notFound()
    }

    // Filter products by category
    const categoryProducts = MOCK_PRODUCTS.filter(
        product => product.category.toLowerCase() === category.name.toLowerCase()
    )

    return (
        <div className="min-h-screen bg-ivory">
            {/* Category Header */}
            <div className="bg-white border-b">
                <div className="container-custom py-8 md:py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-2xl ${category.color}`}>
                            {category.icon}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-charcoal">{category.name}</h1>
                            <p className="text-gray-600 mt-1">{category.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-2 w-2 rounded-full bg-blush"></div>
                        <span className="text-sm text-gray-600">
                            {categoryProducts.length} vendor tersedia
                        </span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Search */}
                                    <div>
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <Search className="h-4 w-4" />
                                            Cari Vendor
                                        </h3>
                                        <Input placeholder="Nama vendor atau produk..." />
                                    </div>

                                    {/* Location Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Lokasi
                                        </h3>
                                        <Select defaultValue="all">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih lokasi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LOCATIONS.map((location) => (
                                                    <SelectItem key={location} value={location.toLowerCase()}>
                                                        {location}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <h3 className="font-semibold mb-3">Rentang Harga</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Rp 0</span>
                                                <span className="text-sm text-gray-600">Rp 50jt+</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="50000000"
                                                step="1000000"
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-sm">
                                                <Button variant="outline" size="sm">Under Rp 5jt</Button>
                                                <Button variant="outline" size="sm">Rp 5-10jt</Button>
                                                <Button variant="outline" size="sm">Rp 10jt+</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3">Fitur</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                                <span className="text-sm">Vendor Terverifikasi</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                                <span className="text-sm">Featured Vendor</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                                <span className="text-sm">Responsif (≤ 1 jam)</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Rating Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3">Rating Minimum</h3>
                                        <div className="space-y-2">
                                            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="rating" className="rounded-full border-gray-300" />
                                                    <span className="text-sm">{rating}+ Bintang</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Apply Filters */}
                                    <Button className="w-full bg-blush hover:bg-blush/90 text-charcoal">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Terapkan Filter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Semua Vendor {category.name} ({categoryProducts.length})
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Tampilkan vendor terbaik di Kalimantan
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Select defaultValue="newest">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {categoryProducts.length > 0 ? (
                            <>
                                <ProductGrid className="mb-8">
                                    {categoryProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            variant="default"

                                        />
                                    ))}
                                </ProductGrid>

                                {/* Featured Vendors Section */}
                                <div className="mt-12">
                                    <h3 className="text-xl font-bold mb-6">Featured Vendors</h3>
                                    <ProductGrid>
                                        {categoryProducts
                                            .filter(product => product.is_featured)
                                            .slice(0, 4)
                                            .map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    variant="default"

                                                />
                                            ))}
                                    </ProductGrid>
                                </div>

                                {/* Popular Locations */}
                                <div className="mt-12">
                                    <h3 className="text-xl font-bold mb-6">Populer di Lokasi</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['Banjarmasin', 'Banjarbaru', 'Samarinda', 'Balikpapan'].map((location) => {
                                            const locationProducts = categoryProducts.filter(
                                                p => p.location === location
                                            )
                                            return (
                                                <Card key={location} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="h-4 w-4 text-blush" />
                                                            <h4 className="font-semibold">{location}</h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {locationProducts.length} vendor tersedia
                                                        </p>
                                                        <Button
                                                            variant="link"
                                                            className="p-0 h-auto text-blush hover:text-blush/80 mt-2"
                                                        >
                                                            Lihat semua →
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <div className="text-4xl mb-4">📭</div>
                                    <h3 className="text-xl font-semibold mb-2">Belum ada vendor</h3>
                                    <p className="text-gray-600 mb-4">
                                        Belum ada vendor {category.name} yang terdaftar di WeddingMarket.
                                    </p>
                                    <Button variant="outline">Jadilah vendor pertama</Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pagination */}
                        {categoryProducts.length > 0 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" disabled>
                                        ←
                                    </Button>
                                    <Button variant="outline" className="bg-blush text-charcoal hover:bg-blush/90">
                                        1
                                    </Button>
                                    <Button variant="outline">2</Button>
                                    <Button variant="outline">3</Button>
                                    <span className="px-2">...</span>
                                    <Button variant="outline">10</Button>
                                    <Button variant="outline" size="icon">
                                        →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}