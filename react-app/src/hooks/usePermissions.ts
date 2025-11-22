import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/auth.types'

export function usePermissions() {
  const user = useAuthStore((state) => state.user)
  const userRole = user?.role

  const isCoordinator = userRole === 'coordinator'
  const isTechnician = userRole === 'technician'
  const isStudent = userRole === 'student'

  return {
    // User role checks
    isCoordinator,
    isTechnician,
    isStudent,
    userRole,

    // Researchers module permissions
    canViewResearchers: isCoordinator,
    canAddResearcher: isCoordinator,
    canEditResearcher: isCoordinator,
    canDeleteResearcher: isCoordinator,

    // Samples module permissions
    canViewSamples: true, // All roles can view
    canAddSample: isCoordinator || isTechnician,
    canEditSample: isCoordinator || isTechnician,
    canDeleteSample: isCoordinator,
    canDuplicateReplica: isCoordinator || isTechnician,

    // Products module permissions
    canViewProducts: true,
    canAddProduct: isCoordinator || isTechnician,
    canEditProduct: isCoordinator || isTechnician,
    canDeleteProduct: isCoordinator,

    // Equipment module permissions
    canViewEquipment: true,
    canAddEquipment: isCoordinator || isTechnician,
    canEditEquipment: isCoordinator || isTechnician,
    canDeleteEquipment: isCoordinator,
    canScheduleEquipment: true, // All roles can schedule

    // General permissions
    canManageSettings: isCoordinator,
  }
}

// Helper function to check if user has required role
export function hasRole(requiredRole: UserRole | UserRole[]): boolean {
  const user = useAuthStore.getState().user
  if (!user) return false

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }

  return user.role === requiredRole
}
