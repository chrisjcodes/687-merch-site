import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all decoration vendors
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const vendors = await prisma.decorationVendor.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { displayName: 'asc' }
    });

    return NextResponse.json({ vendors });
  } catch (error) {
    console.error('Error fetching decoration vendors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new decoration vendor
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
      contactInfo,
      paymentTerms,
      minimumOrder,
      shippingInfo,
      rushServiceAvailable = false,
      rushServiceRate,
      colorMatchFee,
      artProofFee,
      isActive = true
    } = body;

    // Validate required fields
    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      );
    }

    // Check if vendor with this name already exists
    const existingVendor = await prisma.decorationVendor.findUnique({
      where: { name }
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: 'Vendor with this name already exists' },
        { status: 409 }
      );
    }

    // Create the vendor
    const vendor = await prisma.decorationVendor.create({
      data: {
        name,
        displayName,
        contactInfo,
        paymentTerms,
        minimumOrder,
        shippingInfo,
        rushServiceAvailable,
        rushServiceRate,
        colorMatchFee,
        artProofFee,
        isActive
      }
    });

    return NextResponse.json({ vendor }, { status: 201 });
  } catch (error) {
    console.error('Error creating decoration vendor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}