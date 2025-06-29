import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            subscriptions: {
              where: { status: 'active' },
              orderBy: { endDate: 'desc' },
              take: 1,
            },
          },
        })

        if (!user) {
          throw new Error('No user found with this email')
        }

        if (!user.isEmailVerified) {
          throw new Error('Please verify your email before logging in')
        }

        if (!user.passwordHash || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as 'admin' | 'customer',
          subscriptionStatus: user.subscriptions[0]?.status as 'active' | 'expired' | 'grace_period' | undefined,
          subscriptionExpiry: user.subscriptions[0]?.endDate ?? undefined,
          isEmailVerified: user.isEmailVerified,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'customer',
          isEmailVerified: true, // Google accounts are pre-verified
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          role: 'customer',
          isEmailVerified: true, // Facebook accounts are pre-verified
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, create or update user in database
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: 'customer',
              isEmailVerified: true,
            },
          })
        }
      }

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isEmailVerified = user.isEmailVerified
        token.subscriptionStatus = user.subscriptionStatus
        token.subscriptionExpiry = user.subscriptionExpiry
      }

      // Update token if session is updated
      if (trigger === 'update' && session) {
        token.name = session.user.name
        token.email = session.user.email
        token.image = session.user.image
        token.subscriptionStatus = session.user.subscriptionStatus
        token.subscriptionExpiry = session.user.subscriptionExpiry
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.isEmailVerified = token.isEmailVerified
      session.user.subscriptionStatus = token.subscriptionStatus
      session.user.subscriptionExpiry = token.subscriptionExpiry

      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
    verifyRequest: '/auth/verify-email',
  },
  events: {
    async signIn({ user }) {
      // Log user sign in
      await prisma.activityLog.create({
        data: {
          userId: parseInt(user.id),
          action: 'SIGN_IN',
          details: 'User signed in successfully',
        },
      })
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const generateToken = (length: number = 32): string => {
  return randomBytes(length).toString('hex')
}

// Helper function to check if user has admin role
export const isAdmin = (session: any) => session?.user?.role === 'admin'

// Helper function to check if user is authenticated
export const isAuthenticated = (session: any) => !!session?.user

// Helper function to check if user has verified email
export const isEmailVerified = (session: any) => session?.user?.isEmailVerified === true