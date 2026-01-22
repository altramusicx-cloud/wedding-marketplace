// app/dashboard/vendor/products/[id]/edit/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { EditProductForm } from "@/components/vendor/edit-product-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { ProductWithImages } from "@/types"

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()

    const [product, setProduct] = useState<ProductWithImages | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAuthorized, setIsAuthorized] = useState(false)

    const productId = params.id as string

    useEffect(() => {
        fetchProduct()
    }, [productId])

    const fetchProduct = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }

            // Fetch product with images
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select(`
                    *,
                    product_images(*)
                `)
                .eq('id', productId)
                .single()

            if (productError) {
                console.error('Error fetching product:', productError)
                setError('Produk tidak ditemukan')
                return
            }

            // Check authorization - vendor can only edit their own products
            if (productData.vendor_id !== user.id) {
                setError('Anda tidak memiliki izin untuk mengedit produk ini')
                setIsAuthorized(false)
                return
            }

            setIsAuthorized(true)
            setProduct(productData as ProductWithImages)

        } catch (error) {
            console.error('Error:', error)
            setError('Terjadi kesalahan saat memuat produk')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuccess = () => {
        // Redirect to product list after successful update
        router.push("/dashboard/vendor/products")
        router.refresh()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ivory">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blush" />
                    <p className="mt-2 text-gray-600">Memuat produk...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/dashboard/vendor/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Produk
                    </Link>
                </Button>

                <Card className="border-red-200">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-red-50 p-3">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-charcoal mb-2">Tidak dapat mengedit produk</h2>
                        <p className="text-gray-600 mb-4">{error || 'Produk tidak ditemukan'}</p>
                        <Button asChild className="bg-blush hover:bg-blush/90">
                            <Link href="/dashboard/vendor/products">
                                Kembali ke Daftar Produk
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/dashboard/vendor/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Produk
                    </Link>
                </Button>

                <Card className="border-yellow-200">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-yellow-50 p-3">
                                <AlertTriangle className="h-10 w-10 text-yellow-500" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-charcoal mb-2">Akses Ditolak</h2>
                        <p className="text-gray-600 mb-4">
                            Anda hanya dapat mengedit produk Anda sendiri
                        </p>
                        <Button asChild className="bg-blush hover:bg-blush/90">
                            <Link href="/dashboard/vendor/products">
                                Kembali ke Daftar Produk
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-ivory">
            <EditProductForm
                product={product}
                onSuccess={handleSuccess}
            />
        </div>
    )
}