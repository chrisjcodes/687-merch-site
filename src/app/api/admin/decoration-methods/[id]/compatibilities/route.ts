import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

// POST - Add compatibility between decoration method and product
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: decorationMethodId } = await params;
    const body = await request.json();
    const {
      productId,
      isRecommended = true,
      notes,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      additionalCost,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if decoration method exists
    const decorationMethod = await prisma.decorationMethod.findUnique({
      where: { id: decorationMethodId }
    });

    if (!decorationMethod) {
      return NextResponse.json({ error: 'Decoration method not found' }, { status: 404 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if compatibility already exists
    const existingCompatibility = await prisma.decorationCompatibility.findUnique({
      where: {
        decorationMethodId_productId: {
          decorationMethodId,
          productId,
        }
      }
    });

    if (existingCompatibility) {
      return NextResponse.json(
        { error: 'Compatibility already exists between this decoration method and product' },
        { status: 409 }
      );
    }

    // Create the compatibility
    const compatibility = await prisma.decorationCompatibility.create({
      data: {
        decorationMethodId,
        productId,
        isRecommended,
        notes,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        additionalCost,
      },
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
            category: true,
          }
        },
        decorationMethod: {
          select: {
            id: true,
            name: true,
            displayName: true,
          }
        }
      }
    });

    return NextResponse.json({ compatibility }, { status: 201 });
  } catch (error) {
    console.error('Error creating compatibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove compatibility
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: decorationMethodId } = await params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the compatibility
    const compatibility = await prisma.decorationCompatibility.findUnique({
      where: {
        decorationMethodId_productId: {
          decorationMethodId,
          productId,
        }
      }
    });

    if (!compatibility) {
      return NextResponse.json({ error: 'Compatibility not found' }, { status: 404 });
    }

    await prisma.decorationCompatibility.delete({
      where: { id: compatibility.id }
    });

    return NextResponse.json({ message: 'Compatibility removed successfully' });
  } catch (error) {
    console.error('Error removing compatibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}