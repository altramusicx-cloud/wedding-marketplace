// File: app/dashboard/vendor/products/new/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import {
    getKalimantanProvinces,
    getRegenciesByProvince,
    getDistrictsByRegency,
    type Province,
    type Regency,
    type District
} from "@/lib/utils/location-api"
import { ImageUpload } from "@/components/shared/image-upload"
import { uploadImages } from "@/utils/upload-image"
import { createClient } from "@/lib/supabase/client"

// Mock data untuk dropdown (selain location)
const CATEGORIES = [
    "Venue",
    "Photographer",
    "Videographer",
    "Catering",
    "Decoration",
    "Wedding Dress",
    "Makeup Artist",
    "Entertainment",
    "MC & Host",
    "Wedding Planner"
]

const PRICE_UNITS = [
    "paket",
    "per jam",
    "per orang",
    "per hari",
    "per acara"
]

export default function CreateProductPage() {
    const router = useRouter()
    const supabase = createClient()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [priceError, setPriceError] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        priceFrom: "",
        priceTo: "",
        priceUnit: "paket"
    })

    // Location state
    const [provinces, setProvinces] = useState<Province[]>([])
    const [regencies, setRegencies] = useState<Regency[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedRegency, setSelectedRegency] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("")
    const [isLoadingLocations, setIsLoadingLocations] = useState(true)

    // ✅ BUG 1: DEBUG PROVINCES LOADING
    const loadProvinces = async () => {
        try {
            setIsLoadingLocations(true)
            console.log('🔄 Loading provinces from EMSIFA...')
            const data = await getKalimantanProvinces()
            console.log('✅ Provinces loaded:', data)
            setProvinces(data)
        } catch (error) {
            console.error('❌ Failed to load provinces:', error)
            setProvinces([]) // atau tampilkan toast error
        } finally {
            setIsLoadingLocations(false)
        }
    }

    // Load provinces on mount
    useEffect(() => {
        loadProvinces()
    }, [])

    // Load regencies when province changes
    useEffect(() => {
        if (selectedProvince) {
            loadRegencies(selectedProvince)
            setSelectedRegency("")
            setSelectedDistrict("")
        }
    }, [selectedProvince])

    const loadRegencies = async (provinceId: string) => {
        try {
            const data = await getRegenciesByProvince(provinceId)
            setRegencies(data)
            setDistricts([])
        } catch (error) {
            console.error('Failed to load regencies:', error)
            // Clear regencies if error
            setRegencies([])
        }
    }

    // Load districts when regency changes
    useEffect(() => {
        if (selectedRegency) {
            loadDistricts(selectedRegency)
            setSelectedDistrict("")
        }
    }, [selectedRegency])

    const loadDistricts = async (regencyId: string) => {
        try {
            const data = await getDistrictsByRegency(regencyId)
            setDistricts(data)
        } catch (error) {
            console.error('Failed to load districts:', error)
            // Clear districts if error
            setDistricts([])
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // ✅ BUG 2: FIX PRICE PARSING LOGIC
    const parseFormattedNumber = (formattedValue: string): number => {
        if (!formattedValue) return 0
        // Hapus semua titik, lalu parse
        const clean = formattedValue.replace(/\./g, '')
        return parseInt(clean, 10) || 0
    }

    const validatePrices = (priceFrom: string, priceTo: string): string | null => {
        const fromNum = parseFormattedNumber(priceFrom)
        const toNum = parseFormattedNumber(priceTo)

        if (fromNum > 0 && toNum > 0 && fromNum > toNum) {
            return "Harga mulai tidak boleh lebih besar dari harga sampai"
        }

        return null
    }

    // ✅ SIMPLIFIED HANDLE PRICE CHANGE - VALIDATION ONLY (NO AUTO-SWAP)
    const handlePriceChange = (name: 'priceFrom' | 'priceTo', value: string) => {
        // 1. Hapus semua non-digit termasuk titik
        const rawNumbers = value.replace(/[^\d]/g, '')

        // 2. Simpan raw numbers (tanpa titik) di state
        const newFormData = { ...formData, [name]: rawNumbers }

        // 3. Format untuk display dengan titik
        const formattedValue = rawNumbers
            ? parseInt(rawNumbers).toLocaleString('id-ID')
            : ''

        // 4. Update UI input dengan formatting (akan dilakukan di value prop)
        // Kita tetap simpan raw numbers di state

        // 5. Validation
        const fromNum = parseInt(newFormData.priceFrom || '0', 10)
        const toNum = parseInt(newFormData.priceTo || '0', 10)

        if (fromNum > 0 && toNum > 0 && fromNum > toNum) {
            setPriceError("⚠️ Harga mulai lebih besar dari harga sampai")
        } else {
            setPriceError(null)
        }

        setFormData(newFormData)
    }

    const handleImagesChange = (files: File[]) => {
        console.log('📦 [PRODUCT FORM] Images changed:', files.length, 'files')
        console.log('📦 [PRODUCT FORM] Files:', files)
        setUploadedImages(files)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // ✅ VALIDASI HARGA DI SUBMIT DENGAN PARSING YANG BENAR
        const priceError = validatePrices(formData.priceFrom, formData.priceTo)
        if (priceError) {
            alert(priceError)
            return
        }

        // Parse currency values dengan parsing yang benar
        const priceFromNum = parseFormattedNumber(formData.priceFrom) || null
        const priceToNum = parseFormattedNumber(formData.priceTo) || null

        console.log('Parsed prices:', { priceFromNum, priceToNum })

        // Validasi dasar
        if (!formData.name || !formData.category || !formData.description) {
            alert("Harap isi semua field yang wajib diisi")
            return
        }

        // Validasi location
        if (!selectedProvince || !selectedRegency || !selectedDistrict) {
            alert("Harap pilih provinsi, kabupaten, dan kecamatan")
            return
        }

        // Validasi images
        if (uploadedImages.length < 1) {
            alert("Harap upload minimal 1 gambar produk")
            return
        }

        setIsSubmitting(true)

        try {
            // Dapatkan nama location dari state
            const provinceName = provinces.find(p => p.id === selectedProvince)?.name || ""
            const regencyName = regencies.find(r => r.id === selectedRegency)?.name || ""
            const districtName = districts.find(d => d.id === selectedDistrict)?.name || ""
            const fullLocation = `${districtName}, ${regencyName}, ${provinceName}`

            // 1. Upload images ke Supabase Storage
            console.log('Uploading images to Supabase...')
            const imageResults = await uploadImages(uploadedImages, {
                bucket: 'product-images',
                folder: 'temp',
                productId: 'temp-' + Date.now()
            })

            const imageUrls = imageResults.map(result => result.url)
            const thumbnailUrl = imageUrls[0] // Gunakan gambar pertama sebagai thumbnail

            // 2. Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert("Sesi telah berakhir. Silakan login kembali.")
                router.push("/login")
                return
            }

            // 3. Create product di database
            const { data: product, error: productError } = await supabase
                .from('products')
                .insert({
                    vendor_id: user.id,
                    name: formData.name,
                    slug: generateSlug(formData.name),
                    description: formData.description,
                    category: formData.category.toLowerCase(),
                    location: fullLocation,
                    price_from: priceFromNum,
                    price_to: priceToNum,
                    price_unit: formData.priceUnit,
                    thumbnail_url: thumbnailUrl,
                    status: 'pending'
                })
                .select()
                .single()

            if (productError) {
                console.error('Product creation error:', productError)
                throw new Error('Gagal membuat produk')
            }

            // 4. Save product images ke database
            if (product && imageUrls.length > 0) {
                const productImages = imageUrls.map((url, index) => ({
                    product_id: product.id,
                    url,
                    alt_text: `${formData.name} - gambar ${index + 1}`,
                    order_index: index
                }))

                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(productImages)

                if (imagesError) {
                    console.error('Images save error:', imagesError)
                    // Continue anyway, product already created
                }
            }

            console.log('Product created successfully!', product)

            // Redirect ke product list setelah berhasil
            router.push("/dashboard/vendor/products")

        } catch (error) {
            console.error('Error creating product:', error)
            alert("Terjadi kesalahan. Silakan coba lagi.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function untuk generate slug
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim()
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/dashboard/vendor/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Produk
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-charcoal">Tambah Produk Baru</h1>
                <p className="text-gray-600">Isi detail produk Anda untuk ditampilkan di marketplace</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Produk</CardTitle>
                                <CardDescription>Detail utama produk Anda</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nama Produk *
                                    </label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Paket Photographer Premium"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Kategori *
                                        </label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => handleSelectChange("category", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {CATEGORIES.map((category) => (
                                                    <SelectItem key={category} value={category.toLowerCase()}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Location Selector */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Lokasi *
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Province */}
                                        <div>
                                            <Select
                                                value={selectedProvince}
                                                onValueChange={setSelectedProvince}
                                                disabled={isLoadingLocations}
                                            >
                                                <SelectTrigger>
                                                    {isLoadingLocations ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                            <span className="text-gray-400">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        <SelectValue placeholder="Provinsi" />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {provinces.map((province) => (
                                                        <SelectItem key={province.id} value={province.id}>
                                                            {province.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Regency */}
                                        <div>
                                            <Select
                                                value={selectedRegency}
                                                onValueChange={setSelectedRegency}
                                                disabled={!selectedProvince}
                                            >
                                                <SelectTrigger>
                                                    {!selectedProvince ? (
                                                        <span className="text-gray-400">Pilih provinsi</span>
                                                    ) : (
                                                        <SelectValue placeholder="Kabupaten/Kota" />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {regencies.map((regency) => (
                                                        <SelectItem key={regency.id} value={regency.id}>
                                                            {regency.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* District */}
                                        <div>
                                            <Select
                                                value={selectedDistrict}
                                                onValueChange={setSelectedDistrict}
                                                disabled={!selectedRegency}
                                            >
                                                <SelectTrigger>
                                                    {!selectedRegency ? (
                                                        <span className="text-gray-400">Pilih kabupaten</span>
                                                    ) : (
                                                        <SelectValue placeholder="Kecamatan" />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {districts.map((district) => (
                                                        <SelectItem key={district.id} value={district.id}>
                                                            {district.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Pilih provinsi, kabupaten/kota, dan kecamatan di Kalimantan
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Deskripsi *
                                    </label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Deskripsikan produk Anda secara detail..."
                                        rows={6}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Minimal 100 karakter. Jelaskan keunggulan, fasilitas, dan apa yang didapatkan customer.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Harga</CardTitle>
                                <CardDescription>Tentukan rentang harga produk</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Harga Mulai Dari */}
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            value={formData.priceFrom ? parseInt(formData.priceFrom).toLocaleString('id-ID') : ''}
                                            onChange={(e) => handlePriceChange('priceFrom', e.target.value)}
                                            placeholder="0"
                                            className="pl-10"
                                            type="text"
                                            inputMode="numeric"
                                        />
                                    </div>

                                    {/* Harga Sampai */}
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            value={formData.priceTo ? parseInt(formData.priceTo).toLocaleString('id-ID') : ''}
                                            onChange={(e) => handlePriceChange('priceTo', e.target.value)}
                                            placeholder="0"
                                            className="pl-10"
                                            type="text"
                                            inputMode="numeric"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Satuan Harga
                                        </label>
                                        <Select
                                            value={formData.priceUnit}
                                            onValueChange={(value) => handleSelectChange("priceUnit", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRICE_UNITS.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* ✅ TAMPILKAN ERROR MESSAGE JIKA ADA */}
                                {priceError && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {priceError}
                                    </div>
                                )}

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-800">
                                        💡 <strong>Tips:</strong> Harga akan ditampilkan sebagai "Rp 5.000.000 - Rp 10.000.000 / paket".
                                        Kosongkan jika harga tetap.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Section */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar Produk</CardTitle>
                                <CardDescription>Upload foto produk Anda</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload
                                    maxFiles={10}
                                    maxSizeMB={8}
                                    maxSizeKB={120}
                                    onFilesChange={handleImagesChange}
                                    compressToWebP={true}
                                />
                                <p className="text-xs text-gray-500 mt-3">
                                    <strong>Note:</strong> Gambar akan dikompresi otomatis ke format WebP (≤120KB).
                                    Gambar pertama akan menjadi thumbnail.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Publish Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publikasi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span>Status: <strong>Draft</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span>Butuh approval admin (1-2 hari kerja)</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button
                                        type="submit"
                                        className="w-full bg-blush hover:bg-blush/90 text-charcoal"
                                        disabled={isSubmitting || !selectedProvince || !selectedRegency || !selectedDistrict}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : "Simpan & Publikasikan"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-2"
                                        disabled={isSubmitting}
                                    >
                                        Simpan Draft
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
