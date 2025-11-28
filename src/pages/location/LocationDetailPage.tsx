import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { locationService } from '@/services/locationService'
import { productService } from '@/services/productService'
import type { SimpleEquipment } from '@/types/equipment.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/shared/Spinner'
import { ArrowLeft, MapPin, Package, Calendar, Pencil } from 'lucide-react'

export function LocationDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  const { data: location, isLoading: isLoadingLocation } = useQuery({
    queryKey: ['location', id],
    queryFn: () => locationService.getById(parseInt(id!)),
    enabled: !!id,
  })

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', laboratoryId],
    queryFn: () => productService.getAll(laboratoryId!, 1, 1000),
    enabled: !!laboratoryId,
  })

  const isLoading = isLoadingLocation || isLoadingProducts

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Location not found</h3>
        <Button className="mt-4" onClick={() => navigate('/locations')}>
          Back to Locations
        </Button>
      </div>
    )
  }

  const productsInLocation = productsData?.products.filter(
    (product) => product.location_id === parseInt(id!)
  ) || []

  // Note: SimpleEquipment doesn't include location_id, so we can't filter by location
  // This would require using DetailedEquipment or a separate API endpoint
  const equipmentInLocation: SimpleEquipment[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/locations')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold">{location.name}</h1>
            </div>
            {location.description && (
              <p className="text-muted-foreground mt-1">{location.description}</p>
            )}
          </div>
        </div>
        <Button onClick={() => navigate(`/locations/${id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Location
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </CardTitle>
                <CardDescription>Products stored in this location</CardDescription>
              </div>
              <Badge variant="secondary">{productsInLocation.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {productsInLocation.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products in this location
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsInLocation.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          {product.quantity} {product.unit}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Equipment
                </CardTitle>
                <CardDescription>Equipment stored in this location</CardDescription>
              </div>
              <Badge variant="secondary">{equipmentInLocation.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {equipmentInLocation.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No equipment in this location
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentInLocation.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-medium">{equipment.name}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/equipment/${equipment.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
