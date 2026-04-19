import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: string[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuthContext()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-2xl tracking-tight text-primary">TZ</span>
            <span className="font-serif text-2xl text-gold font-semibold">Dalali</span>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-2 w-2 rounded-full animate-bounce" />
            <Skeleton className="h-2 w-2 rounded-full animate-bounce [animation-delay:0.15s]" />
            <Skeleton className="h-2 w-2 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (roles && role && !roles.includes(role)) {
    const fallback =
      role === 'admin' || role === 'superadmin'
        ? '/admin'
        : role === 'law_firm' || role === 'tax_consultant'
        ? '/partner'
        : role === 'seller'
        ? '/seller'
        : '/dashboard'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
