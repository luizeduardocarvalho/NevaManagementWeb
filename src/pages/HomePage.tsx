import { useAuthStore } from '@/store/authStore'

export function HomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to LabFlux</h1>
        {user && (
          <p className="text-muted-foreground mt-2">
            Hello, {user.firstName} {user.lastName}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* TODO: Add dashboard cards here */}
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Products</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your laboratory products
          </p>
        </div>
      </div>
    </div>
  )
}
