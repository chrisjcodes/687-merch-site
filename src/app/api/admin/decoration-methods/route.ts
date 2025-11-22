import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all decoration products (vendor-specific)
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
    
    if (isActive !== null) {
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

// POST - Create new decoration method
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
      isActive = true,
      defaultMinWidth,
      defaultMaxWidth,
      defaultMinHeight,
      defaultMaxHeight,
      colorOptions = [],
      hasColorLimitations = false,
      maxColors,
      baseSetupCost,
      perColorCost,
      perUnitCost,
      estimatedTurnaround,
    } = body;

    // Validate required fields
    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      );
    }

    // Check if decoration method with this name already exists
    const existingMethod = await prisma.decorationMethod.findUnique({
      where: { name }
    });

    if (existingMethod) {
      return NextResponse.json(
        { error: 'Decoration method with this name already exists' },
        { status: 409 }
      );
    }

    // Create the decoration method
    const decorationMethod = await prisma.decorationMethod.create({
      data: {
        name,
        displayName,
        description,
        isActive,
        defaultMinWidth,
        defaultMaxWidth,
        defaultMinHeight,
        defaultMaxHeight,
        colorOptions,
        hasColorLimitations,
        maxColors,
        baseSetupCost,
        perColorCost,
        perUnitCost,
        estimatedTurnaround,
      },
      include: {
        compatibilities: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({ decorationMethod }, { status: 201 });
  } catch (error) {
    console.error('Error creating decoration method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}