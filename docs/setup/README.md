# Setup & Installation Guide

This guide will help you set up the 687 Merch Site locally for development.

## Prerequisites

- **Node.js**: Version 20.0.0 or higher (recommended: latest LTS)
- **npm**: Version 9.0.0 or higher  
- **PostgreSQL**: Version 13 or higher
- **Git**: Latest version
- **Vercel CLI** (optional, for blob storage testing)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 687-merch-site
```

### 2. Node.js Version Management

This project requires Node.js 20+. If using nvm:

```bash
# Install and use Node.js 20
nvm install 20
nvm use 20

# Verify version
node -v  # Should show v20.x.x
```

### 3. Install Dependencies

```bash
npm install
```

## Database Setup

### 1. PostgreSQL Installation

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE merch687_dev;
CREATE USER merch687_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE merch687_dev TO merch687_user;
\q
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
POSTGRES_URL="postgresql://merch687_user:your_password@localhost:5432/merch687_dev"
POSTGRES_PRISMA_URL="postgresql://merch687_user:your_password@localhost:5432/merch687_dev?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://merch687_user:your_password@localhost:5432/merch687_dev"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"

# Email Configuration (for magic links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Vercel Blob (optional for local dev)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Environment Variable Details

#### Database URLs
- `POSTGRES_URL`: Standard connection string
- `POSTGRES_PRISMA_URL`: For connection pooling (production)
- `POSTGRES_URL_NON_POOLING`: Direct connection (migrations)

#### NextAuth
- `NEXTAUTH_URL`: Your app's URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: Random string for JWT signing (generate with `openssl rand -base64 32`)

#### Email (Magic Links)
- Configure SMTP settings for your email provider
- For Gmail, use an App Password instead of your regular password

#### Vercel Blob
- Optional for local development
- Get token from Vercel dashboard for file uploads

## Database Initialization

### 1. Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Verify schema
npx prisma db pull
```

### 2. Seed Development Data

```bash
npx prisma db seed
```

This creates:
- Admin user: `info@687merch.com`
- Test customer: `test@example.com`
- Sample jobs with different statuses

## Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Main site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin
- **Customer portal**: http://localhost:3000/dashboard (after login)

## Verification

### 1. Check Database Connection

```bash
npx prisma studio
```

This opens Prisma Studio at http://localhost:5555 to browse your data.

### 2. Test Authentication

1. Navigate to http://localhost:3000/admin
2. Enter `info@687merch.com`
3. Check your email for magic link
4. Click link to authenticate

### 3. Test File Uploads

1. Create a new job in admin panel
2. Add a placement with design file
3. Verify file uploads work (requires Blob token)

## Troubleshooting

### Common Issues

**Node Version Conflicts**
```bash
# Switch to Node 20+
nvm use 20
npm install
```

**Database Connection Issues**
```bash
# Test PostgreSQL connection
psql postgresql://merch687_user:your_password@localhost:5432/merch687_dev

# Reset database if needed
npx prisma db reset
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Environment Variables**
- Ensure `.env.local` exists and has correct values
- Restart dev server after changing env vars
- Check for typos in variable names

### Development Database Reset

If you need to start fresh:

```bash
# Reset database and reseed
npx prisma db reset

# Or manually
npx prisma db push --force-reset
npx prisma db seed
```

## Next Steps

After successful setup:

1. [Explore the Public Site](../public-site/README.md)
2. [Learn the Admin Panel](../admin/README.md)
3. [Understand the Customer Portal](../customer-portal/README.md)
4. [Review the API Documentation](../api/README.md)

## Development Tools

### Recommended VS Code Extensions

- Prisma
- TypeScript and JavaScript
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint

### Useful Commands

```bash
# Database
npx prisma studio          # Browse database
npx prisma generate         # Regenerate client
npx prisma db reset         # Reset database

# Development
npm run dev                 # Start dev server
npm run build               # Build for production
npm run start               # Start production server
npm run type-check          # Check TypeScript

# Linting
npm run lint                # Run ESLint
npm run lint:fix            # Fix linting issues
```