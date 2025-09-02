import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

interface PlacementCost {
  id: string;
  location: string;
  width: number;
  height: number;
  decorationMethod: string;
  transferCost: number;
}

interface PricingRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  sizeBreakdown?: Record<string, number>;
  markupPercentage?: number;
  placements: PlacementCost[];
}

interface PricingResponse {
  materialCost: number;
  appliqueCost: number;
  decorationBreakdown: {
    initialFee: number;
    additionalPlacementFees: number;
    transferCosts: number;
    total: number;
  };
  totalCostPerItem: number;
  totalCost: number;
  quantityBreak?: string;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const body: PricingRequest = await request.json();
    const { productId, variantId, quantity, sizeBreakdown, markupPercentage = 0, placements } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, quantity' },
        { status: 400 }
      );
    }

    // Get product and variant information
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
        sizePricing: {
          where: { isActive: true },
          orderBy: { size: 'asc' }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const selectedVariant = variantId ? product.variants.find(v => v.id === variantId) : null;
    const variantAdjustment = Number(selectedVariant?.priceAdjustment) || 0;

    // Calculate base material cost based on size breakdown or single quantity
    let baseMaterialCost = 0;
    if (sizeBreakdown && Object.keys(sizeBreakdown).length > 0) {
      // Size-based pricing
      for (const [size, qty] of Object.entries(sizeBreakdown)) {
        if (qty > 0) {
          const sizePrice = product.sizePricing.find(sp => sp.size === size);
          const basePriceForSize = sizePrice 
            ? Number(sizePrice.currentPrice) 
            : Number(product.currentPrice);
          baseMaterialCost += (basePriceForSize + variantAdjustment) * qty;
        }
      }
    } else {
      // Single pricing for all quantities
      const basePrice = Number(product.currentPrice) + variantAdjustment;
      baseMaterialCost = basePrice * quantity;
    }

    // Apply markup percentage to get final material cost
    const materialCost = baseMaterialCost;
    const markupMultiplier = (100 + markupPercentage) / 100;
    const appliqueCost = baseMaterialCost * markupMultiplier;

    // Calculate decoration costs using your pricing model
    const calculateDecorationCosts = () => {
      const placementCount = placements.length;
      if (placementCount === 0) return { initialFee: 0, additionalPlacementFees: 0, transferCosts: 0, total: 0 };

      // Sliding scale for initial decoration fee based on quantity
      let initialFee = 5.00; // Default for 1-49
      let quantityBreak = '1-49 items';
      
      if (quantity >= 100) {
        initialFee = 4.75;
        quantityBreak = '100+ items';
      } else if (quantity >= 50) {
        initialFee = 4.85;
        quantityBreak = '50-99 items';
      }

      // $2 for each additional placement (stays constant)
      const additionalPlacementFees = Math.max(0, placementCount - 1) * 2.00;

      // Sum up transfer/patch costs for each placement
      const transferCosts = placements.reduce((total, placement) => {
        return total + (placement.transferCost || 0);
      }, 0);

      const decorationTotal = (initialFee + additionalPlacementFees + transferCosts) * quantity;

      return {
        initialFee,
        additionalPlacementFees,
        transferCosts,
        total: decorationTotal,
        quantityBreak
      };
    };

    const decorationBreakdown = calculateDecorationCosts();
    
    const totalCost = appliqueCost + decorationBreakdown.total;
    const totalCostPerItem = quantity > 0 ? totalCost / quantity : 0;

    const response: PricingResponse = {
      materialCost,
      appliqueCost,
      decorationBreakdown,
      totalCostPerItem,
      totalCost,
      quantityBreak: decorationBreakdown.quantityBreak
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}