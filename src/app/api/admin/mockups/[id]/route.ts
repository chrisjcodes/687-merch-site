import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

interface Props {
  params: Promise<{ id: string }>;
}

// PUT - Update mockup details (admin only)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ error: 'Mockup name is required' }, { status: 400 });
    }

    // Check if mockup exists
    const existingMockup = await prisma.mockup.findUnique({
      where: { id }
    });

    if (!existingMockup) {
      return NextResponse.json({ error: 'Mockup not found' }, { status: 404 });
    }

    // Update the mockup
    const updatedMockup = await prisma.mockup.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        sortOrder: sortOrder || existingMockup.sortOrder,
      }
    });

    return NextResponse.json({ mockup: updatedMockup });
  } catch (error) {
    console.error('Error updating mockup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mockup (admin only)
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the mockup to delete the file from blob storage
    const mockup = await prisma.mockup.findUnique({
      where: { id }
    });

    if (!mockup) {
      return NextResponse.json({ error: 'Mockup not found' }, { status: 404 });
    }

    try {
      // Delete from Vercel Blob
      await del(mockup.fileUrl);
    } catch (blobError) {
      console.warn('Failed to delete blob file:', blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.mockup.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Mockup deleted successfully' });
  } catch (error) {
    console.error('Error deleting mockup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}