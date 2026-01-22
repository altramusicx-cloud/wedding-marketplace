// app\(auth)\layout.tsx
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush/10 to-sage/10 p-4">
            <div className="absolute top-6 left-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-charcoal"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke beranda
                </Link>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blush">
                            <span className="text-2xl font-bold text-charcoal">W</span>
                        </div>
                        <span className="text-2xl font-bold text-charcoal">
                            Wedding<span className="text-blush">Market</span>
                        </span>
                    </Link>
                    <p className="text-gray-600">
                        Marketplace wedding lokal pertama di Kalimantan
                    </p>
                </div>

                {children}
            </div>
        </div>
    )
}