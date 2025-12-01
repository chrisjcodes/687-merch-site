import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST quick create a shop from a collection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collectionId, collectionTitle } = await request.json();

    if (!collectionId || !collectionTitle) {
      return NextResponse.json(
        { error: 'Collection ID and title are required' },
        { status: 400 }
      );
    }

    // Generate slug from collection title
    const baseSlug = collectionTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists and make unique if needed
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.dropShop.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the shop
    const shop = await prisma.dropShop.create({
      data: {
        name: collectionTitle,
        slug,
        shopifyCollectionId: collectionId,
        themeColor: '#f2bf00',
        themeMode: 'dark',
        isLive: false,
      },
    });

    return NextResponse.json({ shop }, { status: 201 });
  } catch (error) {
    console.error('Error quick creating shop:', error);
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    );
  }
}
