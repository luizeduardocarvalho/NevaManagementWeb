import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/auth.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requireLaboratory?: boolean
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireLaboratory = true
}: ProtectedRouteProps) {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  console.log('[ProtectedRoute] Check:', {
    path: location.pathname,
    isAuthenticated,
    hasUser: !!user,
    laboratoryId,
    requireLaboratory,
  })

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  // Check if user needs to create a laboratory
  if (requireLaboratory && !laboratoryId && location.pathname !== '/create-laboratory') {
    console.log('[ProtectedRoute] No laboratory, redirecting to /create-laboratory')
    return <Navigate to="/create-laboratory" replace />
  }

  // If a specific role is required, check if user has it
  if (requiredRole && user) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole

    if (!hasRequiredRole) {
      console.log('[ProtectedRoute] User does not have required role, redirecting to /')
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
