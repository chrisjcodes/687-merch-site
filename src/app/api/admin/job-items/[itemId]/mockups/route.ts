import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

interface Props {
  params: Promise<{ itemId: string }>;
}

// GET - Get mockups for a job item
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await params;

    // Get the job item to verify access
    const jobItem = await prisma.jobItem.findUnique({
      where: { id: itemId },
      include: {
        job: {
          include: {
            customer: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!jobItem) {
      return NextResponse.json({ error: 'Job item not found' }, { status: 404 });
    }

    // Check if user has access (admin or customer who owns this job)
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = session.user.customerId === jobItem.job.customer.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get mockups for this job item
    const mockups = await prisma.mockup.findMany({
      where: {
        jobItemId: itemId,
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json({ mockups });
  } catch (error) {
    console.error('Error fetching mockups:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Upload new mockup (admin only)
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await params;

    // Verify job item exists
    const jobItem = await prisma.jobItem.findUnique({
      where: { id: itemId },
      include: {
        job: {
          select: { jobNumber: true }
        }
      }
    });

    if (!jobItem) {
      return NextResponse.json({ error: 'Job item not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Mockup name is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const filename = `mockups/${itemId}/${Date.now()}_${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Create mockup record
    const mockup = await prisma.mockup.create({
      data: {
        jobItemId: itemId,
        name: name.trim(),
        description: description?.trim() || null,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        sortOrder,
      }
    });

    return NextResponse.json({ mockup }, { status: 201 });
  } catch (error) {
    console.error('Error uploading mockup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}