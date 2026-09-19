import { MetadataRoute } from 'next'

// Always use the production domain — never the Vercel preview URL
const PRODUCTION_URL = 'https://voiceshield.logicintelligencetechnologies.in'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = PRODUCTION_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/report/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
