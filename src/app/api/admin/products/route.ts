import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductCategory, SizeSystem } from '@prisma/client';

// GET - Get all appliques
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category') as ProductCategory | null;
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    // Build where condition
    let whereCondition: any = {};
    
    if (search) {
      whereCondition.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      whereCondition.category = category;
    }
    
    if (isActive !== null) {
      whereCondition.isActive = isActive === 'true';
    }

    const products = await prisma.product.findMany({
      where: whereCondition,
      include: {
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            colorHex: true,
            priceAdjustment: true,
            isActive: true,
          }
        },
        sizePricing: {
          select: {
            size: true,
            basePrice: true,
            currentPrice: true,
          }
        },
        decorationCompatibilities: {
          include: {
            decorationProduct: {
              select: {
                id: true,
                name: true,
                displayName: true,
                category: {
                  select: {
                    name: true,
                    displayName: true,
                  }
                },
                vendor: {
                  select: {
                    name: true,
                    displayName: true,
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            jobItems: true,
            placementAnchors: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: page * pageSize,
      take: pageSize,
    });

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where: whereCondition });

    return NextResponse.json({
      products,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching appliques:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      isActive = true,
    } = body;

    // Validate required fields
    if (!sku || !name || !category || !basePrice || !currentPrice || !sizeSystem) {
      return NextResponse.json(
        { error: 'SKU, name, category, base price, current price, and size system are required' },
        { status: 400 }
      );
    }

    // Check if product with this SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 409 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
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
        decorationCompatibilities: {
          include: {
            decorationProduct: true
          }
        }
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}