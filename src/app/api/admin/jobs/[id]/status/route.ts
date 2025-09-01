import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireAdminSession();
    const body = await request.json();

    const { status } = body;

    if (!status || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current job
    const currentJob = await prisma.job.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!currentJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Update job status and log event
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status,
        events: {
          create: {
            type: 'status.updated',
            payload: {
              oldStatus: currentJob.status,
              newStatus: status,
              updatedBy: 'admin',
            }
          }
        }
      },
      include: {
        customer: true,
        items: true,
        events: true
      }
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}