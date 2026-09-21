import { MetadataRoute } from 'next'
import { recentWork } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://687merch.com'

  const staticPages = [
    { url: baseUrl,                              lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 1   },
    { url: `${baseUrl}/faq`,                     lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.9 },
    { url: `${baseUrl}/fsu-alumni-clubs`,        lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/black-friday`,            lastModified: new Date(), changeFrequency: 'yearly'  as const, priority: 0.5 },
  ]

  // Pitch pages are noindexed (targeted outreach) — excluded from sitemap

  const workPages = recentWork.map((work) => ({
    url: `${baseUrl}/work/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...workPages]
}
