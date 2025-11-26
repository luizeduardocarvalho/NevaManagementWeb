import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Track if a refresh is in progress to avoid multiple simultaneous refresh calls
let isRefreshing = false
let refreshPromise: Promise<string> | null = null

// Request interceptor - add JWT token and handle refresh
api.interceptors.request.use(
  async (config) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url)
    console.log('[API Request] Full URL:', config.baseURL + config.url)

    // Skip token refresh for auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/signin') ||
                          config.url?.includes('/auth/signup') ||
                          config.url?.includes('/auth/refresh')

    if (!isAuthEndpoint) {
      const authStore = useAuthStore.getState()

      // Check if token needs refresh
      if (authStore.needsRefresh() && authStore.token) {
        console.log('[API Request] Token needs refresh')

        // If a refresh is already in progress, wait for it
        if (isRefreshing && refreshPromise) {
          console.log('[API Request] Refresh already in progress, waiting...')
          try {
            const newToken = await refreshPromise
            config.headers.Authorization = `Bearer ${newToken}`
            return config
          } catch (error) {
            console.error('[API Request] Failed to wait for token refresh')
            return config
          }
        }

        // Start a new refresh
        isRefreshing = true
        refreshPromise = (async () => {
          try {
            const { authService } = await import('./authService')
            const newToken = await authService.refreshToken(authStore.token!)
            authStore.setToken(newToken)
            console.log('[API Request] Token refreshed successfully')
            return newToken
          } catch (error) {
            console.error('[API Request] Token refresh failed, clearing auth')
            authStore.clearAuth()
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
            throw error
          } finally {
            isRefreshing = false
            refreshPromise = null
          }
        })()

        try {
          const newToken = await refreshPromise
          config.headers.Authorization = `Bearer ${newToken}`
          return config
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }

    // Add current token to headers
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API Request] Token added to headers')
    } else {
      console.log('[API Request] No token in localStorage')
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('[API] Error intercepted:', error.response?.status, error.config?.url)
    console.log('[API] Error response:', error.response?.data)
    console.log('[API] Request headers:', error.config?.headers)

    // Endpoints that shouldn't trigger automatic logout on 401
    const noLogoutEndpoints = ['/auth/signin', '/laboratories', '/invitations/accept']
    const shouldSkipLogout = noLogoutEndpoints.some((endpoint) =>
      error.config.url?.includes(endpoint)
    )

    // Don't redirect to login for certain endpoints or if there's no token
    if (error.response?.status === 401 && !shouldSkipLogout) {
      console.log('[API] 401 error detected')

      // Only clear auth and redirect if we actually have a token
      // This prevents infinite loops and unnecessary redirects
      const hasToken = localStorage.getItem('auth_token')

      if (hasToken) {
        console.log('[API] Token exists but is invalid/expired, clearing auth and redirecting to /login')
        // Clear token and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
