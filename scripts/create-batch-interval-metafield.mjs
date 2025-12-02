/**
 * One-time script to create the batch_interval_days metafield definition in Shopify
 *
 * Run with: node scripts/create-batch-interval-metafield.mjs
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const SHOP_DOMAIN = '7dsbxj-tf.myshopify.com'

async function createMetafieldDefinition() {
  if (!SHOPIFY_ADMIN_API_TOKEN) {
    console.error('Error: SHOPIFY_ADMIN_API_TOKEN environment variable is not set')
    process.exit(1)
  }

  const query = `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
          namespace
          key
          type {
            name
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    definition: {
      name: 'Batch Interval Days',
      namespace: 'drop_shop',
      key: 'batch_interval_days',
      description: 'How often to create a batch for ongoing shops (in days). E.g., 7 = weekly batching.',
      type: 'number_integer',
      ownerType: 'COLLECTION',
      pin: true,
      validations: [
        {
          name: 'min',
          value: '1'
        },
        {
          name: 'max',
          value: '365'
        }
      ]
    }
  }

  try {
    const response = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    })

    const result = await response.json()

    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
      process.exit(1)
    }

    const { createdDefinition, userErrors } = result.data.metafieldDefinitionCreate

    if (userErrors && userErrors.length > 0) {
      console.error('User errors:', userErrors)
      process.exit(1)
    }

    console.log('Successfully created metafield definition:')
    console.log(JSON.stringify(createdDefinition, null, 2))
  } catch (error) {
    console.error('Error creating metafield definition:', error)
    process.exit(1)
  }
}

createMetafieldDefinition()
