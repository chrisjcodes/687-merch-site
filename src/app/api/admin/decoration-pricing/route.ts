import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pricingCalculator, PricingRequest } from '@/lib/pricing-calculator';

// POST - Calculate pricing for decoration product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as PricingRequest;
    
    // Validate required fields
    if (!body.decorationProductId || !body.quantity) {
      return NextResponse.json(
        { error: 'Decoration product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (body.quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const pricingResult = await pricingCalculator.calculatePricing(body);

    return NextResponse.json(pricingResult);
  } catch (error) {
    console.error('Error calculating decoration pricing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get quantity breaks for a decoration product
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const decorationProductId = searchParams.get('decorationProductId');
    const sizeRangeId = searchParams.get('sizeRangeId') || undefined;
    const colorCount = searchParams.get('colorCount') ? parseInt(searchParams.get('colorCount')!) : undefined;
    const artworkType = searchParams.get('artworkType') as 'EASY_PRINTS' | 'VECTOR' | 'NON_VECTOR' || undefined;

    if (!decorationProductId) {
      return NextResponse.json(
        { error: 'Decoration product ID is required' },
        { status: 400 }
      );
    }

    // Get quantity breaks
    const quantityBreaks = await pricingCalculator.getQuantityBreaks(
      decorationProductId,
      {
        sizeRangeId,
        colorCount,
        artworkType
      }
    );

    return NextResponse.json({ quantityBreaks });
  } catch (error) {
    console.error('Error fetching quantity breaks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}