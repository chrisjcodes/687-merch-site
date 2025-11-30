import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const dropShopSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  shopifyCollectionId: z.string().min(1),
  isLive: z.boolean(),
  logoUrl: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT update drop shop
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = dropShopSchema.parse(body);

    const shop = await prisma.dropShop.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error updating drop shop:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update drop shop' },
      { status: 500 }
    );
  }
}

// DELETE drop shop
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
    console.error('Error deleting drop shop:', error);
    return NextResponse.json(
      { error: 'Failed to delete drop shop' },
      { status: 500 }
    );
  }
}
