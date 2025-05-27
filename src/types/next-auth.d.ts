import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    subscriptionStatus?: 'active' | 'grace_period' | 'expired'
    subscriptionExpiry?: Date
  }

  interface Session {
    user: User & {
      role?: string
      subscriptionStatus?: 'active' | 'grace_period' | 'expired'
      subscriptionExpiry?: Date
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    subscriptionStatus?: 'active' | 'grace_period' | 'expired'
    subscriptionExpiry?: Date
  }
}