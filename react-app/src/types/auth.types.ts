export type UserRole = 'coordinator' | 'technician' | 'student'

export interface User {
  id: number
  clerkUserId: string
  email: string
  firstName: string
  lastName: string
  laboratoryId: number | null
  role: UserRole
}
