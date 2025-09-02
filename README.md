# 687 Merch Site

A comprehensive custom merchandise ordering and job management system built with Next.js 15.5.2, featuring a public marketing site, customer portal, and admin dashboard.

## 🏢 System Overview

The 687 Merch Site provides a complete solution for custom merchandise businesses:

- **Public Marketing Site** - Showcases services and captures leads
- **Customer Portal** - Self-service order tracking and management
- **Admin Dashboard** - Complete job management and workflow system
- **Authentication System** - Magic link-based secure authentication
- **File Management** - Vercel Blob storage for design files

## ✨ Key Features

### Public Site
- Modern, responsive design with Material-UI
- Contact form with email integration
- SEO optimized with proper metadata
- Performance optimized with Next.js Image

### Customer Portal
- Order tracking and status updates
- Job history and details
- Profile management
- Design file downloads

### Admin Dashboard
- Advanced job creation system with:
  - Dynamic garment and decoration method selection
  - Placement management with auto-sizing
  - Design file uploads with Vercel Blob
  - Size breakdown management
- Comprehensive job detail views
- Status management workflow
- Customer management
- Event timeline tracking

### Technical Features
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **NextAuth.js** for authentication
- **Vercel Blob** for file storage
- **Material-UI** for consistent design
- **Responsive design** for all screen sizes

## 🚀 Quick Start

For detailed setup instructions, see the [Setup Documentation](./docs/setup/README.md).

### Prerequisites
- Node.js 20.0.0 or higher
- PostgreSQL database
- Email service (SMTP)
- Vercel account (for blob storage)

### Basic Installation

```bash
# Clone repository
git clone <repository-url>
cd 687-merch-site

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

### Getting Started
- **[Setup & Installation](./docs/setup/README.md)** - Complete setup guide
- **[Development Guide](./docs/development/README.md)** - Development workflows and standards
- **[Deployment Guide](./docs/deployment/README.md)** - Production deployment on Vercel

### System Components
- **[Public Site](./docs/public-site/README.md)** - Marketing website documentation
- **[Customer Portal](./docs/customer-portal/README.md)** - Customer-facing features
- **[Admin Panel](./docs/admin/README.md)** - Administrative functionality

### Technical Reference
- **[API Documentation](./docs/api/README.md)** - Backend endpoints and schemas
- **[Database Schema](./docs/database/README.md)** - Data models and relationships
- **[Authentication System](./docs/auth/README.md)** - Auth implementation and security
- **[File Management](./docs/files/README.md)** - Design file storage and handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15.5.2                      │
│                  (App Router)                          │
├─────────────────────────────────────────────────────────┤
│  Public Routes    │  Customer Portal  │  Admin Panel    │
│  - Homepage       │  - Job Dashboard  │  - Job Creation │
│  - About          │  - Order Status   │  - Job Details  │
│  - Contact        │  - Profile        │  - Customer Mgmt│
├─────────────────────────────────────────────────────────┤
│                 Authentication Layer                     │
│              NextAuth.js + Magic Links                  │
├─────────────────────────────────────────────────────────┤
│           Database Layer (PostgreSQL)                   │
│                   Prisma ORM                           │
├─────────────────────────────────────────────────────────┤
│              File Storage (Vercel Blob)                │
│           CDN-delivered design files                   │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Project Structure

```
├── docs/                    # Comprehensive documentation
│   ├── setup/              # Installation and setup guides
│   ├── admin/              # Admin panel documentation
│   ├── customer-portal/    # Customer portal documentation
│   ├── api/                # API reference
│   └── deployment/         # Deployment guides
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Database schema definition
│   ├── migrations/         # Database migration files
│   └── seed.js            # Development seed data
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # Admin panel pages
│   │   ├── api/           # API route handlers
│   │   ├── dashboard/     # Customer portal pages
│   │   └── (public)/      # Public site pages
│   ├── components/        # Shared React components
│   ├── lib/              # Utility functions and configurations
│   └── types/            # TypeScript type definitions
└── uploads/              # Local file storage (development)
```

## 🔧 Technology Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with magic links
- **UI Framework**: Material-UI (MUI)
- **File Storage**: Vercel Blob
- **Deployment**: Vercel Platform
- **Email**: SMTP with Nodemailer

## 🗃️ Database Schema

The system uses a comprehensive PostgreSQL schema with these main entities:

- **Users** - Authentication and role management
- **Customers** - Business information and contacts
- **Jobs** - Core order/project management
- **JobItems** - Individual items within jobs
- **Events** - Audit trail and job history
- **Proofs** - Design approval workflow

For detailed schema information, see [Database Documentation](./docs/database/README.md).

## 🔐 Authentication & Security

- **Magic Link Authentication** - Password-free login via email
- **Role-Based Access Control** - ADMIN and CUSTOMER roles
- **Route Protection** - Middleware-based route guarding
- **Session Management** - Secure JWT-based sessions
- **File Access Control** - Authenticated file access

## 📁 File Management

- **Vercel Blob Storage** - Scalable cloud storage
- **Global CDN** - Fast file delivery worldwide
- **Supported Formats** - PNG, SVG, PDF, EPS
- **Secure Access** - Authentication-based file access
- **Organized Structure** - Files organized by job ID

## 🚀 Deployment

The application is optimized for deployment on Vercel:

- **Automatic Deployments** - Git-based deployment pipeline
- **Preview Deployments** - Branch preview environments
- **Environment Variables** - Secure configuration management
- **Performance Monitoring** - Built-in analytics and insights

See [Deployment Documentation](./docs/deployment/README.md) for detailed instructions.

## 👥 User Roles

### Administrators
- Full system access
- Job creation and management
- Customer management
- Status updates and workflow management
- File access and management

### Customers
- Own job viewing and tracking
- Profile management
- Design file downloads
- Order history access

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx prisma studio    # Database browser
npx prisma generate  # Generate Prisma client
npx prisma db seed   # Seed development data
```

### Development Workflow

1. **Feature Development** - Branch-based development with PR reviews
2. **Code Quality** - ESLint, TypeScript, and Prettier integration
3. **Testing** - Unit tests with Jest, E2E tests with Playwright
4. **Documentation** - Comprehensive docs in `/docs` directory

## 📊 Features Highlights

### Smart Job Creation System
- **Dynamic Form Logic** - Options change based on selections
- **Garment Categories** - Headwear, Tops, Bottoms, Accessories
- **Decoration Methods** - HTV, Hybrid DTF, Screen Print DTF, Patches
- **Placement Management** - Location-specific options with auto-sizing
- **File Upload Integration** - Vercel Blob storage with validation

### Comprehensive Job Management
- **Status Workflow** - QUEUED → APPROVED → IN_PROD → READY → SHIPPED → DELIVERED
- **Event Timeline** - Complete audit trail of job changes
- **Customer Integration** - Linked customer records with contact info
- **Size Management** - Flexible size breakdown system

### Professional User Experience
- **Material-UI Design** - Consistent, professional interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **File Downloads** - One-click design file downloads
- **Real-time Updates** - Status changes and notifications

## 🤝 Contributing

1. Read the [Development Guide](./docs/development/README.md)
2. Fork the repository
3. Create a feature branch
4. Make your changes with tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the [Documentation](./docs/README.md)
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, TypeScript, and PostgreSQL**