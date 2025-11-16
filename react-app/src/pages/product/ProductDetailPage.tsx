import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProductDetailedById, useAddQuantity, useUseProduct } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { BackArrow } from '@/components/shared/BackArrow'
import { Spinner } from '@/components/shared/Spinner'
import { AddQuantityModal } from '@/components/product/AddQuantityModal'
import { UseProductModal } from '@/components/product/UseProductModal'
import { Plus, Minus, Edit, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const { data: product, isLoading } = useProductDetailedById(productId)
  const addQuantity = useAddQuantity()
  const useProduct = useUseProduct()

  const [isAddQuantityModalOpen, setIsAddQuantityModalOpen] = useState(false)
  const [isUseProductModalOpen, setIsUseProductModalOpen] = useState(false)

  const handleAddQuantity = async (quantity: number) => {
    if (!productId) return
    await addQuantity.mutateAsync({
      productId,
      quantity,
    })
  }

  const handleUseProduct = async (quantity: number) => {
    if (!productId || !product) return
    await useProduct.mutateAsync({
      productId,
      quantity,
      unit: product.unit,
    })
  }

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date()
  }

  const isLowStock = () => {
    return product?.quantity_used_in_the_last_three_months &&
           product.quantity < product.quantity_used_in_the_last_three_months
  }

  if (isLoading) {
    return <Spinner size="lg" />
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Product not found</p>
      </div>
    )
  }

  const expired = isExpired(product.expiration_date)
  const lowStock = isLowStock()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackArrow to="/products" />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.formula && (
            <p className="text-lg text-muted-foreground mt-1">{product.formula}</p>
          )}
        </div>
        <Link to={`/products/${id}/edit`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {(expired || lowStock) && (
        <div className="space-y-2">
          {expired && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">
                This product has expired
              </p>
            </div>
          )}
          {lowStock && (
            <div className="flex items-center gap-2 rounded-lg border border-orange-500 bg-orange-50 p-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-medium text-orange-900">
                Low stock: Current quantity is below 3-month usage average
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => setIsAddQuantityModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Quantity
        </Button>
        <Button
          onClick={() => setIsUseProductModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Minus className="h-4 w-4" />
          Use Product
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Information</h2>

          <div className="space-y-3">
            {product.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{product.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Quantity</p>
              <p className={`text-2xl font-bold mt-1 ${lowStock ? 'text-destructive' : ''}`}>
                {product.quantity} {product.unit}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-sm mt-1">{product.location?.name || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Expiration Date</p>
              <p className={`text-sm mt-1 ${expired ? 'text-destructive font-semibold' : ''}`}>
                {format(new Date(product.expiration_date), 'MMMM dd, yyyy')}
                {expired && ' (Expired)'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Usage Statistics</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Used in Last 3 Months
              </p>
              <p className="text-2xl font-bold mt-1">
                {product.quantity_used_in_the_last_three_months || 0} {product.unit}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Monthly Usage
              </p>
              <p className="text-lg font-semibold mt-1">
                {((product.quantity_used_in_the_last_three_months || 0) / 3).toFixed(2)} {product.unit}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estimated Days Remaining
              </p>
              <p className="text-lg font-semibold mt-1">
                {product.quantity_used_in_the_last_three_months > 0
                  ? Math.floor((product.quantity / (product.quantity_used_in_the_last_three_months / 90)))
                  : 'N/A'} days
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddQuantityModal
        isOpen={isAddQuantityModalOpen}
        onClose={() => setIsAddQuantityModalOpen(false)}
        onSubmit={handleAddQuantity}
        currentQuantity={product.quantity}
        unit={product.unit}
        productName={product.name}
        isSubmitting={addQuantity.isPending}
      />

      <UseProductModal
        isOpen={isUseProductModalOpen}
        onClose={() => setIsUseProductModalOpen(false)}
        onSubmit={handleUseProduct}
        currentQuantity={product.quantity}
        unit={product.unit}
        productName={product.name}
        isSubmitting={useProduct.isPending}
      />
    </div>
  )
}
