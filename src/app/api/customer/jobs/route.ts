import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.customerId) {
      return NextResponse.json({ error: 'Customer ID not found' }, { status: 400 });
    }

    const jobs = await prisma.job.findMany({
      where: {
        customerId: session.user.customerId
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching customer jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}