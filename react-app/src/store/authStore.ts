import { create } from 'zustand'
import type { User } from '@/types/auth.types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  laboratoryId: number | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('auth_token')
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

  console.log('[AuthStore] Initializing with:', {
    storedToken,
    storedUser,
    isAuthenticated: !!storedToken,
  })

  return {
    token: storedToken,
    user: storedUser,
    isAuthenticated: !!storedToken,
    laboratoryId: storedUser?.laboratoryId || null,

    setAuth: (token, user) => {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({
        token,
        user,
        isAuthenticated: true,
        laboratoryId: user.laboratoryId
      })
    },

    clearAuth: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        laboratoryId: null
      })
    },

    updateUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, laboratoryId: user.laboratoryId })
    },
  }
})
