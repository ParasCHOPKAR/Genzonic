import { MetadataRoute } from 'next'
 
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.genzonic.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/cart/', '/checkout/', '/profile/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
