// app/dashboard/vendor/analytics/page.tsx - Simplified version
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye, MessageSquare, DollarSign, Users } from "lucide-react"

export default function VendorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("monthly")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Analytics</h1>
          <p className="text-neutral-600">Pantau performa produk dan bisnis Anda</p>
        </div>
        <div className="flex gap-3">
          {/* Simplified select - hanya dropdown sederhana */}
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-[180px] p-2 border rounded-md"
          >
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
        </div>
      </div>

      {/* Key Metrics - simplified */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-neutral-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-neutral-500">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,678</div>
            <p className="text-xs text-neutral-500">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Analytics dashboard akan menampilkan data real-time setelah aplikasi production ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Fitur lengkap analytics akan diimplementasikan setelah type system stabil.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
