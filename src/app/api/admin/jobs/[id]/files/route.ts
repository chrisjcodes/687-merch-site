import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
    
    const { id: jobId } = await params;
    const body = await request.json();
    const { placementId, fileUrl, fileName } = body;
    
    if (!placementId || !fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: placementId, fileUrl, fileName' },
        { status: 400 }
      );
    }
    
    // Get the current job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { items: true }
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Update each item's printSpec to include the file information
    for (const item of job.items) {
      if (item.printSpec && typeof item.printSpec === 'object') {
        const printSpec = item.printSpec as any;
        if (printSpec.placements && Array.isArray(printSpec.placements)) {
          const updatedPlacements = printSpec.placements.map((placement: any) => {
            if (placement.id === placementId) {
              return {
                ...placement,
                designFileUrl: fileUrl,
                designFileName: fileName
              };
            }
            return placement;
          });
          
          // Update the item with the new placement data
          await prisma.jobItem.update({
            where: { id: item.id },
            data: {
              printSpec: {
                ...printSpec,
                placements: updatedPlacements
              }
            }
          });
        }
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('File reference update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}