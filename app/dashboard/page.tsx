'use client'

import { useAuthState } from '@/hooks/use-auth-state'
import { UserDashboardLayout } from '@/components/layout/user-dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/dashboard/mode-toggle"
import { ModeCard } from "@/components/dashboard/mode-card"
import {
  Heart,
  MessageSquare,
  Bell,
  Star,
  ArrowRight,
  TrendingUp,
  Package,
  MapPin,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Clock,
  BarChart3,
  User
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { profile } = useAuthState()

  // Stats Data - Design Tokens
  const quickStats = [
    {
      label: 'Produk Favorit',
      value: '12',
      icon: Heart,
      iconColor: 'text-[#d0011b]', // Shopee Red
      iconBg: 'bg-[#d0011b]/10',
      change: '+20%',
      trend: 'up' as const
    },
    {
      label: 'Kontak Terbaru',
      value: '5',
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      change: '+12.5%',
      trend: 'up' as const
    },
    {
      label: 'Notifikasi',
      value: '8',
      icon: Bell,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      change: '-8.2%',
      trend: 'down' as const
    },
    {
      label: 'Ringkasan Bulan Ini',
      value: '',
      icon: BarChart3,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      isSummary: true,
      summaryMetrics: [
        { label: 'Favorit', value: '12', color: 'text-[#d0011b]' },
        { label: 'Kontak', value: '5', color: 'text-blue-600' },
        { label: 'Dilihat', value: '24', color: 'text-emerald-600' }
      ]
    },
  ]

  const recommendedVendors = [
    {
      id: 1,
      name: 'Photography Wedding',
      category: 'Fotografi',
      rating: 4.8,
      reviews: 128,
      price: 'Rp 5-10 Jt',
      location: 'Samarinda',
      verified: true,
      responseTime: '< 1 jam'
    },
    {
      id: 2,
      name: 'Venue Gedung Serba Guna',
      category: 'Venue',
      rating: 4.5,
      reviews: 95,
      price: 'Rp 15-25 Jt',
      location: 'Balikpapan',
      verified: true,
      responseTime: '< 2 jam'
    },
    {
      id: 3,
      name: 'Catering 500 Pax',
      category: 'Katering',
      rating: 4.9,
      reviews: 203,
      price: 'Rp 8-12 Jt',
      location: 'Pontianak',
      verified: true,
      responseTime: '< 30 menit'
    },
    {
      id: 4,
      name: 'Dress Pengantin Modern',
      category: 'Gaun',
      rating: 4.7,
      reviews: 87,
      price: 'Rp 3-8 Jt',
      location: 'Samarinda',
      verified: false,
      responseTime: '< 3 jam'
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'Menghubungi Vendor',
      vendor: 'Photography Wedding',
      time: '2 jam lalu',
      type: 'contact' as const
    },
    {
      id: 2,
      action: 'Menambahkan ke Favorit',
      vendor: 'Venue Gedung Serba Guna',
      time: '1 hari lalu',
      type: 'favorite' as const
    },
    {
      id: 3,
      action: 'Promo Baru',
      vendor: 'Catering turun 10%',
      time: '2 hari lalu',
      type: 'promo' as const
    },
    {
      id: 4,
      action: 'Melihat Detail',
      vendor: 'Dress Pengantin Modern',
      time: '3 hari lalu',
      type: 'view' as const
    },
  ]

  return (
    <UserDashboardLayout
      serverProfile={profile!}
      serverIsVendor={!!profile?.is_vendor}
    >
      {/* Compact Mode Switcher */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Dashboard Saya
            </h1>
            <p className="text-sm text-neutral-600">
              Selamat datang, {profile?.full_name || 'User'}!
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            <User className="h-3 w-3 mr-1" />
            Mode User
          </Badge>
        </div>

        {/* Compact Switcher */}
        <div className="p-3 bg-white rounded-lg border border-neutral-200">
          <ModeCard currentMode="user" />
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Pilih "Toko Saya" untuk kelola produk dan penjualan
          </p>
        </div>
      </div>


      {/* Main Content - Design Tokens Spacing */}
      <div className="space-y-6">

        {/* Stats Grid - 4px base spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-5">
                {stat.isSummary ? (
                  // RINGKASAN CARD - 3 metrics
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                        <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                      </div>
                      <p className="text-sm font-medium text-neutral-600">
                        {stat.label}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {stat.summaryMetrics?.map((metric, idx) => (
                        <div key={idx} className="text-center">
                          <div className={cn(
                            "text-2xl font-bold mb-1",
                            metric.color
                          )}>
                            {metric.value}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // REGULAR STAT CARD
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-600 mb-2">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-neutral-900">
                          {stat.value}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          stat.trend === 'up'
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        )}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-neutral-500">vs bulan lalu</span>
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-xl", stat.iconBg)}>
                      <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid - 2/3 + 1/3 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Section - Vendor List (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recommended Vendors */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-neutral-900">
                      Vendor Direkomendasikan
                    </CardTitle>
                    <p className="text-sm text-neutral-600 mt-1">
                      Vendor terbaik berdasarkan rating dan ulasan
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#d0011b] hover:text-[#d0011b]/80 hover:bg-[#d0011b]/5"
                    asChild
                  >
                    <Link href="/categories">
                      Lihat Semua
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-neutral-100">
                  {recommendedVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="p-5 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Vendor Icon */}
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-neutral-600" />
                        </div>

                        {/* Vendor Info */}
                        <div className="flex-1 min-w-0">
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-neutral-900 truncate">
                                  {vendor.name}
                                </h3>
                                {vendor.verified && (
                                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs h-5">
                                  {vendor.category}
                                </Badge>
                                {vendor.verified && (
                                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs h-5">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-neutral-900 whitespace-nowrap">
                                {vendor.price}
                              </p>
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-4 text-sm">
                              {/* Rating */}
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="font-medium text-neutral-900">{vendor.rating}</span>
                                <span className="text-neutral-500">({vendor.reviews})</span>
                              </div>
                              {/* Location */}
                              <div className="flex items-center gap-1 text-neutral-600">
                                <MapPin className="h-4 w-4" />
                                <span>{vendor.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Response Time & Actions */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="font-medium">Respon {vendor.responseTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Heart className="h-3.5 w-3.5 mr-1.5" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 bg-[#d0011b] hover:bg-[#d0011b]/90 text-white"
                              >
                                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                Hubungi
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section (1/3) */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-neutral-100">
                <CardTitle className="text-lg font-semibold text-neutral-900">
                  Aktivitas Terbaru
                </CardTitle>
                <p className="text-sm text-neutral-600 mt-1">
                  Riwayat aktivitas Anda
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-neutral-100">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          activity.type === 'contact' ? "bg-blue-50" :
                            activity.type === 'favorite' ? "bg-[#d0011b]/10" :
                              activity.type === 'promo' ? "bg-emerald-50" :
                                "bg-neutral-50"
                        )}>
                          {activity.type === 'contact' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'favorite' && <Heart className="h-4 w-4 text-[#d0011b]" />}
                          {activity.type === 'promo' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                          {activity.type === 'view' && <Eye className="h-4 w-4 text-neutral-600" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-neutral-600 mt-0.5 truncate">
                            {activity.vendor}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock className="h-3 w-3 text-neutral-400" />
                            <p className="text-xs text-neutral-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-neutral-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[#d0011b] hover:text-[#d0011b]/80 hover:bg-[#d0011b]/5"
                  >
                    Lihat Semua Aktivitas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Empty Space untuk Future Features */}
            <div className="p-6 border border-dashed border-neutral-300 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-900 mb-1">
                Analytics Coming Soon
              </p>
              <p className="text-xs text-neutral-600">
                Fitur analitik lengkap akan hadir di update berikutnya
              </p>
            </div>

          </div>
        </div>
      </div>
    </UserDashboardLayout>
  )
}