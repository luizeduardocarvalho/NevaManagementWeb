import type {
  Product,
  DetailedProduct,
  CreateProductRequest,
  EditProductRequest,
} from '@/types/product.types'
import api from './api'

// Transform backend product to include location_id
function transformProduct(backendProduct: any): Product {
  return {
    ...backendProduct,
    location_id: backendProduct.location?.id || backendProduct.location_id,
  }
}

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
      products: Array.isArray(data?.products) ? data.products.map(transformProduct) : [],
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
    return transformProduct(response.data)
  },

  getDetailedById: async (id: number, laboratoryId: number): Promise<DetailedProduct> => {
    const response = await api.get(`/products/${id}`, {
      params: { laboratory_id: laboratoryId },
    })
    if (!response.data) {
      throw new Error('Product not found')
    }
    return transformProduct(response.data) as DetailedProduct
  },

  getLowInStock: async (laboratoryId: number): Promise<Product[]> => {
    const response = await api.get('/products/low-stock', {
      params: { laboratory_id: laboratoryId },
    })
    return Array.isArray(response.data) ? response.data.map(transformProduct) : []
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

  useProduct: async (productId: number, data: { quantity: number; unit: string; notes?: string }): Promise<Product> => {
    const response = await api.post(`/products/${productId}/use`, data)
    return transformProduct(response.data)
  },

  getUsageHistory: async (productId: number, limit = 100, offset = 0): Promise<import('@/types/product.types').ProductUsageHistory> => {
    const response = await api.get(`/products/${productId}/usage-history`, {
      params: { limit, offset },
    })
    return response.data
  },

  getUsageStats: async (productId: number): Promise<import('@/types/product.types').ProductUsageStats> => {
    const response = await api.get(`/products/${productId}/usage-stats`)
    return response.data
  },

  delete: async (productId: number, laboratoryId: number): Promise<void> => {
    await api.delete(`/products/${productId}`, {
      params: { laboratory_id: laboratoryId },
    })
  },
}
