// components/product/sticky-bottom-bar.tsx
"use client"

import { MessageCircle } from "lucide-react"
import { FavoritesButton } from "./favorites-button"
import { ContactButton } from "./contact-button"

interface StickyBottomBarProps {
    vendorId: string
    vendorWhatsApp: string
    productId: string
    productName: string
    vendorName: string
}

export function StickyBottomBar({
    vendorId,
    vendorWhatsApp,
    productId,
    productName,
    vendorName
}: StickyBottomBarProps) {
    return (
        <div className="fixed bottom-15 left-0 right-0 bg-white border-t border-[#E5E5E5] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[50] p-1 lg:hidden">
            <div className="flex items-center gap-2">


                {/* Contact Button - WhatsApp Shopee Style */}
                <ContactButton
                    vendorId={vendorId}
                    vendorWhatsApp={vendorWhatsApp}
                    productId={productId}
                    productName={productName}
                    vendorName={vendorName}
                    variant="large"
                    className="flex-1 h-11 bg-[#EE4D2D] hover:bg-[#D73211] text-white font-medium text-[14px] rounded-[3px]"
                />
            </div>

            {/* Safe area untuk iPhone notch */}
            <div className="h-4 lg:hidden" />
        </div>
    )
}