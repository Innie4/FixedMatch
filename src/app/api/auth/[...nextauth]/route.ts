import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: null, // Add a user image field if available
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
        // Fetch subscription status and expiry from database and add to token
        const dbUser = await prisma.user.findUnique({
          where: { id: parseInt(user.id) },
          include: {
            subscriptions: { where: { status: 'active' }, orderBy: { endDate: 'desc' }, take: 1 },
          },
        })
        if (dbUser?.subscriptions && dbUser.subscriptions.length > 0) {
          token.subscriptionStatus = dbUser.subscriptions[0].status
          token.subscriptionExpiry = dbUser.subscriptions[0].endDate
        } else {
          token.subscriptionStatus = 'none'
          token.subscriptionExpiry = null
        }
      }
      // Re-fetch subscription status if session is updated (e.g., after a new subscription)
      if (trigger === 'update' && session?.subscriptionStatus) {
        token.subscriptionStatus = session.subscriptionStatus
        token.subscriptionExpiry = session.subscriptionExpiry
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.name = token.name
      session.user.email = token.email
      session.user.subscriptionStatus = token.subscriptionStatus as string | undefined
      session.user.subscriptionExpiry = token.subscriptionExpiry as Date | undefined
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
