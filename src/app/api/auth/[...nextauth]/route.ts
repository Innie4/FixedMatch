import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Implement your authentication logic here
        // This is where you would verify the user's credentials
        // against your database
        
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // For now, we'll use a mock admin user
        if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
          return {
            id: "1",
            email: credentials.email,
            name: "Admin",
            role: "admin"
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  }
})

export { handler as GET, handler as POST }