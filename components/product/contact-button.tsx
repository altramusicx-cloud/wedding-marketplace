// File: components/product/contact-button.tsx
"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatWhatsAppUrl } from "@/lib/utils/format-whatsapp"

interface ContactButtonProps {
    vendorWhatsApp: string
    productName: string
    userId?: string
    productId: string
    variant?: 'default' | 'large' | 'sticky'
    className?: string
}

export function ContactButton({
    vendorWhatsApp,
    productName,
    userId,
    productId,
    variant = 'default',
    className
}: ContactButtonProps) {
    const [isClicked, setIsClicked] = useState(false)

    const handleContact = () => {
        // TODO: Log contact attempt to database
        console.log('Contact attempt:', { userId, productId })

        // Generate WhatsApp URL
        const message = `Halo, saya tertarik dengan produk: ${productName}. Bisa info lebih detail?`
        const whatsappUrl = formatWhatsAppUrl(vendorWhatsApp, message, {
            includeRef: true,
            userId,
            productId
        })

        // Open WhatsApp
        window.open(whatsappUrl, '_blank')

        // Show clicked state
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 2000)
    }

    const variants = {
        default: "h-9 px-4 text-sm",
        large: "h-12 px-6 text-base font-semibold",
        sticky: "h-14 px-6 text-base font-semibold shadow-lg"
    }

    return (
        <Button
            onClick={handleContact}
            className={cn(
                "bg-whatsapp hover:bg-whatsapp-dark text-white transition-all",
                variants[variant],
                isClicked && "animate-pulse bg-green-600",
                className
            )}
        >
            <MessageCircle className={cn(
                "mr-2",
                variant === 'default' ? "h-4 w-4" : "h-5 w-5"
            )} />
            {isClicked ? "Membuka WhatsApp..." : "Hubungi via WhatsApp"}
        </Button>
    )
}

// Sticky version for mobile
export function StickyContactButton(props: ContactButtonProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg lg:hidden">
            <ContactButton {...props} variant="sticky" />
        </div>
    )
}