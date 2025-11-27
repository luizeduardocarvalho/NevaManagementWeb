import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthStore()

  // Automatically refresh token in the background
  useTokenRefresh()

  // On mount, check if we have a token
  useEffect(() => {
    // Auth store automatically loads from localStorage on initialization
    // Token refresh hook will handle keeping the token fresh
  }, [])

  // Show loading only if we're checking initial auth state
  // For now, we'll just render children immediately
  return <>{children}</>
}
