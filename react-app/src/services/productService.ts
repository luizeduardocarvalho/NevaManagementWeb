import type {
  Product,
  DetailedProduct,
  CreateProductRequest,
  EditProductRequest,
} from '@/types/product.types'
import {
  mockAddQuantity,
  mockCreateProduct,
  mockEditProduct,
  mockGetDetailedProductById,
  mockGetLowStockProducts,
  mockGetProductById,
  mockGetProducts,
  mockUseProduct,
} from '@/mocks/products'

export const productService = {
  getAll: async (
    laboratoryId: number,
    page = 1,
    pageSize = 9
  ): Promise<{ products: Product[]; nextPage: number | null; totalCount: number }> => {
    void laboratoryId
    return mockGetProducts(page, pageSize)
  },

  getById: async (id: number, laboratoryId: number): Promise<Product> => {
    void laboratoryId
    return mockGetProductById(id)
  },

  getDetailedById: async (id: number, laboratoryId: number): Promise<DetailedProduct> => {
    void laboratoryId
    return mockGetDetailedProductById(id)
  },

  getLowInStock: async (): Promise<Product[]> => {
    return mockGetLowStockProducts()
  },

  create: async (data: CreateProductRequest): Promise<string> => {
    return mockCreateProduct(data)
  },

  edit: async (data: EditProductRequest): Promise<string> => {
    return mockEditProduct(data)
  },

  addQuantity: async (productId: number, quantity: number): Promise<string> => {
    return mockAddQuantity(productId, quantity)
  },

  useProduct: async (productId: number, quantity: number, unit: string): Promise<string> => {
    void unit
    return mockUseProduct(productId, quantity)
  },
}
