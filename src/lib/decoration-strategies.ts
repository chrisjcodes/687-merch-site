// Strategy pattern for decoration product types

export interface DecorationTypeStrategy {
  id: string;
  name: string;
  displayName: string;
  description: string;
  pricingModel: 'QUANTITY_BREAKS' | 'SIZE_QUANTITY' | 'COLOR_QUANTITY' | 'STITCH_COUNT';
  hasColorPricing: boolean;
  hasArtworkPricing: boolean;
  hasSizePricing: boolean;
  hasVariantPricing: boolean;
  colorPricingType?: 'PER_COLOR' | 'FLAT_MULTI' | 'INCLUSIVE';
  sizeCalculationMethod?: 'AVERAGE' | 'AREA' | 'MAX_DIMENSION';
  
  // Default form configuration
  defaultFields: {
    artSetupFee?: number;
    sampleFee?: number;
    editFee?: number;
    rushFee?: number;
    minimumQuantity: number;
    maxColors?: number;
  };
  
  // Size ranges specific to this type
  sizeRanges?: Array<{
    name: string;
    minSize?: number;
    maxSize?: number;
    description: string;
  }>;
  
  // Color options
  colorOptions?: string[];
  
  // Artwork types supported
  artworkTypes?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  
  // Variant types
  variantTypes?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  
  // Quantity break suggestions
  quantityBreaks: Array<{
    minQty: number;
    maxQty?: number;
    label: string;
  }>;
  
  // Form validation rules
  validationRules?: {
    requiredFields: string[];
    customValidation?: (data: any) => string | null;
  };
}

export const DECORATION_STRATEGIES: Record<string, DecorationTypeStrategy> = {
  SCREEN_PRINT_TRANSFERS: {
    id: 'screen_print_transfers',
    name: 'screen_print_transfers',
    displayName: 'Screen Print Transfers',
    description: 'Gang sheet screen printed transfers with color and artwork type pricing',
    pricingModel: 'COLOR_QUANTITY',
    hasColorPricing: true,
    hasArtworkPricing: true,
    hasSizePricing: true,
    hasVariantPricing: true,
    colorPricingType: 'PER_COLOR',
    sizeCalculationMethod: 'AREA',
    
    defaultFields: {
      minimumQuantity: 6,
      rushFee: 25.00,
    },
    
    sizeRanges: [
      { name: 'Standard Gang Sheet 11.25" x 14"', description: 'Standard gang sheet size' },
      { name: 'Jumbo Gang Sheet 12.5" x 17.5"', description: 'Jumbo gang sheet size' },
    ],
    
    artworkTypes: [
      { value: 'EASY_PRINTS', label: 'Easy Prints', description: 'Vendor layouts and clip art' },
      { value: 'VECTOR', label: 'Vector Artwork', description: 'Customer vector files' },
      { value: 'NON_VECTOR', label: 'Non-Vector Artwork', description: 'Raster/bitmap files' },
    ],
    
    variantTypes: [
      { value: 'STANDARD', label: 'Standard', description: 'Regular plastisol ink' },
      { value: 'PUFF', label: 'Puff Print', description: 'Raised puff ink effect' },
      { value: 'GLOW', label: 'Glow in Dark', description: 'Glow in the dark ink' },
      { value: 'REFLECTIVE', label: 'Reflective', description: 'Reflective material' },
    ],
    
    quantityBreaks: [
      { minQty: 6, maxQty: 11, label: '6-11' },
      { minQty: 12, maxQty: 17, label: '12-17' },
      { minQty: 18, maxQty: 23, label: '18-23' },
      { minQty: 24, maxQty: 35, label: '24-35' },
      { minQty: 36, maxQty: 47, label: '36-47' },
      { minQty: 48, maxQty: 59, label: '48-59' },
      { minQty: 60, maxQty: 71, label: '60-71' },
      { minQty: 72, maxQty: 89, label: '72-89' },
      { minQty: 90, maxQty: 107, label: '90-107' },
      { minQty: 108, maxQty: 143, label: '108-143' },
      { minQty: 144, maxQty: 179, label: '144-179' },
      { minQty: 180, maxQty: 215, label: '180-215' },
      { minQty: 216, maxQty: 251, label: '216-251' },
      { minQty: 252, label: '252+' },
    ],
    
    validationRules: {
      requiredFields: ['name', 'displayName', 'vendorId'],
    },
  },

  HYBRID_TRANSFERS: {
    id: 'hybrid_transfers',
    name: 'hybrid_transfers',
    displayName: 'Hybrid Transfers',
    description: 'Digital hybrid transfers with single vs multi-color pricing',
    pricingModel: 'COLOR_QUANTITY',
    hasColorPricing: true,
    hasArtworkPricing: false,
    hasSizePricing: true,
    hasVariantPricing: false,
    colorPricingType: 'FLAT_MULTI',
    sizeCalculationMethod: 'AREA',
    
    defaultFields: {
      minimumQuantity: 10,
    },
    
    sizeRanges: [
      { name: '11.7" x 11.7"', description: 'Standard hybrid transfer size' },
      { name: '9" x 12"', description: 'Small hybrid transfer size' },
      { name: '12" x 16"', description: 'Large hybrid transfer size' },
    ],
    
    quantityBreaks: [
      { minQty: 10, maxQty: 19, label: '10-19' },
      { minQty: 20, maxQty: 49, label: '20-49' },
      { minQty: 50, maxQty: 99, label: '50-99' },
      { minQty: 100, maxQty: 199, label: '100-199' },
      { minQty: 200, maxQty: 299, label: '200-299' },
      { minQty: 300, maxQty: 499, label: '300-499' },
      { minQty: 500, maxQty: 999, label: '500-999' },
      { minQty: 1000, maxQty: 2499, label: '1000-2499' },
      { minQty: 2500, maxQty: 4999, label: '2500-4999' },
      { minQty: 5000, label: '5000+' },
    ],
    
    validationRules: {
      requiredFields: ['name', 'displayName', 'vendorId'],
    },
  },

  LEATHER_PATCHES: {
    id: 'leather_patches',
    name: 'leather_patches',
    displayName: 'Leather Patches',
    description: 'Custom leather patches with size-based quantity pricing',
    pricingModel: 'SIZE_QUANTITY',
    hasColorPricing: false,
    hasArtworkPricing: false,
    hasSizePricing: true,
    hasVariantPricing: false,
    colorPricingType: 'INCLUSIVE',
    sizeCalculationMethod: 'AVERAGE',
    
    defaultFields: {
      artSetupFee: 30.00,
      sampleFee: 15.00,
      editFee: 25.00,
      minimumQuantity: 12,
    },
    
    sizeRanges: [
      { name: 'Up to 1.50"', maxSize: 1.50, description: 'Small patches up to 1.50 inches' },
      { name: '1.51" - 2.00"', minSize: 1.51, maxSize: 2.00, description: 'Medium-small patches' },
      { name: '2.01" - 2.50"', minSize: 2.01, maxSize: 2.50, description: 'Medium patches' },
      { name: '2.51" - 3.00"', minSize: 2.51, maxSize: 3.00, description: 'Medium-large patches' },
      { name: '3.01" - 3.50"', minSize: 3.01, maxSize: 3.50, description: 'Large patches' },
      { name: '3.51" - 4.00"', minSize: 3.51, maxSize: 4.00, description: 'Extra large patches' },
    ],
    
    quantityBreaks: [
      { minQty: 12, maxQty: 24, label: '12-24' },
      { minQty: 25, maxQty: 49, label: '25-49' },
      { minQty: 50, maxQty: 99, label: '50-99' },
      { minQty: 100, maxQty: 249, label: '100-249' },
      { minQty: 250, maxQty: 499, label: '250-499' },
      { minQty: 500, maxQty: 999, label: '500-999' },
      { minQty: 1000, maxQty: 2499, label: '1000-2499' },
      { minQty: 2500, maxQty: 4999, label: '2500-4999' },
      { minQty: 5000, maxQty: 9999, label: '5000-9999' },
      { minQty: 10000, label: '10000+' },
    ],
    
    validationRules: {
      requiredFields: ['name', 'displayName', 'vendorId'],
    },
  },

  EMBROIDERED_PATCHES: {
    id: '3d_embroidered_patches',
    name: '3d_embroidered_patches',
    displayName: '3D Embroidered Patches',
    description: '3D embroidered patches with multi-color thread (up to 6 colors included)',
    pricingModel: 'SIZE_QUANTITY',
    hasColorPricing: false, // Colors are inclusive
    hasArtworkPricing: false,
    hasSizePricing: true,
    hasVariantPricing: false,
    colorPricingType: 'INCLUSIVE',
    sizeCalculationMethod: 'AVERAGE',
    
    defaultFields: {
      artSetupFee: 30.00,
      sampleFee: 15.00,
      editFee: 20.00,
      minimumQuantity: 12,
      maxColors: 6,
    },
    
    sizeRanges: [
      { name: 'Up to 1"', maxSize: 1.00, description: 'Extra small patches up to 1 inch' },
      { name: '1.01" - 1.50"', minSize: 1.01, maxSize: 1.50, description: 'Small patches' },
      { name: '1.51" - 2.00"', minSize: 1.51, maxSize: 2.00, description: 'Medium-small patches' },
      { name: '2.01" - 2.50"', minSize: 2.01, maxSize: 2.50, description: 'Medium patches' },
      { name: '2.51" - 3.00"', minSize: 2.51, maxSize: 3.00, description: 'Medium-large patches' },
      { name: '3.01" - 3.50"', minSize: 3.01, maxSize: 3.50, description: 'Large patches' },
      { name: '3.51" - 4.00"', minSize: 3.51, maxSize: 4.00, description: 'Extra large patches' },
    ],
    
    quantityBreaks: [
      { minQty: 12, maxQty: 24, label: '12-24' },
      { minQty: 25, maxQty: 49, label: '25-49' },
      { minQty: 50, maxQty: 99, label: '50-99' },
      { minQty: 100, maxQty: 199, label: '100-199' },
      { minQty: 200, maxQty: 299, label: '200-299' },
      { minQty: 300, maxQty: 499, label: '300-499' },
      { minQty: 500, maxQty: 999, label: '500-999' },
      { minQty: 1000, maxQty: 1999, label: '1000-1999' },
      { minQty: 2000, maxQty: 4999, label: '2000-4999' },
      { minQty: 5000, maxQty: 9999, label: '5000-9999' },
      { minQty: 10000, label: '10000+' },
    ],
    
    validationRules: {
      requiredFields: ['name', 'displayName', 'vendorId'],
    },
  },

  DIRECT_EMBROIDERY: {
    id: 'direct_embroidery',
    name: 'direct_embroidery',
    displayName: 'Direct Embroidery',
    description: 'Direct embroidery on garments with stitch count pricing',
    pricingModel: 'STITCH_COUNT',
    hasColorPricing: true,
    hasArtworkPricing: false,
    hasSizePricing: true,
    hasVariantPricing: false,
    colorPricingType: 'PER_COLOR',
    sizeCalculationMethod: 'AREA',
    
    defaultFields: {
      artSetupFee: 50.00,
      minimumQuantity: 12,
    },
    
    sizeRanges: [
      { name: 'Left Chest (4" x 4")', description: 'Standard left chest placement' },
      { name: 'Full Back (12" x 12")', description: 'Large back design' },
      { name: 'Hat/Cap (4" x 2")', description: 'Standard cap embroidery' },
    ],
    
    quantityBreaks: [
      { minQty: 12, maxQty: 23, label: '12-23' },
      { minQty: 24, maxQty: 47, label: '24-47' },
      { minQty: 48, maxQty: 95, label: '48-95' },
      { minQty: 96, maxQty: 143, label: '96-143' },
      { minQty: 144, maxQty: 287, label: '144-287' },
      { minQty: 288, maxQty: 575, label: '288-575' },
      { minQty: 576, label: '576+' },
    ],
    
    validationRules: {
      requiredFields: ['name', 'displayName', 'vendorId'],
    },
  },

  HEAT_TRANSFER_VINYL: {
    id: 'heat_transfer_vinyl',
    name: 'heat_transfer_vinyl',
    displayName: 'Heat Transfer Vinyl (HTV)',
    description: 'Heat transfer vinyl with color and complexity pricing',
    pricingModel: 'COLOR_QUANTITY',
    hasColorPricing: true,
    hasArtworkPricing: false,
    hasSizePricing: true,
    hasVariantPricing: true,
    colorPricingType: 'PER_COLOR',
    sizeCalculationMethod: 'AREA',
    
    defaultFields: {
      minimumQuantity: 1,
    },
    
    sizeRanges: [
      { name: '4" x 4"', description: 'Small design' },
      { name: '8" x 10"', description: 'Medium design' },
      { name: '12" x 15"', description: 'Large design' },
    ],
    
    variantTypes: [
      { value: 'STANDARD', label: 'Standard HTV', description: 'Regular heat transfer vinyl' },
      { value: 'GLITTER', label: 'Glitter HTV', description: 'Sparkle glitter vinyl' },
      { value: 'METALLIC', label: 'Metallic HTV', description: 'Metallic foil finish' },
      { value: 'FLOCK', label: 'Flock HTV', description: 'Fuzzy velvet texture' },
    ],
    
    quantityBreaks: [
      { minQty: 1, maxQty: 11, label: '1-11' },
      { minQty: 12, maxQty: 23, label: '12-23' },
      { minQty: 24, maxQty: 47, label: '24-47' },
      { minQty: 48, maxQty: 95, label: '48-95' },
      { minQty: 96, maxQty: 143, label: '96-143' },
      { minQty: 144, label: '144+' },
    ],
    
    validationRules: {
      requiredFields: ['name', 'displayName', 'vendorId'],
    },
  },
};

export function getDecorationStrategy(strategyId: string): DecorationTypeStrategy | null {
  return DECORATION_STRATEGIES[strategyId] || null;
}

export function getAvailableStrategies(): DecorationTypeStrategy[] {
  return Object.values(DECORATION_STRATEGIES);
}