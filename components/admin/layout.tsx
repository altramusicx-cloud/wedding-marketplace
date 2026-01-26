// components/admin/layout.tsx
"use client"

import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Simple sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            <a href="/admin" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
            <a href="/admin/products" className="block p-2 hover:bg-gray-100 rounded">Products</a>
            <a href="/admin/vendors" className="block p-2 hover:bg-gray-100 rounded">Vendors</a>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
