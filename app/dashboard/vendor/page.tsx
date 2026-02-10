'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/dashboard/mode-toggle"
import { ModeCard } from "@/components/dashboard/mode-card"
import { PlusCircle, Package, Eye, MessageSquare, TrendingUp, Users, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function VendorDashboardPage() {
    // Mock data untuk dashboard
    const stats = [
        { label: "Total Produk", value: "12", icon: Package, change: "+2", color: "bg-primary" },
        { label: "Dilihat", value: "1,243", icon: Eye, change: "+12%", color: "bg-sage" },
        { label: "Kontak", value: "48", icon: MessageSquare, change: "+5", color: "bg-blue-100" },
        { label: "Konversi", value: "23%", icon: TrendingUp, change: "+3%", color: "bg-purple-100" },
    ]

    const recentProducts = [
        { id: 1, name: "Paket Photographer Premium", status: "active", views: 245, contacts: 12 },
        { id: 2, name: "Venue Gedung Serba Guna", status: "pending", views: 0, contacts: 0 },
        { id: 3, name: "Dress Pengantin Modern", status: "active", views: 189, contacts: 8 },
        { id: 4, name: "Catering 500 Pax", status: "active", views: 312, contacts: 21 },
    ]

    return (
        <div className="space-y-6">
            {/* Modern Dashboard Switching Section */}

            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">


                    <Badge variant="outline" className="text-xs">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Mode Vendor
                    </Badge>
                </div>

                {/* Compact Switcher */}
                <div>
                    <ModeCard currentMode="vendor" />

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-neutral-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    <p className="text-xs text-green-600 mt-1">{stat.change} bulan ini</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-charcoal" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Produk Terbaru */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Produk Terbaru</CardTitle>
                        <CardDescription>Produk Anda yang paling aktif</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-3 w-3 rounded-full ${product.status === 'active' ? 'bg-green-500' :
                                            product.status === 'pending' ? 'bg-yellow-500' : 'bg-neutral-500'
                                            }`} />
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <div className="flex gap-4 text-sm text-neutral-500">
                                                <span>{product.views} dilihat</span>
                                                <span>{product.contacts} kontak</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="ghost" size="sm">Lihat</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/dashboard/vendor/products">
                                    Lihat Semua Produk
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions & Analytics */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/vendor/products/new">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Produk Baru
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Package className="mr-2 h-4 w-4" />
                                Kelola Produk
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Lihat Pesan
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Edit Profil Vendor
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics Mingguan</CardTitle>
                            <CardDescription>Trend performa 7 hari terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm">Kontak</span>
                                    <span className="font-medium">+24%</span>
                                </div>
                                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-sage w-3/4"></div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm">Dilihat</span>
                                    <span className="font-medium">+18%</span>
                                </div>
                                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-2/3"></div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm">Konversi</span>
                                    <span className="font-medium">+8%</span>
                                </div>
                                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-1/2"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}