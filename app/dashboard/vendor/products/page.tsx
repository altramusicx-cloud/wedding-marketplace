// app/dashboard/vendor/products/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Search,
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import type { ProductWithImages } from "@/types"

const STATUS_COLORS = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
}

const STATUS_LABELS = {
    approved: "Disetujui",
    pending: "Menunggu",
    rejected: "Ditolak",
    draft: "Draft"
}

export default function VendorProductsPage() {
    const router = useRouter()
    const supabase = createClient()

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState<ProductWithImages[]>([])
    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        totalViews: 0,
        totalContacts: 0
    })

    const itemsPerPage = 10

    // Fetch vendor products
    useEffect(() => {
        fetchVendorProducts()
    }, [])

    const fetchVendorProducts = async () => {
        setIsLoading(true)
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }

            // Fetch vendor's products
            const { data: productsData, error } = await supabase
                .from('products')
                .select(`
                    *,
                    product_images(*)
                `)
                .eq('vendor_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching products:', error)
                return
            }

            setProducts(productsData as ProductWithImages[])

            // Calculate stats
            const approvedCount = productsData.filter(p => p.status === 'approved').length
            const pendingCount = productsData.filter(p => p.status === 'pending').length

            // TODO: Fetch actual views and contacts from analytics
            // For now using mock numbers
            setStats({
                approved: approvedCount,
                pending: pendingCount,
                totalViews: 1243, // Mock - should come from analytics
                totalContacts: 48 // Mock - should come from contact_logs
            })

        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Filter produk
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || product.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    const handleDelete = async (productId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            return
        }

        try {
            // Delete product images first
            const { error: imagesError } = await supabase
                .from('product_images')
                .delete()
                .eq('product_id', productId)

            if (imagesError) {
                console.error('Error deleting images:', imagesError)
                alert('Gagal menghapus gambar produk')
                return
            }

            // Delete product
            const { error: productError } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)

            if (productError) {
                console.error('Error deleting product:', productError)
                alert('Gagal menghapus produk')
                return
            }

            // Refresh products list
            fetchVendorProducts()
            alert('Produk berhasil dihapus')

        } catch (error) {
            console.error('Error:', error)
            alert('Terjadi kesalahan saat menghapus produk')
        }
    }

    const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_featured: !currentFeatured })
                .eq('id', productId)

            if (error) {
                console.error('Error toggling featured:', error)
                alert('Gagal mengubah status featured')
                return
            }

            // Refresh products list
            fetchVendorProducts()
            alert(`Produk ${!currentFeatured ? 'ditandai' : 'dihapus dari'} featured`)

        } catch (error) {
            console.error('Error:', error)
            alert('Terjadi kesalahan')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blush" />
                    <p className="mt-2 text-gray-600">Memuat produk...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal">Kelola Produk</h1>
                    <p className="text-gray-600">Lihat dan kelola semua produk Anda</p>
                </div>
                <Button asChild className="bg-blush hover:bg-blush/90 text-charcoal">
                    <Link href="/dashboard/vendor/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Produk
                    </Link>
                </Button>
            </div>

            {/* Filter & Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari produk atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        <p className="text-sm text-gray-600">Disetujui</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-sm text-gray-600">Menunggu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                        <p className="text-sm text-gray-600">Total Dilihat</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.totalContacts}</div>
                        <p className="text-sm text-gray-600">Total Kontak</p>
                    </CardContent>
                </Card>
            </div>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Produk</CardTitle>
                    <CardDescription>
                        {filteredProducts.length} produk ditemukan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Tidak ada produk ditemukan</p>
                            <Button asChild className="mt-4 bg-blush hover:bg-blush/90">
                                <Link href="/dashboard/vendor/products/new">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Produk Pertama
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Produk</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Kategori</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Harga</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dibuat</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((product) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(product.created_at)}
                                                            {product.is_featured && (
                                                                <span className="ml-2 inline-block bg-blush text-charcoal text-xs px-2 py-0.5 rounded">
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded capitalize">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-block text-xs px-3 py-1 rounded-full ${STATUS_COLORS[product.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.draft}`}>
                                                        {STATUS_LABELS[product.status as keyof typeof STATUS_LABELS] || product.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-medium">
                                                    {product.price_from ? (
                                                        <>
                                                            {formatCurrency(product.price_from)}
                                                            {product.price_to && ` - ${formatCurrency(product.price_to)}`}
                                                            {product.price_unit && ` / ${product.price_unit}`}
                                                        </>
                                                    ) : (
                                                        'Contact for price'
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {formatDate(product.created_at)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Lihat"
                                                            asChild
                                                        >
                                                            <Link href={`/vendor/${product.id}`} target="_blank">
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Edit"
                                                            asChild
                                                        >
                                                            <Link href={`/dashboard/vendor/products/${product.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => handleToggleFeatured(product.id, product.is_featured || false)}
                                                                >
                                                                    {product.is_featured ? 'Hapus dari Featured' : 'Jadikan Featured'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => handleDelete(product.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-gray-600">
                                        Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} dari {filteredProducts.length} produk
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="icon"
                                                className={currentPage === page ? "bg-blush hover:bg-blush/90" : ""}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}