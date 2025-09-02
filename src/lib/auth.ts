import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.CONTACT_TO,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("🔄 NextAuth redirect callback:", { url, baseUrl });
      
      // If already going to dashboard-redirect, allow it
      if (url.includes('/dashboard-redirect')) {
        console.log("✅ Already going to dashboard-redirect:", url);
        return url;
      }
      
      // Allow navigation to admin and portal routes (these are client-side navigations)
      if (url.startsWith('/admin') || url.startsWith('/portal')) {
        console.log("✅ Allowing navigation to protected route:", url);
        return `${baseUrl}${url}`;
      }
      
      // Only redirect to dashboard-redirect for initial sign-in (baseUrl or home)
      if (url === baseUrl || url === `${baseUrl}/`) {
        console.log("✅ Initial sign-in, redirecting to dashboard-redirect");
        return `${baseUrl}/dashboard-redirect`;
      }
      
      // Allow relative callback URLs
      if (url.startsWith("/")) {
        console.log("✅ Allowing relative callback:", `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        console.log("✅ Allowing same origin callback:", url);
        return url;
      }
      
      console.log("⚠️ Defaulting to baseUrl:", baseUrl);
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      console.log("🎫 NextAuth JWT callback:", { 
        tokenEmail: token.email, 
        userEmail: user?.email,
        account: account?.provider
      });
      
      // If we have user (during sign-in), get their info from database
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { customer: true },
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.customerId = dbUser.customerId;
          token.customer = dbUser.customer;
          console.log("🎫 JWT token updated with role:", dbUser.role);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("👤 NextAuth session callback:", { sessionUser: session.user?.email, tokenRole: token.role });
      
      // Copy token info to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CUSTOMER";
        session.user.customerId = token.customerId as string;
        session.user.customer = token.customer as any;
        
        console.log("✅ Session updated with role from token:", token.role);
      }
      
      return session;
    },
    async signIn({ user, email, account, profile }) {
      console.log("🔑 NextAuth signIn callback:", { 
        userEmail: user.email, 
        account: account?.provider,
        emailVerification: !!email 
      });
      
      if (!user.email) {
        console.log("❌ No email provided");
        return false;
      }
      
      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        console.log("🔍 Existing user check:", { 
          email: user.email, 
          exists: !!existingUser, 
          role: existingUser?.role,
          userId: existingUser?.id 
        });

        // If user doesn't exist, create them as a CUSTOMER by default
        if (!existingUser) {
          console.log("➕ Creating new user as CUSTOMER");
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email,
              role: "CUSTOMER",
            },
          });
          console.log("✅ New user created:", newUser.id);
        }

        console.log("✅ SignIn approved for:", user.email);
        return true;
      } catch (error) {
        console.error("❌ Error during sign in:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
};

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: "ADMIN" | "CUSTOMER";
      customerId?: string;
      customer?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        companyName?: string;
      } | null;
    };
  }

  interface User {
    role: "ADMIN" | "CUSTOMER";
    customerId?: string;
  }
}