# Development Guide

This guide covers development workflows, coding standards, and best practices for the 687 Merch Site project.

## Development Workflow

### Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd 687-merch-site
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Configure database and email settings
   - Run `npx prisma db push` to setup database

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Branch Strategy

**Main Branches**:
- `main` - Production code
- `develop` - Development integration branch
- `feature/*` - Individual feature branches

**Feature Development**:
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/customer-order-history

# Work on feature, make commits
git add .
git commit -m "Add customer order history page"

# Push and create PR to develop
git push origin feature/customer-order-history
```

### Code Review Process

1. **Create Pull Request** to `develop` branch
2. **Automated Checks**: Tests, linting, type checking
3. **Code Review**: At least one reviewer approval
4. **Preview Deployment**: Vercel preview URL for testing
5. **Merge**: Squash and merge to develop
6. **Release**: Merge develop to main for production

## Project Structure

### Directory Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── dashboard/         # Customer portal pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Shared components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Auth configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.js              # Seed data

docs/                     # Documentation
├── README.md            # Main documentation index
├── setup/               # Setup and installation
├── admin/               # Admin panel docs
├── customer-portal/     # Customer portal docs
└── api/                 # API documentation
```

### File Naming Conventions

**Components**:
- PascalCase: `JobStatusCard.tsx`
- Co-located styles: `JobStatusCard.module.css`
- Test files: `JobStatusCard.test.tsx`

**Pages** (App Router):
- `page.tsx` - Route page component
- `layout.tsx` - Route layout component
- `loading.tsx` - Loading UI component
- `error.tsx` - Error UI component

**API Routes**:
- `route.ts` - API route handler
- RESTful naming: `jobs/[id]/status/route.ts`

## Coding Standards

### TypeScript Configuration

**Strict Mode**: Enabled for type safety
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Type Definitions**:
```typescript
// types/job.ts
export interface Job {
  id: string;
  customerId: string;
  status: JobStatus;
  dueDate?: Date;
  notes?: string;
  items: JobItem[];
  events: Event[];
}

// Use Prisma-generated types when possible
import type { Job, JobStatus } from '@prisma/client';
```

### Component Patterns

**Server Components** (Default):
```typescript
// app/admin/jobs/page.tsx
import { getJobs } from '@/lib/jobs';

export default async function JobsPage() {
  const jobs = await getJobs();
  
  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

**Client Components** (Interactive):
```typescript
'use client';
import { useState } from 'react';

export function InteractiveForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
}
```

**Component Props**:
```typescript
interface JobCardProps {
  job: Job & { customer: Customer };
  onStatusChange?: (jobId: string, status: JobStatus) => void;
  className?: string;
}

export function JobCard({ job, onStatusChange, className }: JobCardProps) {
  // Component implementation
}
```

### API Route Patterns

**RESTful Design**:
```typescript
// app/api/admin/jobs/route.ts
export async function GET() {
  // List jobs
}

export async function POST(request: Request) {
  // Create job
}

// app/api/admin/jobs/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Get specific job
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Update specific job
}
```

**Error Handling**:
```typescript
export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const data = await request.json();
    
    // Validation
    if (!data.customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    // Business logic
    const job = await createJob(data);
    return NextResponse.json({ job });
    
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Patterns

**Query Organization**:
```typescript
// lib/queries/jobs.ts
export async function getJobsForCustomer(customerId: string) {
  return await prisma.job.findMany({
    where: { customerId },
    include: {
      items: true,
      events: { orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  return await prisma.$transaction(async (tx) => {
    // Update job status
    const job = await tx.job.update({
      where: { id: jobId },
      data: { status }
    });
    
    // Create status change event
    await tx.event.create({
      data: {
        jobId,
        type: 'status.updated',
        payload: { newStatus: status }
      }
    });
    
    return job;
  });
}
```

**Type Safety with Prisma**:
```typescript
import type { Prisma } from '@prisma/client';

// Use generated types for complex queries
type JobWithItems = Prisma.JobGetPayload<{
  include: {
    items: true;
    customer: true;
  };
}>;
```

## Development Tools

### Required VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-vscode.vscode-json"
  ]
}
```

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
```

## Testing Strategy

### Testing Stack
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright
- **API Tests**: Supertest
- **Database Tests**: Test containers

### Unit Testing

**Component Testing**:
```typescript
// components/JobCard.test.tsx
import { render, screen } from '@testing-library/react';
import { JobCard } from './JobCard';

const mockJob = {
  id: 'job-1',
  status: 'QUEUED' as const,
  customer: { name: 'Test Customer' }
};

describe('JobCard', () => {
  it('displays job status', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Queued')).toBeInTheDocument();
  });
});
```

**API Testing**:
```typescript
// __tests__/api/jobs.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/admin/jobs/route';

describe('/api/admin/jobs', () => {
  it('creates job with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        customerId: 'customer-1',
        items: [{ itemType: 'SHIRT', qty: 10 }]
      }
    });
    
    await handler(req, res);
    expect(res._getStatusCode()).toBe(201);
  });
});
```

### Integration Testing

**E2E Test Example**:
```typescript
// tests/admin-job-creation.spec.ts
import { test, expect } from '@playwright/test';

test('admin can create job', async ({ page }) => {
  await page.goto('/admin/jobs/new');
  
  // Fill form
  await page.selectOption('[data-testid="customer-select"]', 'customer-1');
  await page.fill('[data-testid="item-type"]', 'T-Shirt');
  await page.fill('[data-testid="quantity"]', '25');
  
  // Submit
  await page.click('[data-testid="submit-job"]');
  
  // Verify redirect to job detail
  await expect(page).toHaveURL(/\/admin\/jobs\/\w+/);
});
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Check for large dependencies
npx bundlephobia <package-name>
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false
});
```

### Image Optimization

```tsx
import Image from 'next/image';

// Optimized images
<Image
  src="/hero-image.jpg"
  alt="687 Merch"
  width={1200}
  height={600}
  priority={true} // Above the fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Database Optimization

```typescript
// Use select to limit fields
const jobs = await prisma.job.findMany({
  select: {
    id: true,
    status: true,
    customer: {
      select: { name: true }
    }
  }
});

// Use indexes for common queries
// CREATE INDEX idx_jobs_status ON jobs(status);
```

## Debugging

### Development Debugging

```typescript
// Use console.log strategically
console.log('Job creation data:', JSON.stringify(data, null, 2));

// Use debugger in development
if (process.env.NODE_ENV === 'development') {
  debugger;
}
```

### Production Debugging

```typescript
// Structured logging
import { logger } from '@/lib/logger';

logger.info('Job created', { 
  jobId: job.id, 
  customerId: job.customerId,
  itemCount: job.items.length 
});
```

### Database Debugging

```bash
# Enable query logging in development
DATABASE_URL="postgresql://...?logging=true"

# Use Prisma Studio for data inspection
npx prisma studio
```

## Common Development Tasks

### Adding New Feature

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Database Changes** (if needed)
   ```bash
   # Update schema.prisma
   npx prisma migrate dev --name "add_new_feature_fields"
   ```

3. **Create Components/Pages**
   ```bash
   # Follow existing patterns
   # Add TypeScript interfaces
   # Include error handling
   ```

4. **Add Tests**
   ```bash
   npm run test:unit
   npm run test:e2e
   ```

5. **Update Documentation**
   ```bash
   # Update relevant docs in /docs folder
   ```

### Database Schema Changes

```bash
# 1. Update schema.prisma
# 2. Generate migration
npx prisma migrate dev --name "descriptive_name"

# 3. Update seed data if needed
npx prisma db seed

# 4. Regenerate client
npx prisma generate
```

### Adding New API Endpoint

1. **Create Route File**
   ```typescript
   // app/api/new-endpoint/route.ts
   export async function GET() {
     // Implementation
   }
   ```

2. **Add Authentication**
   ```typescript
   const session = await requireAdminSession();
   ```

3. **Add Validation**
   ```typescript
   const schema = z.object({
     field: z.string().min(1)
   });
   const data = schema.parse(await request.json());
   ```

4. **Add Tests**
   ```typescript
   // __tests__/api/new-endpoint.test.ts
   ```

## Best Practices

### Code Quality

- **Type Safety**: Use TypeScript strictly
- **Error Handling**: Always handle errors gracefully
- **Validation**: Validate all inputs
- **Documentation**: Document complex logic
- **Testing**: Write tests for critical functionality

### Security

- **Authentication**: Protect all admin routes
- **Authorization**: Check user permissions
- **Input Validation**: Sanitize all inputs
- **SQL Injection**: Use Prisma (parameterized queries)
- **XSS Protection**: Sanitize user content

### Performance

- **Server Components**: Use by default
- **Client Components**: Only when needed
- **Database**: Optimize queries and use indexes
- **Caching**: Implement appropriate caching strategies
- **Images**: Use Next.js Image component

### Maintainability

- **Consistent Patterns**: Follow established patterns
- **Component Reuse**: Create reusable components  
- **Clear Naming**: Use descriptive names
- **Small Functions**: Keep functions focused
- **Documentation**: Keep docs up to date

## Troubleshooting

### Common Issues

**Build Errors**:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Database Issues**:
```bash
# Reset database (development only)
npx prisma db reset

# Regenerate Prisma client
npx prisma generate
```

**Type Errors**:
```bash
# Check TypeScript
npx tsc --noEmit

# Fix common issues
npm run lint:fix
```

This development guide provides the foundation for maintaining code quality, consistency, and productivity while working on the 687 Merch Site.