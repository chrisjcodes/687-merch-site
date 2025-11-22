import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

// GET - Get job details for customer
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.customerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the job and verify it belongs to this customer
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true }
        },
        items: {
          include: {
            product: {
              select: { sku: true, name: true }
            },
            variant: {
              select: { name: true, colorHex: true }
            },
            sizeBreakdown: true,
            placements: {
              include: {
                design: {
                  select: { id: true, name: true, fileUrl: true }
                }
              }
            }
          }
        },
        events: {
          where: {
            type: {
              not: 'status.internal_note' // Hide internal notes from customers
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Limit to most recent events
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify this job belongs to the authenticated customer
    if (job.customer.id !== session.user.customerId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching customer job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}