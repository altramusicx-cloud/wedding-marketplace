// app/dashboard/vendor/products/new/page.tsx - Simplified version
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "venue",
    description: "",
    priceFrom: "",
    priceTo: "",
    priceUnit: "paket"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Produk berhasil dibuat! (Simulasi)")
      router.push("/dashboard/vendor/products")
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/vendor/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Tambah Produk Baru</h1>
          <p className="text-gray-600">Isi detail produk Anda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informasi Produk</CardTitle>
            <CardDescription>Detail dasar tentang produk Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nama Produk */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Paket Photographer Premium"
                required
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="venue">Venue</option>
                <option value="photographer">Photographer</option>
                <option value="catering">Catering</option>
                <option value="decoration">Decoration</option>
                <option value="wedding-dress">Wedding Dress</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsi lengkap tentang produk Anda..."
                rows={4}
              />
            </div>

            {/* Harga */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceFrom">Harga Dari</Label>
                <Input
                  id="priceFrom"
                  name="priceFrom"
                  value={formData.priceFrom}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceTo">Harga Sampai</Label>
                <Input
                  id="priceTo"
                  name="priceTo"
                  value={formData.priceTo}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceUnit">Satuan Harga</Label>
                <select
                  id="priceUnit"
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="paket">Paket</option>
                  <option value="per jam">Per Jam</option>
                  <option value="per orang">Per Orang</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/vendor/products">Batal</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Produk"
            )}
          </Button>
        </div>
      </form>

      {/* Info Message */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-700">
            <strong>Catatan:</strong> Form lengkap akan diimplementasikan setelah type system stabil. 
            Versi ini hanya untuk testing dan menghindari TypeScript errors.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
