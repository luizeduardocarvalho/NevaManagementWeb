import type { User } from '@/types/auth.types'
import type { LoginRequest, LoginResponse } from '@/services/authService'

// Mock coordinator user
export const mockCoordinatorUser: User = {
  id: 1,
  clerkUserId: 'mock_clerk_id_coordinator',
  email: 'coordinator@labflux.com',
  firstName: 'John',
  lastName: 'Coordinator',
  laboratoryId: 1,
  role: 'coordinator',
}

// Mock technician user
export const mockTechnicianUser: User = {
  id: 2,
  clerkUserId: 'mock_clerk_id_technician',
  email: 'technician@labflux.com',
  firstName: 'Jane',
  lastName: 'Technician',
  laboratoryId: 1,
  role: 'technician',
}

// Mock student user
export const mockStudentUser: User = {
  id: 3,
  clerkUserId: 'mock_clerk_id_student',
  email: 'student@labflux.com',
  firstName: 'Bob',
  lastName: 'Student',
  laboratoryId: 1,
  role: 'student',
}

export async function mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simple mock authentication logic
  // Default to coordinator for any credentials
  let user: User = mockCoordinatorUser

  // Allow switching users based on email
  if (credentials.email.includes('technician')) {
    user = mockTechnicianUser
  } else if (credentials.email.includes('student')) {
    user = mockStudentUser
  }

  return {
    token: `mock_jwt_token_${user.role}`,
    user,
  }
}
