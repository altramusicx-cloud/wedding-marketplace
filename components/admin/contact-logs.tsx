// components/admin/contact-logs.tsx
"use client"

import { useState } from "react"
import {
    Search,
    Filter,
    Download,
    Eye,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Package,
    Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/format-date"
import { formatWhatsAppUrl } from "@/lib/utils/format-whatsapp"


interface ContactLogsTableProps {
    logs: Array<{
        id: string
        user_name: string
        user_whatsapp: string
        vendors?: { full_name: string }
        products?: { name: string; thumbnail_url: string | null }
        status: string
        contacted_at: string
        contact_method: string
        product_id: string  // ✅ TAMBAH INI
    }>
    showFilters?: boolean
}

const STATUS_CONFIG = {
    contacted: {
        label: 'Contacted',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
    },
    replied: {
        label: 'Replied',
        color: 'bg-blue-100 text-blue-800',
        icon: MessageSquare
    },
    booked: {
        label: 'Booked',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
    }
}

export function ContactLogsTable({ logs, showFilters = true }: ContactLogsTableProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [vendorFilter, setVendorFilter] = useState("all")

    // Extract unique vendors for filter
    const uniqueVendors = Array.from(
        new Set(logs.map(log => log.vendors?.full_name || 'Unknown').filter(Boolean))
    )

    // Filter logs
    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.user_name?.toLowerCase().includes(search.toLowerCase()) ||
            log.vendors?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            log.products?.name?.toLowerCase().includes(search.toLowerCase()) ||
            log.user_whatsapp?.includes(search)

        const matchesStatus = statusFilter === "all" || log.status === statusFilter
        const matchesVendor = vendorFilter === "all" || log.vendors?.full_name === vendorFilter

        return matchesSearch && matchesStatus && matchesVendor
    })

    const handleExportCSV = () => {
        // Simple CSV export
        const headers = ['Date', 'User', 'WhatsApp', 'Vendor', 'Product', 'Status', 'Method']
        const csvData = filteredLogs.map(log => [
            new Date(log.contacted_at).toLocaleDateString('id-ID'),
            log.user_name,
            log.user_whatsapp,
            log.vendors?.full_name || 'Unknown',
            log.products?.name || 'Unknown',
            log.status,
            log.contact_method
        ])

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contact-logs-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No contact logs found</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            {showFilters && (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by user, vendor, product, or WhatsApp..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="replied">Replied</SelectItem>
                                <SelectItem value="booked">Booked</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={vendorFilter} onValueChange={setVendorFilter}>
                            <SelectTrigger className="w-[160px]">
                                <User className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Vendors</SelectItem>
                                {uniqueVendors.map(vendor => (
                                    <SelectItem key={vendor} value={vendor}>
                                        {vendor}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={handleExportCSV}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date & Time</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vendor</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredLogs.map((log) => {
                                const statusConfig = STATUS_CONFIG[log.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.contacted
                                const StatusIcon = statusConfig.icon

                                return (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="text-sm">
                                                <div className="font-medium">{formatDate(log.contacted_at)}</div>
                                                <div className="text-gray-500 text-xs">
                                                    {new Date(log.contacted_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <div className="font-medium">{log.user_name}</div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{log.user_whatsapp}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-medium">
                                                {log.vendors?.full_name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">{log.products?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={`${statusConfig.color} gap-1`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {statusConfig.label}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="View Details"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/vendor/${log.product_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Contact User"
                                                    asChild
                                                >
                                                    <a
                                                        href={formatWhatsAppUrl(log.user_whatsapp)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No contact logs match your filters</p>
                    </div>
                )}
            </div>

            {/* Pagination Info */}
            <div className="text-sm text-gray-500">
                Showing {filteredLogs.length} of {logs.length} contact logs
            </div>
        </div>
    )
}