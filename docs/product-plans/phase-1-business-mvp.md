# Phase 1: Business MVP (4-6 weeks)
*Priority: Fix current operations and deliver immediate value*

## Overview

Phase 1 focuses on updating the core database schema and functionality to match 687 Merch's actual business workflow. This phase eliminates current pain points while establishing the foundation for future configurability.

## Objectives

### Primary Goals
1. **Align Software with Reality**: Update job statuses to match actual workflow
2. **Improve Data Structure**: Create proper product catalog and design management
3. **Enhance Workflow**: Add employee assignment and basic material tracking
4. **Reduce Manual Work**: Eliminate spreadsheet dependencies and manual processes

### Business Impact
- **Job Creation Time**: Reduce by 50% through improved forms and data structure
- **Customer Confusion**: Eliminate through accurate status tracking
- **Production Clarity**: Clear employee assignments and workflow visibility
- **Data Accuracy**: Proper relationships and validation prevent data inconsistencies

## Technical Implementation

### Week 1-2: Critical Schema Updates

#### 1. Job Status Alignment
**Current Problem**: Schema uses generic statuses (QUEUED, APPROVED, etc.) that don't match business workflow

**Solution**: Update to actual business statuses
```prisma
enum JobStatus {
  PENDING_DESIGN      // Waiting for customer design approval
  PENDING_MATERIALS   // Materials need to be ordered/prepared
  PENDING_PRINT       // Ready for production/printing
  PENDING_FULFILLMENT // Printed, ready for packaging/shipping
  DONE               // Complete and delivered
  CANCELLED          // Job cancelled
}

enum JobPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

#### 2. Enhanced Job Model
**Current Problem**: Limited job information and no priority system

**Solution**: Add priority, better tracking, and workflow fields
```prisma
model Job {
  id            String @id @default(cuid())
  jobNumber     String @unique // JOB-2024-001
  customerId    String
  customer      Customer @relation(fields: [customerId], references: [id])
  status        JobStatus @default(PENDING_DESIGN)
  priority      JobPriority @default(NORMAL)
  dueDate       DateTime?
  rushJob       Boolean @default(false)
  estimatedValue Decimal?
  actualValue   Decimal?
  notes         String?
  internalNotes String? // Notes not visible to customer
  
  // Relationships
  items         JobItem[]
  designs       Design[]
  assignments   JobAssignment[]
  events        Event[]
  proofs        Proof[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("jobs")
}
```

#### 3. Proper Product Catalog
**Current Problem**: Products stored as simple strings, no proper catalog

**Solution**: Structured product system matching current inventory
```prisma
model Product {
  id              String @id @default(cuid())
  sku             String @unique
  name            String // "Gildan 64000 Softstyle T-Shirt"
  category        ProductCategory // "TOPS", "HEADWEAR", "BOTTOMS", "ACCESSORIES"
  brand           String? // "Gildan", "Next Level", etc.
  basePrice       Decimal
  currentPrice    Decimal // Allows for price updates without losing base
  isActive        Boolean @default(true)
  
  // Size and decoration configuration
  sizeSystem      SizeSystem // "APPAREL", "OSFA", "CAPS", "SHOES"
  availableSizes  String[] // ["XS","S","M","L","XL","2XL","3XL"]
  decorationMethods String[] // ["HTV","HYBRID_DTF","SCREEN_PRINT_DTF","ADHESIVE_PATCH"]
  
  // Physical properties
  weight          Float? // For shipping calculations
  color           String? // Base color
  material        String? // "100% Cotton", "50/50 Blend"
  
  // Relationships
  jobItems        JobItem[]
  variants        ProductVariant[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("products")
}

enum ProductCategory {
  TOPS
  BOTTOMS
  HEADWEAR
  ACCESSORIES
}

enum SizeSystem {
  APPAREL    // XS, S, M, L, XL, 2XL, etc.
  OSFA       // One Size Fits All
  CAPS       // Youth, Adult
  SHOES      // Numeric sizes
}

model ProductVariant {
  id          String @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  name        String // "Navy", "Black", "Heather Gray"
  sku         String @unique
  colorHex    String? // #000000 for black
  priceAdjustment Decimal @default(0) // +/- from base price
  isActive    Boolean @default(true)
  
  jobItems    JobItem[]
  
  @@map("product_variants")
}
```

### Week 3-4: Design and Job Item Management

#### 4. Separate Design Management
**Current Problem**: Design files mixed with job item data in JSON

**Solution**: Proper design file management with versioning
```prisma
model Design {
  id          String @id @default(cuid())
  jobId       String
  job         Job @relation(fields: [jobId], references: [id], onDelete: Cascade)
  name        String // "Company Logo", "Back Design"
  fileUrl     String // Vercel Blob URL
  fileName    String
  fileSize    Int
  mimeType    String // "image/png", "image/svg+xml", etc.
  version     Int @default(1)
  isActive    Boolean @default(true)
  isApproved  Boolean @default(false)
  approvedAt  DateTime?
  approvedBy  String? // Customer user ID
  
  // Relationships
  placements  DesignPlacement[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("designs")
}

model DesignPlacement {
  id                String @id @default(cuid())
  designId          String
  design            Design @relation(fields: [designId], references: [id], onDelete: Cascade)
  jobItemId         String
  jobItem           JobItem @relation(fields: [jobItemId], references: [id], onDelete: Cascade)
  
  // Placement configuration
  placementType     String // "Full Size Front", "Pocket", "Centered", etc.
  decorationMethod  String // "HTV", "HYBRID_DTF", "SCREEN_PRINT_DTF", "ADHESIVE_PATCH"
  width             Float // inches
  height            Float // inches
  positionX         Float? // X coordinate if precise positioning needed
  positionY         Float? // Y coordinate if precise positioning needed
  
  // Production details
  colors            String[] // Colors used in this placement
  specialInstructions String?
  estimatedTime     Float? // Minutes per piece
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("design_placements")
}
```

#### 5. Enhanced Job Items
**Current Problem**: Complex JSON data structure, hard to query and manage

**Solution**: Normalized structure with proper relationships
```prisma
model JobItem {
  id          String @id @default(cuid())
  jobId       String
  job         Job @relation(fields: [jobId], references: [id], onDelete: Cascade)
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  variantId   String?
  variant     ProductVariant? @relation(fields: [variantId], references: [id])
  
  // Quantity and pricing
  quantity    Int
  unitPrice   Decimal?
  totalPrice  Decimal?
  
  // Special requirements
  rushItem    Boolean @default(false)
  notes       String?
  
  // Relationships
  sizeBreakdown SizeBreakdown[]
  placements    DesignPlacement[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("job_items")
}

model SizeBreakdown {
  id        String @id @default(cuid())
  jobItemId String
  jobItem   JobItem @relation(fields: [jobItemId], references: [id], onDelete: Cascade)
  size      String // "S", "M", "L", etc.
  quantity  Int
  
  @@map("size_breakdowns")
}
```

### Week 5-6: Production Workflow

#### 6. Employee Management
**Current Problem**: No way to assign jobs or track who's working on what

**Solution**: Basic employee system with job assignments
```prisma
model Employee {
  id             String @id @default(cuid())
  employeeNumber String @unique // EMP-001
  name           String
  email          String @unique
  phone          String?
  role           EmployeeRole
  hourlyRate     Decimal? // For future costing
  isActive       Boolean @default(true)
  
  // Relationships
  jobAssignments JobAssignment[]
  user           User? // Link to User account if they need system access
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("employees")
}

enum EmployeeRole {
  DESIGNER       // Creates and manages designs
  PRINT_OPERATOR // Handles printing/production
  FULFILLMENT    // Packaging and shipping
  MANAGER        // Oversees operations
}

model JobAssignment {
  id          String @id @default(cuid())
  jobId       String
  job         Job @relation(fields: [jobId], references: [id], onDelete: Cascade)
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])
  
  // Assignment details
  role        String // "DESIGNER", "PRINTER", "FULFILLMENT"
  assignedAt  DateTime @default(now())
  startedAt   DateTime?
  completedAt DateTime?
  hoursWorked Float?
  
  // Status and notes
  status      AssignmentStatus @default(ASSIGNED)
  notes       String?
  
  @@map("job_assignments")
}

enum AssignmentStatus {
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

#### 7. Basic Material Tracking
**Current Problem**: No visibility into material usage or inventory

**Solution**: Simple material system for basic tracking
```prisma
model Material {
  id              String @id @default(cuid())
  name            String // "Black HTV", "White Plastisol Ink"
  type            MaterialType
  brand           String? // "Siser", "Speedball", etc.
  color           String? // "Black", "White", "Red"
  
  // Inventory
  currentStock    Float @default(0)
  unit            String // "yards", "sheets", "bottles", "rolls"
  costPerUnit     Decimal?
  minStockLevel   Float @default(0)
  
  // Supplier info (for future vendor integration)
  supplierSku     String?
  supplierName    String?
  lastOrderDate   DateTime?
  
  isActive        Boolean @default(true)
  
  // Relationships
  movements       StockMovement[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("materials")
}

enum MaterialType {
  VINYL          // HTV, adhesive vinyl
  DTF_INK        // Direct to film inks
  DTF_POWDER     // DTF powder/adhesive
  SCREEN_INK     // Screen printing inks
  THREAD         // Embroidery thread
  BACKING        // Backing papers, release sheets
  PATCHES        // Pre-made patches
  ADHESIVE       // Transfer tape, etc.
  OTHER          // Miscellaneous materials
}

model StockMovement {
  id          String @id @default(cuid())
  materialId  String
  material    Material @relation(fields: [materialId], references: [id])
  
  // Movement details
  type        MovementType
  quantity    Float // Can be negative for usage
  reason      String // "Purchase", "Job #123", "Waste", "Adjustment"
  reference   String? // Job ID, Purchase Order, etc.
  
  // Tracking
  employeeId  String? // Who made the change
  notes       String?
  
  createdAt   DateTime @default(now())

  @@map("stock_movements")
}

enum MovementType {
  IN          // Adding stock (purchase, return)
  OUT         // Using stock (production, waste)
  ADJUSTMENT  // Inventory adjustment
}
```

## Database Migration Strategy

### Step 1: Schema Updates
1. **Backup Current Database**
   ```bash
   pg_dump $DATABASE_URL > backup_before_phase1.sql
   ```

2. **Create Migration for New Enums**
   ```bash
   npx prisma migrate dev --name "update-job-status-enum"
   ```

3. **Update Existing Data**
   ```sql
   -- Map old statuses to new statuses
   UPDATE jobs SET status = 'PENDING_DESIGN' WHERE status = 'QUEUED';
   UPDATE jobs SET status = 'PENDING_MATERIALS' WHERE status = 'APPROVED';
   UPDATE jobs SET status = 'PENDING_PRINT' WHERE status = 'IN_PROD';
   UPDATE jobs SET status = 'PENDING_FULFILLMENT' WHERE status = 'READY';
   UPDATE jobs SET status = 'DONE' WHERE status = 'DELIVERED';
   ```

### Step 2: Add New Models
1. **Create Product Catalog**
   ```bash
   npx prisma migrate dev --name "add-product-catalog"
   ```

2. **Migrate Existing Job Items**
   - Extract product info from current JobItem.productSku
   - Create Product records for existing items
   - Update JobItem relationships

### Step 3: Design Management
1. **Extract Design Data**
   - Parse existing JobItem.printSpec JSON
   - Create Design records from file URLs
   - Create DesignPlacement records from placement data

## User Interface Updates

### Job Management Interface
- **Status Display**: Update JobsTable to show new status names and colors
- **Priority Indicators**: Add visual priority indicators (already partially implemented)
- **Assignment Display**: Show assigned employees on job cards

### New Job Creation
- **Product Selection**: Replace free-text with proper product picker
- **Design Upload**: Separate design upload from job item creation
- **Employee Assignment**: Add assignment during job creation

### Product Management
- **Product Catalog**: New admin section for managing products
- **Inventory View**: Basic material stock levels display

## Testing Criteria

### Functional Testing
- [ ] Job status updates correctly reflect business workflow
- [ ] Job priority sorting works as expected (already implemented)
- [ ] Product catalog properly populates job item creation
- [ ] Design files upload and associate correctly with jobs
- [ ] Employee assignments display and update properly
- [ ] Material stock movements track correctly

### Data Migration Testing
- [ ] All existing jobs maintain data integrity after migration
- [ ] Job status mappings are correct
- [ ] Product creation from existing data is accurate
- [ ] Design extraction from JSON is complete
- [ ] No data loss during migration process

### Performance Testing
- [ ] Job listing loads quickly with new relationships
- [ ] Product picker performs well with full catalog
- [ ] Design upload and display is responsive

## Rollback Plan

### Database Rollback
1. **Stop Application**
2. **Restore from Backup**
   ```bash
   psql $DATABASE_URL < backup_before_phase1.sql
   ```
3. **Revert Code Changes**
4. **Restart Application**

### Incremental Rollback
- Each migration can be individually reverted using Prisma migrate reset
- Feature flags can disable new functionality while keeping data

## Success Metrics

### Immediate Benefits (Week 2)
- [ ] Job status system matches actual workflow
- [ ] Priority-based sorting works correctly
- [ ] No more confusion about job status meanings

### Enhanced Structure (Week 4)
- [ ] Product catalog eliminates free-text entry errors
- [ ] Design files properly organized and versioned
- [ ] Job creation time reduced by 30-40%

### Workflow Improvements (Week 6)
- [ ] Employee assignments provide production visibility
- [ ] Material tracking gives basic inventory awareness
- [ ] Job data structure supports future enhancements

## Future Configurability Notes

### Configuration Points Added
- Job status names and workflow (stored in enum, can be made configurable)
- Product categories and decoration methods (structured for template system)
- Employee roles and assignment types (ready for role customization)
- Material types and tracking (foundation for vendor integration)

### Template Opportunities
- Product catalog structure ready for template-based setup
- Job workflow can be customized per business type
- Employee roles and assignments configurable per shop

This phase establishes the foundation for both immediate business improvement and future product configurability.