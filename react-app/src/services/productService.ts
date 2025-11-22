import type {
  Product,
  DetailedProduct,
  CreateProductRequest,
  EditProductRequest,
} from '@/types/product.types'
import api from './api'

export const productService = {
  getAll: async (
    laboratoryId: number,
    page = 1,
    pageSize = 9
  ): Promise<{ products: Product[]; nextPage: number | null; totalCount: number }> => {
    const response = await api.get('/products', {
      params: { laboratory_id: laboratoryId, page, pageSize },
    })
    const data = response.data
    return {
      products: Array.isArray(data?.products) ? data.products : [],
      nextPage: data?.nextPage ?? null,
      totalCount: data?.totalCount ?? 0,
    }
  },

  getById: async (id: number, laboratoryId: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`, {
      params: { laboratory_id: laboratoryId },
    })
    if (!response.data) {
      throw new Error('Product not found')
    }
    return response.data
  },

  getDetailedById: async (id: number, laboratoryId: number): Promise<DetailedProduct> => {
    const response = await api.get(`/products/${id}`, {
      params: { laboratory_id: laboratoryId },
    })
    if (!response.data) {
      throw new Error('Product not found')
    }
    return response.data
  },

  getLowInStock: async (laboratoryId: number): Promise<Product[]> => {
    const response = await api.get('/products/low-stock', {
      params: { laboratory_id: laboratoryId },
    })
    return Array.isArray(response.data) ? response.data : []
  },

  create: async (data: CreateProductRequest): Promise<string> => {
    const response = await api.post('/products', data)
    return response.data.message
  },

  edit: async (data: EditProductRequest): Promise<string> => {
    const response = await api.put(`/products/${data.id}`, data)
    return response.data.message
  },

  addQuantity: async (productId: number, quantity: number): Promise<string> => {
    const response = await api.post(`/products/${productId}/add-quantity`, { quantity })
    return response.data.message
  },

  useProduct: async (productId: number, quantity: number, unit: string): Promise<string> => {
    const response = await api.post(`/products/${productId}/use`, { quantity, unit })
    return response.data.message
  },

  delete: async (productId: number, laboratoryId: number): Promise<void> => {
    await api.delete(`/products/${productId}`, {
      params: { laboratory_id: laboratoryId },
    })
  },
}
