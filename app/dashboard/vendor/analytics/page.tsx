// File: app/dashboard/vendor/analytics/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Eye, MessageSquare, DollarSign, Users } from "lucide-react"

// Type Definitions
type DailyData = {
    day: string;
    views: number;
    contacts: number;
    conversion: number;
}

type MonthlyData = {
    month: string;
    revenue: number;
    products: number;
    growth: number;
}

// Mock data functions
const generateDailyData = (): DailyData[] => {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
    return days.map(day => ({
        day,
        views: Math.floor(Math.random() * 100) + 50,
        contacts: Math.floor(Math.random() * 20) + 5,
        conversion: Math.floor(Math.random() * 30) + 10
    }))
}

const generateMonthlyData = (): MonthlyData[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
    return months.map(month => ({
        month,
        revenue: Math.floor(Math.random() * 5000000) + 2000000,
        products: Math.floor(Math.random() * 10) + 5,
        growth: (Math.random() * 30) - 10 // -10% to +20%
    }))
}

const topProducts = [
    { name: "Paket Photographer Premium", revenue: 32000000, growth: 15 },
    { name: "Venue Gedung Serba Guna", revenue: 45000000, growth: 8 },
    { name: "Dress Pengantin Modern", revenue: 25000000, growth: 22 },
    { name: "Catering 500 Pax", revenue: 38000000, growth: -3 },
    { name: "Makeup Artist Profesional", revenue: 18000000, growth: 12 },
]

export default function VendorAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")

    const dailyData = generateDailyData()
    const monthlyData = generateMonthlyData()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getTotal = (data: DailyData[] | MonthlyData[], key: keyof DailyData | keyof MonthlyData) => {
        return data.reduce((sum, item) => {
            const value = item[key as keyof typeof item]
            if (typeof value === 'number') {
                return sum + value
            }
            return sum
        }, 0)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal">Analytics</h1>
                    <p className="text-gray-600">Pantau performa produk dan bisnis Anda</p>
                </div>
                <div className="flex gap-3">
                    <Select value={timeRange} onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") => setTimeRange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Harian</SelectItem>
                            <SelectItem value="weekly">Mingguan</SelectItem>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Dilihat</p>
                                <p className="text-2xl font-bold mt-1">1,243</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-xs text-green-600">+12% dari bulan lalu</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100">
                                <Eye className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Kontak WhatsApp</p>
                                <p className="text-2xl font-bold mt-1">48</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-xs text-green-600">+5 dari bulan lalu</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                                <MessageSquare className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Konversi Rate</p>
                                <p className="text-2xl font-bold mt-1">23%</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                    <span className="text-xs text-red-600">-2% dari bulan lalu</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Estimasi Revenue</p>
                                <p className="text-2xl font-bold mt-1">{formatCurrency(156000000)}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-xs text-green-600">+18% dari bulan lalu</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-amber-100">
                                <DollarSign className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Traffic & Views</CardTitle>
                        <CardDescription>Perkembangan dilihat per {timeRange}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-64 flex items-end gap-1">
                                {timeRange === "daily" ? (
                                    dailyData.map((item, index) => {
                                        const maxViews = Math.max(...dailyData.map(d => d.views))
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-3/4 bg-blush rounded-t-lg transition-all hover:opacity-80"
                                                    style={{ height: `${(item.views / maxViews) * 80}%` }}
                                                    title={`${item.views} views`}
                                                />
                                                <span className="text-xs mt-2">{item.day}</span>
                                            </div>
                                        )
                                    })
                                ) : (
                                    monthlyData.map((item, index) => {
                                        const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-3/4 bg-blush rounded-t-lg transition-all hover:opacity-80"
                                                    style={{ height: `${(item.revenue / maxRevenue) * 80}%` }}
                                                    title={`${formatCurrency(item.revenue)} revenue`}
                                                />
                                                <span className="text-xs mt-2">{item.month}</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                {timeRange === "daily" ? (
                                    <>
                                        <span>Min: {Math.min(...dailyData.map(d => d.views))} views</span>
                                        <span>Max: {Math.max(...dailyData.map(d => d.views))} views</span>
                                        <span>Total: {getTotal(dailyData, 'views')} views</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Min: {formatCurrency(Math.min(...monthlyData.map(d => d.revenue)))}</span>
                                        <span>Max: {formatCurrency(Math.max(...monthlyData.map(d => d.revenue)))}</span>
                                        <span>Total: {formatCurrency(getTotal(monthlyData, 'revenue'))}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contacts Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>WhatsApp Contacts</CardTitle>
                        <CardDescription>Jumlah kontak per {timeRange}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-64 flex items-end gap-1">
                                {timeRange === "daily" ? (
                                    dailyData.map((item, index) => {
                                        const maxContacts = Math.max(...dailyData.map(d => d.contacts))
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-3/4 bg-sage rounded-t-lg transition-all hover:opacity-80"
                                                    style={{ height: `${(item.contacts / maxContacts) * 80}%` }}
                                                    title={`${item.contacts} contacts`}
                                                />
                                                <span className="text-xs mt-2">{item.day}</span>
                                            </div>
                                        )
                                    })
                                ) : (
                                    // For monthly, use products data instead
                                    monthlyData.map((item, index) => {
                                        const maxProducts = Math.max(...monthlyData.map(d => d.products))
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-3/4 bg-sage rounded-t-lg transition-all hover:opacity-80"
                                                    style={{ height: `${(item.products / maxProducts) * 80}%` }}
                                                    title={`${item.products} produk aktif`}
                                                />
                                                <span className="text-xs mt-2">{item.month}</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                {timeRange === "daily" ? (
                                    <>
                                        <span>Min: {Math.min(...dailyData.map(d => d.contacts))} contacts</span>
                                        <span>Max: {Math.max(...dailyData.map(d => d.contacts))} contacts</span>
                                        <span>Total: {getTotal(dailyData, 'contacts')} contacts</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Min: {Math.min(...monthlyData.map(d => d.products))} produk</span>
                                        <span>Max: {Math.max(...monthlyData.map(d => d.products))} produk</span>
                                        <span>Total: {getTotal(monthlyData, 'products')} produk</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products & Conversion Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Produk Terlaris</CardTitle>
                        <CardDescription>Berdasarkan estimasi revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">{formatCurrency(product.revenue)}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.growth >= 0 ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        <span className="font-medium">{Math.abs(product.growth)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Conversion Rate Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analisis Konversi</CardTitle>
                        <CardDescription>View to Contact conversion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Conversion Rate */}
                            <div className="text-center">
                                <div className="inline-block relative">
                                    <svg className="w-32 h-32">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="60"
                                            className="stroke-gray-200 stroke-2 fill-none"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="60"
                                            className="stroke-sage stroke-2 fill-none"
                                            strokeDasharray="377"
                                            strokeDashoffset={377 * (1 - 0.23)}
                                            strokeLinecap="round"
                                            transform="rotate(-90 64 64)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold">23%</span>
                                        <span className="text-sm text-gray-600">Conversion Rate</span>
                                    </div>
                                </div>
                            </div>

                            {/* Funnel Stats */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Product Views</span>
                                    <span className="font-medium">1,243</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blush w-full"></div>
                                </div>

                                <div className="flex justify-between">
                                    <span>Clicked Contact</span>
                                    <span className="font-medium">186 (15%)</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blush/70 w-1/4"></div>
                                </div>

                                <div className="flex justify-between">
                                    <span>WhatsApp Messages</span>
                                    <span className="font-medium">48 (26%)</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-sage w-1/8"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insights & Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle>Insights & Rekomendasi</CardTitle>
                    <CardDescription>Saran untuk meningkatkan performa</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg bg-blue-50">
                            <h4 className="font-medium mb-2">📸 Tambah Foto Produk</h4>
                            <p className="text-sm text-gray-600">
                                Produk dengan 5+ foto mendapatkan 3x lebih banyak views.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg bg-green-50">
                            <h4 className="font-medium mb-2">💬 Respons Cepat</h4>
                            <p className="text-sm text-gray-600">
                                Balas chat dalam 1 jam meningkatkan konversi 40%.
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg bg-purple-50">
                            <h4 className="font-medium mb-2">⭐ Update Deskripsi</h4>
                            <p className="text-sm text-gray-600">
                                Deskripsi lengkap meningkatkan kepercayaan customer.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}