// app\layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeddingMarket - Marketplace Wedding Kalimantan',
  description: 'Marketplace wedding lokal pertama di Kalimantan yang elegan dan mudah digunakan',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <footer className="border-t py-8 mt-16">
            <div className="container-custom text-center text-gray-600">
              <p>© 2024 WeddingMarket. Semua hak dilindungi.</p>
              <p className="mt-2 text-sm">Marketplace wedding lokal Kalimantan</p>
            </div>
          </footer>
          <BottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}