const domain = process.env.SHOPIFY_STORE_DOMAIN!
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    const body = await result.json()

    if (body.errors) {
      throw new Error(body.errors[0].message)
    }

    return body.data as T
  } catch (error) {
    console.error('Shopify API error:', error)
    throw error
  }
}

// Get all products from a collection
export async function getCollectionProducts(collectionId: string) {
  const query = `
    query getCollectionProducts($id: ID!) {
      collection(id: $id) {
        id
        title
        description
        products(first: 250) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              options {
                id
                name
                values
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    collection: {
      id: string
      title: string
      description: string
      products: {
        edges: Array<{
          node: ShopifyProduct
        }>
      }
    }
  }>({
    query,
    variables: { id: collectionId },
  })

  return data.collection.products.edges.map((edge) => edge.node)
}

// Get a single product by ID
export async function getProduct(productId: string) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        descriptionHtml
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  `

  const data = await shopifyFetch<{
    product: ShopifyProduct | null
  }>({
    query,
    variables: { id: productId },
  })

  return data.product
}

// Create a cart with line items (using Cart API - replacement for deprecated Checkout API)
export async function createCheckout(lineItems: Array<{ variantId: string; quantity: number }>) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{
    cartCreate: {
      cart: {
        id: string
        checkoutUrl: string
      }
      userErrors: Array<{
        code: string
        field: string[]
        message: string
      }>
    }
  }>({
    query,
    variables: {
      input: {
        lines: lineItems.map((item) => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
  })

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  // Return in same format as old checkout for compatibility
  return {
    id: data.cartCreate.cart.id,
    webUrl: data.cartCreate.cart.checkoutUrl,
  }
}

// Get all collections (for admin dropdown)
export async function getCollections() {
  const query = `
    query getCollections {
      collections(first: 250) {
        edges {
          node {
            id
            title
            handle
            description
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string
          title: string
          handle: string
          description: string
        }
      }>
    }
  }>({
    query,
  })

  return data.collections.edges.map((edge) => edge.node)
}

// Lightweight type for batch scheduling - just needs metafields
export interface CollectionForBatching {
  id: string
  title: string
  handle: string
  orderWindowStart: Date | null
  orderWindowEnd: Date | null
  batchIntervalDays: number | null
}

// Get all collections with batch-related metafields (for scheduler)
export async function getCollectionsForBatching(): Promise<CollectionForBatching[]> {
  const query = `
    query getCollectionsForBatching {
      collections(first: 250) {
        edges {
          node {
            id
            title
            handle
            orderWindowStart: metafield(namespace: "drop_shop", key: "order_window_start") {
              value
            }
            orderWindowEnd: metafield(namespace: "drop_shop", key: "order_window_end") {
              value
            }
            batchIntervalDays: metafield(namespace: "drop_shop", key: "batch_interval_days") {
              value
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string
          title: string
          handle: string
          orderWindowStart: { value: string } | null
          orderWindowEnd: { value: string } | null
          batchIntervalDays: { value: string } | null
        }
      }>
    }
  }>({
    query,
  })

  return data.collections.edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    orderWindowStart: edge.node.orderWindowStart?.value ? new Date(edge.node.orderWindowStart.value) : null,
    orderWindowEnd: edge.node.orderWindowEnd?.value ? new Date(edge.node.orderWindowEnd.value) : null,
    batchIntervalDays: edge.node.batchIntervalDays?.value ? parseInt(edge.node.batchIntervalDays.value, 10) : null,
  }))
}

// Get collection by handle with metafields (for shop pages)
export async function getCollectionByHandle(handle: string) {
  const query = `
    query getCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        description
        handle
        image {
          url
          altText
          width
          height
        }
        batchingMessage: metafield(namespace: "drop_shop", key: "batching_message") {
          value
        }
        orderWindowStart: metafield(namespace: "drop_shop", key: "order_window_start") {
          value
        }
        orderWindowEnd: metafield(namespace: "drop_shop", key: "order_window_end") {
          value
        }
        minQuantity: metafield(namespace: "drop_shop", key: "min_quantity") {
          value
        }
        clientId: metafield(namespace: "drop_shop", key: "client_id") {
          value
        }
        clientSharePct: metafield(namespace: "drop_shop", key: "client_share_pct") {
          value
        }
        themeColor: metafield(namespace: "drop_shop", key: "theme_color") {
          value
        }
        themeMode: metafield(namespace: "drop_shop", key: "theme_mode") {
          value
        }
        batchIntervalDays: metafield(namespace: "drop_shop", key: "batch_interval_days") {
          value
        }
        products(first: 250) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              minQuantity: metafield(namespace: "drop_shop", key: "min_quantity") {
                value
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
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
                }
              }
              options {
                id
                name
                values
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    collectionByHandle: ShopifyCollectionWithMetafields | null
  }>({
    query,
    variables: { handle },
  })

  return data.collectionByHandle
}

// Type definitions
export interface ShopifyCollectionMetafields {
  batchingMessage: string | null
  orderWindowStart: Date | null
  orderWindowEnd: Date | null
  minQuantity: number | null
  clientId: string | null
  clientSharePct: number | null
  themeColor: string | null
  themeMode: 'light' | 'dark' | null
  batchIntervalDays: number | null
}

export interface ShopifyCollectionWithMetafields {
  id: string
  title: string
  description: string
  handle: string
  image: {
    url: string
    altText: string | null
    width: number
    height: number
  } | null
  batchingMessage: { value: string } | null
  orderWindowStart: { value: string } | null
  orderWindowEnd: { value: string } | null
  minQuantity: { value: string } | null
  clientId: { value: string } | null
  clientSharePct: { value: string } | null
  themeColor: { value: string } | null
  themeMode: { value: string } | null
  batchIntervalDays: { value: string } | null
  products: {
    edges: Array<{
      node: ShopifyProductWithMetafields
    }>
  }
}

// Product with optional metafields
export interface ShopifyProductWithMetafields extends ShopifyProduct {
  minQuantity?: { value: string } | null
  variants: {
    edges: Array<{
      node: ShopifyVariantWithMetafields
    }>
  }
}

// Variant with optional metafields
export interface ShopifyVariantWithMetafields extends ShopifyVariant {
  garmentSku?: { value: string } | null
  materials?: { value: string } | null
}

// Parsed material entry for BOM
export interface MaterialEntry {
  material_sku: string
  units_per_order: number
  production_type?: string
}

// Helper to parse product metafields
export function parseProductMetafields(product: ShopifyProductWithMetafields): { minQuantity: number | null } {
  return {
    minQuantity: product.minQuantity?.value ? parseInt(product.minQuantity.value, 10) : null,
  }
}

// Helper to parse variant metafields
export function parseVariantMetafields(variant: ShopifyVariantWithMetafields): {
  garmentSku: string | null
  materials: MaterialEntry[] | null
} {
  let materials: MaterialEntry[] | null = null
  if (variant.materials?.value) {
    try {
      materials = JSON.parse(variant.materials.value)
    } catch {
      console.error('Failed to parse variant materials JSON:', variant.materials.value)
    }
  }
  return {
    garmentSku: variant.garmentSku?.value || null,
    materials,
  }
}

// Helper to parse collection metafields into a cleaner format
export function parseCollectionMetafields(collection: ShopifyCollectionWithMetafields): ShopifyCollectionMetafields {
  return {
    batchingMessage: collection.batchingMessage?.value || null,
    orderWindowStart: collection.orderWindowStart?.value ? new Date(collection.orderWindowStart.value) : null,
    orderWindowEnd: collection.orderWindowEnd?.value ? new Date(collection.orderWindowEnd.value) : null,
    minQuantity: collection.minQuantity?.value ? parseInt(collection.minQuantity.value, 10) : null,
    clientId: collection.clientId?.value || null,
    clientSharePct: collection.clientSharePct?.value ? parseFloat(collection.clientSharePct.value) : null,
    themeColor: collection.themeColor?.value || null,
    themeMode: (collection.themeMode?.value as 'light' | 'dark') || null,
    batchIntervalDays: collection.batchIntervalDays?.value ? parseInt(collection.batchIntervalDays.value, 10) : null,
  }
}

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  descriptionHtml?: string
  handle: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice?: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
        width: number
        height: number
      }
    }>
  }
  variants: {
    edges: Array<{
      node: ShopifyVariant
    }>
  }
  options?: Array<{
    id: string
    name: string
    values: string[]
  }>
}

export interface ShopifyVariant {
  id: string
  title: string
  price: {
    amount: string
    currencyCode: string
  }
  availableForSale: boolean
  selectedOptions: Array<{
    name: string
    value: string
  }>
}
