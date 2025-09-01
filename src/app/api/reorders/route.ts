import { NextRequest, NextResponse } from 'next/server';
import { requireCustomerSession, createReorderJob } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const session = await requireCustomerSession();
    const body = await request.json();

    const { originalJobId, sizeBreakdown, dueDate, notes } = body;

    if (!originalJobId || !sizeBreakdown) {
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

    const reorderData = {
      sizeBreakdown,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes,
    };

    const newJob = await createReorderJob(
      originalJobId,
      session.user.customerId!,
      reorderData
    );

    return NextResponse.json({ jobId: newJob.id });
  } catch (error) {
    console.error('Reorder creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}