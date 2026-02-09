// File: types/navigation.ts
import {
    Home,
    Heart,
    MessageSquare,
    Bell,
    Settings,
    Package,
    BarChart3,
    Calendar,
    DollarSign,
    User,
    ShoppingBag,
    Mail,
    FileText,
    Shield
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface NavItem {
    id: string
    label: string
    icon: LucideIcon
    href: string
    badge?: number | 'new'
    roles: ('user' | 'vendor' | 'admin')[]
    isActive?: (pathname: string) => boolean
}

// User navigation - EXACT sesuai roadmap V2
export const userNavItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        href: '/dashboard',
        roles: ['user', 'vendor', 'admin']
    },
    {
        id: 'favorites',
        label: 'Favorit',
        icon: Heart,
        href: '/dashboard/favorites',
        roles: ['user', 'vendor', 'admin']
    },
    {
        id: 'contacts',
        label: 'Kontak',
        icon: MessageSquare,
        href: '/dashboard/contacts',
        roles: ['user', 'vendor', 'admin']
    },
    {
        id: 'notifications',
        label: 'Notifikasi',
        icon: Bell,
        href: '/dashboard/notifications',
        roles: ['user', 'vendor', 'admin']
    },
    {
        id: 'settings',
        label: 'Pengaturan',
        icon: Settings,
        href: '/dashboard/settings',
        roles: ['user', 'vendor', 'admin']
    },
]

// Vendor navigation = user items + vendor items - EXACT sesuai roadmap V2
export const vendorNavItems: NavItem[] = [
    ...userNavItems,
    {
        id: 'vendor-dashboard',
        label: 'Dashboard',
        icon: Home,
        href: '/dashboard/vendor',
        roles: ['vendor', 'admin']
    },
    {
        id: 'products',
        label: 'Produk',
        icon: Package,
        href: '/dashboard/vendor/products',
        roles: ['vendor', 'admin']
    },
    {
        id: 'analytics',
        label: 'Analitik',
        icon: BarChart3,
        href: '/dashboard/vendor/analytics',
        roles: ['vendor', 'admin']
    },
    {
        id: 'messages',
        label: 'Pesan',
        icon: MessageSquare,
        href: '/dashboard/vendor/messages',
        roles: ['vendor', 'admin']
    },
    {
        id: 'bookings',
        label: 'Booking',
        icon: Calendar,
        href: '/dashboard/vendor/bookings',
        roles: ['vendor', 'admin']
    },
    {
        id: 'earnings',
        label: 'Pendapatan',
        icon: DollarSign,
        href: '/dashboard/vendor/earnings',
        roles: ['vendor', 'admin']
    },
    {
        id: 'vendor-settings',
        label: 'Pengaturan',
        icon: Settings,
        href: '/dashboard/vendor/settings',
        roles: ['vendor', 'admin']
    },
]

// Admin navigation (optional untuk masa depan)
export const adminNavItems: NavItem[] = [
    {
        id: 'admin-dashboard',
        label: 'Dashboard',
        icon: Home,
        href: '/admin',
        roles: ['admin']
    },
    {
        id: 'products-approval',
        label: 'Persetujuan Produk',
        icon: Package,
        href: '/admin/products',
        roles: ['admin']
    },
    {
        id: 'vendor-management',
        label: 'Kelola Vendor',
        icon: User,
        href: '/admin/vendors',
        roles: ['admin']
    },
    {
        id: 'contact-logs',
        label: 'Log Kontak',
        icon: FileText,
        href: '/admin/logs',
        roles: ['admin']
    },
    {
        id: 'admin-settings',
        label: 'Pengaturan Admin',
        icon: Settings,
        href: '/admin/settings',
        roles: ['admin']
    },
]

// Helper function untuk mendapatkan navigation items berdasarkan role
export function getNavItemsByRole(role: 'user' | 'vendor' | 'admin'): NavItem[] {
    switch (role) {
        case 'vendor':
            return vendorNavItems
        case 'admin':
            return adminNavItems
        default:
            return userNavItems
    }
}