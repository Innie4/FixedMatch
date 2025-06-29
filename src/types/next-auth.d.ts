import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      role: 'admin' | 'customer'
      subscriptionStatus?: 'active' | 'expired' | 'grace_period'
      subscriptionExpiry?: Date
      isEmailVerified: boolean
    }
  }

  interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: 'admin' | 'customer'
    subscriptionStatus?: 'active' | 'expired' | 'grace_period'
    subscriptionExpiry?: Date
    isEmailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: 'admin' | 'customer'
    subscriptionStatus?: 'active' | 'expired' | 'grace_period'
    subscriptionExpiry?: Date
    isEmailVerified: boolean
  }
}
