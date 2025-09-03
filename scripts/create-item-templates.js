const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createItemTemplatesFromJobItems() {
  console.log('🔄 Creating ItemTemplates from existing JobItems...');

  try {
    // Get all existing JobItems with their product, variant, and job information
    const jobItems = await prisma.jobItem.findMany({
      include: {
        product: true,
        variant: true,
        job: {
          include: {
            customer: true
          }
        },
        sizeBreakdown: true,
        placements: true
      }
    });

    if (jobItems.length === 0) {
      console.log('ℹ️  No JobItems found. Nothing to migrate.');
      return;
    }

    console.log(`📦 Found ${jobItems.length} JobItems to process`);

    // Group JobItems by customer and create unique item templates
    const itemTemplateMap = new Map();
    
    for (const jobItem of jobItems) {
      // Skip if already has an itemTemplate
      if (jobItem.itemTemplateId) {
        console.log(`⏭️  JobItem ${jobItem.id} already has itemTemplateId, skipping`);
        continue;
      }

      const customerId = jobItem.job.customerId;
      const productId = jobItem.productId;
      const variantId = jobItem.variantId;
      
      // Create a unique key for this item template
      const templateKey = `${customerId}-${productId}-${variantId}`;
      
      if (!itemTemplateMap.has(templateKey)) {
        // Generate a meaningful name for the item
        const productName = jobItem.product.name;
        const variantName = jobItem.variant?.name || '';
        const customerName = jobItem.job.customer.name;
        
        // Create a name like "Test Company Staff Shirts" or "Acme Corp Hoodies (Black)"
        let itemName;
        if (productName.toLowerCase().includes('t-shirt') || productName.toLowerCase().includes('tee')) {
          itemName = `${customerName} Staff Shirts`;
        } else if (productName.toLowerCase().includes('hoodie')) {
          itemName = `${customerName} Hoodies`;
        } else if (productName.toLowerCase().includes('polo')) {
          itemName = `${customerName} Polo Shirts`;
        } else if (productName.toLowerCase().includes('hat')) {
          itemName = `${customerName} Hats`;
        } else if (productName.toLowerCase().includes('tote')) {
          itemName = `${customerName} Tote Bags`;
        } else {
          itemName = `${customerName} ${productName}`;
        }

        // Add variant name if it exists and isn't generic
        if (variantName && !['Default', 'Standard'].includes(variantName)) {
          itemName += ` (${variantName})`;
        }

        // Store the template info
        itemTemplateMap.set(templateKey, {
          customerId,
          productId,
          variantId,
          name: itemName,
          description: `${productName} ${variantName ? `in ${variantName}` : ''}`.trim(),
          relatedJobItems: []
        });
      }
      
      // Add this job item to the template's related items
      itemTemplateMap.get(templateKey).relatedJobItems.push(jobItem);
    }

    console.log(`📋 Will create ${itemTemplateMap.size} unique ItemTemplates`);

    let createdCount = 0;
    let updatedJobItemsCount = 0;

    // Create ItemTemplates and update JobItems
    for (const [templateKey, templateData] of itemTemplateMap.entries()) {
      const relatedJobItems = templateData.relatedJobItems;
      
      // Calculate statistics
      const timesOrdered = relatedJobItems.length;
      const totalQuantityOrdered = relatedJobItems.reduce((sum, item) => sum + item.quantity, 0);
      const lastOrderedAt = relatedJobItems
        .map(item => item.createdAt)
        .sort((a, b) => b.getTime() - a.getTime())[0];

      // Get standard size breakdown from the most recent order
      const recentJobItem = relatedJobItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      const standardSizes = {};
      
      if (recentJobItem.sizeBreakdown && recentJobItem.sizeBreakdown.length > 0) {
        for (const sizeBreakdown of recentJobItem.sizeBreakdown) {
          standardSizes[sizeBreakdown.size] = sizeBreakdown.quantity;
        }
      }

      try {
        // Check if template with this name already exists for the customer
        const existingTemplate = await prisma.itemTemplate.findFirst({
          where: {
            customerId: templateData.customerId,
            name: templateData.name
          }
        });

        let itemTemplate;
        
        if (existingTemplate) {
          console.log(`📝 Updating existing ItemTemplate: ${templateData.name}`);
          itemTemplate = await prisma.itemTemplate.update({
            where: { id: existingTemplate.id },
            data: {
              timesOrdered,
              lastOrderedAt,
              standardSizes: Object.keys(standardSizes).length > 0 ? standardSizes : null,
              description: templateData.description
            }
          });
        } else {
          console.log(`✨ Creating new ItemTemplate: ${templateData.name}`);
          itemTemplate = await prisma.itemTemplate.create({
            data: {
              customerId: templateData.customerId,
              productId: templateData.productId,
              variantId: templateData.variantId,
              name: templateData.name,
              description: templateData.description,
              standardSizes: Object.keys(standardSizes).length > 0 ? standardSizes : null,
              timesOrdered,
              lastOrderedAt
            }
          });
          createdCount++;
        }

        // Update all related JobItems to link to this template
        const jobItemIds = relatedJobItems.map(item => item.id);
        await prisma.jobItem.updateMany({
          where: {
            id: { in: jobItemIds }
          },
          data: {
            itemTemplateId: itemTemplate.id
          }
        });

        updatedJobItemsCount += jobItemIds.length;
        console.log(`🔗 Linked ${jobItemIds.length} JobItems to ItemTemplate: ${templateData.name}`);

      } catch (error) {
        console.error(`❌ Error creating/updating ItemTemplate for ${templateData.name}:`, error);
        console.error(error.stack);
      }
    }

    console.log(`✅ Migration completed!`);
    console.log(`📊 Results:`);
    console.log(`   - Created: ${createdCount} new ItemTemplates`);
    console.log(`   - Updated: ${updatedJobItemsCount} JobItems with itemTemplateId`);
    console.log(`   - Total templates: ${itemTemplateMap.size}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function main() {
  await createItemTemplatesFromJobItems();
}

main()
  .then(async () => {
    console.log('🎉 Script completed successfully!');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('💥 Script failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });