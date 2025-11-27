import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

// Check every 5 minutes
const CHECK_INTERVAL_MS = 5 * 60 * 1000

/**
 * Hook to automatically refresh the auth token in the background
 * This ensures the user stays logged in as long as their Clerk session is active
 */
export function useTokenRefresh() {
  const { isAuthenticated, token, needsRefresh, setToken, clearAuth } = useAuthStore()
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    // Only run if user is authenticated
    if (!isAuthenticated || !token) {
      return
    }

    const refreshToken = async () => {
      // Prevent concurrent refresh attempts
      if (isRefreshingRef.current) {
        return
      }

      // Check if token needs refresh
      if (!needsRefresh()) {
        return
      }

      isRefreshingRef.current = true
      console.log('[useTokenRefresh] Refreshing token...')

      try {
        const newToken = await authService.refreshToken(token)
        setToken(newToken)
        console.log('[useTokenRefresh] Token refreshed successfully')
      } catch (error) {
        console.error('[useTokenRefresh] Failed to refresh token:', error)
        // If refresh fails, clear auth and redirect to login
        clearAuth()
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      } finally {
        isRefreshingRef.current = false
      }
    }

    // Check immediately on mount
    refreshToken()

    // Set up interval to check periodically
    const interval = setInterval(refreshToken, CHECK_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [isAuthenticated, token, needsRefresh, setToken, clearAuth])
}
