# CLAUDE.md - AI Assistant Context File

This file provides context and important information for AI assistants working on the 687 Merch Site project.

## 🏢 Project Overview

**687 Merch Site** is a comprehensive custom merchandise ordering and job management system built with Next.js 15.5.2. It serves as a complete business solution for custom apparel and promotional product companies.

### System Components
- **Public Marketing Site** - Customer acquisition and information
- **Customer Portal** - Self-service order tracking and management  
- **Admin Dashboard** - Complete job management and workflow system
- **Authentication System** - Magic link-based secure authentication
- **File Management** - Vercel Blob storage for design files

## 🎯 Current Status & Recent Work

### Major Features Completed
✅ **Advanced Job Creation System** - Dynamic form with intelligent garment/decoration selection  
✅ **Placement Management** - Location-specific options with auto-sizing presets  
✅ **File Upload System** - Vercel Blob integration with design file management  
✅ **Status Workflow** - Complete job lifecycle from QUEUED to DELIVERED  
✅ **Customer Management** - Integrated customer database and profiles  
✅ **Authentication** - Magic link authentication with role-based access  
✅ **Database Schema** - Comprehensive PostgreSQL schema with Prisma ORM  
✅ **Documentation** - Complete system documentation in `/docs` directory  

### Recent Development Session Focus
- **File Storage Migration**: Successfully migrated from filesystem to Vercel Blob storage
- **Design File Downloads**: Implemented downloadable design files for each placement
- **Documentation Creation**: Created comprehensive documentation system
- **Admin Panel Refinements**: Enhanced job detail layouts and functionality

## 🏗️ Technical Architecture

### Core Technologies
- **Next.js 15.5.2** with App Router
- **TypeScript** for type safety
- **PostgreSQL** database with **Prisma ORM**
- **NextAuth.js** for authentication
- **Material-UI (MUI)** for UI components
- **Vercel Blob** for file storage
- **Vercel Platform** for deployment

### Key Design Patterns
- **Server Components** by default, Client Components only when needed
- **API Routes** with proper error handling and authentication
- **Role-Based Access Control** (ADMIN/CUSTOMER roles)
- **Magic Link Authentication** (password-free)
- **File Organization** by job ID in Vercel Blob storage

## 📁 Important File Locations

### Key Configuration Files
- `prisma/schema.prisma` - Database schema definition
- `src/lib/auth.ts` - Authentication configuration
- `src/middleware.ts` - Route protection middleware
- `.env.local` - Environment variables (not in repo)

### Core Application Structure
```
src/app/
├── admin/                   # Admin panel pages
│   ├── jobs/
│   │   ├── new/NewJobForm.tsx    # Advanced job creation form
│   │   └── [id]/page.tsx         # Job detail view with file downloads
├── dashboard/               # Customer portal
├── api/
│   ├── admin/jobs/         # Job management APIs
│   ├── auth/               # NextAuth.js configuration
│   └── contact/            # Contact form handler
└── (public routes)         # Marketing site pages
```

### Database Models (Key Entities)
- **User** - Authentication and roles
- **Customer** - Business information  
- **Job** - Core order management
- **JobItem** - Individual items with printSpec JSON
- **Event** - Audit trail and history
- **Proof** - Design approval workflow

## 🎨 Business Logic & Workflows

### Job Creation Workflow
1. **Customer Selection** - Choose from existing customers
2. **Item Configuration** - Select garment types with dynamic sizing
3. **Decoration Setup** - Choose methods based on garment compatibility
4. **Placement Management** - Add locations with auto-sizing and file uploads
5. **Review & Submit** - Create job and upload design files

### Job Status Workflow
`QUEUED` → `APPROVED` → `IN_PROD` → `READY` → `SHIPPED` → `DELIVERED`

### File Management Flow
1. **Upload** - Files uploaded to Vercel Blob during job creation
2. **Storage** - Organized as `jobs/{jobId}/{placementId}_{timestamp}_{filename}`
3. **Access** - Public URLs for authenticated downloads
4. **Integration** - File URLs stored in job item `printSpec.placements`

## 🔧 Development Context

### Common Development Commands
```bash
npm run dev                  # Start development server
npx prisma studio           # Database browser
npx prisma db push          # Push schema changes
npx prisma db seed          # Seed development data
npm run build               # Build for production
```

### Environment Variables Needed
```env
# Database
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-key"

# Email (Magic Links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_USER="email@example.com"
EMAIL_SERVER_PASSWORD="app-password"
EMAIL_FROM="email@example.com"

# File Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
```

### Testing Accounts (from seed data)
- **Admin**: `info@687merch.com`
- **Customer**: `test@example.com`
- **Customer 2**: `orders@acmecorp.com`

## 🧠 Important Context & Decisions

### Key Design Decisions Made
1. **Vercel Blob over Filesystem** - Better for production scalability
2. **Magic Links over Passwords** - Better UX and security
3. **Material-UI** - Consistent professional design system
4. **Prisma ORM** - Type-safe database operations
5. **JSON Fields for Flexibility** - `printSpec` and `sizeBreakdown` as JSON

### Data Structure Patterns

**Placement Data Structure** (in JobItem.printSpec):
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

**Size Breakdown Pattern**:
```json
{
  "S": 5,
  "M": 20, 
  "L": 15,
  "XL": 8,
  "2XL": 2
}
```

### Business Rules Implemented
- **Decoration Method Restrictions**:
  - Beanies: Only patches
  - Hats: No Screen Print DTF
  - Shoes: No patches typically
- **Auto-sizing Presets**:
  - Full Size: 12"×12"
  - Oversize: 12"×16"
  - Centered: 12"×8"
  - Name Plate: 8"×5"
  - Trucker Hat: 4.7"×2.8"
  - Baseball Cap: 4"×1.75"

## 🚨 Important Notes & Gotchas

### Development Setup Issues
- **Node.js Version**: Requires Node 20+ (use `nvm use 20`)
- **Database Connection**: Must have PostgreSQL running locally
- **Email Testing**: Use Gmail App Passwords, not regular passwords
- **File Uploads**: Requires BLOB_READ_WRITE_TOKEN from Vercel

### Code Patterns to Follow
- **Server Components** by default for better performance
- **Authentication Required** for all admin and customer routes
- **Error Handling** with try/catch and proper HTTP status codes
- **Type Safety** - Use Prisma-generated types when possible
- **File Validation** - Always validate file types and sizes

### Database Considerations
- **JSON Fields** are used for flexible data (printSpec, sizeBreakdown)
- **Cascading Deletes** are set up (Job → JobItems, Events, Proofs)
- **Unique Constraints** on emails and critical fields
- **Indexes Needed** for performance on large datasets

## 📚 Documentation & Resources

### Complete Documentation Available
- **Main Docs**: `/docs/README.md` - System overview
- **Setup Guide**: `/docs/setup/README.md` - Installation instructions
- **Admin Panel**: `/docs/admin/README.md` - Admin features
- **Customer Portal**: `/docs/customer-portal/README.md` - Customer features  
- **API Reference**: `/docs/api/README.md` - Endpoint documentation
- **Database Schema**: `/docs/database/README.md` - Data model details
- **Authentication**: `/docs/auth/README.md` - Auth system details
- **File Management**: `/docs/files/README.md` - Vercel Blob integration
- **Deployment**: `/docs/deployment/README.md` - Production deployment
- **Development**: `/docs/development/README.md` - Development workflows

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Material-UI Documentation](https://mui.com/)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)

## 🔮 Future Enhancement Ideas

### Planned Features
- **Proof Management** - Enhanced design approval workflow
- **Bulk Operations** - Multi-job status updates
- **Advanced Reporting** - Analytics and insights
- **Customer Communication** - Automated notifications
- **Inventory Integration** - Stock tracking
- **Mobile App** - Native iOS/Android applications

### Technical Improvements
- **Testing Suite** - Unit tests with Jest, E2E tests with Playwright
- **Error Monitoring** - Sentry integration
- **Performance Monitoring** - Advanced analytics
- **Caching Strategy** - Redis for performance optimization

## 🎯 Current Development Focus Areas

When working on this project, these are the key areas of focus:

1. **User Experience** - Making the admin job creation process even more intuitive
2. **Customer Portal** - Enhancing the customer-facing experience
3. **Performance** - Optimizing database queries and API responses
4. **Mobile Experience** - Ensuring great mobile usability
5. **File Management** - Expanding file type support and processing

## 💡 Tips for AI Assistants

### Understanding the Codebase
- **Read the docs first** - The `/docs` directory has comprehensive information
- **Check existing patterns** - Follow established patterns for consistency
- **Database schema** - Always check `prisma/schema.prisma` for data relationships
- **Authentication flow** - Remember that routes require proper session handling

### Making Changes
- **Test accounts available** - Use seed data for testing
- **Database changes** - Always create migrations with `prisma migrate dev`
- **File uploads** - Test with actual files to ensure Vercel Blob integration works
- **Type safety** - Leverage TypeScript and Prisma types for safety

### Common Tasks
- **Adding new job fields** - Update schema, migration, form, and display components
- **New API endpoints** - Follow existing patterns with authentication and error handling
- **UI changes** - Use Material-UI components for consistency
- **File features** - Consider Vercel Blob limitations and best practices

---

This file should be updated when significant changes are made to the system architecture, key features, or development workflows.