import { ShopifyCollectionMetafields } from './shopify'

export type ShopStatus = 'open' | 'closed' | 'upcoming'

/**
 * Determines the shop status based on order window metafields.
 *
 * Logic:
 * - Neither start nor end: perpetually available (open)
 * - End only: live now, closes at end date
 * - Start + End: timeboxed drop (opens at start, closes at end)
 * - Start only: opens at start, never closes
 */
export function getShopStatus(metafields: ShopifyCollectionMetafields): ShopStatus {
  const now = new Date()
  const { orderWindowStart, orderWindowEnd } = metafields

  // Neither: perpetually available
  if (!orderWindowStart && !orderWindowEnd) {
    return 'open'
  }

  // End only: live now, closes at end
  if (!orderWindowStart && orderWindowEnd) {
    return now <= orderWindowEnd ? 'open' : 'closed'
  }

  // Start + End: timeboxed drop
  if (orderWindowStart && orderWindowEnd) {
    if (now < orderWindowStart) return 'upcoming'
    if (now <= orderWindowEnd) return 'open'
    return 'closed'
  }

  // Start only: opens at start, never closes
  if (orderWindowStart && !orderWindowEnd) {
    return now >= orderWindowStart ? 'open' : 'upcoming'
  }

  return 'open'
}

/**
 * Format a date for display (e.g., "January 15, 2024 at 12:00 PM")
 */
export function formatOrderWindowDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Get time remaining until a date
 */
export function getTimeUntil(date: Date): { days: number; hours: number; minutes: number } {
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes }
}
