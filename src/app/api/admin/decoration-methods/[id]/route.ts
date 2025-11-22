import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

// GET - Get single decoration method
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const decorationMethod = await prisma.decorationMethod.findUnique({
      where: { id },
      include: {
        compatibilities: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                name: true,
                category: true,
                isActive: true,
              }
            }
          },
          orderBy: {
            product: {
              name: 'asc'
            }
          }
        }
      }
    });

    if (!decorationMethod) {
      return NextResponse.json({ error: 'Decoration method not found' }, { status: 404 });
    }

    return NextResponse.json({ decorationMethod });
  } catch (error) {
    console.error('Error fetching decoration method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update decoration method
export async function PUT(request: NextRequest, { params }: Props) {
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
    } = body;

    // Validate required fields
    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      );
    }

    // Check if decoration method exists
    const existingMethod = await prisma.decorationMethod.findUnique({
      where: { id },
    });

    if (!existingMethod) {
      return NextResponse.json({ error: 'Decoration method not found' }, { status: 404 });
    }

    // Check if another method with this name already exists (if name changed)
    if (name !== existingMethod.name) {
      const methodWithName = await prisma.decorationMethod.findUnique({
        where: { name },
      });

      if (methodWithName) {
        return NextResponse.json(
          { error: 'Another decoration method with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update the decoration method
    const updatedMethod = await prisma.decorationMethod.update({
      where: { id },
      data: {
        name,
        displayName,
        description,
        isActive,
        defaultMinWidth,
        defaultMaxWidth,
        defaultMinHeight,
        defaultMaxHeight,
        colorOptions: colorOptions || [],
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

    return NextResponse.json({ decorationMethod: updatedMethod });
  } catch (error) {
    console.error('Error updating decoration method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete decoration method
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if decoration method exists
    const existingMethod = await prisma.decorationMethod.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            compatibilities: true,
          }
        }
      }
    });

    if (!existingMethod) {
      return NextResponse.json({ error: 'Decoration method not found' }, { status: 404 });
    }

    // Delete the decoration method (compatibilities will be cascade deleted)
    await prisma.decorationMethod.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Decoration method deleted successfully' });
  } catch (error) {
    console.error('Error deleting decoration method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}