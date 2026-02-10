'use client'

import { User, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ModeToggleProps {
    currentMode: 'user' | 'vendor'
    className?: string
}

export function ModeToggle({ currentMode, className }: ModeToggleProps) {
    const router = useRouter()

    const isUserMode = currentMode === 'user'
    const isVendorMode = currentMode === 'vendor'

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex items-center justify-center gap-2">
                {/* User Badge */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        "border",
                        isUserMode
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-neutral-700 border-neutral-300"
                    )}
                >
                    <User className="h-3 w-3" />
                    <span>Halaman Saya</span>
                </button>

                {/* Divider */}
                <span className="text-xs text-neutral-400">atau</span>

                {/* Vendor Badge */}
                <button
                    onClick={() => router.push('/dashboard/vendor')}
                    className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        "border",
                        isVendorMode
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-white text-neutral-700 border-neutral-300"
                    )}
                >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Vendor</span>
                </button>
            </div>

            <p className="text-xs text-neutral-500 text-center">
                {isUserMode
                    ? "Klik 'Toko Saya' untuk kelola produk"
                    : "Klik 'Halaman Saya' untuk lihat produk"}
            </p>
        </div>
    )
}