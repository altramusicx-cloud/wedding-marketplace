// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { generateMetadata as generateSiteMetadata } from '@/lib/utils/generate-metadata'
import type { Metadata, Viewport } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
})

// Gunakan utility function untuk metadata default
export const metadata: Metadata = generateSiteMetadata()

// Tambah viewport export untuk themeColor
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7CAC9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        {/* Favicon - placeholder dulu */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifes untuk PWA (future) */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  )
}