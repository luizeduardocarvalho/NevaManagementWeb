import { useNavigate } from 'react-router-dom'
import { useAddProduct } from '@/hooks/useProducts'
import { ProductForm } from '@/components/product/ProductForm'
import { BackArrow } from '@/components/shared/BackArrow'
import type { CreateProductRequest } from '@/types/product.types'

export function AddProductPage() {
  const navigate = useNavigate()
  const addProduct = useAddProduct()

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      await addProduct.mutateAsync(data)
      navigate('/products')
    } catch {
      // toast handled in the mutation
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to="/products" />

      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground mt-2">
          Add a new product to your laboratory inventory
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={addProduct.isPending}
          submitLabel="Add Product"
        />
      </div>
    </div>
  )
}
