import type { Location } from '@/types/location.types'
import api from './api'

export interface CreateLocationRequest {
  name: string
  description: string
  sub_location_id: number | null
}

export interface UpdateLocationRequest {
  id: number
  name: string
  description: string
  sub_location_id: number | null
}

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get('/locations')
    return Array.isArray(response.data) ? response.data : []
  },

  getById: async (id: number): Promise<Location> => {
    const response = await api.get(`/locations/${id}`)
    if (!response.data) {
      throw new Error('Location not found')
    }
    return response.data
  },

  create: async (data: CreateLocationRequest): Promise<Location> => {
    const response = await api.post('/locations', data)
    return response.data
  },

  update: async (data: UpdateLocationRequest): Promise<Location> => {
    const response = await api.put(`/locations/${data.id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/locations/${id}`)
  },
}
