import type { Location } from './location.types'

export interface Product {
  id: number
  name: string
  description: string | null
  quantity: number
  formula: string | null
  unit: string
  expiration_date: string
  location_id: number
  laboratory_id: number
  location?: Location
  quantity_used_in_the_last_three_months?: number
}

export interface DetailedProduct extends Product {
  quantity_used_in_the_last_three_months: number
  location: Location
}

export interface CreateProductRequest {
  name: string
  description: string
  location_id: number
  quantity: number
  formula: string
  unit: string
  expiration_date: string
}

export interface EditProductRequest extends CreateProductRequest {
  id: number
}

export interface AddQuantityRequest {
  product_id: number
  quantity: number
}

export interface UseProductRequest {
  product_id: number
  quantity: number
  unit: string
}
