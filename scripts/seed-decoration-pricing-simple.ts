import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDecorationPricingSimple() {
  console.log('🎨 Seeding simplified decoration product pricing...');

  // 1. Create key size ranges
  const standardGangSheet = await prisma.sizeRange.create({
    data: {
      name: 'Standard Gang Sheet 11.25" x 14"',
      minWidth: 11.25,
      maxWidth: 11.25,
      minHeight: 14,
      maxHeight: 14,
      calculationMethod: 'AREA',
      description: 'Standard gang sheet for screen printed transfers'
    }
  });

  const smallPatch = await prisma.sizeRange.create({
    data: {
      name: 'Up to 2.50"',
      maxWidth: 2.50,
      maxHeight: 2.50,
      calculationMethod: 'AVERAGE',
      description: 'Small patches up to 2.50 inches'
    }
  });

  console.log('📏 Created size ranges');

  // 2. Create categories
  const screenPrintCategory = await prisma.decorationCategory.upsert({
    where: { name: 'screen_print_transfers' },
    update: {},
    create: {
      name: 'screen_print_transfers',
      displayName: 'Screen Print Transfers',
      description: 'Screen printed transfers with gang sheet pricing',
      typicalPricingModel: 'COLOR_QUANTITY',
      defaultSizeMethod: 'AREA'
    }
  });

  const patchesCategory = await prisma.decorationCategory.upsert({
    where: { name: 'embroidered_patches' },
    update: {},
    create: {
      name: 'embroidered_patches',
      displayName: 'Embroidered Patches',
      description: 'Custom embroidered patches',
      typicalPricingModel: 'SIZE_QUANTITY',
      defaultSizeMethod: 'AVERAGE'
    }
  });

  console.log('📂 Created categories');

  // 3. Create vendors
  const transferExpressVendor = await prisma.decorationVendor.upsert({
    where: { name: 'transfer_express' },
    update: {},
    create: {
      name: 'transfer_express',
      displayName: 'Transfer Express',
      rushServiceAvailable: true,
      rushServiceRate: 25.00,
      artProofFee: 26.00
    }
  });

  const stahlsVendor = await prisma.decorationVendor.upsert({
    where: { name: 'stahls' },
    update: {},
    create: {
      name: 'stahls',
      displayName: 'Stahls',
      artProofFee: 15.00
    }
  });

  console.log('🏢 Created vendors');

  // 4. Create products with sample pricing
  const screenPrintProduct = await prisma.decorationProduct.create({
    data: {
      categoryId: screenPrintCategory.id,
      vendorId: transferExpressVendor.id,
      name: 'screen_print_vector_standard',
      displayName: 'Screen Print - Vector Artwork',
      description: 'Standard screen printed transfers using vector artwork',
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: true,
      hasSizePricing: true,
      colorPricingType: 'PER_COLOR',
      minimumQuantity: 6
    }
  });

  // Sample pricing - just a few key points
  const samplePricing = [
    { minQty: 6, maxQty: 23, price: 7.19, colors: 1 },
    { minQty: 24, maxQty: 99, price: 4.51, colors: 1 },
    { minQty: 100, maxQty: null, price: 2.31, colors: 1 },
    { minQty: 6, maxQty: 23, price: 13.03, colors: 2 },
    { minQty: 24, maxQty: 99, price: 8.26, colors: 2 },
    { minQty: 100, maxQty: null, price: 4.08, colors: 2 }
  ];

  for (const pricing of samplePricing) {
    await prisma.decorationProductPricing.create({
      data: {
        decorationProductId: screenPrintProduct.id,
        minQuantity: pricing.minQty,
        maxQuantity: pricing.maxQty,
        sizeRangeId: standardGangSheet.id,
        colorCount: pricing.colors,
        artworkType: 'VECTOR',
        unitPrice: pricing.price
      }
    });
  }

  const patchProduct = await prisma.decorationProduct.create({
    data: {
      categoryId: patchesCategory.id,
      vendorId: stahlsVendor.id,
      name: 'embroidered_patches_standard',
      displayName: 'Custom Embroidered Patches',
      description: 'Custom embroidered patches with quantity pricing',
      pricingType: 'QUANTITY_BREAKS',
      hasSizePricing: true,
      artSetupFee: 30.00,
      sampleFee: 15.00,
      minimumQuantity: 12
    }
  });

  // Sample patch pricing
  const patchPricing = [
    { minQty: 12, maxQty: 49, price: 4.66 },
    { minQty: 50, maxQty: 199, price: 2.61 },
    { minQty: 200, maxQty: null, price: 1.35 }
  ];

  for (const pricing of patchPricing) {
    await prisma.decorationProductPricing.create({
      data: {
        decorationProductId: patchProduct.id,
        minQuantity: pricing.minQty,
        maxQuantity: pricing.maxQty,
        sizeRangeId: smallPatch.id,
        unitPrice: pricing.price
      }
    });
  }

  console.log('✅ Simplified decoration product pricing seed completed!');
  console.log('📊 Created sample products with quantity break pricing');
}

async function main() {
  try {
    await seedDecorationPricingSimple();
  } catch (error) {
    console.error('❌ Error seeding decoration pricing:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();