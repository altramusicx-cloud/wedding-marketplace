// components/vendor/edit-product-form.tsx
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
import { ImageUpload } from "@/components/shared/image-upload"
import { uploadImages, deleteImages } from "@/utils/upload-image"
import { createClient } from "@/lib/supabase/client"
import { productSchema } from "@/lib/validation/product-schema"
import type { ProductFormData } from "@/lib/validation/product-schema"
import type { ProductWithImages } from "@/types"

// Location API types
import {
    getKalimantanProvinces,
    getRegenciesByProvince,
    getDistrictsByRegency,
    type Province,
    type Regency,
    type District
} from "@/lib/utils/location-api"

// Categories dari constants
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

interface EditProductFormProps {
    product: ProductWithImages
    onSuccess?: () => void
}

export function EditProductForm({ product, onSuccess }: EditProductFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoadingLocations, setIsLoadingLocations] = useState(true)

    // Form state
    const [formData, setFormData] = useState<ProductFormData>({
        name: product.name || "",
        category: (product.category as "venue" | "photographer" | "catering" | "decoration" | "dress" | "makeup" | "music" | "invitation") || "venue",
        description: product.description || "",
        location: product.location || "",
        price_from: product.price_from || null,
        price_to: product.price_to || null,
        price_unit: (product.price_unit as "paket" | "per jam" | "per orang" | "custom") || "paket"
    })

    // Location state
    const [provinces, setProvinces] = useState<Province[]>([])
    const [regencies, setRegencies] = useState<Regency[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedRegency, setSelectedRegency] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("")

    // Existing images state
    const [existingImages, setExistingImages] = useState(
        product.product_images?.map(img => ({
            url: img.url,
            id: img.id
        })) || []
    )
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

    // Parse location string (format: "Kecamatan, Kabupaten, Provinsi")
    useEffect(() => {
        const parseLocation = () => {
            const parts = product.location.split(', ').reverse()
            if (parts.length >= 3) {
                // Akan di-match dengan API setelah provinces loaded
                // Simpan dulu sebagai reference
            }
        }
        parseLocation()
    }, [product.location])

    // Load provinces on mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                setIsLoadingLocations(true)
                const data = await getKalimantanProvinces()
                setProvinces(data)
            } catch (error) {
                console.error('Failed to load provinces:', error)
            } finally {
                setIsLoadingLocations(false)
            }
        }
        loadProvinces()
    }, [])

    // Load regencies when province changes
    useEffect(() => {
        if (selectedProvince) {
            const loadRegencies = async () => {
                try {
                    const data = await getRegenciesByProvince(selectedProvince)
                    setRegencies(data)
                } catch (error) {
                    console.error('Failed to load regencies:', error)
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
                } catch (error) {
                    console.error('Failed to load districts:', error)
                }
            }
            loadDistricts()
        }
    }, [selectedRegency])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSelectChange = (name: keyof ProductFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handlePriceChange = (name: 'price_from' | 'price_to', value: string) => {
        // Remove non-digits
        const rawNumbers = value.replace(/[^\d]/g, '')
        const numValue = rawNumbers ? parseInt(rawNumbers, 10) : null

        setFormData(prev => ({
            ...prev,
            [name]: numValue
        }))

        // Clear price errors
        if (errors.price_from || errors.price_to) {
            setErrors(prev => ({
                ...prev,
                price_from: '',
                price_to: ''
            }))
        }
    }

    const handleImagesChange = (files: File[]) => {
        console.log('Images changed for edit:', files.length)
        setUploadedImages(files)
    }

    const validateForm = (): boolean => {
        try {
            productSchema.parse(formData)
            setErrors({})
            return true
        } catch (error: unknown) {
            const newErrors: Record<string, string> = {}
            if (error instanceof Error && 'errors' in error) {
                const zodError = error as { errors: Array<{ path: string[]; message: string }> }
                zodError.errors.forEach((err) => {
                    const field = err.path[0]
                    newErrors[field] = err.message
                })
            }
            setErrors(newErrors)
            return false
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!validateForm()) {
            alert("Harap perbaiki error pada form")
            return
        }

        // Location validation
        if (!selectedProvince || !selectedRegency || !selectedDistrict) {
            alert("Harap pilih lokasi lengkap (provinsi, kabupaten, kecamatan)")
            return
        }

        setIsSubmitting(true)

        try {
            // Get location names
            const provinceName = provinces.find(p => p.id === selectedProvince)?.name || ""
            const regencyName = regencies.find(r => r.id === selectedRegency)?.name || ""
            const districtName = districts.find(d => d.id === selectedDistrict)?.name || ""
            const fullLocation = `${districtName}, ${regencyName}, ${provinceName}`

            // Upload new images if any
            let newImageUrls: string[] = []
            if (uploadedImages.length > 0) {
                const uploadResults = await uploadImages(uploadedImages, {
                    bucket: 'product-images',
                    folder: `products/${product.id}`,
                    productId: product.id
                })
                newImageUrls = uploadResults.map(result => result.url)
            }

            // Delete images marked for removal
            if (imagesToDelete.length > 0) {
                await deleteImages(imagesToDelete, 'product-images')
            }

            // Update product in database
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category.toLowerCase(),
                    location: fullLocation,
                    price_from: formData.price_from,
                    price_to: formData.price_to,
                    price_unit: formData.price_unit,
                    updated_at: new Date().toISOString()
                })
                .eq('id', product.id)

            if (updateError) {
                throw new Error(`Gagal update produk: ${updateError.message}`)
            }

            // Add new product images to database
            if (newImageUrls.length > 0) {
                const productImages = newImageUrls.map((url, index) => ({
                    product_id: product.id,
                    url,
                    alt_text: `${formData.name} - gambar ${index + 1}`,
                    order_index: existingImages.length + index
                }))

                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(productImages)

                if (imagesError) {
                    console.warn('Gagal menyimpan gambar baru:', imagesError)
                }
            }

            console.log('Product updated successfully!')

            // Call success callback or redirect
            if (onSuccess) {
                onSuccess()
            } else {
                router.push("/dashboard/vendor/products")
                router.refresh()
            }

        } catch (error: unknown) {
            console.error('Error updating product:', error)
            alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Format price for display
    const formatPriceDisplay = (price: number | null): string => {
        if (!price) return ''
        return price.toLocaleString('id-ID')
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
                <h1 className="text-3xl font-bold text-charcoal">Edit Produk</h1>
                <p className="text-gray-600">Update detail produk Anda</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Produk</CardTitle>
                                <CardDescription>Update detail utama produk</CardDescription>
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
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                    )}
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
                                        {errors.category && (
                                            <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                                        )}
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
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        Minimal 20 karakter. Jelaskan keunggulan, fasilitas, dan apa yang didapatkan customer.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Harga</CardTitle>
                                <CardDescription>Update rentang harga produk</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Harga Mulai Dari */}
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            value={formatPriceDisplay(formData.price_from)}
                                            onChange={(e) => handlePriceChange('price_from', e.target.value)}
                                            placeholder="0"
                                            className="pl-10"
                                            type="text"
                                            inputMode="numeric"
                                        />
                                        {errors.price_from && (
                                            <p className="text-red-600 text-sm mt-1">{errors.price_from}</p>
                                        )}
                                    </div>

                                    {/* Harga Sampai */}
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            value={formatPriceDisplay(formData.price_to)}
                                            onChange={(e) => handlePriceChange('price_to', e.target.value)}
                                            placeholder="0"
                                            className="pl-10"
                                            type="text"
                                            inputMode="numeric"
                                        />
                                        {errors.price_to && (
                                            <p className="text-red-600 text-sm mt-1">{errors.price_to}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Satuan Harga
                                        </label>
                                        <Select
                                            value={formData.price_unit}
                                            onValueChange={(value) => handleSelectChange("price_unit", value)}
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

                                {errors.price_to && errors.price_to.includes('maksimal') && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.price_to}
                                    </div>
                                )}

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-800">
                                        💡                                         💡 <strong>Tips:</strong> Harga akan ditampilkan sebagai &quot;Rp 5.000.000 - Rp 10.000.000 / paket&quot;.
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
                                <CardDescription>Update foto produk Anda</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload
                                    maxFiles={10}
                                    maxSizeMB={8}
                                    maxSizeKB={120}
                                    onFilesChange={handleImagesChange}
                                    existingImages={existingImages}
                                    compressToWebP={true}
                                />
                                <p className="text-xs text-gray-500 mt-3">
                                    <strong>Note:</strong> Gambar akan dikompresi otomatis ke format WebP (≤120KB).
                                    Klik X pada gambar untuk menghapus.
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
                                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                        <span>Status: <strong>Pending Review</strong> (setelah edit)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span>Butuh approval admin setelah update</span>
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
                                        ) : "Update Produk"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-2"
                                        disabled={isSubmitting}
                                        onClick={() => router.push("/dashboard/vendor/products")}
                                    >
                                        Batalkan
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