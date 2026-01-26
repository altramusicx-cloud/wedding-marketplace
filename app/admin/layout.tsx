// app/admin/layout.tsx - FIXED VERSION WITH WORKING LOGOUT
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, Users, Package, FileText, BarChart3, Settings,
  ChevronLeft, ChevronRight, Menu, X, Search, Bell, User, LogOut
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthState } from '@/hooks/use-auth-state'

// Navigation items
const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home, badge: null },
  { href: '/admin/vendors', label: 'Vendors', icon: Users, badge: '12' },
  { href: '/admin/products', label: 'Products', icon: Package, badge: '3' },
  { href: '/admin/logs', label: 'Contact Logs', icon: FileText, badge: null },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { href: '/admin/settings', label: 'Settings', icon: Settings, badge: null },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, isLoading } = useAuthState()

  const handleLogout = async () => {
    try {
      await signOut()
      // Redirect to login page after logout
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-md shadow-sm"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">WM</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-blue-600 font-semibold text-sm">WM</span>
              </div>
            )}

            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-md"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />

                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 h-14 bg-white border-b border-gray-200">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            {/* Left: Title */}
            <div className="lg:hidden">
              <h1 className="text-base font-semibold text-gray-900">Admin</h1>
            </div>

            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* Right: Search & User Menu */}
            <div className="flex items-center gap-3">
              {/* Search (Desktop only) */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 h-9 w-64 text-sm border-gray-300"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-md">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-md">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold truncate max-w-[120px]">Admin User</p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">Super Admin</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 cursor-pointer"
                    disabled={isLoading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


