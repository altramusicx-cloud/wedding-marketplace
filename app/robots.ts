// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://weddingmarket.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/admin/',
                '/api/',
                '/auth/',
                '/test-',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl.replace('https://', ''),
    }
}