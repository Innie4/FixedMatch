import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { User } from 'next-auth'

const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        type UserWithRole = {
          id: number
          name: string | null
          email: string
          passwordHash: string
          role: 'admin' | 'customer'
          isEmailVerified: boolean
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        }) as UserWithRole | null

        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: null,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.isEmailVerified = user.isEmailVerified
        // Fetch subscription status and expiry from database and add to token
        const dbUser = await prisma.user.findUnique({
          where: { id: parseInt(user.id) },
          include: {
            subscriptions: { where: { status: 'active' }, orderBy: { endDate: 'desc' }, take: 1 },
          },
        })
        if (dbUser?.subscriptions && dbUser.subscriptions.length > 0) {
          token.subscriptionStatus = dbUser.subscriptions[0].status as 'active' | 'expired' | 'grace_period'
          token.subscriptionExpiry = dbUser.subscriptions[0].endDate
        } else {
          token.subscriptionStatus = undefined
          token.subscriptionExpiry = undefined
        }
      }
      // Re-fetch subscription status if session is updated (e.g., after a new subscription)
      if (trigger === 'update' && session?.subscriptionStatus) {
        token.subscriptionStatus = session.subscriptionStatus as 'active' | 'expired' | 'grace_period'
        token.subscriptionExpiry = session.subscriptionExpiry
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user) session.user = {} as any
      session.user.id = token.id as string
      session.user.name = token.name
      session.user.email = token.email
      session.user.role = token.role as 'admin' | 'customer'
      session.user.isEmailVerified = token.isEmailVerified as boolean
      session.user.subscriptionStatus = token.subscriptionStatus as 'active' | 'expired' | 'grace_period' | undefined
      session.user.subscriptionExpiry = token.subscriptionExpiry as Date | undefined
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    // signOut: '/auth/login',
    // error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
