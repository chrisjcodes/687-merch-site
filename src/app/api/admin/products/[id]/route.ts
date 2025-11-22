import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

// GET - Get single product
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { name: 'asc' }
        },
        sizePricing: {
          orderBy: { size: 'asc' }
        },
        placementAnchors: {
          where: { isActive: true },
          orderBy: { name: 'asc' }
        },
        decorationCompatibilities: {
          include: {
            decorationMethod: true
          },
          orderBy: {
            decorationMethod: {
              displayName: 'asc'
            }
          }
        },
        _count: {
          select: {
            jobItems: true,
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      sku,
      name,
      category,
      brand,
      basePrice,
      currentPrice,
      sizeSystem,
      availableSizes,
      decorationMethods,
      weight,
      color,
      material,
      isActive,
    } = body;

    // Validate required fields
    if (!sku || !name || !category || !basePrice || !currentPrice || !sizeSystem) {
      return NextResponse.json(
        { error: 'SKU, name, category, base price, current price, and size system are required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if another product with this SKU already exists (if SKU changed)
    if (sku !== existingProduct.sku) {
      const productWithSku = await prisma.product.findUnique({
        where: { sku },
      });

      if (productWithSku) {
        return NextResponse.json(
          { error: 'Another product with this SKU already exists' },
          { status: 409 }
        );
      }
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        sku,
        name,
        category,
        brand,
        basePrice,
        currentPrice,
        sizeSystem,
        availableSizes: availableSizes || [],
        decorationMethods: decorationMethods || [],
        weight,
        color,
        material,
        isActive,
      },
      include: {
        variants: true,
        sizePricing: true,
        placementAnchors: true,
        decorationCompatibilities: {
          include: {
            decorationMethod: true
          }
        }
      }
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if product exists and has usage
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            jobItems: true,
            itemTemplates: true,
          }
        }
      }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is being used
    if (existingProduct._count.jobItems > 0 || existingProduct._count.itemTemplates > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product that is being used in jobs or item templates. Deactivate it instead.' },
        { status: 409 }
      );
    }

    // Delete the product (this will cascade to related records)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}