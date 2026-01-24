// components\admin\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats
    const [
        { count: pendingProducts },
        { count: totalVendors },
        { count: totalContacts },
        { count: totalProducts },
        { data: recentContacts }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_vendor', true),
        supabase.from('contact_logs').select('*', { count: 'exact', head: true })
            .gte('contacted_at', new Date().toISOString().split('T')[0]),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase
            .from('contact_logs')
            .select('*, products(name), profiles!contact_logs_vendor_id_fkey(full_name)')
            .order('contacted_at', { ascending: false })
            .limit(5)
    ])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <h1 className="text-3xl font-bold text-charcoal tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                    Welcome back! Here's what's happening with your platform today.
                </p>
            </div>

            {/* Platform Metrics */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Platform Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Pending Products Card */}
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Products</p>
                                    <p className="text-3xl font-bold text-charcoal mt-2">{pendingProducts || 0}</p>
                                    <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
                                </div>
                                <div className="p-3 rounded-lg bg-amber-50">
                                    <Package className="h-6 w-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Vendors Card */}
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                                    <p className="text-3xl font-bold text-charcoal mt-2">{totalVendors || 0}</p>
                                    <p className="text-xs text-gray-500 mt-2">Registered vendors</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-50">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Contacts Card */}
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today's Contacts</p>
                                    <p className="text-3xl font-bold text-charcoal mt-2">{totalContacts || 0}</p>
                                    <p className="text-xs text-gray-500 mt-2">User inquiries</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-50">
                                    <MessageSquare className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Live Products Card */}
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Live Products</p>
                                    <p className="text-3xl font-bold text-charcoal mt-2">{totalProducts || 0}</p>
                                    <p className="text-xs text-gray-500 mt-2">Approved & active</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-50">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Need Attention & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Need Attention */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Need Your Attention</h2>
                    <div className="space-y-4">
                        <Card className="border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-amber-100">
                                            <AlertCircle className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Pending Products</h3>
                                            <p className="text-sm text-gray-600">Require review and approval</p>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/admin/products">
                                            Review Now
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-blue-100">
                                            <Users className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Vendor Applications</h3>
                                            <p className="text-sm text-gray-600">New vendors awaiting approval</p>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/admin/vendors">
                                            Manage Vendors
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border border-gray-200 hover:border-blush hover:bg-blush-light/5 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <Link href="/admin/products" className="flex flex-col items-center text-center">
                                    <div className="p-3 rounded-lg bg-blush/10 mb-3">
                                        <Filter className="h-6 w-6 text-blush" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Review Products</h3>
                                    <p className="text-sm text-gray-600 mt-1">Approve or reject submissions</p>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 hover:border-blush hover:bg-blush-light/5 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <Link href="/admin/contacts" className="flex flex-col items-center text-center">
                                    <div className="p-3 rounded-lg bg-blush/10 mb-3">
                                        <MessageSquare className="h-6 w-6 text-blush" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Contact Logs</h3>
                                    <p className="text-sm text-gray-600 mt-1">Monitor user interactions</p>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 hover:border-blush hover:bg-blush-light/5 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <Link href="/admin/reports" className="flex flex-col items-center text-center">
                                    <div className="p-3 rounded-lg bg-blush/10 mb-3">
                                        <TrendingUp className="h-6 w-6 text-blush" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                                    <p className="text-sm text-gray-600 mt-1">View platform insights</p>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 hover:border-blush hover:bg-blush-light/5 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <Link href="/admin/settings" className="flex flex-col items-center text-center">
                                    <div className="p-3 rounded-lg bg-blush/10 mb-3">
                                        <CheckCircle className="h-6 w-6 text-blush" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Settings</h3>
                                    <p className="text-sm text-gray-600 mt-1">Configure platform</p>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>

            {/* Recent Activity */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/contacts">View All</Link>
                    </Button>
                </div>

                <Card className="border border-gray-200">
                    <CardContent className="p-6">
                        {recentContacts && recentContacts.length > 0 ? (
                            <div className="space-y-4">
                                {recentContacts.slice(0, 5).map((log) => (
                                    <div key={log.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-gray-100">
                                                <Clock className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {log.user_name} contacted {log.profiles?.full_name || 'vendor'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {log.products?.name || 'Product'} • {new Date(log.contacted_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                                            {log.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No recent activity</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}