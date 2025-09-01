import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@687merch.com' },
    update: {},
    create: {
      email: 'admin@687merch.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create test customer
  const testCustomer = await prisma.customer.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'test@example.com',
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
  const customerUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { customerId: testCustomer.id },
    create: {
      email: 'test@example.com',
      name: 'Test Customer',
      role: 'CUSTOMER',
      customerId: testCustomer.id,
    },
  });

  console.log('🏢 Created test customer:', testCustomer.name);

  // Create sample job 1
  const job1 = await prisma.job.create({
    data: {
      customerId: testCustomer.id,
      status: 'DELIVERED',
      dueDate: new Date('2024-12-15'),
      notes: 'Holiday promotional items - rush order',
      items: {
        create: {
          productSku: 'SHIRT-BASIC-COTTON',
          variant: 'Navy Blue',
          printSpec: {
            design: 'Company Logo',
            placement: 'Front chest',
            colors: 'White ink',
            special: 'High-quality vinyl'
          },
          qty: 50,
          sizeBreakdown: {
            'S': 5,
            'M': 20,
            'L': 15,
            'XL': 8,
            '2XL': 2
          }
        }
      },
      events: {
        createMany: {
          data: [
            {
              type: 'job.created',
              payload: {
                createdBy: 'admin',
                productSku: 'SHIRT-BASIC-COTTON',
                totalQty: 50
              }
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'QUEUED',
                newStatus: 'APPROVED',
                updatedBy: 'admin'
              },
              createdAt: new Date('2024-11-15')
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'APPROVED',
                newStatus: 'IN_PROD',
                updatedBy: 'admin'
              },
              createdAt: new Date('2024-11-20')
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'IN_PROD',
                newStatus: 'READY',
                updatedBy: 'admin'
              },
              createdAt: new Date('2024-12-01')
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'READY',
                newStatus: 'SHIPPED',
                updatedBy: 'admin'
              },
              createdAt: new Date('2024-12-10')
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'SHIPPED',
                newStatus: 'DELIVERED',
                updatedBy: 'admin'
              },
              createdAt: new Date('2024-12-14')
            }
          ]
        }
      }
    },
    include: {
      items: true,
      events: true
    }
  });

  console.log('📦 Created sample job 1:', job1.id.slice(-8));

  // Create sample job 2 (in progress)
  const job2 = await prisma.job.create({
    data: {
      customerId: testCustomer.id,
      status: 'IN_PROD',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      notes: 'Standard order - no rush',
      items: {
        create: {
          productSku: 'HOODIE-PREMIUM-BLEND',
          variant: 'Heather Gray',
          printSpec: {
            design: 'Custom Artwork',
            placement: 'Back center',
            colors: '3-color screen print',
            special: 'Soft hand feel preferred'
          },
          qty: 25,
          sizeBreakdown: {
            'M': 8,
            'L': 10,
            'XL': 5,
            '2XL': 2
          }
        }
      },
      events: {
        createMany: {
          data: [
            {
              type: 'job.created',
              payload: {
                createdBy: 'admin',
                productSku: 'HOODIE-PREMIUM-BLEND',
                totalQty: 25
              },
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'QUEUED',
                newStatus: 'APPROVED',
                updatedBy: 'admin'
              },
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            },
            {
              type: 'status.updated',
              payload: {
                oldStatus: 'APPROVED',
                newStatus: 'IN_PROD',
                updatedBy: 'admin'
              },
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
          ]
        }
      }
    },
    include: {
      items: true,
      events: true
    }
  });

  console.log('📦 Created sample job 2:', job2.id.slice(-8));

  // Create another customer
  const customer2 = await prisma.customer.create({
    data: {
      name: 'Acme Corp',
      email: 'orders@acmecorp.com',
      phone: '(555) 987-6543',
      company: 'Acme Corporation',
      defaultShip: {
        address: '456 Business Ave',
        city: 'Commerce City',
        state: 'NY',
        zipCode: '10001'
      }
    }
  });

  // Create customer user for Acme Corp
  const customer2User = await prisma.user.create({
    data: {
      email: 'orders@acmecorp.com',
      name: 'Acme Orders',
      role: 'CUSTOMER',
      customerId: customer2.id,
    },
  });

  // Create a queued job for the second customer
  const job3 = await prisma.job.create({
    data: {
      customerId: customer2.id,
      status: 'QUEUED',
      notes: 'Corporate event merchandise',
      items: {
        create: {
          productSku: 'POLO-DRYFIT',
          variant: 'White',
          printSpec: {
            design: 'Acme Logo',
            placement: 'Left chest',
            colors: 'Navy embroidery'
          },
          qty: 100,
          sizeBreakdown: {
            'S': 15,
            'M': 35,
            'L': 30,
            'XL': 15,
            '2XL': 5
          }
        }
      },
      events: {
        create: {
          type: 'job.created',
          payload: {
            createdBy: 'admin',
            productSku: 'POLO-DRYFIT',
            totalQty: 100
          }
        }
      }
    }
  });

  console.log('🏢 Created second customer and job:', customer2.name, job3.id.slice(-8));

  console.log('✅ Seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log(`👑 Admin: admin@687merch.com`);
  console.log(`👤 Customer 1: test@example.com`);
  console.log(`👤 Customer 2: orders@acmecorp.com`);
  console.log('\n🔗 Use these emails to sign in via magic link');
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