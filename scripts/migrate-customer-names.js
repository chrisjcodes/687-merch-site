const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateCustomerNames() {
  try {
    console.log('Starting customer name migration...');
    
    // Get all customers
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
      }
    });
    
    console.log(`Found ${customers.length} customers to migrate`);
    
    for (const customer of customers) {
      if (!customer.firstName && !customer.lastName && customer.name) {
        // Split the name into first and last
        const nameParts = customer.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'Unknown';
        
        // Update the customer
        await prisma.customer.update({
          where: { id: customer.id },
          data: {
            firstName,
            lastName,
          }
        });
        
        console.log(`Migrated: "${customer.name}" → "${firstName}" + "${lastName}"`);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCustomerNames();