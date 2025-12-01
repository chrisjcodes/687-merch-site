import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const shopSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  themeMode: z.enum(['light', 'dark']).default('light'),
  shopifyCollectionId: z.string().min(1),
  isLive: z.boolean(),
  activationMode: z.enum(['manual', 'scheduled']).default('manual'),
  activeUntil: z.string().nullable().optional(),
  logoUrl: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT update shop
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = shopSchema.parse(body);

    // Convert activeUntil string to Date if present
    const dataToUpdate = {
      ...validatedData,
      activeUntil: validatedData.activeUntil ? new Date(validatedData.activeUntil) : null,
    };

    const shop = await prisma.dropShop.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error updating shop:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    );
  }
}

// DELETE shop
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.dropShop.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Failed to delete shop' },
      { status: 500 }
    );
  }
}
