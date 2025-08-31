import { MetadataRoute } from 'next'
import { recentWork } from '@/lib/data'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://687merch.com' // Replace with your actual domain
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]
  
  // Dynamic work pages
  const workPages = recentWork.map((work) => ({
    url: `${baseUrl}/work/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
 
  return [...staticPages, ...workPages]
}