import api from './api'
import { AxiosError } from 'axios'
import type { SimpleSample, DetailedSample, CreateSampleRequest } from '@/types/sample.types'

export const sampleService = {
  getAll: async (): Promise<SimpleSample[]> => {
    try {
      const response = await api.get('/samples')
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  getById: async (id: number): Promise<DetailedSample | null> => {
    try {
      const response = await api.get(`/samples/${id}`)
      if (!response.data) {
        return null
      }
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  create: async (data: CreateSampleRequest): Promise<string> => {
    const response = await api.post('/samples', data)
    return response.data.message || 'Sample created successfully with first replica'
  },

  edit: async (id: number, data: CreateSampleRequest): Promise<string> => {
    const response = await api.put(`/samples/${id}`, data)
    return response.data.message || 'Sample updated successfully'
  },

  delete: async (sampleId: number): Promise<void> => {
    await api.delete(`/samples/${sampleId}`)
  },
}
