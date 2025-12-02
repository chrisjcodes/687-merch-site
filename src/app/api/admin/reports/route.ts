import { NextRequest, NextResponse } from 'next/server'
import { generateProductionReport } from '@/lib/shopify-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collectionHandle, startDate, endDate } = body

    if (!collectionHandle || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: collectionHandle, startDate, endDate' },
        { status: 400 }
      )
    }

    const report = await generateProductionReport(
      collectionHandle,
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating production report:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    )
  }
}
