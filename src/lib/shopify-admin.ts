/**
 * Shopify Admin API client for server-side operations
 * Used for fetching orders and other admin operations that require elevated access
 */

const adminApiToken = process.env.SHOPIFY_ADMIN_API_TOKEN

async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  if (!adminApiToken) {
    throw new Error('SHOPIFY_ADMIN_API_TOKEN is not set')
  }

  // For Admin API, we need to use the myshopify.com domain
  // The custom domain redirects, so we extract the shop name
  const endpoint = `https://7dsbxj-tf.myshopify.com/admin/api/2024-01/graphql.json`

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', // Don't cache admin API calls
    })

    const body = await result.json()

    if (body.errors) {
      console.error('Shopify Admin API errors:', body.errors)
      throw new Error(body.errors[0].message)
    }

    return body.data as T
  } catch (error) {
    console.error('Shopify Admin API error:', error)
    throw error
  }
}

// Types for order data
export interface OrderLineItem {
  quantity: number
  variant: {
    id: string
    title: string
    selectedOptions: Array<{ name: string; value: string }>
    metafield: { value: string } | null
  } | null
  product: {
    id: string
    title: string
    collections: {
      edges: Array<{
        node: {
          id: string
          handle: string
        }
      }>
    }
  } | null
}

export interface Order {
  id: string
  name: string
  createdAt: string
  lineItems: {
    edges: Array<{
      node: OrderLineItem
    }>
  }
}

export interface OrdersResponse {
  orders: {
    edges: Array<{
      node: Order
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

/**
 * Fetch orders for a specific collection within a date range
 * Uses cursor-based pagination to handle large result sets
 */
export async function getOrdersForCollection(
  collectionHandle: string,
  startDate: Date,
  endDate: Date
): Promise<Order[]> {
  const allOrders: Order[] = []
  let hasNextPage = true
  let cursor: string | null = null

  // Format dates for Shopify query
  const startStr = startDate.toISOString().split('T')[0]
  const endStr = endDate.toISOString().split('T')[0]

  while (hasNextPage) {
    const query = `
      query getOrders($first: Int!, $query: String!, $after: String) {
        orders(first: $first, query: $query, after: $after) {
          edges {
            node {
              id
              name
              createdAt
              lineItems(first: 100) {
                edges {
                  node {
                    quantity
                    variant {
                      id
                      title
                      selectedOptions {
                        name
                        value
                      }
                      garmentSku: metafield(namespace: "drop_shop", key: "garment_sku") {
                        value
                      }
                      materials: metafield(namespace: "drop_shop", key: "materials") {
                        value
                      }
                    }
                    product {
                      id
                      title
                      collections(first: 10) {
                        edges {
                          node {
                            id
                            handle
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const data: OrdersResponse = await shopifyAdminFetch<OrdersResponse>({
      query,
      variables: {
        first: 50,
        query: `created_at:>=${startStr} created_at:<=${endStr}`,
        after: cursor,
      },
    })

    // Filter orders to only include those with items from the specified collection
    for (const edge of data.orders.edges) {
      const order = edge.node
      const relevantLineItems = order.lineItems.edges.filter((lineItemEdge: { node: OrderLineItem }) => {
        const lineItem = lineItemEdge.node
        if (!lineItem.product?.collections) return false
        return lineItem.product.collections.edges.some(
          (collectionEdge: { node: { id: string; handle: string } }) => collectionEdge.node.handle === collectionHandle
        )
      })

      if (relevantLineItems.length > 0) {
        // Create a filtered order with only relevant line items
        allOrders.push({
          ...order,
          lineItems: {
            edges: relevantLineItems,
          },
        })
      }
    }

    hasNextPage = data.orders.pageInfo.hasNextPage
    cursor = data.orders.pageInfo.endCursor
  }

  return allOrders
}

// Types for aggregated report data
export interface GarmentCount {
  garmentSku: string
  size: string
  quantity: number
}

export interface MaterialCount {
  materialSku: string
  quantity: number
  productionType?: string
}

export interface ProductionReport {
  collectionHandle: string
  startDate: string
  endDate: string
  orderCount: number
  totalItems: number
  garments: GarmentCount[]
  materials: MaterialCount[]
}

/**
 * Generate a production report for a collection
 * Aggregates garment and material requirements from orders
 */
export async function generateProductionReport(
  collectionHandle: string,
  startDate: Date,
  endDate: Date
): Promise<ProductionReport> {
  const orders = await getOrdersForCollection(collectionHandle, startDate, endDate)

  // Aggregate garments by SKU + size
  const garmentMap = new Map<string, GarmentCount>()
  // Aggregate materials by SKU
  const materialMap = new Map<string, MaterialCount>()

  let totalItems = 0

  for (const order of orders) {
    for (const lineItemEdge of order.lineItems.edges) {
      const lineItem = lineItemEdge.node
      const quantity = lineItem.quantity
      totalItems += quantity

      // Get variant metafields
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

      // Aggregate garment
      const garmentKey = `${garmentSku}|${size}`
      const existing = garmentMap.get(garmentKey)
      if (existing) {
        existing.quantity += quantity
      } else {
        garmentMap.set(garmentKey, { garmentSku, size, quantity })
      }

      // Get materials from metafield
      // @ts-expect-error - metafield structure from Admin API
      const materialsJson = variant.materials?.value
      if (materialsJson) {
        try {
          const materials = JSON.parse(materialsJson) as Array<{
            material_sku: string
            units_per_order: number
            production_type?: string
          }>

          for (const material of materials) {
            const materialKey = material.material_sku
            const materialQuantity = quantity * (material.units_per_order || 1)

            const existingMaterial = materialMap.get(materialKey)
            if (existingMaterial) {
              existingMaterial.quantity += materialQuantity
            } else {
              materialMap.set(materialKey, {
                materialSku: material.material_sku,
                quantity: materialQuantity,
                productionType: material.production_type,
              })
            }
          }
        } catch (e) {
          console.error('Failed to parse materials JSON:', e)
        }
      }
    }
  }

  // Sort garments by SKU then size
  const garments = Array.from(garmentMap.values()).sort((a, b) => {
    if (a.garmentSku !== b.garmentSku) {
      return a.garmentSku.localeCompare(b.garmentSku)
    }
    return sortBySize(a.size, b.size)
  })

  // Sort materials by SKU
  const materials = Array.from(materialMap.values()).sort((a, b) =>
    a.materialSku.localeCompare(b.materialSku)
  )

  return {
    collectionHandle,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    orderCount: orders.length,
    totalItems,
    garments,
    materials,
  }
}

// Size sort order for common apparel sizes
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
