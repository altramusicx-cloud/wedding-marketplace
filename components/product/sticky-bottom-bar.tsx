// components/product/sticky-bottom-bar.tsx - FIXED
'use client'

import { MessageCircle } from 'lucide-react'
import { formatWhatsAppUrl } from '@/lib/utils/format-whatsapp'

interface StickyBottomBarProps {
    vendorWhatsApp: string
    productName: string
    vendorName: string
    productId: string
    vendorId: string
}

export function StickyBottomBar({
    vendorWhatsApp,
    productName,
    vendorName,
    productId,
    vendorId
}: StickyBottomBarProps) {
    const whatsappUrl = formatWhatsAppUrl(vendorWhatsApp,
        `Halo ${vendorName}, saya tertarik dengan produk ${productName} yang ada di Wedding Marketplace. Bisa info detail lebih lanjut?`
    )

    return (
        <div className="lg:hidden">
            {/* ✅ SPACER - Tinggi = bottom nav (h-16) + gap (1rem) + tombol */}
            <div className="h-[88px]" aria-hidden="true" />

            {/* ✅ FIXED BOTTOM BAR - Posisi tepat di atas bottom nav */}
            <div className="fixed bottom-16 left-0 right-0 z-[60] px-4 pb-2 bg-gradient-to-t from-white via-white to-transparent pt-4">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-3.5 px-4 font-semibold transition-colors shadow-lg active:scale-[0.98]"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span>Hubungi via WhatsApp</span>
                </a>
            </div>
        </div>
    )
}