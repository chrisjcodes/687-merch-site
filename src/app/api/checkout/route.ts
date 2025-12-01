import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.variantId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Invalid item structure' },
          { status: 400 }
        );
      }
    }

    // Create checkout with Shopify
    const checkout = await createCheckout(items);

    return NextResponse.json({
      checkoutId: checkout.id,
      checkoutUrl: checkout.webUrl,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
