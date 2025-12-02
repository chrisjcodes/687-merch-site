import { NextRequest, NextResponse } from 'next/server'
import { listBatches } from '@/lib/batch-service'

/**
 * GET /api/admin/batches?collectionHandle=xyz
 * List batches, optionally filtered by collection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collectionHandle = searchParams.get('collectionHandle') || undefined

    const batches = await listBatches(collectionHandle)
    return NextResponse.json(batches)
  } catch (error) {
    console.error('Error listing batches:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list batches' },
      { status: 500 }
    )
  }
}
