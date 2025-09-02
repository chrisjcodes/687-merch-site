# API Documentation

The 687 Merch Site API provides backend functionality for job management, file handling, authentication, and customer communication.

## API Architecture

### Next.js API Routes

Built using Next.js App Router API routes with TypeScript:

```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts    # NextAuth.js authentication
├── contact/route.ts              # Contact form handler
├── admin/
│   └── jobs/
│       ├── route.ts              # Job CRUD operations
│       ├── [id]/
│       │   ├── status/route.ts   # Status updates
│       │   └── files/route.ts    # File reference updates
│       └── files/route.ts        # File upload handler
└── customer/
    ├── jobs/route.ts             # Customer job access
    └── profile/route.ts          # Customer profile management
```

## Authentication

### NextAuth.js Integration

**Configuration** (`/api/auth/[...nextauth]/route.ts`)
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      // Add custom user data to session
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
        include: { customer: true },
      });
      
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.customerId = user.customerId;
      
      return session;
    },
  },
};
```

**Authentication Helpers**
```typescript
// Require admin role
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized - Admin required');
  }
  return session;
}

// Require customer role
export async function requireCustomerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CUSTOMER') {
    throw new Error('Unauthorized - Customer required');
  }
  return session;
}
```

## Admin API Endpoints

### Job Management

#### Create Job
```http
POST /api/admin/jobs
Content-Type: application/json
Authorization: Admin session required

{
  "customerId": "customer-id",
  "items": [
    {
      "itemType": "SHIRT_BASIC",
      "variant": "Navy Blue",
      "applique": "Gildan",
      "appliqueColorway": "Navy",
      "placements": [
        {
          "id": "placement-1",
          "location": "Full Size Front",
          "width": 12,
          "height": 12,
          "art": "Company Logo",
          "decorationMethod": "HTV",
          "designFileName": "logo.png"
        }
      ],
      "costPerItem": 15.99,
      "qty": 50,
      "sizeBreakdown": {
        "M": 20,
        "L": 20,
        "XL": 10
      }
    }
  ],
  "dueDate": "2024-02-15",
  "notes": "Rush order for event"
}
```

**Response**
```json
{
  "jobId": "cm123456789",
  "job": {
    "id": "cm123456789",
    "customerId": "customer-id",
    "status": "QUEUED",
    "items": [...],
    "events": [...],
    "customer": {...}
  }
}
```

#### Update Job Status
```http
PATCH /api/admin/jobs/[id]/status
Content-Type: application/json
Authorization: Admin session required

{
  "status": "APPROVED"
}
```

**Response**
```json
{
  "success": true,
  "job": {
    "id": "cm123456789",
    "status": "APPROVED",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### File Management

#### Upload Design File
```http
POST /api/admin/jobs/files
Content-Type: multipart/form-data
Authorization: Admin session required

file: [File] (PNG, SVG, PDF, or EPS)
jobId: "cm123456789"
placementId: "placement-1"
```

**Response**
```json
{
  "success": true,
  "filename": "placement-1_1642234567890_logo.png",
  "originalName": "logo.png",
  "fileUrl": "https://blob.vercel-storage.com/jobs/cm123456789/placement-1_1642234567890_logo.png",
  "size": 156789,
  "type": "image/png"
}
```

#### Update File References
```http
PATCH /api/admin/jobs/[id]/files
Content-Type: application/json
Authorization: Admin session required

{
  "placementId": "placement-1",
  "fileUrl": "https://blob.vercel-storage.com/...",
  "fileName": "logo.png"
}
```

## Customer API Endpoints

### Job Access

#### List Customer Jobs
```http
GET /api/customer/jobs
Authorization: Customer session required
```

**Response**
```json
{
  "jobs": [
    {
      "id": "cm123456789",
      "status": "IN_PROD",
      "createdAt": "2024-01-10T09:00:00Z",
      "dueDate": "2024-02-15T00:00:00Z",
      "items": [
        {
          "productSku": "SHIRT_BASIC",
          "variant": "Navy Blue",
          "qty": 50,
          "printSpec": {
            "applique": "Gildan",
            "appliqueColorway": "Navy",
            "placements": [...],
            "costPerItem": 15.99
          }
        }
      ],
      "events": [...]
    }
  ]
}
```

#### Get Job Details
```http
GET /api/customer/jobs/[id]
Authorization: Customer session required
```

**Response**
```json
{
  "job": {
    "id": "cm123456789",
    "status": "IN_PROD",
    "createdAt": "2024-01-10T09:00:00Z",
    "dueDate": "2024-02-15T00:00:00Z",
    "notes": "Rush order for event",
    "items": [...],
    "events": [
      {
        "id": "event-1",
        "type": "status.updated",
        "payload": {
          "oldStatus": "QUEUED",
          "newStatus": "APPROVED",
          "updatedBy": "admin"
        },
        "createdAt": "2024-01-11T14:30:00Z"
      }
    ]
  }
}
```

### Profile Management

#### Get Customer Profile
```http
GET /api/customer/profile
Authorization: Customer session required
```

**Response**
```json
{
  "customer": {
    "id": "customer-id",
    "name": "Acme Corporation",
    "email": "orders@acme.com",
    "phone": "(555) 123-4567",
    "company": "Acme Corporation",
    "defaultShip": {
      "address": "123 Business Ave",
      "city": "Commerce City",
      "state": "NY",
      "zipCode": "10001"
    }
  }
}
```

#### Update Customer Profile
```http
PATCH /api/customer/profile
Content-Type: application/json
Authorization: Customer session required

{
  "name": "Updated Company Name",
  "phone": "(555) 987-6543",
  "defaultShip": {
    "address": "456 New Address",
    "city": "New City",
    "state": "CA",
    "zipCode": "90210"
  }
}
```

## Public API Endpoints

### Contact Form

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "company": "Example Corp",
  "message": "Interested in custom merchandise for our event.",
  "serviceInterest": "apparel",
  "urgency": "normal"
}
```

**Response**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

## Error Handling

### Standard Error Format

All API endpoints return errors in a consistent format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error",
    "validation": "Validation details"
  }
}
```

### HTTP Status Codes

- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

### Common Error Scenarios

**Authentication Errors**
```json
{
  "error": "Unauthorized - Admin required",
  "code": "UNAUTHORIZED"
}
```

**Validation Errors**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "customerId": "Customer ID is required",
    "items": "At least one item is required"
  }
}
```

**File Upload Errors**
```json
{
  "error": "Invalid file type. Only PNG, SVG, PDF, and EPS files are allowed.",
  "code": "INVALID_FILE_TYPE"
}
```

## Data Models

### Job Model
```typescript
interface Job {
  id: string;
  customerId: string;
  customer: Customer;
  status: JobStatus;
  dueDate?: Date;
  notes?: string;
  items: JobItem[];
  events: Event[];
  proofs: Proof[];
  createdAt: Date;
  updatedAt: Date;
}
```

### JobItem Model
```typescript
interface JobItem {
  id: string;
  jobId: string;
  productSku: string;
  variant?: string;
  printSpec: {
    applique?: string;
    appliqueColorway?: string;
    placements: Placement[];
    costPerItem?: number;
  };
  qty: number;
  sizeBreakdown: Record<string, number>;
}
```

### Placement Model
```typescript
interface Placement {
  id: string;
  location: string;
  width: number;
  height: number;
  art: string;
  decorationMethod: string;
  designFileName?: string;
  designFileUrl?: string;
}
```

### Event Model
```typescript
interface Event {
  id: string;
  jobId?: string;
  type: string;
  payload: Record<string, any>;
  createdAt: Date;
}
```

## Rate Limiting

### Contact Form Protection
```typescript
// Rate limiting for contact form
const rateLimiter = new Map();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimiter.get(ip) || [];
  
  // Allow 5 requests per hour
  const hourAgo = now - (60 * 60 * 1000);
  const recentRequests = userRequests.filter(time => time > hourAgo);
  
  if (recentRequests.length >= 5) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}
```

## File Storage Integration

### Vercel Blob Configuration

```typescript
import { put, del } from '@vercel/blob';

// Upload file
const blob = await put(
  `jobs/${jobId}/${filename}`, 
  file, 
  {
    access: 'public',
    addRandomSuffix: false,
  }
);

// Delete file (if needed)
await del(blob.url);
```

### File Organization
- **Path Structure**: `jobs/{jobId}/{placementId}_{timestamp}_{filename}`
- **Access Level**: Public (for customer downloads)
- **File Types**: PNG, SVG, PDF, EPS
- **Size Limits**: Handled by Vercel Blob (typically 10MB+ supported)

## Database Queries

### Common Query Patterns

**Jobs with Related Data**
```typescript
const job = await prisma.job.findUnique({
  where: { id: jobId },
  include: {
    customer: true,
    items: true,
    events: {
      orderBy: { createdAt: 'desc' }
    },
    proofs: true
  }
});
```

**Customer Jobs Only**
```typescript
const jobs = await prisma.job.findMany({
  where: {
    customerId: session.user.customerId
  },
  include: {
    items: true,
    events: true
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

## Middleware

### Authentication Middleware
```typescript
export async function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await getToken({ req: request });
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Protect customer routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = await getToken({ req: request });
    if (!session || session.role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
```

## Testing

### API Testing Examples

**Job Creation Test**
```typescript
describe('POST /api/admin/jobs', () => {
  it('creates job successfully with valid data', async () => {
    const response = await request(app)
      .post('/api/admin/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: 'test-customer-id',
        items: [validJobItem],
      });
      
    expect(response.status).toBe(201);
    expect(response.body.jobId).toBeDefined();
  });
  
  it('returns 400 for missing required fields', async () => {
    const response = await request(app)
      .post('/api/admin/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
      
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('required');
  });
});
```

This API documentation provides comprehensive coverage of all backend functionality, enabling developers to understand and extend the 687 Merch Site system effectively.