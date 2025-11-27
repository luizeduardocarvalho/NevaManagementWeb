import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/auth.types'

export function usePermissions() {
  const user = useAuthStore((state) => state.user)
  const userRole = user?.role

  const isOrgCoordinator = userRole === 'org-coordinator'
  const isLabCoordinator = userRole === 'lab-coordinator'
  const isTechnician = userRole === 'technician'
  const isStudent = userRole === 'student'

  // Helper: any coordinator role
  const isAnyCoordinator = isOrgCoordinator || isLabCoordinator

  return {
    // User role checks
    isOrgCoordinator,
    isLabCoordinator,
    isTechnician,
    isStudent,
    isAnyCoordinator,
    userRole,

    // Researchers module permissions (team management)
    canViewResearchers: isAnyCoordinator,
    canAddResearcher: isAnyCoordinator,
    canEditResearcher: isAnyCoordinator,
    canDeleteResearcher: isAnyCoordinator,

    // Samples module permissions
    canViewSamples: true, // All roles can view
    canAddSample: isAnyCoordinator || isTechnician,
    canEditSample: isAnyCoordinator || isTechnician,
    canDeleteSample: isAnyCoordinator,
    canDuplicateReplica: isAnyCoordinator || isTechnician,

    // Products module permissions
    canViewProducts: true,
    canAddProduct: isAnyCoordinator || isTechnician,
    canEditProduct: isAnyCoordinator || isTechnician,
    canDeleteProduct: isAnyCoordinator,

    // Equipment module permissions
    canViewEquipment: true,
    canAddEquipment: isAnyCoordinator || isTechnician,
    canEditEquipment: isAnyCoordinator || isTechnician,
    canDeleteEquipment: isAnyCoordinator,
    canScheduleEquipment: true, // All roles can schedule

    // General permissions
    canManageSettings: isAnyCoordinator,
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
