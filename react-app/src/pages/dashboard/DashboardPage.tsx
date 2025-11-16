import { Link } from 'react-router-dom'
import { useLowStockProducts } from '@/hooks/useProducts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { AlertTriangle, Package, MapPin, Calendar, TrendingDown } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useMemo } from 'react'

export function DashboardPage() {
  const { data: lowStockProducts, isLoading } = useLowStockProducts()

  const stats = useMemo(() => {
    if (!lowStockProducts) return null

    const now = new Date()
    const expiringProducts = lowStockProducts.filter((product) => {
      const daysUntilExpiry = differenceInDays(new Date(product.expiration_date), now)
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0
    })

    const expiredProducts = lowStockProducts.filter(
      (product) => new Date(product.expiration_date) < now
    )

    return {
      totalLowStock: lowStockProducts.length,
      expiringSoon: expiringProducts.length,
      expired: expiredProducts.length,
      expiringProducts,
      expiredProducts,
    }
  }, [lowStockProducts])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your laboratory inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Products</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLowStock || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Products below usage threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.expiringSoon || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Expires within 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Products</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.expired || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription className="mt-2">
                Products that need to be restocked based on recent usage
              </CardDescription>
            </div>
            <Link to="/products">
              <Button variant="outline" size="sm">
                View All Products
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!lowStockProducts || lowStockProducts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              All products are adequately stocked
            </p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="block"
                >
                  <div className="flex items-start justify-between p-4 rounded-lg border hover:border-primary transition-colors">
                    <div className="flex gap-3 flex-1">
                      <div className="rounded-full bg-destructive/10 p-2 shrink-0 self-start">
                        <Package className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{product.name}</h4>
                          <span className="text-sm font-semibold text-destructive">
                            {product.quantity} {product.unit}
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {product.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {product.location.name}
                            </span>
                          )}
                          <span>
                            Used: {product.quantity_used_in_the_last_three_months} {product.unit} (3 months)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {lowStockProducts.length > 5 && (
                <div className="text-center pt-2">
                  <Link to="/products">
                    <Button variant="ghost" size="sm">
                      View {lowStockProducts.length - 5} more low stock products
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Products Section */}
      {stats && stats.expiringProducts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Expiring Soon
                </CardTitle>
                <CardDescription className="mt-2">
                  Products expiring within the next 30 days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.expiringProducts.slice(0, 5).map((product) => {
                const daysLeft = differenceInDays(new Date(product.expiration_date), new Date())
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between p-4 rounded-lg border hover:border-primary transition-colors">
                      <div className="flex gap-3 flex-1">
                        <div className="rounded-full bg-orange-500/10 p-2 shrink-0 self-start">
                          <Calendar className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{product.name}</h4>
                            <span className="text-sm font-semibold text-orange-600">
                              {daysLeft} days left
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires: {format(new Date(product.expiration_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Products Section */}
      {stats && stats.expiredProducts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Expired Products
            </CardTitle>
            <CardDescription className="mt-2">
              These products have expired and should be disposed of
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.expiredProducts.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="block"
                >
                  <div className="flex items-start justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div className="flex gap-3 flex-1">
                      <div className="rounded-full bg-destructive/10 p-2 shrink-0 self-start">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-destructive">
                          Expired: {format(new Date(product.expiration_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
