import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ItemOrder {
  itemTemplateId: string;
  sizeBreakdown: Record<string, number>;
  notes: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.customerId) {
      return NextResponse.json({ error: 'Customer ID not found' }, { status: 400 });
    }

    const { itemOrders, dueDate, generalNotes } = await request.json();

    // Validate input
    if (!itemOrders || !Array.isArray(itemOrders) || itemOrders.length === 0) {
      return NextResponse.json({ error: 'At least one item order is required' }, { status: 400 });
    }

    // Validate that all itemTemplateIds exist and belong to the customer
    const itemTemplateIds = itemOrders.map((order: ItemOrder) => order.itemTemplateId);
    const itemTemplates = await prisma.itemTemplate.findMany({
      where: {
        id: { in: itemTemplateIds },
        customerId: session.user.customerId,
        isActive: true
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            availableSizes: true
          }
        },
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            colorHex: true
          }
        }
      }
    });

    if (itemTemplates.length !== itemTemplateIds.length) {
      return NextResponse.json({ 
        error: 'One or more item templates not found or not accessible' 
      }, { status: 400 });
    }

    // Create job with items
    const job = await prisma.$transaction(async (tx) => {
      // Create the job
      const newJob = await tx.job.create({
        data: {
          customerId: session.user.customerId!,
          status: 'PENDING_DESIGN',
          dueDate: dueDate ? new Date(dueDate) : null,
          notes: generalNotes || null,
        },
      });

      // Create job items from the item orders
      const jobItems = [];
      for (const itemOrder of itemOrders) {
        const itemTemplate = itemTemplates.find(t => t.id === itemOrder.itemTemplateId);
        if (!itemTemplate) continue;

        // Calculate total quantity from size breakdown
        const totalQuantity = Object.values(itemOrder.sizeBreakdown)
          .reduce((sum: number, qty: number) => sum + (qty || 0), 0);

        if (totalQuantity === 0) continue; // Skip items with no quantity

        const jobItem = await tx.jobItem.create({
          data: {
            jobId: newJob.id,
            itemTemplateId: itemTemplate.id,
            productId: itemTemplate.productId,
            variantId: itemTemplate.variantId,
            quantity: totalQuantity,
            sizeBreakdown: itemOrder.sizeBreakdown,
            notes: itemOrder.notes || null,
          },
        });

        jobItems.push(jobItem);

        // Update item template statistics
        await tx.itemTemplate.update({
          where: { id: itemTemplate.id },
          data: {
            timesOrdered: { increment: 1 },
            lastOrderedAt: new Date(),
          },
        });
      }

      // Create job creation event
      await tx.event.create({
        data: {
          jobId: newJob.id,
          type: 'job.created',
          payload: {
            createdBy: 'customer',
            customerId: session.user.customerId,
            itemsCount: jobItems.length,
            totalQty: jobItems.reduce((sum, item) => sum + item.quantity, 0),
            createdVia: 'item_reorder'
          },
        },
      });

      return newJob;
    });

    // Fetch the complete job with related data
    const completeJob = await prisma.job.findUnique({
      where: { id: job.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          }
        },
        items: {
          include: {
            itemTemplate: {
              select: {
                id: true,
                name: true,
                description: true,
              }
            },
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              }
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
                colorHex: true,
              }
            }
          }
        },
        events: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      job: completeJob,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating reorder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}