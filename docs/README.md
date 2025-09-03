# 687 Merch Site Documentation

Welcome to the comprehensive documentation for the 687 Merch Site - a custom merchandise ordering and job management system.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Quick Links](#quick-links)
4. [Getting Started](#getting-started)

## System Overview

The 687 Merch Site is a comprehensive merchandise management platform that provides:

- **Public Marketing Site** - Professional dark-themed marketing site with brand colors
- **Customer Portal** - Order tracking, item management, and multi-item reordering
- **Admin Dashboard** - Complete job lifecycle management with status updates
- **Authentication System** - Secure magic link authentication with role-based access
- **File Management** - Design file uploads with anchor-point placement system
- **Item Templates** - Reusable item configurations for efficient reordering
- **Advanced UI** - Material-UI with custom themes and comprehensive navigation

## Architecture

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

## Quick Links

### Documentation Sections
- [Setup & Installation](./setup/README.md) - Get the project running locally
- [Public Site](./public-site/README.md) - Marketing website documentation
- [Customer Portal](./customer-portal/README.md) - Customer-facing features
- [Admin Panel](./admin/README.md) - Administrative functionality
- [API Reference](./api/README.md) - Backend endpoints and schemas
- [Database Schema](./database/README.md) - Data models and relationships
- [Authentication](./auth/README.md) - Auth system and user management
- [File Management](./files/README.md) - Design file storage and handling
- [Deployment](./deployment/README.md) - Production deployment guide

### Key Features
- **Item-Level Reordering** - Customers can reorder specific items across multiple jobs
- **Anchor-Point Placement** - Precise design placement using product-specific anchor points  
- **Multi-Portal Architecture** - Separate admin (plum) and customer (black) themed portals
- **Advanced Job Management** - Complete workflow from design to fulfillment with status updates
- **Smart Item Templates** - Automatic creation of reusable item configurations
- **Comprehensive Search & Filtering** - Sortable, paginated tables with real-time search
- **Global Navigation** - Persistent portal navigation with role-based features
- **File Upload System** - Secure design file management with multiple format support
- **Theme Separation** - Independent styling for marketing site vs. portals
- **Status Tracking** - Visual job progression with color-coded status indicators

## Getting Started

1. **First Time Setup**: Follow the [Setup Guide](./setup/README.md)
2. **Understanding the System**: Read through the [Architecture Overview](./architecture/README.md)
3. **Development Workflow**: Check the [Development Guide](./development/README.md)
4. **Deployment**: See [Deployment Documentation](./deployment/README.md)

## Technology Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Magic Links
- **UI Framework**: Material-UI (MUI)
- **File Storage**: Vercel Blob
- **Deployment**: Vercel Platform
- **Email**: Nodemailer with SMTP

## Project Status

This project is actively developed and includes:
- ✅ Complete admin job management system
- ✅ Customer portal with order tracking
- ✅ File upload and management
- ✅ Authentication and authorization
- ✅ Database schema and relationships
- ✅ Public marketing website
- 🔄 Additional customer-facing features (in development)

---

For detailed information on any component, navigate to the relevant documentation section above.