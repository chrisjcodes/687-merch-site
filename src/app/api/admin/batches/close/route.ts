import { NextRequest, NextResponse } from 'next/server'
import { closeBatch } from '@/lib/batch-service'

/**
 * POST /api/admin/batches/close
 * Close a batch (create a purchase order) for a collection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collectionHandle, periodStart, periodEnd } = body

    if (!collectionHandle || !periodStart || !periodEnd) {
      return NextResponse.json(
        { error: 'Missing required fields: collectionHandle, periodStart, periodEnd' },
        { status: 400 }
      )
    }

    const batch = await closeBatch(
      collectionHandle,
      new Date(periodStart),
      new Date(periodEnd)
    )

    return NextResponse.json(batch)
  } catch (error) {
    console.error('Error closing batch:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to close batch' },
      { status: 500 }
    )
  }
}
