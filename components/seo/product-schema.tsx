// components/seo/product-schema.tsx
import { StructuredData } from './structured-data'

interface ProductSchemaProps {
    product: {
        name: string
        description: string
        url: string
        image?: string | string[]
        priceFrom?: number
        priceTo?: number
        priceUnit?: string
        category: string
        location: string
        vendorName: string
        vendorUrl?: string
    }
}

export function ProductSchema({ product }: ProductSchemaProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://weddingmarket.com'

    // Format price
    const priceSpecification = []
    if (product.priceFrom) {
        priceSpecification.push({
            '@type': 'PriceSpecification',
            price: product.priceFrom,
            priceCurrency: 'IDR',
            ...(product.priceTo && { maxPrice: product.priceTo }),
            ...(product.priceUnit && { priceUnit: product.priceUnit }),
        })
    }

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: product.url,
        ...(product.image && {
            image: Array.isArray(product.image) ? product.image : [product.image],
        }),
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'IDR',
            ...(product.priceFrom && { lowPrice: product.priceFrom }),
            ...(product.priceTo && { highPrice: product.priceTo }),
            offerCount: product.priceFrom && product.priceTo ? 2 : 1,
            availability: 'https://schema.org/InStock',
        },
        category: product.category,
        location: {
            '@type': 'Place',
            name: product.location,
            address: {
                '@type': 'PostalAddress',
                addressLocality: product.location,
                addressRegion: 'Kalimantan',
                addressCountry: 'ID',
            },
        },
        brand: {
            '@type': 'Brand',
            name: product.vendorName,
            ...(product.vendorUrl && { url: product.vendorUrl }),
        },
        ...(priceSpecification.length > 0 && { priceSpecification }),
    }

    return <StructuredData data={schemaData} />
}