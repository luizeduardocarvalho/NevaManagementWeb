import api from './api'
import type { User } from '@/types/auth.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/signin', credentials)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}
