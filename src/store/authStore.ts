import { create } from 'zustand'
import type { User } from '@/types/auth.types'

interface AuthState {
  token: string | null
  tokenExpiresAt: number | null
  user: User | null
  isAuthenticated: boolean
  laboratoryId: number | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  updateUser: (user: User) => void
  setToken: (token: string) => void
  needsRefresh: () => boolean
}

// Token lifetime: 55 minutes (refresh before 60min expiry)
const TOKEN_LIFETIME_MS = 55 * 60 * 1000
// Refresh buffer: refresh 5 minutes before expiry
const REFRESH_BUFFER_MS = 5 * 60 * 1000

export const useAuthStore = create<AuthState>((set, get) => {
  const storedToken = localStorage.getItem('auth_token')
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const storedExpiresAt = localStorage.getItem('token_expires_at')

  console.log('[AuthStore] Initializing with:', {
    storedToken,
    storedUser,
    isAuthenticated: !!storedToken,
    tokenExpiresAt: storedExpiresAt,
  })

  return {
    token: storedToken,
    tokenExpiresAt: storedExpiresAt ? parseInt(storedExpiresAt) : null,
    user: storedUser,
    isAuthenticated: !!storedToken,
    laboratoryId: storedUser?.laboratoryId || null,

    setAuth: (token, user) => {
      const expiresAt = Date.now() + TOKEN_LIFETIME_MS
      localStorage.setItem('auth_token', token)
      localStorage.setItem('token_expires_at', expiresAt.toString())
      localStorage.setItem('user', JSON.stringify(user))
      set({
        token,
        tokenExpiresAt: expiresAt,
        user,
        isAuthenticated: true,
        laboratoryId: user.laboratoryId
      })
    },

    setToken: (token) => {
      const expiresAt = Date.now() + TOKEN_LIFETIME_MS
      localStorage.setItem('auth_token', token)
      localStorage.setItem('token_expires_at', expiresAt.toString())
      set({
        token,
        tokenExpiresAt: expiresAt,
      })
    },

    clearAuth: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('token_expires_at')
      localStorage.removeItem('user')
      set({
        token: null,
        tokenExpiresAt: null,
        user: null,
        isAuthenticated: false,
        laboratoryId: null
      })
    },

    updateUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, laboratoryId: user.laboratoryId })
    },

    needsRefresh: () => {
      const { tokenExpiresAt } = get()
      if (!tokenExpiresAt) return false
      return Date.now() >= (tokenExpiresAt - REFRESH_BUFFER_MS)
    },
  }
})
