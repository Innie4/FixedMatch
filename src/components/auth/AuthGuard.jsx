import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export default function AuthGuard({ requiredRole = null, children }) {
  const { currentUser, getCurrentUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function checkUserRole() {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        const userDoc = await getCurrentUser()
        setUserData(userDoc)

        if (!requiredRole || (userDoc && userDoc.role === requiredRole)) {
          setAuthorized(true)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking user role:', error)
        setLoading(false)
      }
    }

    checkUserRole()
  }, [currentUser, getCurrentUser, requiredRole])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!authorized) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="text-gray-700 text-center">You don't have permission to access this page.</p>
      </div>
    )
  }

  return children
}
