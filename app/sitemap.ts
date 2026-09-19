import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceshield.logicintelligencetechnologies.in'

  const routes = [
    '',
    '/about',
    '/architecture',
    '/brief',
    '/demo',
    '/docs',
    '/login',
    '/privacy',
    '/sandbox',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
