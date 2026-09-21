import { NextResponse } from 'next/server'
import { processScheduledBatches } from '@/lib/batch-scheduler'

// Vercel cron job authentication
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron or has correct secret
  const authHeader = request.headers.get('authorization')

  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    console.log('[Batch Scheduler] Starting scheduled batch processing...')

    const results = await processScheduledBatches()

    const created = results.filter((r) => r.action === 'created')
    const skipped = results.filter((r) => r.action === 'skipped')
    const errors = results.filter((r) => r.action === 'error')

    console.log(`[Batch Scheduler] Complete: ${created.length} created, ${skipped.length} skipped, ${errors.length} errors`)

    if (errors.length > 0) {
      console.error('[Batch Scheduler] Errors:', errors)
    }

    return NextResponse.json({
      success: true,
      summary: {
        created: created.length,
        skipped: skipped.length,
        errors: errors.length,
      },
      results,
    })
  } catch (error) {
    console.error('[Batch Scheduler] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Also allow POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
