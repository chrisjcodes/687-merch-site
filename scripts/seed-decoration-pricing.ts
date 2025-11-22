import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDecorationPricing() {
  console.log('🎨 Seeding comprehensive decoration product pricing...');

  // 1. Create Size Ranges
  const sizeRanges = await Promise.all([
    // Patches size ranges
    prisma.sizeRange.create({
      data: {
        name: 'Up to 1.50"',
        maxWidth: 1.50,
        maxHeight: 1.50,
        calculationMethod: 'AVERAGE',
        description: 'Small patches up to 1.50 inches'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: '1.51" - 2.00"',
        minWidth: 1.51,
        maxWidth: 2.00,
        minHeight: 1.51,
        maxHeight: 2.00,
        calculationMethod: 'AVERAGE',
        description: 'Medium-small patches 1.51 to 2.00 inches'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: '2.01" - 2.50"',
        minWidth: 2.01,
        maxWidth: 2.50,
        minHeight: 2.01,
        maxHeight: 2.50,
        calculationMethod: 'AVERAGE',
        description: 'Medium patches 2.01 to 2.50 inches'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: '2.51" - 3.00"',
        minWidth: 2.51,
        maxWidth: 3.00,
        minHeight: 2.51,
        maxHeight: 3.00,
        calculationMethod: 'AVERAGE',
        description: 'Medium-large patches 2.51 to 3.00 inches'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: '3.01" - 3.50"',
        minWidth: 3.01,
        maxWidth: 3.50,
        minHeight: 3.01,
        maxHeight: 3.50,
        calculationMethod: 'AVERAGE',
        description: 'Large patches 3.01 to 3.50 inches'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: '3.51" - 4.00"',
        minWidth: 3.51,
        maxWidth: 4.00,
        minHeight: 3.51,
        maxHeight: 4.00,
        calculationMethod: 'AVERAGE',
        description: 'Extra large patches 3.51 to 4.00 inches'
      }
    }),
    // Transfer size ranges
    prisma.sizeRange.create({
      data: {
        name: 'Standard Gang Sheet 11.25" x 14"',
        minWidth: 11.25,
        maxWidth: 11.25,
        minHeight: 14,
        maxHeight: 14,
        calculationMethod: 'AREA',
        description: 'Standard gang sheet for screen printed transfers'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: 'Jumbo Gang Sheet 12.5" x 17.5"',
        minWidth: 12.5,
        maxWidth: 12.5,
        minHeight: 17.5,
        maxHeight: 17.5,
        calculationMethod: 'AREA',
        description: 'Jumbo gang sheet for screen printed transfers'
      }
    }),
    prisma.sizeRange.create({
      data: {
        name: 'Hybrid Transfer 11.7" x 11.7"',
        minWidth: 11.7,
        maxWidth: 11.7,
        minHeight: 11.7,
        maxHeight: 11.7,
        calculationMethod: 'AREA',
        description: 'Standard hybrid transfer size'
      }
    })
  ]);

  console.log('📏 Created size ranges');

  // 2. Create Decoration Categories
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

  const hybridTransfersCategory = await prisma.decorationCategory.upsert({
    where: { name: 'hybrid_transfers' },
    update: {},
    create: {
      name: 'hybrid_transfers',
      displayName: 'Hybrid Transfers',
      description: 'Digital hybrid transfers with quantity breaks',
      typicalPricingModel: 'COLOR_QUANTITY',
      defaultSizeMethod: 'AREA'
    }
  });

  const leatherPatchesCategory = await prisma.decorationCategory.upsert({
    where: { name: 'leather_patches' },
    update: {},
    create: {
      name: 'leather_patches',
      displayName: 'Leather Patches',
      description: 'Custom leather patches with size-based pricing',
      typicalPricingModel: 'SIZE_QUANTITY',
      defaultSizeMethod: 'AVERAGE'
    }
  });

  const embroideredPatchesCategory = await prisma.decorationCategory.upsert({
    where: { name: '3d_embroidered_patches' },
    update: {},
    create: {
      name: '3d_embroidered_patches',
      displayName: '3D Embroidered Patches',
      description: '3D embroidered patches with multi-color threading',
      typicalPricingModel: 'SIZE_QUANTITY',
      defaultSizeMethod: 'AVERAGE'
    }
  });

  console.log('📂 Created decoration categories');

  // 3. Create Decoration Vendors
  const transferExpressVendor = await prisma.decorationVendor.upsert({
    where: { name: 'transfer_express' },
    update: {},
    create: {
      name: 'transfer_express',
      displayName: 'Transfer Express',
      contactInfo: {
        phone: '1-800-622-2280',
        email: 'Info@TransferExpress.com',
        address: '7650 Tyler Blvd. Mentor, OH 44060'
      },
      rushServiceAvailable: true,
      rushServiceRate: 25.00,
      colorMatchFee: 40.00,
      artProofFee: 26.00
    }
  });

  const stahlsVendor = await prisma.decorationVendor.upsert({
    where: { name: 'stahls' },
    update: {},
    create: {
      name: 'stahls',
      displayName: 'Stahls',
      contactInfo: {
        phone: '800.478.2457',
        website: 'www.stahls.com'
      },
      rushServiceAvailable: false,
      artProofFee: 15.00
    }
  });

  console.log('🏢 Created decoration vendors');

  // 4. Create Screen Print Transfer Products with Comprehensive Pricing
  
  // Transfer Express - Screen Print Standard (Vector)
  const screenPrintStandardVector = await prisma.decorationProduct.create({
    data: {
      categoryId: screenPrintCategory.id,
      vendorId: transferExpressVendor.id,
      name: 'screen_print_standard_vector',
      displayName: 'Screen Print Standard - Vector Artwork',
      description: 'Standard gang sheet screen printed transfers using customer vector artwork',
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: true,
      hasArtworkPricing: true,
      hasSizePricing: true,
      colorPricingType: 'PER_COLOR',
      artSetupFee: 0.00, // No setup fee for transfers
      minimumQuantity: 6
    }
  });

  // Create pricing for Standard Gang Sheet Vector (11.25" x 14")
  const standardGangSheetRange = sizeRanges.find(r => r.name === 'Standard Gang Sheet 11.25" x 14"');
  
  // 1 Color Vector Pricing for Standard Gang Sheet
  const vectorPricing1Color = [
    { minQty: 6, maxQty: 11, price: 13.31 },
    { minQty: 12, maxQty: 17, price: 7.19 },
    { minQty: 18, maxQty: 23, price: 5.35 },
    { minQty: 24, maxQty: 35, price: 4.51 },
    { minQty: 36, maxQty: 47, price: 3.93 },
    { minQty: 48, maxQty: 59, price: 3.21 },
    { minQty: 60, maxQty: 71, price: 2.97 },
    { minQty: 72, maxQty: 89, price: 2.71 },
    { minQty: 90, maxQty: 107, price: 2.51 },
    { minQty: 108, maxQty: 143, price: 2.31 },
    { minQty: 144, maxQty: 179, price: 1.90 },
    { minQty: 180, maxQty: 215, price: 1.82 },
    { minQty: 216, maxQty: 251, price: 1.71 },
    { minQty: 252, maxQty: null, price: 1.68 } // 252+
  ];

  for (const pricing of vectorPricing1Color) {
    await prisma.decorationProductPricing.create({
      data: {
        decorationProductId: screenPrintStandardVector.id,
        minQuantity: pricing.minQty,
        maxQuantity: pricing.maxQty,
        sizeRangeId: standardGangSheetRange?.id,
        colorCount: 1,
        artworkType: 'VECTOR',
        variantType: 'STANDARD',
        unitPrice: pricing.price
      }
    });
  }

  // 2 Color Vector Pricing
  const vectorPricing2Color = [
    { minQty: 6, maxQty: 11, price: 24.38 },
    { minQty: 12, maxQty: 17, price: 13.03 },
    { minQty: 18, maxQty: 23, price: 9.72 },
    { minQty: 24, maxQty: 35, price: 8.26 },
    { minQty: 36, maxQty: 47, price: 6.92 },
    { minQty: 48, maxQty: 59, price: 5.65 },
    { minQty: 60, maxQty: 71, price: 5.19 },
    { minQty: 72, maxQty: 89, price: 4.73 },
    { minQty: 90, maxQty: 107, price: 4.40 },
    { minQty: 108, maxQty: 143, price: 4.08 },
    { minQty: 144, maxQty: 179, price: 3.57 },
    { minQty: 180, maxQty: 215, price: 3.37 },
    { minQty: 216, maxQty: 251, price: 3.14 },
    { minQty: 252, maxQty: null, price: 2.98 }
  ];

  for (const pricing of vectorPricing2Color) {
    await prisma.decorationProductPricing.create({
      data: {
        decorationProductId: screenPrintStandardVector.id,
        minQuantity: pricing.minQty,
        maxQuantity: pricing.maxQty,
        sizeRangeId: standardGangSheetRange?.id,
        colorCount: 2,
        artworkType: 'VECTOR',
        variantType: 'STANDARD',
        unitPrice: pricing.price
      }
    });
  }

  console.log('🎨 Created screen print standard vector pricing');

  // 5. Create Hybrid Transfer Products
  
  // Transfer Express - Hybrid Multi-color
  const hybridMulticolor = await prisma.decorationProduct.create({
    data: {
      categoryId: hybridTransfersCategory.id,
      vendorId: transferExpressVendor.id,
      name: 'hybrid_multicolor_11_7',
      displayName: 'Hybrid Multicolor Transfer 11.7"x11.7"',
      description: 'Multicolor hybrid transfers with quantity break pricing',
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: false, // Multicolor is flat rate
      hasSizePricing: true,
      colorPricingType: 'FLAT_MULTI',
      minimumQuantity: 10
    }
  });

  const hybridSizeRange = sizeRanges.find(r => r.name === 'Hybrid Transfer 11.7" x 11.7"');
  
  const hybridMulticolorPricing = [
    { minQty: 10, maxQty: 19, price: 7.58 },
    { minQty: 20, maxQty: 49, price: 6.31 },
    { minQty: 50, maxQty: 99, price: 5.00 },
    { minQty: 100, maxQty: 199, price: 3.47 },
    { minQty: 200, maxQty: 299, price: 2.87 },
    { minQty: 300, maxQty: 499, price: 2.64 },
    { minQty: 500, maxQty: 999, price: 2.49 },
    { minQty: 1000, maxQty: 2499, price: 2.37 },
    { minQty: 2500, maxQty: 4999, price: 2.31 },
    { minQty: 5000, maxQty: null, price: 2.24 }
  ];

  for (const pricing of hybridMulticolorPricing) {
    await prisma.decorationProductPricing.create({
      data: {
        decorationProductId: hybridMulticolor.id,
        minQuantity: pricing.minQty,
        maxQuantity: pricing.maxQty,
        sizeRangeId: hybridSizeRange?.id,
        colorType: 'MULTI',
        unitPrice: pricing.price
      }
    });
  }

  // Single color hybrid version
  const hybridSingleColor = await prisma.decorationProduct.create({
    data: {
      categoryId: hybridTransfersCategory.id,
      vendorId: transferExpressVendor.id,
      name: 'hybrid_single_color_11_7',
      displayName: 'Hybrid Single Color Transfer 11.7"x11.7"',
      description: 'Single color hybrid transfers with quantity break pricing',
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: true,
      hasSizePricing: true,
      colorPricingType: 'PER_COLOR',
      minimumQuantity: 10
    }
  });

  const hybridSingleColorPricing = [
    { minQty: 10, maxQty: 19, price: 4.54 },
    { minQty: 20, maxQty: 49, price: 3.79 },
    { minQty: 50, maxQty: 99, price: 3.01 },
    { minQty: 100, maxQty: 199, price: 2.08 },
    { minQty: 200, maxQty: 299, price: 1.73 },
    { minQty: 300, maxQty: 499, price: 1.58 },
    { minQty: 500, maxQty: 999, price: 1.49 },
    { minQty: 1000, maxQty: 2499, price: 1.42 },
    { minQty: 2500, maxQty: 4999, price: 1.38 },
    { minQty: 5000, maxQty: null, price: 1.34 }
  ];

  for (const pricing of hybridSingleColorPricing) {
    await prisma.decorationProductPricing.create({
      data: {
        decorationProductId: hybridSingleColor.id,
        minQuantity: pricing.minQty,
        maxQuantity: pricing.maxQty,
        sizeRangeId: hybridSizeRange?.id,
        colorCount: 1,
        colorType: 'SINGLE',
        unitPrice: pricing.price
      }
    });
  }

  console.log('🎨 Created hybrid transfer pricing');

  // 6. Create Leather Patches
  const leatherPatches = await prisma.decorationProduct.create({
    data: {
      categoryId: leatherPatchesCategory.id,
      vendorId: stahlsVendor.id,
      name: 'leather_patches_standard',
      displayName: 'Custom Leather Patches',
      description: 'Custom leather patches with heat applied or pressure sensitive backing',
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: false, // Single color only
      hasSizePricing: true,
      colorPricingType: 'INCLUSIVE',
      artSetupFee: 30.00,
      sampleFee: 15.00,
      editFee: 25.00,
      minimumQuantity: 12
    }
  });

  // Create leather patch pricing for all size ranges
  const leatherPatchSizes = sizeRanges.filter(r => r.name.includes('"') && !r.name.includes('Gang') && !r.name.includes('Hybrid'));
  
  const leatherPatchQuantityPricing = {
    '12-24': [5.02, 5.60, 6.30, 6.97, 7.54, 8.22],
    '25-49': [4.18, 4.67, 5.25, 5.81, 6.28, 6.85],
    '50-99': [2.64, 3.17, 3.80, 4.67, 5.25, 5.52],
    '100-249': [1.91, 2.43, 3.24, 3.77, 3.90, 4.18],
    '250-499': [1.46, 1.98, 2.81, 2.99, 3.15, 3.53],
    '500-999': [1.32, 1.84, 2.20, 2.36, 2.47, 2.88],
    '1000-2499': [1.25, 1.77, 1.98, 2.15, 2.28, 2.57],
    '2500-4999': [1.18, 1.74, 1.77, 1.86, 1.98, 2.28],
    '5000-9999': [1.15, 1.63, 1.70, 1.77, 1.91, 2.17],
    '10000+': [1.07, 1.56, 1.60, 1.70, 1.81, 2.05]
  };

  const quantityRanges = [
    { name: '12-24', min: 12, max: 24 },
    { name: '25-49', min: 25, max: 49 },
    { name: '50-99', min: 50, max: 99 },
    { name: '100-249', min: 100, max: 249 },
    { name: '250-499', min: 250, max: 499 },
    { name: '500-999', min: 500, max: 999 },
    { name: '1000-2499', min: 1000, max: 2499 },
    { name: '2500-4999', min: 2500, max: 4999 },
    { name: '5000-9999', min: 5000, max: 9999 },
    { name: '10000+', min: 10000, max: null }
  ];

  for (const qtyRange of quantityRanges) {
    const prices = leatherPatchQuantityPricing[qtyRange.name];
    for (let i = 0; i < leatherPatchSizes.length; i++) {
      await prisma.decorationProductPricing.create({
        data: {
          decorationProductId: leatherPatches.id,
          minQuantity: qtyRange.min,
          maxQuantity: qtyRange.max,
          sizeRangeId: leatherPatchSizes[i].id,
          unitPrice: prices[i]
        }
      });
    }
  }

  console.log('🧥 Created leather patches pricing');

  // 7. Create 3D Embroidered Patches
  const embroideredPatches = await prisma.decorationProduct.create({
    data: {
      categoryId: embroideredPatchesCategory.id,
      vendorId: stahlsVendor.id,
      name: '3d_embroidered_patches_standard',
      displayName: '3D Embroidered Patches',
      description: '3D embroidered patches with up to 6 colors of thread included',
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: false, // Up to 6 colors included
      hasSizePricing: true,
      colorPricingType: 'INCLUSIVE',
      maxColors: 6,
      artSetupFee: 30.00,
      sampleFee: 15.00,
      editFee: 20.00,
      minimumQuantity: 12
    }
  });

  // Add size range for up to 1" (for embroidered patches)
  const embroideredSizeRange = await prisma.sizeRange.create({
    data: {
      name: 'Up to 1"',
      maxWidth: 1.00,
      maxHeight: 1.00,
      calculationMethod: 'AVERAGE',
      description: 'Extra small patches up to 1 inch'
    }
  });

  const embroideredSizes = [embroideredSizeRange, ...leatherPatchSizes];

  const embroideredQuantityPricing = {
    '12-24': [3.13, 4.66, 6.20, 7.76, 9.28, 10.87, 12.41],
    '25-49': [2.61, 3.88, 5.17, 6.47, 7.73, 9.06, 10.34],
    '50-99': [1.71, 2.61, 3.45, 4.33, 5.17, 6.02, 6.89],
    '100-199': [1.29, 1.90, 2.54, 3.19, 3.83, 4.48, 5.08],
    '200-299': [0.91, 1.35, 1.71, 2.25, 2.67, 3.14, 3.59],
    '300-499': [0.78, 1.16, 1.56, 1.94, 2.34, 2.70, 3.10],
    '500-999': [0.66, 0.99, 1.31, 1.63, 1.95, 2.27, 2.64],
    '1000-1999': [0.58, 0.89, 1.18, 1.47, 1.75, 2.02, 2.36],
    '2000-4999': [0.51, 0.78, 1.04, 1.29, 1.56, 1.80, 2.08],
    '5000-9999': [0.48, 0.72, 0.97, 1.19, 1.44, 1.69, 1.94],
    '10000+': [0.44, 0.65, 0.85, 1.06, 1.29, 1.50, 1.71]
  };

  const embroideredQuantityRanges = [
    { name: '12-24', min: 12, max: 24 },
    { name: '25-49', min: 25, max: 49 },
    { name: '50-99', min: 50, max: 99 },
    { name: '100-199', min: 100, max: 199 },
    { name: '200-299', min: 200, max: 299 },
    { name: '300-499', min: 300, max: 499 },
    { name: '500-999', min: 500, max: 999 },
    { name: '1000-1999', min: 1000, max: 1999 },
    { name: '2000-4999', min: 2000, max: 4999 },
    { name: '5000-9999', min: 5000, max: 9999 },
    { name: '10000+', min: 10000, max: null }
  ];

  for (const qtyRange of embroideredQuantityRanges) {
    const prices = embroideredQuantityPricing[qtyRange.name];
    for (let i = 0; i < embroideredSizes.length; i++) {
      await prisma.decorationProductPricing.create({
        data: {
          decorationProductId: embroideredPatches.id,
          minQuantity: qtyRange.min,
          maxQuantity: qtyRange.max,
          sizeRangeId: embroideredSizes[i].id,
          colorType: 'UNLIMITED',
          unitPrice: prices[i]
        }
      });
    }
  }

  console.log('🪡 Created 3D embroidered patches pricing');

  console.log('✅ Comprehensive decoration product pricing seed completed!');
  console.log('📊 Summary:');
  console.log('- 4 decoration categories created');
  console.log('- 2 vendors created');
  console.log('- 5 decoration products created');
  console.log('- 10+ size ranges created');
  console.log('- 500+ individual pricing records created');
}

async function main() {
  try {
    await seedDecorationPricing();
  } catch (error) {
    console.error('❌ Error seeding decoration pricing:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();