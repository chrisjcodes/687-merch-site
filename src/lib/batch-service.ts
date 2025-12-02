/**
 * Batch Service - Creates "purchase order" records when a drop closes
 *
 * Batch = immutable snapshot of what to order after aggregating sales
 * and applying minimum quantity rules.
 */

import { prisma } from './prisma'
import { getCollectionByHandle, parseCollectionMetafields, parseVariantMetafields, MaterialEntry } from './shopify'
import { getOrdersForCollection } from './shopify-admin'
import { Batch, BatchLine, LineType } from '@prisma/client'

// Size sort order for aggregation display
const SIZE_ORDER = ['XS', 'S', 'SM', 'M', 'MD', 'L', 'LG', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', '5XL']

function sortBySize(a: string, b: string): number {
  const aUpper = a.toUpperCase()
  const bUpper = b.toUpperCase()
  const aIndex = SIZE_ORDER.indexOf(aUpper)
  const bIndex = SIZE_ORDER.indexOf(bUpper)

  if (aIndex === -1 && bIndex === -1) {
    return a.localeCompare(b)
  }
  if (aIndex === -1) return 1
  if (bIndex === -1) return -1
  return aIndex - bIndex
}

interface GarmentAggregation {
  garmentSku: string
  size: string
  soldQty: number
  // Track which variants contributed to this aggregation for material computation
  variantMaterials: MaterialEntry[][]
}

interface MaterialAggregation {
  materialSku: string
  productionType: string | null
  soldUnits: number
  requiredUnits: number
}

/**
 * Close a batch for a collection within a date range
 *
 * Steps:
 * 1. Fetch collection metafields from Shopify (min_quantity, client info)
 * 2. Fetch all orders for the period from Shopify Admin API
 * 3. Aggregate by garment SKU + size
 * 4. Apply minimum quantity rules
 * 5. Compute material requirements from variant metafields
 * 6. Create Batch record with all lines
 */
export async function closeBatch(
  collectionHandle: string,
  periodStart: Date,
  periodEnd: Date
): Promise<Batch & { lines: BatchLine[] }> {
  // 1. Fetch collection metafields
  const collection = await getCollectionByHandle(collectionHandle)
  if (!collection) {
    throw new Error(`Collection not found: ${collectionHandle}`)
  }

  const metafields = parseCollectionMetafields(collection)
  const collectionMinQty = metafields.minQuantity ?? 1

  // Build product min overrides map (productId -> minQty)
  const productMinOverrides = new Map<string, number>()
  for (const productEdge of collection.products.edges) {
    const product = productEdge.node
    if (product.minQuantity?.value) {
      productMinOverrides.set(product.id, parseInt(product.minQuantity.value, 10))
    }
  }

  // Build variant materials map (variantId -> materials)
  const variantMaterialsMap = new Map<string, MaterialEntry[]>()
  const variantToProductMap = new Map<string, string>()
  for (const productEdge of collection.products.edges) {
    const product = productEdge.node
    for (const variantEdge of product.variants.edges) {
      const variant = variantEdge.node
      variantToProductMap.set(variant.id, product.id)
      const parsed = parseVariantMetafields(variant)
      if (parsed.materials) {
        variantMaterialsMap.set(variant.id, parsed.materials)
      }
    }
  }

  // 2. Fetch orders from Shopify Admin API
  const orders = await getOrdersForCollection(collectionHandle, periodStart, periodEnd)

  // 3. Aggregate by garment SKU + size
  const garmentMap = new Map<string, GarmentAggregation>()
  let totalItemsSold = 0

  for (const order of orders) {
    for (const lineItemEdge of order.lineItems.edges) {
      const lineItem = lineItemEdge.node
      const quantity = lineItem.quantity
      totalItemsSold += quantity

      const variant = lineItem.variant
      if (!variant) continue

      // Extract size from selectedOptions
      const sizeOption = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === 'size'
      )
      const size = sizeOption?.value || 'N/A'

      // Get garment SKU from metafield
      // @ts-expect-error - metafield structure from Admin API
      const garmentSku = variant.garmentSku?.value || 'UNKNOWN'

      // Get materials for this variant
      const variantId = variant.id
      const materials = variantMaterialsMap.get(variantId) || []

      // Aggregate garment
      const garmentKey = `${garmentSku}|${size}`
      const existing = garmentMap.get(garmentKey)
      if (existing) {
        existing.soldQty += quantity
        // Add materials for each unit sold
        for (let i = 0; i < quantity; i++) {
          existing.variantMaterials.push(materials)
        }
      } else {
        const variantMaterials: MaterialEntry[][] = []
        for (let i = 0; i < quantity; i++) {
          variantMaterials.push(materials)
        }
        garmentMap.set(garmentKey, { garmentSku, size, soldQty: quantity, variantMaterials })
      }
    }
  }

  // 4. Apply minimum quantity rules and compute required quantities
  const garmentLines: Array<{
    type: LineType
    sku: string
    size: string | null
    productionType: string | null
    soldQty: number
    requiredQty: number
    variantMaterials: MaterialEntry[][]
  }> = []

  for (const [, agg] of garmentMap) {
    // For now, use collection minimum. Could enhance to use product-level overrides
    // if we had a way to map garmentSku back to product.
    const minQty = collectionMinQty
    const requiredQty = Math.max(agg.soldQty, minQty)

    garmentLines.push({
      type: 'GARMENT' as LineType,
      sku: agg.garmentSku,
      size: agg.size,
      productionType: null,
      soldQty: agg.soldQty,
      requiredQty,
      variantMaterials: agg.variantMaterials,
    })
  }

  // Sort garment lines by SKU then size
  garmentLines.sort((a, b) => {
    if (a.sku !== b.sku) {
      return a.sku.localeCompare(b.sku)
    }
    return sortBySize(a.size || '', b.size || '')
  })

  // 5. Compute material requirements
  // For each garment, we need to order materials based on requiredQty, not soldQty
  const materialMap = new Map<string, MaterialAggregation>()

  for (const garmentLine of garmentLines) {
    // Calculate the ratio of required to sold
    const soldQty = garmentLine.soldQty
    const requiredQty = garmentLine.requiredQty

    // Aggregate materials from all variants that contributed to this garment
    // Each entry in variantMaterials represents one unit sold
    const materialCounts = new Map<string, { entry: MaterialEntry; soldUnits: number }>()

    for (const materials of garmentLine.variantMaterials) {
      for (const material of materials) {
        const key = material.material_sku
        const existing = materialCounts.get(key)
        if (existing) {
          existing.soldUnits += material.units_per_order
        } else {
          materialCounts.set(key, { entry: material, soldUnits: material.units_per_order })
        }
      }
    }

    // Now scale up to requiredQty
    for (const [materialSku, data] of materialCounts) {
      // Scale: if we sold 5 but need to order minimum 10, scale materials by 10/5
      const scaleFactor = soldQty > 0 ? requiredQty / soldQty : requiredQty
      const requiredUnits = Math.ceil(data.soldUnits * scaleFactor)

      const existing = materialMap.get(materialSku)
      if (existing) {
        existing.soldUnits += data.soldUnits
        existing.requiredUnits += requiredUnits
      } else {
        materialMap.set(materialSku, {
          materialSku,
          productionType: data.entry.production_type || null,
          soldUnits: data.soldUnits,
          requiredUnits,
        })
      }
    }
  }

  // Convert material map to lines
  const materialLines: Array<{
    type: LineType
    sku: string
    size: string | null
    productionType: string | null
    soldQty: number
    requiredQty: number
  }> = Array.from(materialMap.values())
    .sort((a, b) => a.materialSku.localeCompare(b.materialSku))
    .map((m) => ({
      type: 'MATERIAL' as LineType,
      sku: m.materialSku,
      size: null,
      productionType: m.productionType,
      soldQty: m.soldUnits,
      requiredQty: m.requiredUnits,
    }))

  // Calculate total items required
  const totalItemsRequired = garmentLines.reduce((sum, line) => sum + line.requiredQty, 0)

  // 6. Create Batch record with all lines
  const batch = await prisma.batch.create({
    data: {
      collectionHandle,
      periodStart,
      periodEnd,
      orderCount: orders.length,
      totalItemsSold,
      totalItemsRequired,
      clientId: metafields.clientId,
      clientSharePct: metafields.clientSharePct,
      lines: {
        create: [
          ...garmentLines.map((line) => ({
            type: line.type,
            sku: line.sku,
            size: line.size,
            productionType: line.productionType,
            soldQty: line.soldQty,
            requiredQty: line.requiredQty,
          })),
          ...materialLines,
        ],
      },
    },
    include: {
      lines: true,
    },
  })

  return batch
}

/**
 * Get a batch by ID with all lines
 */
export async function getBatch(batchId: string): Promise<(Batch & { lines: BatchLine[] }) | null> {
  return prisma.batch.findUnique({
    where: { id: batchId },
    include: { lines: true },
  })
}

/**
 * List batches for a collection
 */
export async function listBatches(collectionHandle?: string): Promise<Batch[]> {
  return prisma.batch.findMany({
    where: collectionHandle ? { collectionHandle } : undefined,
    orderBy: { closedAt: 'desc' },
  })
}

/**
 * Get batch with lines formatted for display/export
 */
export interface BatchSummary {
  id: string
  collectionHandle: string
  periodStart: Date
  periodEnd: Date
  closedAt: Date
  orderCount: number
  totalItemsSold: number
  totalItemsRequired: number
  clientId: string | null
  clientSharePct: number | null
  garments: Array<{
    sku: string
    size: string
    soldQty: number
    requiredQty: number
  }>
  materials: Array<{
    sku: string
    productionType: string | null
    soldQty: number
    requiredQty: number
  }>
}

export async function getBatchSummary(batchId: string): Promise<BatchSummary | null> {
  const batch = await getBatch(batchId)
  if (!batch) return null

  const garments = batch.lines
    .filter((line) => line.type === 'GARMENT')
    .map((line) => ({
      sku: line.sku,
      size: line.size || 'N/A',
      soldQty: line.soldQty,
      requiredQty: line.requiredQty,
    }))

  const materials = batch.lines
    .filter((line) => line.type === 'MATERIAL')
    .map((line) => ({
      sku: line.sku,
      productionType: line.productionType,
      soldQty: line.soldQty,
      requiredQty: line.requiredQty,
    }))

  return {
    id: batch.id,
    collectionHandle: batch.collectionHandle,
    periodStart: batch.periodStart,
    periodEnd: batch.periodEnd,
    closedAt: batch.closedAt,
    orderCount: batch.orderCount,
    totalItemsSold: batch.totalItemsSold,
    totalItemsRequired: batch.totalItemsRequired,
    clientId: batch.clientId,
    clientSharePct: batch.clientSharePct ? Number(batch.clientSharePct) : null,
    garments,
    materials,
  }
}
