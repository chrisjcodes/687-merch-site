import { NextResponse } from 'next/server'
import { getCollectionsForBatching } from '@/lib/shopify'
import { prisma } from '@/lib/prisma'

export interface ShopStatus {
  handle: string
  title: string
  status: 'live' | 'upcoming' | 'closed' | 'ongoing'
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
        let status: ShopStatus['status'] = 'ongoing'
        let nextBatchDate: Date | null = null

        if (collection.orderWindowEnd) {
          const windowEnd = new Date(collection.orderWindowEnd)
          const windowStart = collection.orderWindowStart
            ? new Date(collection.orderWindowStart)
            : null

          if (windowStart && now < windowStart) {
            status = 'upcoming'
          } else if (now > windowEnd) {
            status = 'closed'
          } else {
            status = 'live'
          }
          nextBatchDate = windowEnd
        } else if (collection.batchIntervalDays) {
          status = 'ongoing'
          if (lastBatch) {
            nextBatchDate = new Date(
              lastBatch.periodEnd.getTime() +
                collection.batchIntervalDays * 24 * 60 * 60 * 1000
            )
          } else {
            nextBatchDate = now // First batch is due
          }
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
        ongoing: configuredShops.filter((s) => s.status === 'ongoing').length,
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
