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

// Type definitions
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
