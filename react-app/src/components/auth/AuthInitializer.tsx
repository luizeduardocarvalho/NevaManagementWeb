import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthStore()

  // On mount, check if we have a token
  useEffect(() => {
    // Auth store automatically loads from localStorage on initialization
    // No additional logic needed here for now
  }, [])

  // Show loading only if we're checking initial auth state
  // For now, we'll just render children immediately
  return <>{children}</>
}
