import { prisma } from './prisma';

export interface PricingRequest {
  decorationProductId: string;
  quantity: number;
  width?: number;
  height?: number;
  colorCount?: number;
  artworkType?: 'EASY_PRINTS' | 'VECTOR' | 'NON_VECTOR';
  variantType?: string;
  rushService?: boolean;
}

export interface PricingBreakdownItem {
  description: string;
  unitPrice?: number;
  quantity?: number;
  totalPrice: number;
  type: 'UNIT_COST' | 'SETUP_FEE' | 'SAMPLE_FEE' | 'EDIT_FEE' | 'RUSH_FEE' | 'COLOR_FEE';
}

export interface PricingResult {
  unitPrice: number;
  totalUnitCost: number;
  setupFee: number;
  sampleFee: number;
  editFee?: number;
  rushFee?: number;
  totalPrice: number;
  breakdown: PricingBreakdownItem[];
  appliedPricing?: {
    minQuantity: number;
    maxQuantity?: number;
    sizeRange?: string;
    colorCount?: number;
    artworkType?: string;
  };
  errors?: string[];
}

export class PricingCalculator {
  /**
   * Calculate pricing for a decoration product based on request parameters
   */
  async calculatePricing(request: PricingRequest): Promise<PricingResult> {
    const errors: string[] = [];
    const breakdown: PricingBreakdownItem[] = [];

    try {
      // Get decoration product with vendor info
      const decorationProduct = await prisma.decorationProduct.findUnique({
        where: { id: request.decorationProductId },
        include: {
          vendor: true,
          category: true,
          pricing: {
            include: {
              sizeRange: true
            },
            where: {
              isActive: true
            },
            orderBy: [
              { minQuantity: 'asc' },
              { sizeRange: { name: 'asc' } },
              { colorCount: 'asc' }
            ]
          }
        }
      });

      if (!decorationProduct) {
        throw new Error('Decoration product not found');
      }

      // Validate minimum quantity
      if (request.quantity < decorationProduct.minimumQuantity) {
        errors.push(`Minimum quantity is ${decorationProduct.minimumQuantity}`);
      }

      // Find applicable size range
      let applicableSizeRange = null;
      if (request.width && request.height && decorationProduct.hasSizePricing) {
        applicableSizeRange = await this.findApplicableSizeRange(
          request.width, 
          request.height, 
          decorationProduct.pricing.map(p => p.sizeRange).filter(Boolean)
        );
      }

      // Find the best matching pricing record
      const applicablePricing = this.findApplicablePricing(
        decorationProduct.pricing,
        {
          quantity: request.quantity,
          sizeRangeId: applicableSizeRange?.id,
          colorCount: request.colorCount,
          artworkType: request.artworkType,
          variantType: request.variantType
        }
      );

      if (!applicablePricing) {
        // Fallback to legacy pricing or error
        if (decorationProduct.perUnitCost) {
          return this.calculateLegacyPricing(decorationProduct, request);
        }
        throw new Error('No applicable pricing found for the requested parameters');
      }

      const unitPrice = Number(applicablePricing.unitPrice);
      const totalUnitCost = unitPrice * request.quantity;

      breakdown.push({
        description: `Unit cost (${request.quantity} × ${this.formatPrice(unitPrice)})`,
        unitPrice,
        quantity: request.quantity,
        totalPrice: totalUnitCost,
        type: 'UNIT_COST'
      });

      // Add fixed costs
      let setupFee = 0;
      let sampleFee = 0;
      let editFee = 0;
      let rushFee = 0;

      if (decorationProduct.artSetupFee) {
        setupFee = Number(decorationProduct.artSetupFee);
        breakdown.push({
          description: 'Art setup fee',
          totalPrice: setupFee,
          type: 'SETUP_FEE'
        });
      }

      if (decorationProduct.sampleFee) {
        sampleFee = Number(decorationProduct.sampleFee);
        breakdown.push({
          description: 'Pre-production sample',
          totalPrice: sampleFee,
          type: 'SAMPLE_FEE'
        });
      }

      if (decorationProduct.editFee) {
        editFee = Number(decorationProduct.editFee);
        breakdown.push({
          description: 'Edit fee (if applicable)',
          totalPrice: editFee,
          type: 'EDIT_FEE'
        });
      }

      if (request.rushService && decorationProduct.rushFee) {
        rushFee = Number(decorationProduct.rushFee);
        breakdown.push({
          description: 'Rush service fee',
          totalPrice: rushFee,
          type: 'RUSH_FEE'
        });
      }

      const totalPrice = totalUnitCost + setupFee + sampleFee + (request.rushService ? rushFee : 0);

      return {
        unitPrice,
        totalUnitCost,
        setupFee,
        sampleFee,
        editFee: editFee > 0 ? editFee : undefined,
        rushFee: request.rushService ? rushFee : undefined,
        totalPrice,
        breakdown,
        appliedPricing: {
          minQuantity: applicablePricing.minQuantity,
          maxQuantity: applicablePricing.maxQuantity,
          sizeRange: applicablePricing.sizeRange?.name,
          colorCount: applicablePricing.colorCount,
          artworkType: applicablePricing.artworkType
        },
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('Pricing calculation error:', error);
      
      return {
        unitPrice: 0,
        totalUnitCost: 0,
        setupFee: 0,
        sampleFee: 0,
        totalPrice: 0,
        breakdown: [],
        errors: [error instanceof Error ? error.message : 'Pricing calculation failed']
      };
    }
  }

  /**
   * Find applicable size range based on dimensions
   */
  private async findApplicableSizeRange(width: number, height: number, sizeRanges: any[]): Promise<any | null> {
    for (const sizeRange of sizeRanges) {
      if (!sizeRange) continue;

      // Calculate based on method
      let calculatedSize: number;
      
      switch (sizeRange.calculationMethod) {
        case 'AVERAGE':
          calculatedSize = (width + height) / 2;
          break;
        case 'AREA':
          calculatedSize = width * height;
          break;
        case 'MAX_DIMENSION':
          calculatedSize = Math.max(width, height);
          break;
        default:
          calculatedSize = Math.max(width, height);
      }

      // Check if size fits in range
      const minSize = sizeRange.minWidth || 0;
      const maxSize = sizeRange.maxWidth || Infinity;
      
      if (calculatedSize >= minSize && calculatedSize <= maxSize) {
        return sizeRange;
      }
    }

    return null;
  }

  /**
   * Find the best matching pricing record
   */
  private findApplicablePricing(pricingRecords: any[], criteria: {
    quantity: number;
    sizeRangeId?: string;
    colorCount?: number;
    artworkType?: string;
    variantType?: string;
  }): any | null {
    // Filter records that match quantity range
    let applicableRecords = pricingRecords.filter(record => 
      criteria.quantity >= record.minQuantity && 
      (record.maxQuantity === null || criteria.quantity <= record.maxQuantity)
    );

    // Further filter by other criteria if specified
    if (criteria.sizeRangeId) {
      applicableRecords = applicableRecords.filter(record => 
        record.sizeRangeId === criteria.sizeRangeId
      );
    }

    if (criteria.colorCount) {
      applicableRecords = applicableRecords.filter(record => 
        !record.colorCount || record.colorCount === criteria.colorCount
      );
    }

    if (criteria.artworkType) {
      applicableRecords = applicableRecords.filter(record => 
        !record.artworkType || record.artworkType === criteria.artworkType
      );
    }

    if (criteria.variantType) {
      applicableRecords = applicableRecords.filter(record => 
        !record.variantType || record.variantType === criteria.variantType
      );
    }

    // Return the best match (most specific)
    if (applicableRecords.length > 0) {
      // Sort by specificity (more criteria matched = higher priority)
      return applicableRecords.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        if (a.sizeRangeId) scoreA++;
        if (a.colorCount) scoreA++;
        if (a.artworkType) scoreA++;
        if (a.variantType) scoreA++;
        
        if (b.sizeRangeId) scoreB++;
        if (b.colorCount) scoreB++;
        if (b.artworkType) scoreB++;
        if (b.variantType) scoreB++;
        
        return scoreB - scoreA; // Higher score first
      })[0];
    }

    return null;
  }

  /**
   * Fallback to legacy pricing calculation
   */
  private calculateLegacyPricing(decorationProduct: any, request: PricingRequest): PricingResult {
    const breakdown: PricingBreakdownItem[] = [];
    
    const unitPrice = Number(decorationProduct.perUnitCost || 0);
    const totalUnitCost = unitPrice * request.quantity;
    
    breakdown.push({
      description: `Unit cost (${request.quantity} × ${this.formatPrice(unitPrice)})`,
      unitPrice,
      quantity: request.quantity,
      totalPrice: totalUnitCost,
      type: 'UNIT_COST'
    });

    let setupFee = 0;
    if (decorationProduct.baseSetupCost) {
      setupFee = Number(decorationProduct.baseSetupCost);
      breakdown.push({
        description: 'Setup cost',
        totalPrice: setupFee,
        type: 'SETUP_FEE'
      });
    }

    // Add per-color costs
    let colorFee = 0;
    if (request.colorCount && decorationProduct.perColorCost && request.colorCount > 1) {
      colorFee = Number(decorationProduct.perColorCost) * (request.colorCount - 1);
      breakdown.push({
        description: `Additional colors (${request.colorCount - 1} × ${this.formatPrice(Number(decorationProduct.perColorCost))})`,
        totalPrice: colorFee,
        type: 'COLOR_FEE'
      });
    }

    const totalPrice = totalUnitCost + setupFee + colorFee;

    return {
      unitPrice,
      totalUnitCost,
      setupFee,
      sampleFee: 0,
      totalPrice,
      breakdown
    };
  }

  /**
   * Format price as currency string
   */
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  /**
   * Get quantity break pricing for display
   */
  async getQuantityBreaks(decorationProductId: string, options?: {
    sizeRangeId?: string;
    colorCount?: number;
    artworkType?: string;
  }): Promise<Array<{ quantity: number; unitPrice: number; totalPrice: number }>> {
    const decorationProduct = await prisma.decorationProduct.findUnique({
      where: { id: decorationProductId },
      include: {
        pricing: {
          where: {
            isActive: true,
            ...(options?.sizeRangeId && { sizeRangeId: options.sizeRangeId }),
            ...(options?.colorCount && { colorCount: options.colorCount }),
            ...(options?.artworkType && { artworkType: options.artworkType })
          },
          orderBy: { minQuantity: 'asc' }
        }
      }
    });

    if (!decorationProduct) {
      return [];
    }

    return decorationProduct.pricing.map(pricing => ({
      quantity: pricing.minQuantity,
      unitPrice: Number(pricing.unitPrice),
      totalPrice: Number(pricing.unitPrice) * pricing.minQuantity
    }));
  }
}

// Export singleton instance
export const pricingCalculator = new PricingCalculator();