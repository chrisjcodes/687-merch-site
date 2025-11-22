# Vendor-Specific Decoration Products System

## Business Model Overview

The new system treats each vendor's decoration offering as a separate product, recognizing that different vendors provide different quality, pricing, capabilities, and service levels.

## Database Structure

### 1. DecorationCategory (Base decoration types)
- Screen Print, Embroidery, Heat Transfer Vinyl, etc.
- Serves as organizational categories

### 2. DecorationProduct (Vendor-specific offerings)
- Each vendor's specific implementation of a decoration type
- Contains all pricing, specifications, and capabilities for that vendor
- One-to-one relationship: One vendor + One decoration type = One product

### 3. DecorationVendor (Supplier information)
- Vendor contact info, payment terms, shipping details
- Can offer multiple decoration products

## Real-World Examples

### Screen Print Category

**Product 1: Local Print Shop - Screen Print**
- Vendor: Local Print Shop
- Price: $2.50/unit, $25 setup
- Size: 4"×4" to 12"×14" 
- Colors: Up to 4 colors
- Turnaround: 5-7 days
- Quality: Standard
- Minimum: 24 pieces

**Product 2: Premium Printer - Screen Print**
- Vendor: Premium Printer
- Price: $3.75/unit, $35 setup
- Size: 2"×2" to 14"×16"
- Colors: Up to 6 colors
- Turnaround: 3-5 days
- Quality: High-end
- Minimum: 12 pieces

**Product 3: Budget Printer - Screen Print**
- Vendor: Budget Printer
- Price: $1.95/unit, $15 setup
- Size: 6"×6" to 12"×12"
- Colors: Up to 3 colors
- Turnaround: 10-14 days
- Quality: Basic
- Minimum: 48 pieces

### Heat Transfer Vinyl Category

**Product 1: SanMar - Standard HTV**
- Vendor: SanMar
- Price: $1.25/unit, $10 setup
- Size: 3"×3" to 12"×15"
- Colors: 20+ vinyl colors available
- Turnaround: 2-3 days
- Special: Bulk pricing available

**Product 2: Local Shop - Glitter HTV**
- Vendor: Local Vinyl Shop
- Price: $2.75/unit, $15 setup
- Size: 4"×4" to 10"×12"
- Colors: 8 glitter colors
- Turnaround: 5-7 days
- Special: Custom die-cutting

## Benefits of This Approach

### 1. **Accurate Pricing**
Each vendor's actual costs and pricing structure

### 2. **Quality Differentiation** 
Different vendors = different quality levels and capabilities

### 3. **Service Comparison**
Compare turnaround times, minimums, and service levels

### 4. **Vendor Management**
Track vendor relationships, performance, and terms

### 5. **Business Intelligence**
- Which vendors perform best for different job types?
- Cost analysis across vendors for similar services
- Preferred vendor selection based on job requirements

## UI Impact

### Materials Management Interface
Instead of grouping by decoration method, we now show:

| Decoration Product | Vendor | Price | Size Range | Colors | Turnaround | Status |
|--------------------|--------|-------|------------|--------|------------|--------|
| Premium Screen Print | Premium Printer | $3.75 | 2"×2" to 14"×16" | 6 colors | 3-5 days | Active |
| Standard Screen Print | Local Print Shop | $2.50 | 4"×4" to 12"×14" | 4 colors | 5-7 days | Active |
| Budget Screen Print | Budget Printer | $1.95 | 6"×6" to 12"×12" | 3 colors | 10-14 days | Active |
| Standard HTV | SanMar | $1.25 | 3"×3" to 12"×15" | 20+ colors | 2-3 days | Active |
| Glitter HTV | Local Vinyl Shop | $2.75 | 4"×4" to 10"×12" | 8 colors | 5-7 days | Active |

## Job Creation Benefits

When creating a job, users can:
1. **Compare Options** - See all vendor options for a decoration type
2. **Make Informed Decisions** - Consider price vs quality vs turnaround
3. **Select Best Fit** - Choose vendor based on job requirements
4. **Track Performance** - See which vendors consistently deliver

## Migration Strategy

1. **Convert existing decoration methods** to decoration categories
2. **Create vendor-specific products** for each current method
3. **Migrate compatibility rules** to new structure
4. **Update UI** to show vendor-specific products
5. **Create vendor management interface**

This approach provides a much more accurate representation of the business reality where each vendor's offering is a distinct product with its own characteristics, pricing, and capabilities.