import { MetadataRoute } from 'next'
import { recentWork } from '@/lib/data'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://687merch.com' // Replace with your actual domain
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/mobile-risk`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/flex-catalog`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/mobile-experience`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/mobile-logistics`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
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