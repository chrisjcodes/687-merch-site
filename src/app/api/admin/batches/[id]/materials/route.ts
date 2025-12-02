import { NextRequest, NextResponse } from 'next/server'
import { getBatchSummary } from '@/lib/batch-service'

/**
 * GET /api/admin/batches/[id]/materials
 * Get materials order sheet for a batch (CSV export)
 *
 * Query params:
 * - format: 'json' (default) or 'csv'
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

    const format = request.nextUrl.searchParams.get('format') || 'json'

    // Build materials order sheet
    const orderSheet = {
      batchId: batch.id,
      collectionHandle: batch.collectionHandle,
      periodStart: batch.periodStart,
      periodEnd: batch.periodEnd,
      closedAt: batch.closedAt,
      // Materials to order
      materials: batch.materials.map((m) => ({
        sku: m.sku,
        productionType: m.productionType || 'Standard',
        quantityToOrder: m.requiredQty,
        soldQty: m.soldQty,
      })),
      // Garments to order (for reference)
      garments: batch.garments.map((g) => ({
        sku: g.sku,
        size: g.size,
        quantityToOrder: g.requiredQty,
        soldQty: g.soldQty,
      })),
    }

    if (format === 'csv') {
      // Generate CSV for materials
      const csvLines = [
        'Material SKU,Production Type,Quantity to Order,Quantity Sold',
      ]

      for (const m of orderSheet.materials) {
        csvLines.push(
          `"${m.sku}","${m.productionType}",${m.quantityToOrder},${m.soldQty}`
        )
      }

      // Add separator and garments
      csvLines.push('')
      csvLines.push('Garment SKU,Size,Quantity to Order,Quantity Sold')

      for (const g of orderSheet.garments) {
        csvLines.push(
          `"${g.sku}","${g.size}",${g.quantityToOrder},${g.soldQty}`
        )
      }

      const csv = csvLines.join('\n')
      const filename = `batch-${batch.id}-materials-${batch.periodEnd.toISOString().split('T')[0]}.csv`

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    return NextResponse.json(orderSheet)
  } catch (error) {
    console.error('Error generating materials order sheet:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate order sheet' },
      { status: 500 }
    )
  }
}
