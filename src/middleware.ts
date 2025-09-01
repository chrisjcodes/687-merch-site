import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect to signin if no token on protected routes
    if (!token && (pathname.startsWith('/portal') || pathname.startsWith('/admin'))) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Admin route protection
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Customer portal protection
    if (pathname.startsWith('/portal') && token?.role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow all non-protected routes
        if (!pathname.startsWith('/portal') && !pathname.startsWith('/admin')) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*']
};