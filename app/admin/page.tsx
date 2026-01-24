// app\admin\page.tsx
import { Package, Users, MessageSquare, TrendingUp, ArrowUpRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch all stats in parallel
    const [
        pendingProductsResult,
        totalVendorsResult,
        todayContactsResult,
        approvedProductsResult,
        recentContactsResult
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_vendor', true),
        supabase.from('contact_logs').select('*', { count: 'exact', head: true })
            .gte('contacted_at', new Date().toISOString().split('T')[0]),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase
            .from('contact_logs')
            .select('*, profiles!contact_logs_vendor_id_fkey(full_name)')
            .order('contacted_at', { ascending: false })
            .limit(5)
    ])

    const stats = [
        {
            label: 'Pending Products',
            value: pendingProductsResult.count || 0,
            icon: Package,
            color: 'bg-amber-500',
            href: '/admin/products'
        },
        {
            label: 'Total Vendors',
            value: totalVendorsResult.count || 0,
            icon: Users,
            color: 'bg-blue-500',
            href: '/admin/vendors'
        },
        {
            label: "Today's Contacts",
            value: todayContactsResult.count || 0,
            icon: MessageSquare,
            color: 'bg-green-500',
            href: '/admin/logs'
        },
        {
            label: 'Live Products',
            value: approvedProductsResult.count || 0,
            icon: TrendingUp,
            color: 'bg-purple-500',
            href: '/admin/products'
        }
    ]

    const quickActions = [
        { label: 'Review Products', href: '/admin/products', icon: Package },
        { label: 'Manage Vendors', href: '/admin/vendors', icon: Users },
        { label: 'View Contacts', href: '/admin/logs', icon: MessageSquare },
        { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Platform performance & quick actions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-2 rounded-lg`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            View details
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-gray-100 mb-2">
                                <action.icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-700 text-center font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <Link
                        href="/admin/logs"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View all →
                    </Link>
                </div>

                {recentContactsResult.data && recentContactsResult.data.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {recentContactsResult.data.map((log) => (
                            <div
                                key={log.id}
                                className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                        <Users className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{log.user_name}</p>
                                        <div className="flex items-center mt-0.5">
                                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                            <p className="text-xs text-gray-500">
                                                {new Date(log.contacted_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {log.profiles?.full_name || "Vendor"}
                                    </p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-8 text-center">
                        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No recent activity</p>
                        <p className="text-sm text-gray-400 mt-1">User contacts will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
}