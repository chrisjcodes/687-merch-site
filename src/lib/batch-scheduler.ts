/**
 * Batch Scheduler - Automatically creates batches when due
 *
 * Runs on a schedule (daily via cron) and checks all collections:
 * - Finite drops: Create batch when order_window_end has passed
 * - Ongoing shops: Create batch every batch_interval_days
 */

import { prisma } from './prisma'
import { getCollectionsForBatching, CollectionForBatching } from './shopify'
import { closeBatch } from './batch-service'

export interface BatchScheduleResult {
  collectionHandle: string
  collectionTitle: string
  action: 'created' | 'skipped' | 'error'
  reason: string
  batchId?: string
}

/**
 * Check if a batch needs to be created for a collection
 */
async function shouldCreateBatch(collection: CollectionForBatching): Promise<{
  shouldCreate: boolean
  reason: string
  periodStart: Date | null
  periodEnd: Date | null
}> {
  const now = new Date()

  // Get the last batch for this collection
  const lastBatch = await prisma.batch.findFirst({
    where: { collectionHandle: collection.handle },
    orderBy: { periodEnd: 'desc' },
  })

  // Case 1: Finite drop with order_window_end
  if (collection.orderWindowEnd) {
    const windowEnd = collection.orderWindowEnd

    // Window hasn't closed yet
    if (now < windowEnd) {
      return {
        shouldCreate: false,
        reason: `Order window still open until ${windowEnd.toISOString()}`,
        periodStart: null,
        periodEnd: null,
      }
    }

    // Already batched after window closed
    if (lastBatch && lastBatch.periodEnd >= windowEnd) {
      return {
        shouldCreate: false,
        reason: `Already batched for this drop on ${lastBatch.closedAt.toISOString()}`,
        periodStart: null,
        periodEnd: null,
      }
    }

    // Window closed and no batch yet - create one
    const periodStart = collection.orderWindowStart || lastBatch?.periodEnd || new Date(0)
    return {
      shouldCreate: true,
      reason: 'Order window closed, creating final batch',
      periodStart,
      periodEnd: windowEnd,
    }
  }

  // Case 2: Ongoing shop with batch_interval_days
  if (collection.batchIntervalDays && collection.batchIntervalDays > 0) {
    const intervalMs = collection.batchIntervalDays * 24 * 60 * 60 * 1000

    if (!lastBatch) {
      // No previous batch - create first one
      // Period starts from order window start or 30 days ago (reasonable default)
      const periodStart = collection.orderWindowStart || new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      return {
        shouldCreate: true,
        reason: 'First batch for ongoing shop',
        periodStart,
        periodEnd: now,
      }
    }

    const timeSinceLastBatch = now.getTime() - lastBatch.periodEnd.getTime()

    if (timeSinceLastBatch >= intervalMs) {
      return {
        shouldCreate: true,
        reason: `${collection.batchIntervalDays} days since last batch`,
        periodStart: lastBatch.periodEnd,
        periodEnd: now,
      }
    }

    const nextBatchDate = new Date(lastBatch.periodEnd.getTime() + intervalMs)
    return {
      shouldCreate: false,
      reason: `Next batch due ${nextBatchDate.toISOString()}`,
      periodStart: null,
      periodEnd: null,
    }
  }

  // No batch configuration
  return {
    shouldCreate: false,
    reason: 'No order_window_end or batch_interval_days configured',
    periodStart: null,
    periodEnd: null,
  }
}

/**
 * Process all collections and create batches where needed
 */
export async function processScheduledBatches(): Promise<BatchScheduleResult[]> {
  const results: BatchScheduleResult[] = []

  // Get all collections with batch-related metafields
  const collections = await getCollectionsForBatching()

  for (const collection of collections) {
    const check = await shouldCreateBatch(collection)

    if (!check.shouldCreate) {
      results.push({
        collectionHandle: collection.handle,
        collectionTitle: collection.title,
        action: 'skipped',
        reason: check.reason,
      })
      continue
    }

    try {
      const batch = await closeBatch(
        collection.handle,
        check.periodStart!,
        check.periodEnd!
      )

      results.push({
        collectionHandle: collection.handle,
        collectionTitle: collection.title,
        action: 'created',
        reason: check.reason,
        batchId: batch.id,
      })
    } catch (error) {
      results.push({
        collectionHandle: collection.handle,
        collectionTitle: collection.title,
        action: 'error',
        reason: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}

/**
 * Get batch schedule status for all collections
 * (for admin dashboard display)
 */
export async function getBatchScheduleStatus(): Promise<Array<{
  collectionHandle: string
  collectionTitle: string
  lastBatchDate: Date | null
  nextBatchDate: Date | null
  status: 'pending' | 'due' | 'completed' | 'not_configured'
}>> {
  const collections = await getCollectionsForBatching()
  const now = new Date()
  const statuses = []

  for (const collection of collections) {
    const lastBatch = await prisma.batch.findFirst({
      where: { collectionHandle: collection.handle },
      orderBy: { periodEnd: 'desc' },
    })

    let status: 'pending' | 'due' | 'completed' | 'not_configured' = 'not_configured'
    let nextBatchDate: Date | null = null

    // Finite drop
    if (collection.orderWindowEnd) {
      if (now < collection.orderWindowEnd) {
        status = 'pending'
        nextBatchDate = collection.orderWindowEnd
      } else if (lastBatch && lastBatch.periodEnd >= collection.orderWindowEnd) {
        status = 'completed'
      } else {
        status = 'due'
        nextBatchDate = collection.orderWindowEnd
      }
    }
    // Ongoing shop
    else if (collection.batchIntervalDays && collection.batchIntervalDays > 0) {
      const intervalMs = collection.batchIntervalDays * 24 * 60 * 60 * 1000

      if (lastBatch) {
        nextBatchDate = new Date(lastBatch.periodEnd.getTime() + intervalMs)
        status = now >= nextBatchDate ? 'due' : 'pending'
      } else {
        status = 'due'
        nextBatchDate = now
      }
    }

    statuses.push({
      collectionHandle: collection.handle,
      collectionTitle: collection.title,
      lastBatchDate: lastBatch?.closedAt || null,
      nextBatchDate,
      status,
    })
  }

  return statuses
}
