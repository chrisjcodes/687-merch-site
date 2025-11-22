import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all decoration products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const vendorId = searchParams.get('vendorId');
    const categoryId = searchParams.get('categoryId');

    // Build where condition
    let whereCondition: any = {};
    
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { vendor: { displayName: { contains: search, mode: 'insensitive' } } },
        { category: { displayName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (isActive !== null && isActive !== undefined) {
      whereCondition.isActive = isActive === 'true';
    }

    if (vendorId) {
      whereCondition.vendorId = vendorId;
    }

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    const decorationProducts = await prisma.decorationProduct.findMany({
      where: whereCondition,
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
          },
          orderBy: {
            product: {
              name: 'asc'
            }
          }
        },
        _count: {
          select: {
            compatibilities: true,
            pricing: true,
          }
        }
      },
      orderBy: [
        { category: { displayName: 'asc' } },
        { vendor: { displayName: 'asc' } },
        { displayName: 'asc' }
      ],
    });

    return NextResponse.json({ decorationProducts });
  } catch (error) {
    console.error('Error fetching decoration products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new decoration product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      displayName,
      description,
      categoryId,
      vendorId,
      pricingType = 'QUANTITY_BREAKS',
      hasColorPricing = false,
      hasArtworkPricing = false,
      hasSizePricing = false,
      colorPricingType,
      maxColors,
      artSetupFee,
      sampleFee,
      editFee,
      rushFee,
      minimumQuantity = 12,
      estimatedTurnaround,
      notes,
      isActive = true,
    } = body;

    // Validate required fields
    if (!name || !displayName || !categoryId || !vendorId) {
      return NextResponse.json(
        { error: 'Name, display name, category, and vendor are required' },
        { status: 400 }
      );
    }

    // Check if decoration product with this name already exists for this vendor/category
    const existingProduct = await prisma.decorationProduct.findFirst({
      where: { 
        name,
        vendorId,
        categoryId
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Decoration product with this name already exists for this vendor and category' },
        { status: 409 }
      );
    }

    // Create the decoration product
    const decorationProduct = await prisma.decorationProduct.create({
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

    return NextResponse.json({ decorationProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating decoration product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}