// File: app/dashboard/vendor/products/page.tsx
"use client"

import { useState } from "react"
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
    ChevronRight
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data produk
const mockProducts = [
    {
        id: 1,
        name: "Paket Photographer Premium",
        category: "Photographer",
        status: "approved",
        price: "Rp 8.000.000",
        views: 245,
        contacts: 12,
        createdAt: "2024-01-15",
        featured: true
    },
    {
        id: 2,
        name: "Venue Gedung Serba Guna",
        category: "Venue",
        status: "pending",
        price: "Rp 15.000.000",
        views: 0,
        contacts: 0,
        createdAt: "2024-01-18",
        featured: false
    },
    {
        id: 3,
        name: "Dress Pengantin Modern",
        category: "Wedding Dress",
        status: "approved",
        price: "Rp 5.000.000",
        views: 189,
        contacts: 8,
        createdAt: "2024-01-10",
        featured: true
    },
    {
        id: 4,
        name: "Catering 500 Pax",
        category: "Catering",
        status: "approved",
        price: "Rp 12.000.000",
        views: 312,
        contacts: 21,
        createdAt: "2024-01-05",
        featured: false
    },
    {
        id: 5,
        name: "Dekorasi Rustic Theme",
        category: "Decoration",
        status: "rejected",
        price: "Rp 7.500.000",
        views: 89,
        contacts: 3,
        createdAt: "2024-01-12",
        featured: false
    },
    {
        id: 6,
        name: "Makeup Artist Profesional",
        category: "Makeup Artist",
        status: "approved",
        price: "Rp 3.500.000",
        views: 167,
        contacts: 9,
        createdAt: "2024-01-08",
        featured: true
    },
]

const STATUS_COLORS = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
}

export default function VendorProductsPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Filter produk
    const filteredProducts = mockProducts.filter(product => {
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

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            console.log("Delete product:", id)
            // TODO: Implement delete logic
        }
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
                                    <SelectItem value="draft">Draft</SelectItem>
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
                        <div className="text-2xl font-bold text-green-600">{mockProducts.filter(p => p.status === 'approved').length}</div>
                        <p className="text-sm text-gray-600">Disetujui</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{mockProducts.filter(p => p.status === 'pending').length}</div>
                        <p className="text-sm text-gray-600">Menunggu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">1,243</div>
                        <p className="text-sm text-gray-600">Total Dilihat</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">48</div>
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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Produk</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Kategori</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Harga</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stats</th>
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
                                                    Dibuat: {product.createdAt}
                                                    {product.featured && (
                                                        <span className="ml-2 inline-block bg-blush text-charcoal text-xs px-2 py-0.5 rounded">
                                                            Featured
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block text-xs px-3 py-1 rounded-full ${STATUS_COLORS[product.status as keyof typeof STATUS_COLORS]}`}>
                                                {product.status === 'approved' && 'Disetujui'}
                                                {product.status === 'pending' && 'Menunggu'}
                                                {product.status === 'rejected' && 'Ditolak'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-medium">
                                            {product.price}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Eye className="h-3 w-3" />
                                                    <span>{product.views} dilihat</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                    <span>{product.contacts} kontak</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" title="Lihat">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                        <DropdownMenuItem>Feature Product</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
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
                </CardContent>
            </Card>
        </div>
    )
}