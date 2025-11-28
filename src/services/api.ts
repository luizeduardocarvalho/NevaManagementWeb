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
    console.log('[API Request] Full URL:', `${config.baseURL || ''}${config.url || ''}`)

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

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshingOn401 = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('[API] Error intercepted:', error.response?.status, error.config?.url)
    console.log('[API] Error response:', error.response?.data)
    console.log('[API] Request headers:', error.config?.headers)

    const originalRequest = error.config

    // Endpoints that shouldn't trigger automatic logout/refresh on 401
    const noRefreshEndpoints = ['/auth/signin', '/auth/signup', '/auth/refresh', '/laboratories', '/invitations/accept']
    const shouldSkipRefresh = noRefreshEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint)
    )

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !shouldSkipRefresh && !originalRequest._retry) {
      console.log('[API] 401 error detected, attempting token refresh')

      const hasToken = localStorage.getItem('auth_token')

      if (!hasToken) {
        console.log('[API] No token found, redirecting to login')
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      // If already refreshing, queue this request
      if (isRefreshingOn401) {
        console.log('[API] Refresh already in progress, queueing request')
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true
      isRefreshingOn401 = true

      try {
        console.log('[API] Attempting to refresh token...')
        const { authService } = await import('./authService')
        const authStore = useAuthStore.getState()

        const newToken = await authService.refreshToken(hasToken)
        console.log('[API] Token refreshed successfully')

        authStore.setToken(newToken)
        processQueue(null, newToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError)
        processQueue(refreshError, null)

        // Clear auth and redirect to login
        const authStore = useAuthStore.getState()
        authStore.clearAuth()

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshingOn401 = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
