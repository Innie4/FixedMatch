import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    subscriptionStatus?: 'active' | 'grace_period' | 'expired'
    subscriptionExpiry?: Date
    isEmailVerified?: boolean
    isAdmin?: boolean
  }

  interface Session {
    user: User & {
      role?: string
      subscriptionStatus?: 'active' | 'grace_period' | 'expired'
      subscriptionExpiry?: Date
      isEmailVerified?: boolean
      isAdmin?: boolean
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
