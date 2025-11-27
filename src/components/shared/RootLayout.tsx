import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { NavBar } from './NavBar'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
