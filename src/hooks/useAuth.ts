import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          })
          return false
        }

        // Refresh the session to get the latest data
        await update()
        
        return true
      } catch (error) {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        })
        return false
      }
    },
    [update]
  )

  const loginWithGoogle = useCallback(async () => {
    try {
      await signIn('google', { redirect: false })
      return true
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      })
      return false
    }
  }, [])

  const loginWithFacebook = useCallback(async () => {
    try {
      await signIn('facebook', { redirect: false })
      return true
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Facebook',
        variant: 'destructive',
      })
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false })
      router.push('/auth/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      })
    }
  }, [router])

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    updateSession: update,
  }
} 