# 687 Merch Site Documentation

Welcome to the comprehensive documentation for the 687 Merch Site - a custom merchandise ordering and job management system.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Quick Links](#quick-links)
4. [Getting Started](#getting-started)

## System Overview

The 687 Merch Site is a full-stack Next.js application that provides:

- **Public Marketing Site** - Showcases services and company information
- **Customer Portal** - Allows customers to place orders and track jobs
- **Admin Dashboard** - Complete job management system for staff
- **Authentication System** - Magic link-based authentication via NextAuth.js
- **File Management** - Vercel Blob storage for design files

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
- **Smart Job Creation** - Dynamic form with garment-specific decoration methods
- **Placement Management** - Detailed placement specifications with size presets
- **File Upload System** - Vercel Blob integration for design files
- **Status Tracking** - Complete job lifecycle management
- **Customer Management** - Integrated customer database
- **Event Timeline** - Detailed job history and status changes

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