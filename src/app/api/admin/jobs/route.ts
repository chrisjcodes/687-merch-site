import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// GET /api/admin/jobs - List jobs or get form data
export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'form-data') {
      // Return products and customers for form
      const [products, customers] = await Promise.all([
        prisma.product.findMany({
          where: { isActive: true },
          select: {
            id: true,
            sku: true,
            name: true,
            category: true,
            brand: true,
            basePrice: true,
            currentPrice: true,
            sizeSystem: true,
            availableSizes: true,
            decorationMethods: true,
            weight: true,
            color: true,
            material: true,
            variants: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                sku: true,
                colorHex: true,
                priceAdjustment: true,
                isActive: true
              }
            },
            sizePricing: {
              where: { isActive: true },
              orderBy: { size: 'asc' },
              select: {
                id: true,
                size: true,
                basePrice: true,
                currentPrice: true,
                isActive: true
              }
            },
            placementAnchors: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                description: true,
                anchorType: true,
                maxOffsetUp: true,
                maxOffsetDown: true,
                maxOffsetLeft: true,
                maxOffsetRight: true,
                maxDesignWidth: true,
                maxDesignHeight: true,
                minDesignWidth: true,
                minDesignHeight: true
              }
            }
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }]
        }),
        prisma.customer.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          },
          orderBy: { name: 'asc' }
        })
      ]);

      return NextResponse.json({ products, customers });
    }

    // Default: return jobs list (existing functionality if needed)
    const jobs = await prisma.job.findMany({
      include: {
        customer: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { sku: true, name: true }
            },
            variant: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();

    const { 
      customerId, 
      items, 
      dueDate, 
      notes,
      priority = 'NORMAL'
    } = body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId and items array' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Each item must have productId and positive quantity' },
          { status: 400 }
        );
      }
    }

    const totalQty = items.reduce((sum: number, item: any) => sum + (parseInt(item.quantity) || 0), 0);

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Generate job number
    const jobCount = await prisma.job.count();
    const jobNumber = `JOB-${new Date().getFullYear()}-${String(jobCount + 1).padStart(3, '0')}`;

    const job = await prisma.job.create({
      data: {
        jobNumber,
        customerId,
        status: 'PENDING_DESIGN',
        priority: priority as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        estimatedValue: items.reduce((sum: number, item: any) => 
          sum + (parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 0)), 0
        ),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice || 0),
            totalPrice: parseFloat(item.unitPrice || 0) * parseInt(item.quantity),
            notes: item.notes || null,
            sizeBreakdown: {
              create: Object.entries(item.sizeBreakdown || {}).map(([size, qty]: [string, any]) => ({
                size,
                quantity: parseInt(qty) || 0
              }))
            }
          }))
        },
        events: {
          create: {
            type: 'job.created',
            payload: {
              createdBy: 'admin',
              itemsCount: items.length,
              totalQty,
              estimatedValue: items.reduce((sum: number, item: any) => 
                sum + (parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 0)), 0
              )
            }
          }
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true
              }
            },
            variant: true,
            sizeBreakdown: true
          }
        },
        events: true,
        customer: true,
      }
    });

    // With Vercel Blob, files are already in their permanent location
    // No need to move files - they're stored with the correct jobId path

    return NextResponse.json({ jobId: job.id, job });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}