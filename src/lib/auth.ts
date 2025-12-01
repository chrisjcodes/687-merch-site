import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Adapter } from 'next-auth/adapters'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.CONTACT_TO || 'info@687merch.com',
    }),
  ],
  pages: {
    signIn: '/admin/login',
    verifyRequest: '/admin/verify-request',
    error: '/admin/error',
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow sign in if the user already exists in the database
      // This prevents automatic user creation - admins must be added manually
      if (!user.id) {
        // New user attempting to sign in - check if they exist
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        if (!existingUser) {
          return false // Reject sign in for non-existent users
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
  session: {
    strategy: 'database',
  },
  debug: process.env.NODE_ENV === 'development',
}
