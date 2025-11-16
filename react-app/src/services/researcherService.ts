import type { SimpleResearcher } from '@/types/equipment.types'
import { mockGetResearchers } from '@/mocks/researchers'

export const researcherService = {
  getAll: async (): Promise<SimpleResearcher[]> => {
    return mockGetResearchers()
  },
}
