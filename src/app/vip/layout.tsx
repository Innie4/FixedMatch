import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

export default async function VIPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  if (!session.user.subscriptionStatus || 
      session.user.subscriptionStatus === 'expired' ||
      (session.user.subscriptionExpiry && new Date(session.user.subscriptionExpiry) < new Date())) {
    redirect('/vip/upgrade')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  )
}