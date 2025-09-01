import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();

    const { 
      customerId, 
      productSku, 
      variant, 
      sizeBreakdown, 
      printSpec, 
      dueDate, 
      notes 
    } = body;

    if (!customerId || !productSku || !sizeBreakdown) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const totalQty = Object.values(sizeBreakdown).reduce(
      (sum: number, qty: any) => sum + (parseInt(qty) || 0),
      0
    );

    if (totalQty === 0) {
      return NextResponse.json(
        { error: 'Must specify at least one item' },
        { status: 400 }
      );
    }

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

    const job = await prisma.job.create({
      data: {
        customerId,
        status: 'QUEUED',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        items: {
          create: {
            productSku,
            variant,
            printSpec: printSpec || {},
            qty: totalQty,
            sizeBreakdown,
          }
        },
        events: {
          create: {
            type: 'job.created',
            payload: {
              createdBy: 'admin',
              productSku,
              variant,
              totalQty,
            }
          }
        }
      },
      include: {
        items: true,
        events: true,
        customer: true,
      }
    });

    return NextResponse.json({ jobId: job.id, job });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}