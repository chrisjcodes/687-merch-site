# Appliques & Decorations System Design

## Business Model Overview

The system now properly reflects the two-part material structure:

1. **Appliques** = Items that can be decorated (t-shirts, hoodies, caps, bags, etc.)
2. **Decoration Methods** = Ways to decorate appliques with variants and vendor pricing

## Database Structure

### Appliques (Current "Product" Model)
- **Product** model represents appliques - items that can be decorated
- Examples: T-shirts, Hoodies, Caps, Tote Bags
- Attributes: SKU, Name, Category, Brand, Sizes, Base Pricing

### Decoration Methods Hierarchy
1. **DecorationMethod** (Base category)
   - Examples: "Screen Print", "Embroidery", "Heat Transfer Vinyl"
   - Basic properties: name, description, size constraints

2. **DecorationMethodVariant** (Specific variants within each method)
   - Examples under Screen Print: "Standard Print", "Puff Print", "Glow in the Dark", "Reflective"
   - Examples under Heat Transfer: "Standard HTV", "Glitter HTV", "Holographic HTV"
   - Properties: color options, size constraints, specifications

3. **DecorationVendor** (Suppliers)
   - Examples: "SanMar", "Alphabroder", "Local Print Shop"
   - Contact info, payment terms, shipping details

4. **DecorationVendorPricing** (Vendor-specific pricing for variants)
   - Links variants to vendors with pricing
   - Setup costs, per-unit costs, quantity breaks
   - Minimum quantities, turnaround times

## Example Data Structure

### Screen Print Method
**Method**: Screen Print
- **Variants**:
  - Standard Screen Print
  - Puff Print (raised texture)
  - Glow in the Dark
  - Reflective Print
  - Metallic Print

**Vendor Pricing Example**:
```
Standard Screen Print - Local Print Shop:
- Setup: $25.00
- Per Unit: $2.50 (1-49 qty)
- Per Unit: $2.25 (50-99 qty)  
- Per Unit: $2.00 (100+ qty)
- Turnaround: 5-7 days

Puff Print - Specialty Vendor:
- Setup: $35.00
- Per Unit: $3.75
- Min Qty: 24
- Turnaround: 7-10 days
```

### Heat Transfer Method
**Method**: Heat Transfer Vinyl
- **Variants**:
  - Standard HTV
  - Glitter HTV
  - Holographic HTV
  - Reflective HTV
  - Flock (fuzzy texture)

### Embroidery Method  
**Method**: Embroidery
- **Variants**:
  - Standard Embroidery
  - 3D Puff Embroidery
  - Metallic Thread
  - Applique Embroidery

## Implementation Plan

### Phase 1: Enhanced UI Updates ✅
- [x] Add new database models
- [x] Update existing decoration method management
- [ ] Update terminology from "Products" to "Appliques" 
- [ ] Add variant management interface
- [ ] Add vendor management interface

### Phase 2: Vendor & Pricing Management
- [ ] Create vendor management system
- [ ] Build pricing management interface with quantity breaks
- [ ] Add preferred vendor selection
- [ ] Cost calculation engine

### Phase 3: Advanced Features
- [ ] Integration with job creation system
- [ ] Automatic cost calculations based on quantities
- [ ] Vendor comparison tools
- [ ] Purchase order generation

## Benefits of This Structure

1. **Accurate Business Model**: Reflects actual two-part material structure
2. **Flexible Pricing**: Multiple vendors per variant with complex pricing tiers
3. **Vendor Management**: Track relationships, terms, and performance  
4. **Cost Optimization**: Compare vendors and pricing automatically
5. **Scalable**: Easy to add new methods, variants, and vendors
6. **Realistic**: Matches how decoration businesses actually operate

## Current Status

- ✅ Database schema enhanced
- ✅ Basic decoration method variants structure
- ✅ Vendor and pricing models added
- 🔄 UI updates needed to reflect new terminology and structure
- ⏳ Sample data migration needed

## Next Steps

1. Update UI terminology from "Products" to "Appliques"
2. Create variant management interface
3. Build vendor management system
4. Migrate existing decoration method data to new structure