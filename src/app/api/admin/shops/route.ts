import { NextResponse } from 'next/server'
import { getCollectionsForBatching } from '@/lib/shopify'
import { prisma } from '@/lib/prisma'

export interface ShopStatus {
  handle: string
  title: string
  status: 'live' | 'upcoming' | 'closed'
  orderWindowStart: string | null
  orderWindowEnd: string | null
  batchIntervalDays: number | null
  lastBatchDate: string | null
  nextBatchDate: string | null
  themeColor: string | null
}

export async function GET() {
  try {
    const collections = await getCollectionsForBatching()
    const now = new Date()

    const shops: ShopStatus[] = await Promise.all(
      collections.map(async (collection) => {
        // Get last batch for this collection
        const lastBatch = await prisma.batch.findFirst({
          where: { collectionHandle: collection.handle },
          orderBy: { closedAt: 'desc' },
          select: { closedAt: true, periodEnd: true },
        })

        // Determine status
        // - No start or end date = live
        // - Start date in future = upcoming
        // - Between start and end = live
        // - Only end date = live until that date
        // - Past end date = closed
        let status: ShopStatus['status'] = 'live'
        let nextBatchDate: Date | null = null

        const windowStart = collection.orderWindowStart
        const windowEnd = collection.orderWindowEnd

        if (windowStart && now < windowStart) {
          // Start date in future = upcoming
          status = 'upcoming'
        } else if (windowEnd && now > windowEnd) {
          // Past end date = closed
          status = 'closed'
        } else {
          // Live - either no end date or end date in future
          status = 'live'
        }

        // Calculate next batch date
        if (collection.batchIntervalDays) {
          // Has batch interval - calculate based on last batch
          if (lastBatch) {
            nextBatchDate = new Date(
              lastBatch.periodEnd.getTime() +
                collection.batchIntervalDays * 24 * 60 * 60 * 1000
            )
          } else {
            // No previous batch - next batch is now (or interval from now)
            nextBatchDate = new Date(
              now.getTime() + collection.batchIntervalDays * 24 * 60 * 60 * 1000
            )
          }
        } else if (windowEnd) {
          // No batch interval but has end date - batch on close
          nextBatchDate = windowEnd
        }

        return {
          handle: collection.handle,
          title: collection.title,
          status,
          orderWindowStart: collection.orderWindowStart?.toISOString() || null,
          orderWindowEnd: collection.orderWindowEnd?.toISOString() || null,
          batchIntervalDays: collection.batchIntervalDays,
          lastBatchDate: lastBatch?.closedAt.toISOString() || null,
          nextBatchDate: nextBatchDate?.toISOString() || null,
          themeColor: collection.themeColor,
        }
      })
    )

    // Filter to only show collections that are drop shops (have theme_color set)
    const configuredShops = shops.filter((shop) => shop.themeColor)

    return NextResponse.json({
      shops: configuredShops,
      summary: {
        live: configuredShops.filter((s) => s.status === 'live').length,
        upcoming: configuredShops.filter((s) => s.status === 'upcoming').length,
        closed: configuredShops.filter((s) => s.status === 'closed').length,
      },
    })
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch shops' },
      { status: 500 }
    )
  }
}
