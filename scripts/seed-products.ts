import { PrismaClient, ProductCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('Seeding products and decoration methods...');

  // Create decoration methods
  const screenPrint = await prisma.decorationMethod.upsert({
    where: { name: 'screen_print' },
    update: {},
    create: {
      name: 'screen_print',
      displayName: 'Screen Print',
      description: 'Traditional screen printing with vibrant colors and durability',
      isActive: true,
      defaultMinWidth: 4,
      defaultMaxWidth: 14,
      defaultMinHeight: 4,
      defaultMaxHeight: 16,
      colorOptions: ['White', 'Black', 'Navy', 'Red', 'Green', 'Yellow', 'Orange', 'Purple'],
      hasColorLimitations: true,
      maxColors: 6,
      baseSetupCost: 25,
      perColorCost: 15,
      perUnitCost: 2.50,
      estimatedTurnaround: 7,
    },
  });

  const embroidery = await prisma.decorationMethod.upsert({
    where: { name: 'embroidery' },
    update: {},
    create: {
      name: 'embroidery',
      displayName: 'Embroidery',
      description: 'Professional embroidered designs with premium appearance',
      isActive: true,
      defaultMinWidth: 2,
      defaultMaxWidth: 5,
      defaultMinHeight: 2,
      defaultMaxHeight: 4,
      colorOptions: [],
      hasColorLimitations: false,
      baseSetupCost: 50,
      perColorCost: 0,
      perUnitCost: 4.00,
      estimatedTurnaround: 10,
    },
  });

  const htv = await prisma.decorationMethod.upsert({
    where: { name: 'htv' },
    update: {},
    create: {
      name: 'htv',
      displayName: 'Heat Transfer Vinyl',
      description: 'Versatile vinyl application with various finishes',
      isActive: true,
      defaultMinWidth: 2,
      defaultMaxWidth: 12,
      defaultMinHeight: 2,
      defaultMaxHeight: 16,
      colorOptions: ['White', 'Black', 'Red', 'Navy', 'Gold', 'Silver', 'Metallic'],
      hasColorLimitations: false,
      baseSetupCost: 10,
      perColorCost: 5,
      perUnitCost: 1.75,
      estimatedTurnaround: 3,
    },
  });

  // Create sample products
  const tshirt = await prisma.product.upsert({
    where: { sku: 'TS-001-BASIC' },
    update: {},
    create: {
      sku: 'TS-001-BASIC',
      name: 'Basic Cotton T-Shirt',
      category: ProductCategory.TOPS,
      brand: 'Gildan',
      basePrice: 8.50,
      currentPrice: 8.50,
      isActive: true,
    },
  });

  const hoodie = await prisma.product.upsert({
    where: { sku: 'HD-001-BASIC' },
    update: {},
    create: {
      sku: 'HD-001-BASIC',
      name: 'Pullover Hoodie',
      category: ProductCategory.TOPS,
      brand: 'Gildan',
      basePrice: 24.00,
      currentPrice: 22.50,
      isActive: true,
    },
  });

  const cap = await prisma.product.upsert({
    where: { sku: 'CAP-001-FITTED' },
    update: {},
    create: {
      sku: 'CAP-001-FITTED',
      name: 'Fitted Baseball Cap',
      category: ProductCategory.HEADWEAR,
      brand: 'Flexfit',
      basePrice: 12.00,
      currentPrice: 12.00,
      isActive: true,
    },
  });

  const beanie = await prisma.product.upsert({
    where: { sku: 'BN-001-KNIT' },
    update: {},
    create: {
      sku: 'BN-001-KNIT',
      name: 'Knit Beanie',
      category: ProductCategory.HEADWEAR,
      brand: 'Yupoong',
      basePrice: 8.00,
      currentPrice: 8.00,
      isActive: true,
    },
  });

  const tote = await prisma.product.upsert({
    where: { sku: 'BAG-001-TOTE' },
    update: {},
    create: {
      sku: 'BAG-001-TOTE',
      name: 'Canvas Tote Bag',
      category: ProductCategory.ACCESSORIES,
      brand: 'Liberty Bags',
      basePrice: 6.50,
      currentPrice: 6.50,
      isActive: true,
    },
  });

  // Create decoration compatibilities
  const compatibilities = [
    // T-shirt compatibilities
    { productId: tshirt.id, decorationMethodId: screenPrint.id, isRecommended: true },
    { productId: tshirt.id, decorationMethodId: htv.id, isRecommended: false },
    
    // Hoodie compatibilities
    { productId: hoodie.id, decorationMethodId: screenPrint.id, isRecommended: true },
    { productId: hoodie.id, decorationMethodId: embroidery.id, isRecommended: true },
    { productId: hoodie.id, decorationMethodId: htv.id, isRecommended: false },
    
    // Cap compatibilities
    { productId: cap.id, decorationMethodId: embroidery.id, isRecommended: true },
    { productId: cap.id, decorationMethodId: htv.id, isRecommended: false },
    
    // Beanie compatibilities (embroidery only)
    { productId: beanie.id, decorationMethodId: embroidery.id, isRecommended: true },
    
    // Tote bag compatibilities
    { productId: tote.id, decorationMethodId: screenPrint.id, isRecommended: true },
    { productId: tote.id, decorationMethodId: htv.id, isRecommended: true },
  ];

  for (const comp of compatibilities) {
    await prisma.decorationCompatibility.upsert({
      where: {
        decorationMethodId_productId: {
          decorationMethodId: comp.decorationMethodId,
          productId: comp.productId,
        },
      },
      update: {},
      create: comp,
    });
  }

  console.log('✓ Products and decoration methods seeded successfully');
}

seedProducts()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });