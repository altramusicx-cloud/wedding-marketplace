// File: app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, MessageSquare, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats
    const [
        { count: pendingProducts },
        { count: totalVendors },
        { count: totalContacts },
        { count: totalProducts }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_vendor', true),
        supabase.from('contact_logs').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    ])

    const stats = [
        {
            title: 'Pending Products',
            value: pendingProducts || 0,
            icon: Package,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            title: 'Total Vendors',
            value: totalVendors || 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Total Contacts',
            value: totalContacts || 0,
            icon: MessageSquare,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Approved Products',
            value: totalProducts || 0,
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-charcoal">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage vendors, products, and platform analytics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="/admin/products"
                            className="p-4 border rounded-lg hover:border-blush hover:bg-blush-light/20 transition-colors cursor-pointer"
                        >
                            <h3 className="font-semibold text-gray-900">Review Products</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Approve or reject pending product submissions
                            </p>
                        </a>
                        <a
                            href="/admin/vendors"
                            className="p-4 border rounded-lg hover:border-blush hover:bg-blush-light/20 transition-colors cursor-pointer"
                        >
                            <h3 className="font-semibold text-gray-900">Manage Vendors</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                View and manage registered vendors
                            </p>
                        </a>
                        <a
                            href="/admin/contacts"
                            className="p-4 border rounded-lg hover:border-blush hover:bg-blush-light/20 transition-colors cursor-pointer"
                        >
                            <h3 className="font-semibold text-gray-900">Contact Logs</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Monitor user-vendor interactions
                            </p>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}