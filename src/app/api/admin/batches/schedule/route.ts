import { NextResponse } from 'next/server'
import { getBatchScheduleStatus } from '@/lib/batch-scheduler'

/**
 * GET /api/admin/batches/schedule
 * Get batch schedule status for all collections
 */
export async function GET() {
  try {
    const status = await getBatchScheduleStatus()

    return NextResponse.json({
      collections: status,
      summary: {
        due: status.filter((s) => s.status === 'due').length,
        pending: status.filter((s) => s.status === 'pending').length,
        completed: status.filter((s) => s.status === 'completed').length,
        notConfigured: status.filter((s) => s.status === 'not_configured').length,
      },
    })
  } catch (error) {
    console.error('Error getting batch schedule status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get schedule status' },
      { status: 500 }
    )
  }
}
