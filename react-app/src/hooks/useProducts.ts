import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import type {
  CreateProductRequest,
  DetailedProduct,
  EditProductRequest,
  Product,
} from '@/types/product.types'
import { getErrorMessage } from '@/lib/errors'

export function useProducts(page = 1) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['products', laboratoryId, page],
    queryFn: async (): Promise<Product[]> => {
      const result = await productService.getAll(laboratoryId!, page)
      return result.products
    },
    enabled: !!laboratoryId,
  })
}

export function useInfiniteProducts() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useInfiniteQuery({
    queryKey: ['products', 'infinite', laboratoryId],
    queryFn: ({ pageParam = 1 }) => productService.getAll(laboratoryId!, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!laboratoryId,
  })
}

export function useProductById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['product', id, laboratoryId],
    queryFn: (): Promise<Product> => productService.getById(id, laboratoryId!),
    enabled: !!id && !!laboratoryId,
  })
}

export function useProductDetailedById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['product', 'detailed', id, laboratoryId],
    queryFn: (): Promise<DetailedProduct> => productService.getDetailedById(id, laboratoryId!),
    enabled: !!id && !!laboratoryId,
  })
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productService.getLowInStock(),
  })
}

export function useAddProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.create(data),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to create product'),
        variant: 'destructive',
      })
    },
  })
}

export function useEditProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: EditProductRequest) => productService.edit(data),
    onSuccess: (message, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to edit product'),
        variant: 'destructive',
      })
    },
  })
}

export function useAddQuantity() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      productService.addQuantity(productId, quantity),
    onSuccess: (message, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to add quantity'),
        variant: 'destructive',
      })
    },
  })
}

export function useUseProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ productId, quantity, unit }: { productId: number; quantity: number; unit: string }) =>
      productService.useProduct(productId, quantity, unit),
    onSuccess: (message, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to use product'),
        variant: 'destructive',
      })
    },
  })
}
