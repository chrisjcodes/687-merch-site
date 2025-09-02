const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with new schema...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'info@687merch.com' },
    update: {},
    create: {
      email: 'info@687merch.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create employees
  const designer = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP-001',
      name: 'Sarah Designer',
      email: 'sarah@687merch.com',
      role: 'DESIGNER',
      hourlyRate: 25.00,
      userId: adminUser.id,
    },
  });

  const printer = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP-002',
      name: 'Test Printer',
      email: 'test_printer1@687merch.com',
      role: 'PRINT_OPERATOR',
      hourlyRate: 22.00,
    },
  });

  const fulfillment = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP-003',
      name: 'Lisa Fulfillment',
      email: 'lisa@687merch.com',
      role: 'FULFILLMENT',
      hourlyRate: 18.00,
    },
  });

  console.log('👥 Created employees:', designer.name, printer.name, fulfillment.name);

  // Create product catalog based on NewJobForm items
  const products = await prisma.$transaction([
    // T-Shirts
    prisma.product.create({
      data: {
        sku: 'GILDAN-64000',
        name: 'Gildan 64000 Softstyle T-Shirt',
        category: 'TOPS',
        brand: 'Gildan',
        basePrice: 3.50,
        currentPrice: 3.50,
        sizeSystem: 'APPAREL',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
        decorationMethods: ['HTV', 'HYBRID_DTF', 'SCREEN_PRINT_DTF', 'ADHESIVE_PATCH'],
        material: '100% Cotton',
        variants: {
          create: [
            { name: 'Black', sku: 'GILDAN-64000-BLACK', colorHex: '#000000' },
            { name: 'White', sku: 'GILDAN-64000-WHITE', colorHex: '#FFFFFF' },
            { name: 'Navy', sku: 'GILDAN-64000-NAVY', colorHex: '#000080' },
            { name: 'Heather Gray', sku: 'GILDAN-64000-HGRAY', colorHex: '#808080' },
          ]
        },
        placementAnchors: {
          create: [
            { 
              name: 'Collar Center', 
              description: 'Center point of collar seam', 
              anchorType: 'COLLAR',
              maxOffsetUp: 2.0,
              maxOffsetDown: 12.0,
              maxOffsetLeft: 6.0,
              maxOffsetRight: 6.0,
              maxDesignWidth: 12.0,
              maxDesignHeight: 16.0,
              minDesignWidth: 4.0,
              minDesignHeight: 2.0
            },
            { 
              name: 'Left Chest Seam', 
              description: 'Left chest pocket seam intersection', 
              anchorType: 'SEAM',
              maxOffsetUp: 2.0,
              maxOffsetDown: 6.0,
              maxOffsetLeft: 2.0,
              maxOffsetRight: 4.0,
              maxDesignWidth: 4.0,
              maxDesignHeight: 4.0,
              minDesignWidth: 2.0,
              minDesignHeight: 1.5
            },
            { 
              name: 'Bottom Hem Center', 
              description: 'Center point of bottom hem', 
              anchorType: 'HEM',
              maxOffsetUp: 8.0,
              maxOffsetDown: 0.5,
              maxOffsetLeft: 6.0,
              maxOffsetRight: 6.0,
              maxDesignWidth: 10.0,
              maxDesignHeight: 8.0,
              minDesignWidth: 3.0,
              minDesignHeight: 1.0
            },
            { 
              name: 'Back Collar Center', 
              description: 'Center point of back collar seam', 
              anchorType: 'COLLAR',
              maxOffsetUp: 1.0,
              maxOffsetDown: 14.0,
              maxOffsetLeft: 6.0,
              maxOffsetRight: 6.0,
              maxDesignWidth: 12.0,
              maxDesignHeight: 16.0,
              minDesignWidth: 4.0,
              minDesignHeight: 2.0
            },
            { 
              name: 'Left Sleeve Cuff', 
              description: 'Left sleeve cuff seam', 
              anchorType: 'SEAM',
              maxOffsetUp: 8.0,
              maxOffsetDown: 1.0,
              maxOffsetLeft: 1.0,
              maxOffsetRight: 2.0,
              maxDesignWidth: 3.0,
              maxDesignHeight: 8.0,
              minDesignWidth: 1.5,
              minDesignHeight: 1.0
            }
          ]
        }
      }
    }),
    
    // Polo Shirts  
    prisma.product.create({
      data: {
        sku: 'NL-POLO-001',
        name: 'Next Level Polo Shirt',
        category: 'TOPS',
        brand: 'Next Level',
        basePrice: 12.50,
        currentPrice: 12.50,
        sizeSystem: 'APPAREL',
        availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
        decorationMethods: ['HTV', 'HYBRID_DTF', 'ADHESIVE_PATCH'],
        material: '60% Cotton, 40% Polyester',
        variants: {
          create: [
            { name: 'White', sku: 'NL-POLO-001-WHITE', colorHex: '#FFFFFF' },
            { name: 'Navy', sku: 'NL-POLO-001-NAVY', colorHex: '#000080' },
            { name: 'Black', sku: 'NL-POLO-001-BLACK', colorHex: '#000000' },
          ]
        },
        placementAnchors: {
          create: [
            { 
              name: 'Left Chest Placket', 
              description: 'Left chest button placket area', 
              anchorType: 'PLACKET',
              maxOffsetUp: 1.0,
              maxOffsetDown: 4.0,
              maxOffsetLeft: 1.0,
              maxOffsetRight: 3.0,
              maxDesignWidth: 4.0,
              maxDesignHeight: 4.0,
              minDesignWidth: 2.0,
              minDesignHeight: 1.5
            },
            { 
              name: 'Back Collar Center', 
              description: 'Center of polo back collar', 
              anchorType: 'COLLAR',
              maxOffsetUp: 1.0,
              maxOffsetDown: 10.0,
              maxOffsetLeft: 5.0,
              maxOffsetRight: 5.0,
              maxDesignWidth: 10.0,
              maxDesignHeight: 12.0,
              minDesignWidth: 4.0,
              minDesignHeight: 2.0
            },
            { 
              name: 'Left Sleeve Cuff', 
              description: 'Left sleeve cuff seam', 
              anchorType: 'SEAM',
              maxOffsetUp: 6.0,
              maxOffsetDown: 1.0,
              maxOffsetLeft: 1.0,
              maxOffsetRight: 2.0,
              maxDesignWidth: 3.0,
              maxDesignHeight: 6.0,
              minDesignWidth: 1.5,
              minDesignHeight: 1.0
            }
          ]
        }
      }
    }),

    // Hoodies
    prisma.product.create({
      data: {
        sku: 'GILDAN-18500',
        name: 'Gildan 18500 Heavy Blend Hoodie',
        category: 'TOPS',
        brand: 'Gildan',
        basePrice: 18.00,
        currentPrice: 18.00,
        sizeSystem: 'APPAREL',
        availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
        decorationMethods: ['HTV', 'HYBRID_DTF', 'SCREEN_PRINT_DTF', 'ADHESIVE_PATCH'],
        material: '50% Cotton, 50% Polyester',
        variants: {
          create: [
            { name: 'Black', sku: 'GILDAN-18500-BLACK', colorHex: '#000000' },
            { name: 'Navy', sku: 'GILDAN-18500-NAVY', colorHex: '#000080' },
            { name: 'Heather Gray', sku: 'GILDAN-18500-HGRAY', colorHex: '#808080' },
            { name: 'Maroon', sku: 'GILDAN-18500-MAROON', colorHex: '#800000' },
          ]
        },
        placementAnchors: {
          create: [
            { 
              name: 'Hood Seam Center', 
              description: 'Center where hood meets body', 
              anchorType: 'SEAM',
              maxOffsetUp: 6.0,
              maxOffsetDown: 12.0,
              maxOffsetLeft: 5.0,
              maxOffsetRight: 5.0,
              maxDesignWidth: 10.0,
              maxDesignHeight: 14.0,
              minDesignWidth: 4.0,
              minDesignHeight: 2.0
            },
            { 
              name: 'Kangaroo Pocket Top', 
              description: 'Top edge of kangaroo pocket', 
              anchorType: 'POCKET',
              maxOffsetUp: 3.0,
              maxOffsetDown: 2.0,
              maxOffsetLeft: 3.0,
              maxOffsetRight: 3.0,
              maxDesignWidth: 4.0,
              maxDesignHeight: 4.0,
              minDesignWidth: 2.0,
              minDesignHeight: 1.5
            },
            { 
              name: 'Back Hood Seam', 
              description: 'Back center where hood attaches', 
              anchorType: 'SEAM',
              maxOffsetUp: 4.0,
              maxOffsetDown: 12.0,
              maxOffsetLeft: 5.0,
              maxOffsetRight: 5.0,
              maxDesignWidth: 10.0,
              maxDesignHeight: 14.0,
              minDesignWidth: 4.0,
              minDesignHeight: 2.0
            },
            { 
              name: 'Hood Center', 
              description: 'Center top of hood', 
              anchorType: 'SEAM',
              maxOffsetUp: 2.0,
              maxOffsetDown: 4.0,
              maxOffsetLeft: 3.0,
              maxOffsetRight: 3.0,
              maxDesignWidth: 6.0,
              maxDesignHeight: 4.0,
              minDesignWidth: 2.0,
              minDesignHeight: 1.0
            }
          ]
        }
      }
    }),

    // Trucker Hats
    prisma.product.create({
      data: {
        sku: 'TRUCKER-CLASSIC',
        name: 'Classic Trucker Hat',
        category: 'HEADWEAR',
        brand: 'Generic',
        basePrice: 8.50,
        currentPrice: 8.50,
        sizeSystem: 'OSFA',
        availableSizes: ['OSFA'],
        decorationMethods: ['HTV', 'ADHESIVE_PATCH'],
        material: 'Cotton/Mesh',
        variants: {
          create: [
            { name: 'Black/Gray', sku: 'TRUCKER-CLASSIC-BKGY', colorHex: '#000000' },
            { name: 'Navy/White', sku: 'TRUCKER-CLASSIC-NVWH', colorHex: '#000080' },
            { name: 'Red/White', sku: 'TRUCKER-CLASSIC-RDWH', colorHex: '#FF0000' },
          ]
        },
        placementAnchors: {
          create: [
            { 
              name: 'Front Panel Center', 
              description: 'Center of front hat panel', 
              anchorType: 'PANEL',
              maxOffsetUp: 1.5,
              maxOffsetDown: 1.5,
              maxOffsetLeft: 2.0,
              maxOffsetRight: 2.0,
              maxDesignWidth: 4.0,
              maxDesignHeight: 3.0,
              minDesignWidth: 2.0,
              minDesignHeight: 1.0
            },
            { 
              name: 'Visor Seam', 
              description: 'Seam where visor attaches to front', 
              anchorType: 'SEAM',
              maxOffsetUp: 2.5,
              maxOffsetDown: 0.5,
              maxOffsetLeft: 3.0,
              maxOffsetRight: 3.0,
              maxDesignWidth: 6.0,
              maxDesignHeight: 1.5,
              minDesignWidth: 2.0,
              minDesignHeight: 0.5
            },
            { 
              name: 'Back Panel Center', 
              description: 'Center of back mesh panel', 
              anchorType: 'PANEL',
              maxOffsetUp: 1.0,
              maxOffsetDown: 1.5,
              maxOffsetLeft: 2.0,
              maxOffsetRight: 2.0,
              maxDesignWidth: 4.0,
              maxDesignHeight: 2.5,
              minDesignWidth: 2.0,
              minDesignHeight: 1.0
            }
          ]
        }
      }
    }),

    // Tote Bags
    prisma.product.create({
      data: {
        sku: 'TOTE-CANVAS',
        name: 'Canvas Tote Bag',
        category: 'ACCESSORIES',
        brand: 'Generic',
        basePrice: 5.50,
        currentPrice: 5.50,
        sizeSystem: 'OSFA',
        availableSizes: ['OSFA'],
        decorationMethods: ['HTV', 'SCREEN_PRINT_DTF'],
        material: '100% Cotton Canvas',
        variants: {
          create: [
            { name: 'Natural', sku: 'TOTE-CANVAS-NATURAL', colorHex: '#F5F5DC' },
            { name: 'Black', sku: 'TOTE-CANVAS-BLACK', colorHex: '#000000' },
          ]
        },
        placementAnchors: {
          create: [
            { 
              name: 'Handle Attachment Center', 
              description: 'Center where handles attach to bag', 
              anchorType: 'SEAM',
              maxOffsetUp: 2.0,
              maxOffsetDown: 8.0,
              maxOffsetLeft: 5.0,
              maxOffsetRight: 5.0,
              maxDesignWidth: 10.0,
              maxDesignHeight: 10.0,
              minDesignWidth: 4.0,
              minDesignHeight: 2.0
            },
            { 
              name: 'Bottom Seam Center', 
              description: 'Center of bottom seam', 
              anchorType: 'SEAM',
              maxOffsetUp: 4.0,
              maxOffsetDown: 1.0,
              maxOffsetLeft: 4.0,
              maxOffsetRight: 4.0,
              maxDesignWidth: 8.0,
              maxDesignHeight: 4.0,
              minDesignWidth: 3.0,
              minDesignHeight: 1.0
            }
          ]
        }
      }
    }),
  ]);

  console.log('📦 Created product catalog with', products.length, 'products');

  // Create basic materials
  const materials = await prisma.$transaction([
    prisma.material.create({
      data: {
        name: 'Black HTV Vinyl',
        type: 'VINYL',
        brand: 'Siser',
        color: 'Black',
        currentStock: 50.0,
        unit: 'yards',
        costPerUnit: 3.50,
        minStockLevel: 10.0,
      }
    }),
    prisma.material.create({
      data: {
        name: 'White HTV Vinyl',
        type: 'VINYL',
        brand: 'Siser',
        color: 'White',
        currentStock: 45.0,
        unit: 'yards', 
        costPerUnit: 3.50,
        minStockLevel: 10.0,
      }
    }),
    prisma.material.create({
      data: {
        name: 'DTF Ink - Black',
        type: 'DTF_INK',
        brand: 'Epson',
        color: 'Black',
        currentStock: 3.0,
        unit: 'bottles',
        costPerUnit: 45.00,
        minStockLevel: 1.0,
      }
    }),
    prisma.material.create({
      data: {
        name: 'DTF Powder',
        type: 'DTF_POWDER',
        brand: 'Generic',
        currentStock: 8.0,
        unit: 'pounds',
        costPerUnit: 25.00,
        minStockLevel: 2.0,
      }
    }),
  ]);

  console.log('🧵 Created materials inventory with', materials.length, 'items');

  // Create test customers
  const testCustomer = await prisma.customer.create({
    data: {
      name: 'Test Customer 1',
      email: 'test_customer1@687merch.com',
      phone: '(555) 123-4567',
      company: 'Test Company Inc',
      defaultShip: {
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210'
      }
    },
  });

  // Create customer user account
  const customerUser = await prisma.user.create({
    data: {
      email: 'test_customer1@687merch.com',
      name: 'Test Customer 1',
      role: 'CUSTOMER',
      customerId: testCustomer.id,
    },
  });

  const acmeCustomer = await prisma.customer.create({
    data: {
      name: 'Test Customer 2',
      email: 'test_customer2@687merch.com',
      phone: '(555) 987-6543',
      company: 'Test Company Corp',
      defaultShip: {
        address: '456 Business Ave',
        city: 'Commerce City',
        state: 'NY',
        zipCode: '10001'
      }
    }
  });

  const acmeUser = await prisma.user.create({
    data: {
      email: 'test_customer2@687merch.com',
      name: 'Test Customer 2',
      role: 'CUSTOMER',
      customerId: acmeCustomer.id,
    },
  });

  console.log('🏢 Created test customers:', testCustomer.name, acmeCustomer.name);

  // Get products with their variants for job creation
  const productsWithVariants = await prisma.product.findMany({
    include: { variants: true }
  });
  
  const tshirtProduct = productsWithVariants[0]; // Gildan T-Shirt
  const hoodieProduct = productsWithVariants[2]; // Hoodie
  const poloProduct = productsWithVariants[1]; // Polo

  // Job 1: Completed T-shirt order
  const job1 = await prisma.job.create({
    data: {
      jobNumber: 'JOB-2024-001',
      customerId: testCustomer.id,
      status: 'DONE',
      priority: 'NORMAL',
      dueDate: new Date('2024-12-15'),
      actualValue: 875.00,
      notes: 'Holiday promotional items - completed successfully',
      items: {
        create: {
          productId: tshirtProduct.id,
          variantId: tshirtProduct.variants[2]?.id, // Navy variant
          quantity: 50,
          unitPrice: 17.50,
          totalPrice: 875.00,
          sizeBreakdown: {
            create: [
              { size: 'S', quantity: 5 },
              { size: 'M', quantity: 20 },
              { size: 'L', quantity: 15 },
              { size: 'XL', quantity: 8 },
              { size: '2XL', quantity: 2 },
            ]
          }
        }
      },
      assignments: {
        create: [
          {
            employeeId: designer.id,
            role: 'DESIGNER',
            assignedAt: new Date('2024-11-10'),
            completedAt: new Date('2024-11-12'),
            hoursWorked: 4.5,
            status: 'COMPLETED'
          },
          {
            employeeId: printer.id,
            role: 'PRINTER',
            assignedAt: new Date('2024-11-15'),
            completedAt: new Date('2024-11-18'),
            hoursWorked: 6.0,
            status: 'COMPLETED'
          }
        ]
      },
      events: {
        createMany: {
          data: [
            {
              type: 'job.created',
              payload: { createdBy: 'admin', totalValue: 875.00 }
            },
            {
              type: 'status.updated',
              payload: { oldStatus: 'PENDING_DESIGN', newStatus: 'PENDING_MATERIALS' },
              createdAt: new Date('2024-11-12')
            },
            {
              type: 'status.updated', 
              payload: { oldStatus: 'PENDING_MATERIALS', newStatus: 'PENDING_PRINT' },
              createdAt: new Date('2024-11-15')
            },
            {
              type: 'status.updated',
              payload: { oldStatus: 'PENDING_PRINT', newStatus: 'PENDING_FULFILLMENT' },
              createdAt: new Date('2024-11-18')
            },
            {
              type: 'status.updated',
              payload: { oldStatus: 'PENDING_FULFILLMENT', newStatus: 'DONE' },
              createdAt: new Date('2024-12-14')
            }
          ]
        }
      }
    },
    include: {
      items: { include: { sizeBreakdown: true } },
      assignments: { include: { employee: true } }
    }
  });

  // Job 2: Currently in print
  const job2 = await prisma.job.create({
    data: {
      jobNumber: 'JOB-2024-002', 
      customerId: testCustomer.id,
      status: 'PENDING_PRINT',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      estimatedValue: 450.00,
      notes: 'Premium hoodies - customer requested soft feel',
      items: {
        create: {
          productId: hoodieProduct.id,
          variantId: hoodieProduct.variants[2]?.id, // Heather Gray
          quantity: 25,
          unitPrice: 18.00,
          totalPrice: 450.00,
          sizeBreakdown: {
            create: [
              { size: 'M', quantity: 8 },
              { size: 'L', quantity: 10 },
              { size: 'XL', quantity: 5 },
              { size: '2XL', quantity: 2 },
            ]
          }
        }
      },
      assignments: {
        create: [
          {
            employeeId: designer.id,
            role: 'DESIGNER',
            assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            hoursWorked: 3.5,
            status: 'COMPLETED'
          },
          {
            employeeId: printer.id,
            role: 'PRINTER',
            assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'IN_PROGRESS'
          }
        ]
      }
    }
  });

  // Job 3: Waiting for design approval
  const job3 = await prisma.job.create({
    data: {
      jobNumber: 'JOB-2024-003',
      customerId: acmeCustomer.id,
      status: 'PENDING_DESIGN',
      priority: 'URGENT',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      rushJob: true,
      estimatedValue: 1250.00,
      notes: 'Corporate event - RUSH ORDER needed by Friday!',
      items: {
        create: {
          productId: poloProduct.id,
          variantId: poloProduct.variants[0]?.id, // White
          quantity: 100,
          unitPrice: 12.50,
          totalPrice: 1250.00,
          rushItem: true,
          sizeBreakdown: {
            create: [
              { size: 'S', quantity: 15 },
              { size: 'M', quantity: 35 },
              { size: 'L', quantity: 30 },
              { size: 'XL', quantity: 15 },
              { size: '2XL', quantity: 5 },
            ]
          }
        }
      },
      assignments: {
        create: {
          employeeId: designer.id,
          role: 'DESIGNER',
          assignedAt: new Date(),
          status: 'ASSIGNED'
        }
      }
    }
  });

  console.log('📦 Created sample jobs:', job1.jobNumber, job2.jobNumber, job3.jobNumber);

  console.log('✅ Seeding completed successfully!');
  console.log('\\n📋 Test Accounts:');
  console.log(`👑 Admin: info@687merch.com`);
  console.log(`👤 Customer 1: test_customer1@687merch.com`);
  console.log(`👤 Customer 2: test_customer2@687merch.com`);
  console.log(`👤 Employee: test_printer1@687merch.com`);
  console.log('\\n🔗 Use these emails to sign in via magic link');
  console.log('\\n📊 Sample Data:');
  console.log(`📦 Products: ${products.length} items in catalog`);
  console.log(`🧵 Materials: ${materials.length} materials in inventory`);
  console.log(`👥 Employees: 3 team members`);
  console.log(`📋 Jobs: 3 sample jobs (1 complete, 1 in progress, 1 pending)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });