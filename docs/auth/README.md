# Authentication System Documentation

The 687 Merch Site uses NextAuth.js with magic link authentication for a password-free, secure authentication experience.

## Authentication Overview

### Magic Link Authentication
- **Password-free**: Users authenticate via email links only
- **Secure**: Time-limited, one-use tokens
- **User-friendly**: No password management required
- **Role-based**: Automatic routing based on user role (ADMIN/CUSTOMER)

### Authentication Flow
```
1. User enters email → 2. Magic link sent → 3. User clicks link → 4. Authenticated & redirected
```

## NextAuth.js Configuration

### Core Setup (`/api/auth/[...nextauth]/route.ts`)

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { customer: true },
        });
        
        if (user) {
          session.user.id = user.id;
          session.user.role = user.role;
          session.user.customerId = user.customerId;
        }
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## User Roles & Permissions

### Role Definitions

**ADMIN Role**
- Full system access
- Job creation and management
- Customer management
- Status updates
- File access and management
- System administration

**CUSTOMER Role**
- Own job viewing and tracking
- Profile management
- File downloads (own jobs only)
- Order history access

### Role-Based Access Control

**Server-Side Protection**
```typescript
// Helper functions for route protection
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized - Admin access required');
  }
  return session;
}

export async function requireCustomerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CUSTOMER') {
    throw new Error('Unauthorized - Customer access required');
  }
  return session;
}

export async function requireAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized - Authentication required');
  }
  return session;
}
```

**Client-Side Protection**
```typescript
'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export function AdminProtectedPage({ children }) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loading />;
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }
  
  return children;
}
```

## Middleware Protection

### Route Protection (`middleware.ts`)

```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Customer routes protection
    if (pathname.startsWith('/dashboard')) {
      if (!token || token.role !== 'CUSTOMER') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        if (req.nextUrl.pathname.startsWith('/api/auth')) return true;
        if (req.nextUrl.pathname === '/') return true;
        if (req.nextUrl.pathname === '/about') return true;
        if (req.nextUrl.pathname === '/contact') return true;
        if (req.nextUrl.pathname === '/login') return true;

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/customer/:path*',
  ],
};
```

## Email Configuration

### SMTP Setup

**Environment Variables**
```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

**Gmail Configuration**
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password (not regular password)

**Custom SMTP Providers**
- SendGrid
- Mailgun  
- Amazon SES
- Postmark

### Email Templates

**Magic Link Email Template**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Sign in to 687 Merch</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Sign in to 687 Merch</h1>
        <p>Click the button below to sign in to your account:</p>
        <a href="{{url}}" style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Sign In
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="{{url}}">{{url}}</a></p>
        <p>This link will expire in 24 hours and can only be used once.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
            If you didn't request this email, you can safely ignore it.
        </p>
    </div>
</body>
</html>
```

## User Management

### User Creation Flow

**New Customer Registration**
1. Admin creates Customer record
2. Admin creates User record linked to Customer
3. Customer receives welcome email with login instructions
4. Customer uses magic link to access portal

**Admin User Creation**
1. Database user creation with ADMIN role
2. Admin can immediately access admin panel
3. No customer linkage required

### User Profile Management

**Customer Profile Updates**
```typescript
// API endpoint: /api/customer/profile
export async function PATCH(request: NextRequest) {
  const session = await requireCustomerSession();
  const data = await request.json();
  
  const updatedCustomer = await prisma.customer.update({
    where: { id: session.user.customerId },
    data: {
      name: data.name,
      phone: data.phone,
      company: data.company,
      defaultShip: data.defaultShip,
    },
  });
  
  return NextResponse.json({ customer: updatedCustomer });
}
```

## Session Management

### Session Configuration

**JWT Strategy**
- Stateless tokens
- 30-day expiration
- Automatic renewal
- Secure signing

**Session Data Structure**
```typescript
interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    role: 'ADMIN' | 'CUSTOMER';
    customerId?: string;
  };
  expires: string;
}
```

### Session Hooks

**Client-Side Session Usage**
```typescript
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  
  if (status === 'unauthenticated') {
    return <button onClick={() => signIn()}>Sign In</button>;
  }
  
  return (
    <div>
      <p>Welcome, {session.user.email}!</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

**Server-Side Session Usage**
```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Welcome, {session.user.email}!</div>;
}
```

## Security Features

### Token Security

**Magic Link Tokens**
- Cryptographically secure random generation
- Time-limited (24 hours default)
- Single-use only
- Tied to specific email address

**JWT Tokens**
- Signed with secret key
- Contains minimal user data
- Stateless verification
- Automatic expiration

### CSRF Protection

**Built-in CSRF Protection**
- NextAuth.js includes CSRF tokens
- Automatic validation on form submissions
- State parameter validation
- Secure cookie handling

### Rate Limiting

**Magic Link Rate Limiting**
```typescript
const rateLimiter = new Map<string, number[]>();

export function rateLimitEmailSending(email: string): boolean {
  const now = Date.now();
  const userAttempts = rateLimiter.get(email) || [];
  
  // Remove attempts older than 1 hour
  const recentAttempts = userAttempts.filter(
    time => now - time < 60 * 60 * 1000
  );
  
  // Allow max 5 attempts per hour
  if (recentAttempts.length >= 5) {
    return false;
  }
  
  recentAttempts.push(now);
  rateLimiter.set(email, recentAttempts);
  return true;
}
```

## Error Handling

### Authentication Errors

**Common Error Scenarios**
- Invalid email address
- Expired magic link
- Rate limit exceeded
- Email delivery failure
- Invalid session token

**Error Pages**
```typescript
// pages/auth/error.tsx
export default function AuthError({ searchParams }) {
  const error = searchParams?.error;
  
  const errorMessages = {
    Signin: 'Try signing in with a different account.',
    OAuthSignin: 'Try signing in with a different account.',
    OAuthCallback: 'Try signing in with a different account.',
    OAuthCreateAccount: 'Try signing in with a different account.',
    EmailCreateAccount: 'Try signing in with a different account.',
    Callback: 'Try signing in with a different account.',
    OAuthAccountNotLinked: 'Account linking failed.',
    EmailSignin: 'Check your email for the sign in link.',
    CredentialsSignin: 'Sign in failed.',
    default: 'Unable to sign in.',
  };
  
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{errorMessages[error] || errorMessages.default}</p>
    </div>
  );
}
```

## Testing Authentication

### Test User Setup

**Development Test Users**
```javascript
// In seed data
const testUsers = [
  {
    email: 'admin@test.com',
    role: 'ADMIN',
    name: 'Test Admin'
  },
  {
    email: 'customer@test.com', 
    role: 'CUSTOMER',
    name: 'Test Customer',
    customerId: 'test-customer-id'
  }
];
```

### Integration Testing

**Authentication Flow Tests**
```typescript
import { createMocks } from 'node-mocks-http';
import handler from '../api/auth/[...nextauth]';

describe('/api/auth', () => {
  it('handles signin requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        callbackUrl: '/dashboard'
      }
    });
    
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

## Troubleshooting

### Common Issues

**Magic Links Not Working**
1. Check email SMTP configuration
2. Verify email provider settings
3. Check spam/junk folders
4. Validate EMAIL_FROM address

**Session Issues**
1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches deployment URL
3. Clear browser cookies
4. Check for clock skew (token expiration)

**Role Access Problems**
1. Verify user role in database
2. Check middleware configuration
3. Validate session callback implementation
4. Review API route protection

### Debug Mode

**Enable NextAuth Debug Logging**
```env
NEXTAUTH_DEBUG=true
```

**Custom Debug Logging**
```typescript
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata);
    },
  },
  // ... other options
};
```

This authentication system provides secure, user-friendly access control while maintaining the flexibility to support both admin and customer workflows in the 687 Merch Site.