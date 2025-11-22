import api from './api'
import type { User } from '@/types/auth.types'
import { mockLogin } from '@/mocks/auth'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  token: string
  user: User
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Backend response types (snake_case)
interface BackendUser {
  id: number
  clerk_user_id: string
  email: string
  first_name: string
  last_name: string
  laboratory_id: number | null
  role: 'coordinator' | 'technician' | 'student' | 'user'
  created_at?: string
}

interface BackendLoginResponse {
  token: string
  user: BackendUser
}

// Transform backend user (snake_case) to frontend user (camelCase)
function transformUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    clerkUserId: backendUser.clerk_user_id,
    email: backendUser.email,
    firstName: backendUser.first_name,
    lastName: backendUser.last_name,
    laboratoryId: backendUser.laboratory_id,
    // Map 'user' role to 'student' for frontend compatibility
    role: backendUser.role === 'user' ? 'student' : backendUser.role as 'coordinator' | 'technician' | 'student',
  }
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      console.log('[AuthService] Using mock data')
      return mockLogin(credentials)
    }

    console.log('[AuthService] Calling login endpoint: POST /auth/signin')
    console.log('[AuthService] Request body:', credentials)
    console.log('[AuthService] Base URL:', import.meta.env.VITE_API_BASE_URL)

    try {
      const response = await api.post<BackendLoginResponse>('/auth/signin', credentials)
      console.log('[AuthService] Login API full response:', response)
      console.log('[AuthService] Login API response data:', response.data)
      console.log('[AuthService] Login API status:', response.status)

      const transformedUser = transformUser(response.data.user)
      console.log('[AuthService] Transformed user:', transformedUser)

      return {
        token: response.data.token,
        user: transformedUser,
      }
    } catch (error) {
      console.error('[AuthService] Login error:', error)
      throw error
    }
  },

  signUp: async (data: SignUpRequest): Promise<LoginResponse> => {
    console.log('[AuthService] Calling signup endpoint: POST /auth/signup')
    console.log('[AuthService] Request body:', { ...data, password: '[REDACTED]' })

    const requestBody = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    }

    try {
      const response = await api.post<BackendLoginResponse>('/auth/signup', requestBody)
      console.log('[AuthService] Signup API response:', response.data)

      const transformedUser = transformUser(response.data.user)
      console.log('[AuthService] Transformed user:', transformedUser)

      return {
        token: response.data.token,
        user: transformedUser,
      }
    } catch (error) {
      console.error('[AuthService] Signup error:', error)
      throw error
    }
  },

  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK) {
      // Return coordinator user as default
      const { mockCoordinatorUser } = await import('@/mocks/auth')
      return mockCoordinatorUser
    }

    const response = await api.get<BackendUser>('/auth/me')
    return transformUser(response.data)
  },
}
