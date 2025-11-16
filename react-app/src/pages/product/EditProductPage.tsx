import { useNavigate, useParams } from 'react-router-dom'
import { useProductById, useEditProduct } from '@/hooks/useProducts'
import { ProductForm } from '@/components/product/ProductForm'
import { BackArrow } from '@/components/shared/BackArrow'
import { Spinner } from '@/components/shared/Spinner'
import type { CreateProductRequest } from '@/types/product.types'

export function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProductById(parseInt(id!))
  const editProduct = useEditProduct()

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      await editProduct.mutateAsync({
        id: parseInt(id!),
        ...data,
      })
      navigate(`/products/${id}`)
    } catch {
      // toast handled in the mutation
    }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to={`/products/${id}`} />

      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product information
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <ProductForm
          initialData={{
            name: product.name,
            description: product.description ?? '',
            location_id: product.location_id,
            quantity: product.quantity,
            formula: product.formula ?? '',
            unit: product.unit,
            expiration_date: product.expiration_date.split('T')[0], // Format date for input
          }}
          onSubmit={handleSubmit}
          isSubmitting={editProduct.isPending}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}
