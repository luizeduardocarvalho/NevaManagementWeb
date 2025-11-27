import type { Location } from '@/types/location.types'

let mockLocationStore: Location[] = [
  {
    id: 1,
    name: 'Cold Storage Room A',
    description: 'Main refrigerated storage for reagents and solutions (4°C)',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 2,
    name: 'Chemical Cabinet B',
    description: 'Dry chemical storage cabinet in prep room',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 3,
    name: 'Freezer -20°C Unit 1',
    description: 'Enzyme and protein storage freezer',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 4,
    name: 'Storage Shelf C3',
    description: 'General purpose storage shelf in main lab',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 5,
    name: 'Chemical Fume Hood Storage',
    description: 'Storage area under fume hood for volatile compounds',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 6,
    name: 'Freezer -80°C Unit 1',
    description: 'Ultra-low temperature freezer for long-term sample storage',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 7,
    name: 'Desiccator Cabinet',
    description: 'Moisture-controlled storage for hygroscopic materials',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 8,
    name: 'Flammable Storage Cabinet',
    description: 'Fire-rated cabinet for flammable solvents and chemicals',
    sub_location_id: 2,
    laboratoryId: 1,
  },
  {
    id: 9,
    name: 'Liquid Nitrogen Dewar',
    description: 'Cryogenic storage for cell cultures and samples',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 10,
    name: 'Refrigerator 4°C - Main Lab',
    description: 'Standard refrigerator for buffers and media',
    sub_location_id: 1,
    laboratoryId: 1,
  },
  {
    id: 11,
    name: 'Acid Storage Cabinet',
    description: 'Corrosive-resistant cabinet for acids',
    sub_location_id: null,
    laboratoryId: 1,
  },
  {
    id: 12,
    name: 'Base Storage Cabinet',
    description: 'Separate storage for alkaline chemicals',
    sub_location_id: null,
    laboratoryId: 1,
  },
]

let nextLocationId = mockLocationStore.length + 1

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(clone(value)), timeout))

const findLocationIndex = (id: number) => {
  const index = mockLocationStore.findIndex((loc) => loc.id === id)
  if (index === -1) {
    throw new Error('Location not found')
  }
  return index
}

export async function mockGetLocations(): Promise<Location[]> {
  return delay(mockLocationStore)
}

export async function mockGetLocationById(id: number): Promise<Location> {
  const index = findLocationIndex(id)
  return delay(mockLocationStore[index])
}

export async function mockGetLocationsByLaboratory(laboratoryId: number): Promise<Location[]> {
  const locations = mockLocationStore.filter((loc) => loc.laboratoryId === laboratoryId)
  return delay(locations)
}

export async function mockGetSubLocations(parentLocationId: number): Promise<Location[]> {
  const subLocations = mockLocationStore.filter((loc) => loc.sub_location_id === parentLocationId)
  return delay(subLocations)
}

export async function mockGetTopLevelLocations(laboratoryId?: number): Promise<Location[]> {
  let locations = mockLocationStore.filter((loc) => loc.sub_location_id === null)
  if (laboratoryId) {
    locations = locations.filter((loc) => loc.laboratoryId === laboratoryId)
  }
  return delay(locations)
}

export async function mockCreateLocation(
  data: Omit<Location, 'id'>
): Promise<Location> {
  const newLocation: Location = {
    ...data,
    id: nextLocationId++,
  }
  mockLocationStore = [...mockLocationStore, newLocation]
  return delay(newLocation)
}

export async function mockUpdateLocation(
  id: number,
  data: Partial<Omit<Location, 'id'>>
): Promise<Location> {
  const index = findLocationIndex(id)
  mockLocationStore[index] = {
    ...mockLocationStore[index],
    ...data,
  }
  return delay(mockLocationStore[index])
}

export async function mockDeleteLocation(id: number): Promise<void> {
  const hasSubLocations = mockLocationStore.some((loc) => loc.sub_location_id === id)
  if (hasSubLocations) {
    throw new Error('Cannot delete location with sub-locations')
  }
  const index = findLocationIndex(id)
  mockLocationStore.splice(index, 1)
  await delay(null)
}

// Export for use in other mocks
export const mockLocations = mockLocationStore
