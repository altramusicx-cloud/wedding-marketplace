// File: app/dashboard/vendor/products/new/page.tsx (VERSI BARU DENGAN LOCATION API)
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import {
    getKalimantanProvinces,
    getRegenciesByProvince,
    getDistrictsByRegency,
    type Province,
    type Regency,
    type District
} from "@/lib/utils/location-api"

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<File[]>([])

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

    // Load provinces on mount
    useEffect(() => {
        loadProvinces()
    }, [])

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
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newImages = Array.from(files).slice(0, 10 - images.length)
            setImages(prev => [...prev, ...newImages])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validasi location
        if (!selectedProvince || !selectedRegency || !selectedDistrict) {
            alert("Harap pilih provinsi, kabupaten, dan kecamatan")
            return
        }

        setIsSubmitting(true)

        // Dapatkan nama location dari state
        const provinceName = provinces.find(p => p.id === selectedProvince)?.name || ""
        const regencyName = regencies.find(r => r.id === selectedRegency)?.name || ""
        const districtName = districts.find(d => d.id === selectedDistrict)?.name || ""

        const locationData = {
            provinceId: selectedProvince,
            province: provinceName,
            regencyId: selectedRegency,
            regency: regencyName,
            districtId: selectedDistrict,
            district: districtName,
            fullLocation: `${districtName}, ${regencyName}, ${provinceName}`
        }

        console.log("Form data:", formData)
        console.log("Location data:", locationData)
        console.log("Images:", images)

        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Redirect ke product list setelah berhasil
        router.push("/dashboard/vendor/products")
        setIsSubmitting(false)
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
                                            <SelectContent>
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
                                                <SelectContent>
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
                                                <SelectContent>
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
                                                <SelectContent>
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
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Harga Mulai Dari
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                Rp
                                            </span>
                                            <Input
                                                name="priceFrom"
                                                value={formData.priceFrom}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className="pl-10"
                                                type="number"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Harga Sampai
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                Rp
                                            </span>
                                            <Input
                                                name="priceTo"
                                                value={formData.priceTo}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className="pl-10"
                                                type="number"
                                            />
                                        </div>
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
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Drag & drop gambar atau klik untuk upload
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Max 10 gambar, setiap gambar max 2MB
                                    </p>
                                    <Button type="button" variant="outline" className="relative">
                                        Pilih Gambar
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </Button>
                                </div>

                                {/* Preview Images */}
                                {images.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium">
                                            {images.length} gambar dipilih
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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