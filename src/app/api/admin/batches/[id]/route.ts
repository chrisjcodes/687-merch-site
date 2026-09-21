import { NextRequest, NextResponse } from 'next/server'
import { getBatchSummary } from '@/lib/batch-service'

/**
 * GET /api/admin/batches/[id]
 * Get a batch with all lines (the "purchase order")
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const batch = await getBatchSummary(id)

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(batch)
  } catch (error) {
    console.error('Error getting batch:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get batch' },
      { status: 500 }
    )
  }
}
