import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'
import { Home, FlaskConical, Package, Calendar, Users, LogOut, Menu, Settings, ClipboardList } from 'lucide-react'
import { useState, useMemo } from 'react'

export function NavBar() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { canViewResearchers } = usePermissions()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const navLinks = useMemo(() => {
    const links = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/products', label: 'Products', icon: Package },
      { to: '/equipment', label: 'Equipment', icon: Calendar },
      { to: '/samples', label: 'Samples', icon: FlaskConical },
      { to: '/routines', label: 'Routines', icon: ClipboardList },
    ]

    // Only show Researchers link for coordinators
    if (canViewResearchers) {
      links.push({ to: '/researchers', label: 'Researchers', icon: Users })
    }

    return links
  }, [canViewResearchers])

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="text-xl font-bold">
            LabFlux
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </span>
            <Link to="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-accent rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t space-y-2">
              <div className="px-2 py-2 text-sm text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </div>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-accent rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
