import type {
  CreateProductRequest,
  DetailedProduct,
  EditProductRequest,
  Product,
} from '@/types/product.types'
import type { Location } from '@/types/location.types'
import { mockLocations } from './locations'

let mockProductStore: DetailedProduct[] = [
  {
    id: 1,
    name: 'Agarose Powder',
    description: 'UltraPure agarose for gel electrophoresis',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 750,
    quantity_used_in_the_last_three_months: 500,
    unit: 'g',
    formula: '(C12H18O9)n',
    expiration_date: '2025-11-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Ethanol 96%',
    description: 'Molecular biology grade ethanol',
    location: mockLocations[0],
    location_id: mockLocations[0].id,
    laboratory_id: 1,
    quantity: 18000,
    quantity_used_in_the_last_three_months: 12500,
    unit: 'mL',
    formula: 'C2H5OH',
    expiration_date: '2026-04-15T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'DNA Polymerase',
    description: 'High-fidelity DNA polymerase (2 U/µL)',
    location: mockLocations[2],
    location_id: mockLocations[2].id,
    laboratory_id: 1,
    quantity: 120,
    quantity_used_in_the_last_three_months: 150,
    unit: 'µL',
    formula: null,
    expiration_date: '2025-06-10T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'PBS Buffer 1X',
    description: 'Phosphate Buffered Saline solution',
    location: mockLocations[0],
    location_id: mockLocations[0].id,
    laboratory_id: 1,
    quantity: 9500,
    quantity_used_in_the_last_three_months: 4000,
    unit: 'mL',
    formula: null,
    expiration_date: '2025-12-20T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Trypan Blue',
    description: '0.4% solution for cell counting',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 35,
    quantity_used_in_the_last_three_months: 20,
    unit: 'mL',
    formula: null,
    expiration_date: '2025-08-01T00:00:00.000Z',
  },
  {
    id: 6,
    name: 'DMSO',
    description: 'Dimethyl sulfoxide, cell culture grade',
    location: mockLocations[2],
    location_id: mockLocations[2].id,
    laboratory_id: 1,
    quantity: 500,
    quantity_used_in_the_last_three_months: 200,
    unit: 'mL',
    formula: '(CH3)2SO',
    expiration_date: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 7,
    name: 'Sodium Chloride',
    description: 'Molecular biology grade NaCl',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 2500,
    quantity_used_in_the_last_three_months: 800,
    unit: 'g',
    formula: 'NaCl',
    expiration_date: '2027-03-20T00:00:00.000Z',
  },
  {
    id: 8,
    name: 'EDTA Solution',
    description: 'Ethylenediaminetetraacetic acid 0.5M',
    location: mockLocations[0],
    location_id: mockLocations[0].id,
    laboratory_id: 1,
    quantity: 1200,
    quantity_used_in_the_last_three_months: 450,
    unit: 'mL',
    formula: 'C10H16N2O8',
    expiration_date: '2025-09-30T00:00:00.000Z',
  },
  {
    id: 9,
    name: 'Glycerol',
    description: 'Anhydrous glycerol for molecular biology',
    location: mockLocations[3],
    location_id: mockLocations[3].id,
    laboratory_id: 1,
    quantity: 850,
    quantity_used_in_the_last_three_months: 300,
    unit: 'mL',
    formula: 'C3H8O3',
    expiration_date: '2026-07-10T00:00:00.000Z',
  },
  {
    id: 10,
    name: 'Acetic Acid',
    description: 'Glacial acetic acid, analytical grade',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 400,
    quantity_used_in_the_last_three_months: 150,
    unit: 'mL',
    formula: 'CH3COOH',
    expiration_date: '2025-05-22T00:00:00.000Z',
  },
  {
    id: 11,
    name: 'Tris Base',
    description: 'Tris(hydroxymethyl)aminomethane buffer',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 1800,
    quantity_used_in_the_last_three_months: 600,
    unit: 'g',
    formula: 'C4H11NO3',
    expiration_date: '2026-11-05T00:00:00.000Z',
  },
  {
    id: 12,
    name: 'Glucose',
    description: 'D-Glucose powder, cell culture tested',
    location: mockLocations[4],
    location_id: mockLocations[4].id,
    laboratory_id: 1,
    quantity: 300,
    quantity_used_in_the_last_three_months: 450,
    unit: 'g',
    formula: 'C6H12O6',
    expiration_date: '2025-04-18T00:00:00.000Z',
  },
  {
    id: 13,
    name: 'Methanol',
    description: 'HPLC grade methanol',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 2000,
    quantity_used_in_the_last_three_months: 800,
    unit: 'mL',
    formula: 'CH3OH',
    expiration_date: '2025-12-31T00:00:00.000Z',
  },
  {
    id: 14,
    name: 'Chloroform',
    description: 'Molecular biology grade chloroform',
    location: mockLocations[1],
    location_id: mockLocations[1].id,
    laboratory_id: 1,
    quantity: 150,
    quantity_used_in_the_last_three_months: 250,
    unit: 'mL',
    formula: 'CHCl3',
    expiration_date: '2025-03-10T00:00:00.000Z',
  },
  {
    id: 15,
    name: 'Magnesium Chloride',
    description: 'MgCl2 solution 1M',
    location: mockLocations[0],
    location_id: mockLocations[0].id,
    laboratory_id: 1,
    quantity: 750,
    quantity_used_in_the_last_three_months: 300,
    unit: 'mL',
    formula: 'MgCl2',
    expiration_date: '2026-06-20T00:00:00.000Z',
  },
]

let nextProductId = mockProductStore.length + 1

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(clone(value)), timeout))

const ensureLocation = (locationId: number): Location => {
  return (
    mockLocations.find((loc) => loc.id === locationId) || {
      id: locationId,
      name: `Location ${locationId}`,
      description: 'Mock location',
      sub_location_id: null,
    }
  )
}

const findProductIndex = (id: number) => {
  const index = mockProductStore.findIndex((product) => product.id === id)
  if (index === -1) {
    throw new Error('Product not found')
  }
  return index
}

export async function mockGetProducts(page = 1, pageSize = 9): Promise<{
  products: Product[]
  nextPage: number | null
  totalCount: number
}> {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const products = mockProductStore.slice(startIndex, endIndex)
  const hasMore = endIndex < mockProductStore.length

  return delay({
    products,
    nextPage: hasMore ? page + 1 : null,
    totalCount: mockProductStore.length,
  })
}

export async function mockGetProductById(id: number): Promise<Product> {
  const index = findProductIndex(id)
  return delay(mockProductStore[index])
}

export async function mockGetDetailedProductById(id: number): Promise<DetailedProduct> {
  const index = findProductIndex(id)
  return delay(mockProductStore[index])
}

export async function mockGetLowStockProducts(): Promise<Product[]> {
  const lowStock = mockProductStore.filter((product) =>
    product.quantity_used_in_the_last_three_months &&
    product.quantity < product.quantity_used_in_the_last_three_months
  )
  return delay(lowStock)
}

export async function mockCreateProduct(data: CreateProductRequest): Promise<string> {
  const location = ensureLocation(data.location_id)
  const newProduct: DetailedProduct = {
    id: nextProductId++,
    name: data.name,
    description: data.description,
    location,
    location_id: location.id,
    laboratory_id: 1,
    quantity: data.quantity,
    quantity_used_in_the_last_three_months: 0,
    unit: data.unit,
    formula: data.formula,
    expiration_date: data.expiration_date,
  }

  mockProductStore = [newProduct, ...mockProductStore]
  await delay(null)
  return 'Product created successfully (mock)'
}

export async function mockEditProduct(data: EditProductRequest): Promise<string> {
  const index = findProductIndex(data.id)
  const location = ensureLocation(data.location_id)
  mockProductStore[index] = {
    ...mockProductStore[index],
    ...data,
    location,
  }
  await delay(null)
  return 'Product updated successfully (mock)'
}

export async function mockAddQuantity(productId: number, quantity: number): Promise<string> {
  const index = findProductIndex(productId)
  mockProductStore[index] = {
    ...mockProductStore[index],
    quantity: mockProductStore[index].quantity + quantity,
  }
  await delay(null)
  return 'Quantity added successfully (mock)'
}

export async function mockUseProduct(productId: number, quantity: number): Promise<string> {
  const index = findProductIndex(productId)
  const product = mockProductStore[index]
  if (quantity > product.quantity) {
    throw new Error('Cannot use more than available quantity')
  }

  mockProductStore[index] = {
    ...product,
    quantity: product.quantity - quantity,
    quantity_used_in_the_last_three_months: product.quantity_used_in_the_last_three_months + quantity,
  }
  await delay(null)
  return 'Product usage recorded (mock)'
}

export async function mockDeleteProduct(productId: number): Promise<void> {
  const index = findProductIndex(productId)
  mockProductStore.splice(index, 1)
  await delay(null)
}

// Export product store for use in other mocks
export const mockProducts = mockProductStore
