import type { Location } from '@/types/location.types'
import { mockGetLocations, mockGetLocationById } from '@/mocks/locations'

export const locationService = {
  getAll: async (laboratoryId: number): Promise<Location[]> => {
    void laboratoryId
    return mockGetLocations()
  },

  getById: async (id: number): Promise<Location | undefined> => {
    return mockGetLocationById(id)
  },
}
