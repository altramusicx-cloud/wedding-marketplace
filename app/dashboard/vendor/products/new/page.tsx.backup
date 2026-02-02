// File: app/dashboard/vendor/products/new/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, AlertCircle, Info, Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react"
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
import { productSchema } from "@/lib/validation/product-schema"
import { formatCurrency } from "@/lib/utils/format-currency"
import { useToast } from "@/components/ui/use-toast"

// --- STYLES CONSTANTS ---
const MALL_RED = "#d0011b"
const SHOPEE_ORANGE = "#ee4d2d"
const BORDER_COLOR = "#e5e5e5"
const BG_GRAY = "#f5f5f5"

// Mock data untuk dropdown
const CATEGORIES = [
    { value: "venue", label: "Venue" },
    { value: "photographer", label: "Photographer" },
    { value: "videographer", label: "Videographer" },
    { value: "catering", label: "Catering" },
    { value: "decoration", label: "Decoration" },
    { value: "wedding-dress", label: "Wedding Dress" },
    { value: "makeup-artist", label: "Makeup Artist" },
    { value: "entertainment", label: "Entertainment" },
    { value: "mc-host", label: "MC & Host" },
    { value: "wedding-planner", label: "Wedding Planner" }
]

const PRICE_UNITS = [
    { value: "paket", label: "paket" },
    { value: "per-jam", label: "per jam" },
    { value: "per-orang", label: "per orang" },
    { value: "per-hari", label: "per hari" },
    { value: "per-acara", label: "per acara" }
]

export default function CreateProductPage() {
    const router = useRouter()
    const supabase = createClient()
    const { toast } = useToast()

    // === STATE MANAGEMENT ===
    const [isClient, setIsClient] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

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

    // === INITIALIZATION ===
    useEffect(() => {
        setIsClient(true)
        loadProvinces()
    }, [])

    // === LOCATION HANDLING ===
    const loadProvinces = useCallback(async () => {
        try {
            setIsLoadingLocations(true)
            const data = await getKalimantanProvinces()
            setProvinces(data)
        } catch (error) {
            console.error('❌ Failed to load provinces:', error)
            toast({
                title: "Gagal memuat data lokasi",
                description: "Silakan refresh halaman atau coba lagi nanti.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingLocations(false)
        }
    }, [toast])

    // Load regencies when province changes
    useEffect(() => {
        if (selectedProvince) {
            const loadRegencies = async () => {
                try {
                    const data = await getRegenciesByProvince(selectedProvince)
                    setRegencies(data)
                    setSelectedRegency("")
                    setSelectedDistrict("")
                    setDistricts([])
                } catch (error) {
                    console.error('Failed to load regencies:', error)
                    setRegencies([])
                }
            }
            loadRegencies()
        }
    }, [selectedProvince])

    // Load districts when regency changes
    useEffect(() => {
        if (selectedRegency) {
            const loadDistricts = async () => {
                try {
                    const data = await getDistrictsByRegency(selectedRegency)
                    setDistricts(data)
                    setSelectedDistrict("")
                } catch (error) {
                    console.error('Failed to load districts:', error)
                    setDistricts([])
                }
            }
            loadDistricts()
        }
    }, [selectedRegency])

    // === FORM HANDLING ===
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear validation error
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    // === PRICE HANDLING ===
    const handlePriceChange = (name: 'priceFrom' | 'priceTo', value: string) => {
        const numericValue = value.replace(/[^\d]/g, '')
        setFormData(prev => ({ ...prev, [name]: numericValue }))

        // Validation
        const fromNum = parseInt(formData.priceFrom || '0', 10)
        const toNum = parseInt(formData.priceTo || '0', 10)

        if (name === 'priceFrom' && toNum > 0 && parseInt(numericValue || '0', 10) > toNum) {
            setValidationErrors(prev => ({
                ...prev,
                price: "Harga mulai tidak boleh lebih besar dari harga sampai"
            }))
        } else if (name === 'priceTo' && fromNum > 0 && parseInt(numericValue || '0', 10) < fromNum) {
            setValidationErrors(prev => ({
                ...prev,
                price: "Harga sampai tidak boleh lebih kecil dari harga mulai"
            }))
        } else {
            if (validationErrors.price) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.price
                    return newErrors
                })
            }
        }
    }

    // === IMAGE HANDLING ===
    const handleImagesChange = useCallback((files: File[]) => {
        console.log('📦 [Parent] Images received:', files.length)
        setUploadedImages(files)
    }, [])

    const handleThumbnailChange = useCallback((index: number) => {
        console.log("✅ Thumbnail selected:", index)
        setSelectedThumbnailIndex(index)

        toast({
            title: "Thumbnail dipilih",
            description: `Gambar ${index + 1} dijadikan thumbnail`,
            duration: 2000
        })
    }, [toast])

    // === VALIDATION ===
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!formData.name.trim()) errors.name = "Nama produk wajib diisi"
        if (!formData.category) errors.category = "Kategori wajib dipilih"
        if (!formData.description.trim()) errors.description = "Deskripsi wajib diisi"
        if (!selectedProvince) errors.province = "Provinsi wajib dipilih"
        if (!selectedRegency) errors.regency = "Kabupaten/Kota wajib dipilih"
        if (!selectedDistrict) errors.district = "Kecamatan wajib dipilih"

        const fromNum = parseInt(formData.priceFrom || '0', 10)
        const toNum = parseInt(formData.priceTo || '0', 10)
        if (fromNum > 0 && toNum > 0 && fromNum > toNum) {
            errors.price = "Harga mulai tidak boleh lebih besar dari harga sampai"
        }

        if (uploadedImages.length < 1) {
            errors.images = "Minimal upload 1 gambar produk"
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    // === SUBMIT HANDLER - OPTIMIZED ===
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast({
                title: "Form tidak valid",
                description: "Harap periksa kembali data yang diisi",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)

        try {
            // 1. Get location names
            const provinceName = provinces.find(p => p.id === selectedProvince)?.name || ""
            const regencyName = regencies.find(r => r.id === selectedRegency)?.name || ""
            const districtName = districts.find(d => d.id === selectedDistrict)?.name || ""
            const fullLocation = `${districtName}, ${regencyName}, ${provinceName}`

            // 2. Upload images (FASTER - tanpa delay)
            console.log('Uploading images to Supabase...')
            const uploadPromises = uploadedImages.map((file, index) =>
                uploadImages([file], {
                    bucket: 'product-images',
                    folder: 'products',
                    productId: `temp-${Date.now()}-${index}`
                })
            )

            const imageResults = await Promise.all(uploadPromises)
            const imageUrls = imageResults.flat().map(result => result.url)
            const thumbnailIndex = selectedThumbnailIndex < imageUrls.length ? selectedThumbnailIndex : 0
            const thumbnailUrl = imageUrls[thumbnailIndex]

            // 3. Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast({
                    title: "Sesi berakhir",
                    description: "Silakan login kembali",
                    variant: "destructive"
                })
                router.push("/login")
                return
            }

            // 4. Create product
            const priceFromNum = formData.priceFrom ? parseInt(formData.priceFrom, 10) : null
            const priceToNum = formData.priceTo ? parseInt(formData.priceTo, 10) : null

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

            if (productError) throw new Error(productError.message)

            // 5. Save product images (batch insert)
            if (product && imageUrls.length > 0) {
                const productImages = imageUrls.map((url: string, index: number) => ({
                    product_id: product.id,
                    url,
                    alt_text: `${formData.name} - gambar ${index + 1}`,
                    order_index: index
                }))

                await supabase
                    .from('product_images')
                    .insert(productImages)
            }

            // Success
            toast({
                title: "✅ Produk berhasil diajukan!",
                description: "Produk Anda sedang menunggu persetujuan admin.",
                duration: 5000
            })

            // Redirect
            setTimeout(() => {
                router.push("/dashboard/vendor/products")
            }, 1500)

        } catch (error: any) {
            console.error('❌ Error creating product:', error)
            toast({
                title: "Gagal membuat produk",
                description: error.message || "Silakan coba lagi.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim()
    }

    // Render loading skeleton
    if (!isClient) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-4">
                        <div className="h-40 bg-gray-200 rounded"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/dashboard/vendor/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Produk
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
                <p className="text-gray-600 mt-1">Lengkapi detail produk Anda</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Main Form - SINGLE COLUMN */}
                <div className="space-y-8">
                    {/* Product Info */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg">Informasi Produk</CardTitle>
                            <CardDescription>Detail utama produk Anda</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div>
                                <Label htmlFor="name" className="mb-2 block font-medium">
                                    Nama Produk *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Paket Photographer Premium"
                                    className={`w-full bg-white ${validationErrors.name ? "border-red-500" : ""}`}
                                />
                                {validationErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="category" className="mb-2 block font-medium">
                                    Kategori *
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleSelectChange("category", value)}
                                >
                                    <SelectTrigger className={`w-full bg-white ${validationErrors.category ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {CATEGORIES.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {validationErrors.category && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
                                )}
                            </div>

                            {/* Location Selector */}
                            <div>
                                <Label className="mb-2 block font-medium">
                                    Lokasi *
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Province */}
                                    <div>
                                        <Select
                                            value={selectedProvince}
                                            onValueChange={setSelectedProvince}
                                            disabled={isLoadingLocations}
                                        >
                                            <SelectTrigger className={`bg-white ${validationErrors.province ? "border-red-500" : ""}`}>
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
                                        {validationErrors.province && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.province}</p>
                                        )}
                                    </div>

                                    {/* Regency */}
                                    <div>
                                        <Select
                                            value={selectedRegency}
                                            onValueChange={setSelectedRegency}
                                            disabled={!selectedProvince}
                                        >
                                            <SelectTrigger className={`bg-white ${validationErrors.regency ? "border-red-500" : ""}`}>
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
                                        {validationErrors.regency && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.regency}</p>
                                        )}
                                    </div>

                                    {/* District */}
                                    <div>
                                        <Select
                                            value={selectedDistrict}
                                            onValueChange={setSelectedDistrict}
                                            disabled={!selectedRegency}
                                        >
                                            <SelectTrigger className={`bg-white ${validationErrors.district ? "border-red-500" : ""}`}>
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
                                        {validationErrors.district && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.district}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Pilih provinsi, kabupaten/kota, dan kecamatan di Kalimantan
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="description" className="mb-2 block font-medium">
                                    Deskripsi *
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Deskripsikan produk Anda secara detail..."
                                    rows={5}
                                    className={`w-full bg-white ${validationErrors.description ? "border-red-500" : ""}`}
                                />
                                <div className="flex justify-between mt-2">
                                    <p className="text-xs text-gray-500">
                                        Minimal 100 karakter. Jelaskan keunggulan dan fasilitas.
                                    </p>
                                    <p className={`text-xs ${formData.description.length < 100 ? "text-amber-600" : "text-green-600"}`}>
                                        {formData.description.length} karakter
                                    </p>
                                </div>
                                {validationErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg">Harga</CardTitle>
                            <CardDescription>Tentukan rentang harga produk</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Harga Mulai Dari */}
                                <div>
                                    <Label htmlFor="priceFrom" className="mb-2 block font-medium">
                                        Harga Mulai Dari
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            id="priceFrom"
                                            value={formData.priceFrom ? formatCurrency(parseInt(formData.priceFrom, 10)) : ''}
                                            onChange={(e) => handlePriceChange('priceFrom', e.target.value)}
                                            placeholder="0"
                                            className="pl-10 bg-white w-full"
                                            type="text"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                {/* Harga Sampai */}
                                <div>
                                    <Label htmlFor="priceTo" className="mb-2 block font-medium">
                                        Harga Sampai
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            id="priceTo"
                                            value={formData.priceTo ? formatCurrency(parseInt(formData.priceTo, 10)) : ''}
                                            onChange={(e) => handlePriceChange('priceTo', e.target.value)}
                                            placeholder="0"
                                            className="pl-10 bg-white w-full"
                                            type="text"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="priceUnit" className="mb-2 block font-medium">
                                        Satuan Harga
                                    </Label>
                                    <Select
                                        value={formData.priceUnit}
                                        onValueChange={(value) => handleSelectChange("priceUnit", value)}
                                    >
                                        <SelectTrigger className="bg-white w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {PRICE_UNITS.map((unit) => (
                                                <SelectItem key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {validationErrors.price && (
                                <div className="text-red-500 text-sm mt-1 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {validationErrors.price}
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    💡 Harga akan ditampilkan sebagai <strong>"Rp 5.000.000 - Rp 10.000.000 / paket"</strong>.
                                    Kosongkan salah satu jika harga tetap.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg">Gambar Produk</CardTitle>
                            <CardDescription>Upload foto produk Anda (min. 1 gambar)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ImageUpload
                                selectedThumbnailIndex={selectedThumbnailIndex}
                                onThumbnailSelect={handleThumbnailChange}
                                maxFiles={10}
                                maxSizeMB={8}
                                maxSizeKB={120}
                                onFilesChange={handleImagesChange}
                                compressToWebP={true}
                            />

                            {validationErrors.images && (
                                <p className="text-red-500 text-sm mt-2">{validationErrors.images}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status Card - DI BAWAH (sebelum tombol) */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg">Status Publikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                                        <span className="text-white text-xs">D</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Status: Draft</p>
                                        <p className="text-sm text-gray-600">Produk belum diajukan untuk review</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                                        <span className="text-white text-xs">R</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Butuh Approval Admin</p>
                                        <p className="text-sm text-gray-600">Setelah submit, admin akan review produk dalam 1-2 hari kerja</p>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-green-800">Setelah Disetujui:</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-green-700">
                                                <li>Produk live di marketplace</li>
                                                <li>Bisa ditemukan oleh calon pengantin</li>
                                                <li>Bisa menerima kontak dari pengguna</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button Section - DI PALING BAWAH */}
                    <div className="sticky bottom-0 bg-white border-t pt-6 pb-6 -mx-4 px-4 mt-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto order-2 sm:order-1"
                                    onClick={() => router.push("/dashboard/vendor/products")}
                                    disabled={isSubmitting}
                                >
                                    Kembali
                                </Button>

                                <div className="w-full sm:w-auto order-1 sm:order-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Ajukan untuk Review Admin
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                        Produk akan ditinjau admin sebelum dipublikasikan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}


