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
  quantity: number
  unit: string
  notes?: string
}

export interface ProductUsageUser {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

export interface ProductUsageRecord {
  id: number
  product_id: number
  user_id: number
  user: ProductUsageUser
  quantity_used: number
  unit: string
  used_at: string
  notes?: string
  created_at: string
}

export interface ProductUsageHistory {
  product_id: number
  product_name: string
  total_records: number
  usage_history: ProductUsageRecord[]
}

export interface ProductUsageTopUser {
  user_id: number
  user_email: string
  user_name: string
  total_used: number
  usage_count: number
}

export interface ProductUsageStats {
  product_id: number
  product_name: string
  current_quantity: number
  unit: string
  usage_last_30_days: number
  usage_last_3_months: number
  total_usage_all_time: number
  average_monthly_usage: number
  estimated_days_remaining: number
  top_users: ProductUsageTopUser[]
}
