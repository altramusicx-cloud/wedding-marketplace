// File: components/product/contact-button.tsx (UPDATED VERSION)
"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatWhatsAppUrl } from "@/lib/utils/format-whatsapp"
import { logContact } from "@/lib/actions/contact"
import { useAuthState } from "@/hooks/use-auth-state"
import { useToast } from "@/components/ui/use-toast"

interface ContactButtonProps {
    vendorId: string
    vendorWhatsApp: string
    productId: string
    productName: string
    vendorName: string // ← JANGAN OPTIONAL, HARUS REQUIRED
    variant?: 'default' | 'large' | 'sticky'
    className?: string
}

export function ContactButton({
    vendorId,
    vendorWhatsApp,
    productId,
    productName,
    vendorName,
    variant = 'default',
    className
}: ContactButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { user, profile } = useAuthState()
    const { toast } = useToast()

    const handleContact = async () => {
        setIsLoading(true)

        try {
            // Cek apakah user sudah login
            if (!user || !profile) {
                // Simpan data untuk redirect setelah login
                sessionStorage.setItem('redirect_after_login', window.location.pathname)
                sessionStorage.setItem('contact_product_id', productId)
                sessionStorage.setItem('contact_vendor_id', vendorId)

                toast({
                    title: "Login diperlukan",
                    description: "Silakan login terlebih dahulu untuk menghubungi vendor",
                    variant: "default"
                })

                // Redirect ke login page
                window.location.href = '/login'
                return
            }

            // Log contact ke database
            const result = await logContact({
                vendorId,
                productId,
                productName,
                vendorName: vendorName || `Vendor ${vendorId.substring(0, 8)}`,
                userEmail: user.email || '',
                userName: profile.full_name || 'User',
                userWhatsApp: profile.whatsapp_number || ''
            })

            if (!result.success) {
                toast({
                    title: "Error",
                    description: "Gagal mencatat kontak. Silakan coba lagi.",
                    variant: "destructive"
                })
                console.error('Contact logging failed:', result.error)
            }

            // Generate WhatsApp URL dengan pesan yang lebih baik
            const message = `Halo ${vendorName}, saya ${profile.full_name} tertarik dengan produk "${productName}" yang ada di Wedding Marketplace Kalimantan. Bisa info lebih detail mengenai harga dan ketersediaannya?`

            const whatsappUrl = formatWhatsAppUrl(vendorWhatsApp, message, {
                includeRef: true,
                userId: user.id,
                productId
            })

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank')

            // Show success toast
            if (result.success) {
                toast({
                    title: "Berhasil!",
                    description: "WhatsApp dibuka dan kontak Anda telah dicatat.",
                    variant: "default"
                })
            }

        } catch (error) {
            console.error('Error in contact flow:', error)
            toast({
                title: "Error",
                description: "Terjadi kesalahan. Silakan coba lagi.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const variants = {
        default: "h-9 px-4 text-sm",
        large: "h-12 px-6 text-base font-semibold",
        sticky: "h-14 px-6 text-base font-semibold shadow-lg"
    }

    // Jika auth masih loading, show disabled button
    if (isLoading) {
        return (
            <Button
                disabled
                className={cn(
                    "bg-gray-300 text-gray-500",
                    variants[variant],
                    className
                )}
            >
                <MessageCircle className={cn(
                    "mr-2",
                    variant === 'default' ? "h-4 w-4" : "h-5 w-5"
                )} />
                Memuat...
            </Button>
        )
    }

    return (
        <Button
            onClick={handleContact}
            disabled={isLoading}
            className={cn(
                "bg-whatsapp hover:bg-whatsapp-dark text-white transition-all",
                variants[variant],
                isLoading && "opacity-70 cursor-not-allowed",
                className
            )}
        >
            <MessageCircle className={cn(
                "mr-2",
                variant === 'default' ? "h-4 w-4" : "h-5 w-5"
            )} />
            {isLoading ? "Memproses..." : "Hubungi via WhatsApp"}
        </Button>
    )
}

// Sticky version for mobile (tidak perlu diubah banyak)
export function StickyContactButton(props: ContactButtonProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg lg:hidden">
            <ContactButton {...props} variant="sticky" />
        </div>
    )
}