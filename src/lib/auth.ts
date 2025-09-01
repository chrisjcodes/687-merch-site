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
    async session({ session, user }) {
      if (session.user && user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { customer: true },
        });
        
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.customerId = dbUser.customerId;
          session.user.customer = dbUser.customer;
        }
      }
      return session;
    },
    async signIn({ user, email }) {
      if (!user.email) return false;
      
      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create them as a CUSTOMER by default
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              role: "CUSTOMER",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "database",
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