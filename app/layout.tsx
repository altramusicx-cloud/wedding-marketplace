import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from '@/components/providers/auth-provider'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { Toaster } from '@/components/ui/toaster'
import { BottomNav } from '@/components/layout/bottom-nav' // ✅ ADD THIS IMPORT!

// Shopee style: Inter font saja (sans-serif semua)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Wedding Marketplace",
  description: "Marketplace vendor wedding lokal pertama di Kalimantan",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-white text-neutral-900 antialiased font-sans">
        <ErrorBoundary>
          <AuthProvider>
            {/* Konten utama */}
            <main className="min-h-screen">
              {children}
            </main>

            {/* Bottom Navigation - hanya muncul di mobile (< 768px) */}
            <BottomNav /> {/* ✅ ADD THIS LINE! */}

            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}