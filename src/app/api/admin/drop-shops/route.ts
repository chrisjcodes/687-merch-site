import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const dropShopSchema = z.object({
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

// GET all drop shops
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shops = await prisma.dropShop.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Error fetching drop shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drop shops' },
      { status: 500 }
    );
  }
}

// POST create new drop shop
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = dropShopSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.dropShop.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A shop with this slug already exists' },
        { status: 400 }
      );
    }

    // Convert activeUntil string to Date if present
    const dataToCreate = {
      ...validatedData,
      activeUntil: validatedData.activeUntil ? new Date(validatedData.activeUntil) : null,
    };

    const shop = await prisma.dropShop.create({
      data: dataToCreate,
    });

    return NextResponse.json({ shop }, { status: 201 });
  } catch (error) {
    console.error('Error creating drop shop:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create drop shop' },
      { status: 500 }
    );
  }
}
