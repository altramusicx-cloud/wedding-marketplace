// File: lib/utils/format-whatsapp.ts
export function formatWhatsAppUrl(
    phoneNumber: string,
    message?: string,
    options?: {
        includeRef?: boolean
        userId?: string
        productId?: string
    }
): string {
    // Clean phone number (remove spaces, dashes, +, 0)
    let cleanNumber = phoneNumber.replace(/[\s\-+()]/g, '')

    // If starts with 0, replace with 62
    if (cleanNumber.startsWith('0')) {
        cleanNumber = '62' + cleanNumber.substring(1)
    }

    // If starts with 8 (without 62), add 62
    if (cleanNumber.startsWith('8')) {
        cleanNumber = '62' + cleanNumber
    }

    // Build message
    let finalMessage = message || "Halo, saya tertarik dengan produk Anda."

    if (options?.includeRef) {
        const refParts = []
        if (options.userId) refParts.push(`user:${options.userId}`)
        if (options.productId) refParts.push(`product:${options.productId}`)

        if (refParts.length > 0) {
            finalMessage += `\n\nRef: ${refParts.join('|')}`
        }
    }

    // URL encode message
    const encodedMessage = encodeURIComponent(finalMessage)

    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}