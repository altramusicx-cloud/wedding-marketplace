// lib/utils/generate-metadata.ts
import type { Metadata } from 'next'

interface GenerateMetadataOptions {
    title?: string
    description?: string
    image?: string
    url?: string
}

export function generateMetadata({
    title,
    description,
    image,
    url
}: GenerateMetadataOptions = {}): Metadata {
    const baseTitle = 'WeddingMarket - Marketplace Wedding Kalimantan'
    const baseDescription = 'Marketplace wedding lokal pertama di Kalimantan yang elegan dan mudah digunakan'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://weddingmarket.com'

    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle
    const fullDescription = description || baseDescription
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl

    // Default wedding-themed image dari Unsplash
    const defaultImage = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&h=630&q=80'

    const metadata: Metadata = {
        title: fullTitle,
        description: fullDescription,

        // Open Graph (Facebook, WhatsApp, dll)
        openGraph: {
            title: fullTitle,
            description: fullDescription,
            url: fullUrl,
            siteName: 'WeddingMarket',
            images: [
                {
                    url: image || defaultImage,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
            locale: 'id_ID',
            type: 'website',
        },

        // Twitter Cards
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: fullDescription,
            images: [image || defaultImage],
        },

        // Additional metadata
        keywords: ['wedding', 'pernikahan', 'kalimantan', 'vendor', 'wedding planner', 'dekorasi pernikahan'],
        authors: [{ name: 'WeddingMarket Team' }],
        creator: 'WeddingMarket',
        publisher: 'WeddingMarket',
        formatDetection: {
            telephone: false,
            date: false,
            address: false,
            email: false,
        },

        // Alternatif URLs
        alternates: {
            canonical: fullUrl,
        },
    }

    return metadata
}

// Utility khusus untuk product pages
export function generateProductMetadata(
    productName: string,
    productDescription: string,
    productImage?: string
): Metadata {
    return generateMetadata({
        title: productName,
        description: productDescription.length > 160
            ? `${productDescription.substring(0, 157)}...`
            : productDescription,
        image: productImage,
    })
}

// Utility khusus untuk category pages
export function generateCategoryMetadata(
    categoryName: string,
    categoryDescription?: string
): Metadata {
    return generateMetadata({
        title: `Kategori ${categoryName}`,
        description: categoryDescription || `Temukan vendor ${categoryName} pernikahan terbaik di Kalimantan`,
    })
}