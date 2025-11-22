import {
  mockGetResearchers,
  mockGetAllResearchers,
  mockGetResearcherById,
  mockAddResearcher,
  mockEditResearcher,
  mockDeleteResearcher,
} from '@/mocks/researchers'
import type { Researcher, SimpleResearcher, CreateResearcherRequest } from '@/types/researcher.types'

export const researcherService = {
  // For dropdowns and selects (simple list)
  getSimple: async (): Promise<SimpleResearcher[]> => {
    return mockGetResearchers()
  },

  // For researcher management page (full details)
  getAll: async (laboratoryId: number): Promise<Researcher[]> => {
    return mockGetAllResearchers()
  },

  getById: async (id: number, laboratoryId: number): Promise<Researcher | null> => {
    return mockGetResearcherById(id)
  },

  create: async (data: CreateResearcherRequest, laboratoryId: number): Promise<void> => {
    await mockAddResearcher(data)
  },

  edit: async (id: number, data: CreateResearcherRequest, laboratoryId: number): Promise<void> => {
    await mockEditResearcher(id, data)
  },

  delete: async (id: number, laboratoryId: number): Promise<void> => {
    await mockDeleteResearcher(id)
  },
}
