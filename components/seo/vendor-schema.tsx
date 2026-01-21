// components/seo/vendor-schema.tsx
import { StructuredData } from './structured-data'

interface VendorSchemaProps {
    vendor: {
        name: string
        description?: string
        url: string
        logo?: string
        whatsappNumber: string
        location: string
        foundingDate?: string
    }
}

export function VendorSchema({ vendor }: VendorSchemaProps) {
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: vendor.name,
        ...(vendor.description && { description: vendor.description }),
        url: vendor.url,
        ...(vendor.logo && { logo: vendor.logo }),
        telephone: `+${vendor.whatsappNumber.replace(/\D/g, '')}`,
        address: {
            '@type': 'PostalAddress',
            addressLocality: vendor.location,
            addressRegion: 'Kalimantan',
            addressCountry: 'ID',
        },
        ...(vendor.foundingDate && {
            foundingDate: vendor.foundingDate,
        }),
        priceRange: '$$',
        openingHours: 'Mo-Su',
        areaServed: 'Kalimantan',
    }

    return <StructuredData data={schemaData} />
}