import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    console.log("🔒 Middleware check:", { 
      pathname, 
      hasToken: !!token, 
      tokenRole: token?.role,
      tokenEmail: token?.email 
    });

    // Redirect to signin if no token on protected routes
    if (!token && (pathname.startsWith('/portal') || pathname.startsWith('/admin'))) {
      console.log("❌ No token, redirecting to signin");
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Admin route protection
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      console.log("❌ Admin route access denied, role:", token?.role);
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Customer portal protection
    if (pathname.startsWith('/portal') && token?.role !== 'CUSTOMER') {
      console.log("❌ Portal route access denied, role:", token?.role);
      return NextResponse.redirect(new URL('/', req.url));
    }

    console.log("✅ Middleware allowing access to:", pathname);
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