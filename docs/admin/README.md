# Admin Panel Documentation

The admin panel is a comprehensive job management system that allows 687 Merch staff to create, manage, and track custom merchandise orders.

## Access & Authentication

- **URL**: `/admin`
- **Authentication**: Magic link authentication
- **Admin Users**: Users with `role: ADMIN` in the database
- **Default Admin**: `info@687merch.com` (created by seed data)

## Main Features

### 1. Job Management Dashboard

**Location**: `/admin/jobs`

The main dashboard displays all jobs with:
- **Status filtering**: View jobs by status (QUEUED, APPROVED, IN_PROD, READY, SHIPPED, DELIVERED)
- **Customer information**: Name, company, and contact details
- **Job summary**: Item count, total quantity, due dates
- **Quick actions**: Status updates and job details access

### 2. Job Creation System

**Location**: `/admin/jobs/new`

#### Advanced Form Features

**Customer Selection**
- Dropdown populated from customer database
- Auto-complete search functionality
- Customer details display

**Smart Item Configuration**
- **Item Types**: Organized by category (Headwear, Tops, Bottoms, Accessories)
- **Dynamic Sizing**: Item-specific size options (S-5XL, One Size Fits All)
- **Garment Details**: Brand and color specification

**Intelligent Decoration System**
- **Decoration Methods**: HTV, Hybrid DTF, Screen Print DTF, Adhesive Patches
- **Method Restrictions**: 
  - Beanies: Patches only
  - Hats: No Screen Print DTF
  - Shoes: No patches typically
- **Dynamic Options**: Available methods update based on item selection

**Placement Management**
- **Location-Specific Options**: Different placements per item type
  - Hats: Centered, Top Left, Top Right, Bottom Left, Bottom Right
  - Tops: Full Size Front/Back, Oversize Front/Back, Pocket, Centered, Name Plate Neck
  - Bottoms: Hip Left, Hip Right, Back Pocket, Front Left Leg, etc.
- **Auto-sizing**: Predefined dimensions for common placements
  - Full Size: 12"×12"
  - Oversize: 12"×16" 
  - Centered: 12"×8"
  - Name Plate: 8"×5"
  - Hat-specific: Trucker (4.7"×2.8"), Baseball (4"×1.75")

**Design File Management**
- **File Upload**: PNG, SVG, PDF, EPS support
- **Vercel Blob Storage**: Secure, scalable file storage
- **Per-placement Files**: Each placement can have its own design file
- **File Validation**: Type and size restrictions

### 3. Job Detail View

**Location**: `/admin/jobs/[id]`

#### Comprehensive Job Information

**Customer Section**
- Complete customer contact information
- Company details and shipping address
- Clickable email and phone links

**Job Information**
- Creation date and time
- Due date (if specified)
- Current status with color coding
- Job notes and special instructions
- Status update controls

**Detailed Item Breakdown**
- Product SKU and variant information
- Quantity with size breakdown
- **Enhanced Print Specifications**:
  - Garment brand and color
  - Cost per item
  - **Placement Details**: Each placement shown as separate card with:
    - Location and dimensions
    - Decoration method
    - Art description
    - **Downloadable design files**

**Event Timeline**
- Complete audit trail of job changes
- Status transitions with timestamps
- User attribution for changes
- JSON payload details for technical information

### 4. Status Management

#### Job Status Workflow
1. **QUEUED** - Initial state, awaiting approval
2. **APPROVED** - Ready for production
3. **IN_PROD** - Currently being produced
4. **READY** - Production complete, ready for shipping
5. **SHIPPED** - Sent to customer
6. **DELIVERED** - Received by customer

#### Status Update Features
- **Quick Actions**: One-click status progression
- **Automatic Events**: Status changes create timeline events
- **Color Coding**: Visual status indicators throughout the interface

## Technical Implementation

### File Storage System

**Vercel Blob Integration**
```typescript
// File upload to Vercel Blob
const blob = await put(`jobs/${jobId}/${filename}`, file, {
  access: 'public',
  addRandomSuffix: false,
});
```

**File Organization**
- Path structure: `jobs/{jobId}/{placementId}_{timestamp}_{filename}`
- Public access for downloads
- CDN-delivered globally

### Database Schema

**Key Models**
```prisma
model Job {
  id         String     @id @default(cuid())
  customerId String
  customer   Customer   @relation(fields: [customerId], references: [id])
  status     JobStatus  @default(QUEUED)
  dueDate    DateTime?
  notes      String?
  items      JobItem[]
  events     Event[]
  proofs     Proof[]
}

model JobItem {
  printSpec     Json      // Contains placement data
  sizeBreakdown Json      // Size quantities
}
```

**Placement Data Structure**
```json
{
  "placements": [
    {
      "id": "placement-1",
      "location": "Full Size Front",
      "width": 12,
      "height": 12,
      "art": "Company Logo",
      "decorationMethod": "HTV",
      "designFileName": "logo.png",
      "designFileUrl": "https://blob.vercel-storage.com/..."
    }
  ]
}
```

### API Endpoints

**Job Management**
- `POST /api/admin/jobs` - Create new job
- `GET /api/admin/jobs/[id]` - Get job details  
- `PATCH /api/admin/jobs/[id]/status` - Update job status

**File Management**
- `POST /api/admin/jobs/files` - Upload design file
- `PATCH /api/admin/jobs/[id]/files` - Update file references

## User Interface

### Design System

**Material-UI Components**
- Consistent color scheme with primary/secondary colors
- Professional typography hierarchy
- Responsive grid system
- Accessible form controls

**Color Coding**
- QUEUED: Default gray
- APPROVED: Info blue
- IN_PROD: Warning orange  
- READY: Primary blue
- SHIPPED: Secondary purple
- DELIVERED: Success green

### Responsive Design

- **Desktop First**: Optimized for admin workstations
- **Mobile Friendly**: Accessible on tablets and phones
- **Print Friendly**: Clean layouts for printing job details

## Advanced Features

### Smart Form Logic

**Conditional Fields**
- Placement options disabled until item type selected
- Decoration methods filtered based on item compatibility
- Size fields shown only for applicable items

**Validation System**
- Required field enforcement
- File type validation
- Quantity distribution validation
- Custom error messaging

### Event System

**Automatic Event Creation**
```typescript
// Job creation event
{
  type: 'job.created',
  payload: {
    createdBy: 'admin',
    itemsCount: 2,
    totalQty: 50,
    itemTypes: ['SHIRT_BASIC', 'HAT_TRUCKER']
  }
}

// Status change event
{
  type: 'status.updated', 
  payload: {
    oldStatus: 'QUEUED',
    newStatus: 'APPROVED',
    updatedBy: 'admin'
  }
}
```

### Search and Filtering

**Job Dashboard Filters**
- Status-based filtering
- Customer name search
- Date range filtering
- Quick status counts

## Workflows

### Typical Job Creation Workflow

1. **Customer Selection**
   - Search and select existing customer
   - View customer details and history

2. **Item Configuration**  
   - Add items with type selection
   - Configure sizes and quantities
   - Set garment specifications

3. **Placement Setup**
   - Add placements for each decoration
   - Upload design files
   - Specify decoration methods
   - Set dimensions and positioning

4. **Review and Submit**
   - Verify all details
   - Add job notes if needed
   - Create job and upload files

5. **Job Management**
   - Track through status workflow
   - Update status as work progresses
   - Communicate with customers

### File Management Workflow

1. **Upload Phase**
   - Files uploaded to Vercel Blob during job creation
   - Stored with job ID for organization
   - Metadata saved to database

2. **Access Phase**  
   - Download links available in job details
   - Direct CDN delivery for fast access
   - Original filename preservation

## Troubleshooting

### Common Issues

**File Upload Problems**
- Check Vercel Blob token in environment variables
- Verify file types are PNG, SVG, PDF, or EPS
- Ensure file size is reasonable (< 10MB typically)

**Status Update Issues**
- Verify admin authentication
- Check database connectivity  
- Review browser console for errors

**Performance Issues**
- Large jobs with many placements may load slowly
- Consider pagination for job lists with many items
- Image optimization for better performance

### Development Tools

**Database Inspection**
```bash
npx prisma studio  # Browse job data
```

**API Testing**
- Use browser dev tools to inspect network requests
- Check API response formats
- Verify authentication headers

## Future Enhancements

### Planned Features

- **Bulk Operations**: Multi-job status updates
- **Advanced Filtering**: More search criteria
- **Reporting Dashboard**: Analytics and insights
- **Customer Communication**: Automated notifications
- **Proof Management**: Enhanced proofing workflow
- **Inventory Integration**: Stock tracking
- **Production Scheduling**: Resource management

### Extensibility

The admin system is designed to be extended with:
- Additional item types and categories
- New decoration methods
- Custom placement options
- Enhanced file management features
- Advanced reporting capabilities