import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Home, FlaskConical, Package, Calendar, Users, LogOut, Menu, Settings, ClipboardList, MapPin, ChevronDown, Beaker } from 'lucide-react'
import { useState } from 'react'

export function NavBar() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { canViewResearchers } = usePermissions()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const labManagementLinks = [
    { to: '/equipment', label: 'Equipment', icon: Calendar },
    { to: '/locations', label: 'Locations', icon: MapPin },
    { to: '/samples', label: 'Samples', icon: FlaskConical },
  ]

  const resourceLinks = [
    { to: '/products', label: 'Products', icon: Package },
    { to: '/routines', label: 'Routines', icon: ClipboardList },
  ]

  // Add team to resources if user has permission
  if (canViewResearchers) {
    resourceLinks.push({ to: '/researchers', label: 'Team', icon: Users })
  }

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
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Lab Management Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary outline-none">
                <Beaker className="h-4 w-4" />
                Lab Management
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {labManagementLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="flex items-center gap-2 cursor-pointer">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary outline-none">
                <Package className="h-4 w-4" />
                Resources
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {resourceLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="flex items-center gap-2 cursor-pointer">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            {/* Home */}
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Lab Management Section */}
            <div className="pt-2">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Lab Management
              </div>
              {labManagementLinks.map((link) => (
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
            </div>

            {/* Resources Section */}
            <div className="pt-2">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </div>
              {resourceLinks.map((link) => (
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
            </div>

            {/* User Section */}
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
