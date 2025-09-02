# Deployment Documentation

The 687 Merch Site is designed for deployment on the Vercel platform, which provides seamless integration with Next.js applications.

## Deployment Overview

### Vercel Platform Benefits
- **Automatic Deployments**: Git-based deployments from GitHub/GitLab
- **Preview Deployments**: Every branch gets a preview URL
- **Edge Network**: Global CDN with 100+ edge locations
- **Serverless Functions**: Automatic scaling and zero configuration
- **Built-in Analytics**: Performance monitoring and insights

### Production Architecture
```
┌─────────────────────────────────────────────────────────┐
│                Vercel Edge Network                      │
│               (100+ Locations)                         │
├─────────────────────────────────────────────────────────┤
│              Next.js Application                        │
│            (Serverless Functions)                       │
├─────────────────────────────────────────────────────────┤
│    PostgreSQL Database    │    Vercel Blob Storage    │
│     (External Provider)   │   (Integrated Storage)    │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

### Required Services
1. **Vercel Account**: Free tier available, Pro recommended for production
2. **PostgreSQL Database**: 
   - Vercel Postgres (recommended)
   - Railway
   - PlanetScale
   - AWS RDS
   - Google Cloud SQL
3. **Email Service**:
   - Gmail SMTP
   - SendGrid
   - Mailgun
   - Amazon SES

### Development Requirements
- Node.js 20+ 
- Git repository (GitHub recommended)
- Environment variables configured

## Environment Configuration

### Production Environment Variables

Create these in your Vercel dashboard under Project Settings → Environment Variables:

```env
# Database Configuration
POSTGRES_URL="postgresql://username:password@host:5432/database"
POSTGRES_PRISMA_URL="postgresql://username:password@host:5432/database?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret-key"

# Email Configuration  
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-production-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# Vercel Blob (automatically provided by Vercel)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_here"

# Optional: Custom Domain
NEXT_PUBLIC_APP_URL="https://your-custom-domain.com"
```

### Environment Variable Security

**Secret Management**
- Use Vercel's encrypted environment variables
- Never commit secrets to version control
- Rotate secrets regularly
- Use different secrets for preview/production

**Variable Scoping**
- Production: Live deployment only
- Preview: Branch deployments
- Development: Local development only

## Database Setup

### Vercel Postgres (Recommended)

**Setup Steps**:
1. Go to Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Choose region (closest to your users)
4. Database automatically provisions
5. Connection strings added to environment variables

**Migration Deployment**:
```bash
# Vercel automatically runs this during build
npx prisma migrate deploy
```

### External Database Providers

**Railway Setup**:
1. Create Railway account
2. Deploy PostgreSQL service
3. Copy connection strings to Vercel environment variables
4. Configure connection pooling if needed

**Connection Pooling** (Recommended for production):
```env
# Use pgbouncer for connection pooling
POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connect_timeout=15"
```

## Deployment Process

### Automatic Git Deployments

**Initial Setup**:
1. Connect Vercel to your Git repository
2. Configure build settings (usually auto-detected)
3. Add environment variables
4. Deploy

**Build Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "POSTGRES_URL": "@postgres-url"
  }
}
```

### Build Process

**Build Steps**:
1. Install dependencies (`npm install`)
2. Generate Prisma client (`npx prisma generate`)
3. Build Next.js application (`npm run build`)
4. Deploy to Vercel edge network

**Build Optimization**:
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['blob.vercel-storage.com'],
  },
};

module.exports = nextConfig;
```

## Custom Domain Setup

### Domain Configuration

**Add Custom Domain**:
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain name
3. Configure DNS records as instructed
4. SSL automatically provisioned

**DNS Configuration**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### SSL/HTTPS

**Automatic SSL**:
- Vercel provides free SSL certificates
- Automatic renewal
- HTTP → HTTPS redirects
- HSTS headers enabled

## Performance Optimization

### Build Optimization

**Bundle Analysis**:
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

**Code Splitting**:
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Caching Strategy

**Static Assets**:
- Long-term caching for images, fonts, static files
- Automatic invalidation on changes
- Gzip/Brotli compression

**API Routes**:
```typescript
// Add caching headers to API routes
export async function GET() {
  const data = await fetchData();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json',
    },
  });
}
```

### Database Optimization

**Connection Pooling**:
```typescript
// lib/prisma.ts - Singleton pattern
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## Monitoring & Analytics

### Vercel Analytics Integration

**Setup**:
```bash
npm install @vercel/analytics
```

**Implementation**:
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Vercel Speed Insights

**Setup**:
```bash
npm install @vercel/speed-insights
```

**Implementation**:
```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Error Monitoring

**Vercel Built-in Monitoring**:
- Function logs automatically captured
- Error tracking and alerting
- Performance metrics
- Real-time monitoring dashboard

**External Monitoring** (Optional):
```typescript
// Optional: Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Security Configuration

### Security Headers

**Automatic Security Features**:
- HTTPS redirects
- HSTS headers
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

**Custom Security Headers** (`next.config.js`):
```javascript
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ],
};
```

### Environment Security

**Secret Rotation**:
- Rotate NEXTAUTH_SECRET regularly
- Update database passwords periodically
- Refresh API keys and tokens
- Monitor access logs

## Backup & Disaster Recovery

### Database Backups

**Automated Backups**:
- Vercel Postgres: Automatic daily backups
- External providers: Configure backup schedules
- Point-in-time recovery available

**Manual Backup**:
```bash
# Export database schema and data
npx prisma db pull > backup-schema.prisma
pg_dump DATABASE_URL > backup-data.sql
```

### File Storage Backups

**Vercel Blob**:
- Built-in redundancy and backups
- No manual backup required
- Geographic replication included

### Disaster Recovery Plan

1. **Service Outage**: Vercel provides 99.99% uptime SLA
2. **Database Recovery**: Restore from automated backups
3. **Code Recovery**: Redeploy from Git repository
4. **File Recovery**: Vercel Blob handles redundancy automatically

## Scaling Considerations

### Traffic Scaling

**Automatic Scaling**:
- Serverless functions scale automatically
- No server management required
- Handle traffic spikes seamlessly

**Performance Monitoring**:
```typescript
// Monitor function execution time
console.time('database-query');
const result = await prisma.job.findMany();
console.timeEnd('database-query');
```

### Database Scaling

**Connection Limits**:
- Use connection pooling (PgBouncer)
- Monitor active connections
- Implement query optimization

**Read Replicas** (Future):
```typescript
// Separate read/write database connections
const writeDb = new PrismaClient({ 
  datasource: { db: { url: process.env.DATABASE_WRITE_URL } }
});

const readDb = new PrismaClient({ 
  datasource: { db: { url: process.env.DATABASE_READ_URL } }
});
```

## Troubleshooting

### Common Deployment Issues

**Build Failures**:
```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Prisma client generation failures
# 4. Node.js version incompatibility
```

**Database Connection Issues**:
```typescript
// Test database connection
export async function GET() {
  try {
    await prisma.$connect();
    return Response.json({ status: 'Database connected' });
  } catch (error) {
    return Response.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
```

**File Upload Issues**:
- Verify BLOB_READ_WRITE_TOKEN is set
- Check file size limits
- Validate file type restrictions

### Debugging Production Issues

**Function Logs**:
1. Vercel Dashboard → Functions tab
2. View real-time logs
3. Filter by function or time range
4. Export logs for analysis

**Performance Issues**:
1. Check Vercel Speed Insights
2. Analyze Core Web Vitals
3. Review function execution times
4. Optimize database queries

## Maintenance

### Regular Maintenance Tasks

**Weekly**:
- Review error logs and performance metrics
- Check for dependency updates
- Monitor database performance
- Verify backup integrity

**Monthly**:
- Update dependencies (`npm update`)
- Review security headers and settings
- Analyze usage patterns and costs
- Test disaster recovery procedures

**Quarterly**:
- Security audit and penetration testing
- Performance optimization review
- Infrastructure cost analysis
- Capacity planning assessment

### Updates & Migrations

**Application Updates**:
1. Test changes in preview deployments
2. Run database migrations in staging
3. Deploy to production during low-traffic periods
4. Monitor for issues post-deployment

**Database Migrations**:
```bash
# Migrations run automatically during deployment
# For manual migration in production:
npx prisma migrate deploy --preview-feature
```

This deployment guide ensures a reliable, secure, and performant production environment for the 687 Merch Site on the Vercel platform.