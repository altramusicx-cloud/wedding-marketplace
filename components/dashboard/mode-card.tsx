'use client'

import { User, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ModeCardProps {
    currentMode: 'user' | 'vendor'
    className?: string
}

export function ModeCard({ currentMode, className }: ModeCardProps) {
    const router = useRouter()

    const isUserMode = currentMode === 'user'
    const isVendorMode = currentMode === 'vendor'

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* User Badge */}
            <button
                onClick={() => router.push('/dashboard')}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    "border hover:shadow-sm",
                    isUserMode
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-primary hover:bg-primary/5"
                )}
            >
                <User className="h-3 w-3" />
                <span>Halaman Saya</span>
                {isUserMode && <span className="ml-0.5">✓</span>}
            </button>

            {/* Divider */}
            <span className="text-xs text-neutral-400">atau</span>

            {/* Vendor Badge */}
            <button
                onClick={() => router.push('/dashboard/vendor')}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    "border hover:shadow-sm",
                    isVendorMode
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50"
                )}
            >
                <ShoppingBag className="h-3 w-3" />
                <span>Vendor</span>
                {isVendorMode && <span className="ml-0.5">✓</span>}
            </button>
        </div>
    )
}