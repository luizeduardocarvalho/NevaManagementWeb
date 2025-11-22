import type { Laboratory, CreateLaboratoryRequest } from '@/types/laboratory.types'
import api from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Mock data for development
const mockLaboratory: Laboratory = {
  id: 1,
  name: 'Main Research Lab',
  description: 'Primary molecular biology research laboratory',
  address: '123 Science Way, Research City, RC 12345',
  createdAt: new Date().toISOString(),
}

export const laboratoryService = {
  getById: async (id: number): Promise<Laboratory> => {
    if (USE_MOCK) {
      return Promise.resolve(mockLaboratory)
    }

    const response = await api.get(`/laboratories/${id}`)
    return response.data
  },

  create: async (data: CreateLaboratoryRequest): Promise<Laboratory> => {
    if (USE_MOCK) {
      const newLab: Laboratory = {
        ...data,
        id: 1,
        createdAt: new Date().toISOString(),
      }
      return Promise.resolve(newLab)
    }

    const response = await api.post('/laboratories', data)
    return response.data
  },

  getUserLaboratories: async (): Promise<Laboratory[]> => {
    if (USE_MOCK) {
      return Promise.resolve([mockLaboratory])
    }

    const response = await api.get('/laboratories/user')
    return response.data
  },
}
