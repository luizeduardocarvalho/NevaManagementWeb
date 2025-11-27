import api from './api'
import { AxiosError } from 'axios'
import type { Researcher, SimpleResearcher, CreateResearcherRequest } from '@/types/researcher.types'

export const researcherService = {
  // For dropdowns and selects (simple list)
  getSimple: async (): Promise<SimpleResearcher[]> => {
    try {
      const response = await api.get<SimpleResearcher[]>('/researchers')
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // For researcher management page (full details)
  getAll: async (): Promise<Researcher[]> => {
    try {
      const response = await api.get<Researcher[]>('/researchers')
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  getById: async (id: number): Promise<Researcher | null> => {
    try {
      const response = await api.get<Researcher>(`/researchers/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  create: async (data: CreateResearcherRequest): Promise<void> => {
    await api.post('/researchers', data)
  },

  edit: async (id: number, data: CreateResearcherRequest): Promise<void> => {
    await api.put(`/researchers/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/researchers/${id}`)
  },
}
