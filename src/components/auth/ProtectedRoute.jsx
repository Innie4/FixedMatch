import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Show loading or nothing while checking auth status
  if (currentUser === null) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return children;
}