import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get single decoration product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const decorationProduct = await prisma.decorationProduct.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            displayName: true,
          }
        },
        vendor: {
          select: {
            id: true,
            name: true,
            displayName: true,
            paymentTerms: true,
            minimumOrder: true,
          }
        },
        compatibilities: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                name: true,
                category: true,
              }
            }
          }
        },
        pricing: {
          include: {
            sizeRange: true
          },
          orderBy: [
            { minQuantity: 'asc' },
            { sizeRange: { name: 'asc' } }
          ]
        },
        _count: {
          select: {
            compatibilities: true,
            pricing: true,
          }
        }
      }
    });

    if (!decorationProduct) {
      return NextResponse.json({ error: 'Decoration product not found' }, { status: 404 });
    }

    return NextResponse.json({ decorationProduct });
  } catch (error) {
    console.error('Error fetching decoration product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update decoration product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      displayName,
      description,
      categoryId,
      vendorId,
      pricingType,
      hasColorPricing,
      hasArtworkPricing,
      hasSizePricing,
      colorPricingType,
      maxColors,
      artSetupFee,
      sampleFee,
      editFee,
      rushFee,
      minimumQuantity,
      estimatedTurnaround,
      notes,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !displayName || !categoryId || !vendorId) {
      return NextResponse.json(
        { error: 'Name, display name, category, and vendor are required' },
        { status: 400 }
      );
    }

    // Check if decoration product exists
    const existingProduct = await prisma.decorationProduct.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Decoration product not found' }, { status: 404 });
    }

    // Check for name conflicts (excluding current product)
    const nameConflict = await prisma.decorationProduct.findFirst({
      where: { 
        name,
        vendorId,
        categoryId,
        id: { not: id }
      }
    });

    if (nameConflict) {
      return NextResponse.json(
        { error: 'Decoration product with this name already exists for this vendor and category' },
        { status: 409 }
      );
    }

    // Update the decoration product
    const decorationProduct = await prisma.decorationProduct.update({
      where: { id },
      data: {
        name,
        displayName,
        description,
        categoryId,
        vendorId,
        pricingType,
        hasColorPricing,
        hasArtworkPricing,
        hasSizePricing,
        colorPricingType,
        maxColors,
        artSetupFee,
        sampleFee,
        editFee,
        rushFee,
        minimumQuantity,
        estimatedTurnaround,
        notes,
        isActive,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            displayName: true,
          }
        },
        vendor: {
          select: {
            id: true,
            name: true,
            displayName: true,
          }
        },
        compatibilities: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({ decorationProduct });
  } catch (error) {
    console.error('Error updating decoration product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete decoration product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if decoration product exists
    const existingProduct = await prisma.decorationProduct.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            compatibilities: true,
            pricing: true
          }
        }
      }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Decoration product not found' }, { status: 404 });
    }

    // Delete the decoration product (cascades to related records)
    await prisma.decorationProduct.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Decoration product deleted successfully',
      deletedCounts: {
        compatibilities: existingProduct._count.compatibilities,
        pricing: existingProduct._count.pricing
      }
    });
  } catch (error) {
    console.error('Error deleting decoration product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}