import type { Location } from '@/types/location.types'

export const mockLocations: Location[] = [
  { id: 1, name: 'Cold Room A', description: 'Primary cold storage', sub_location_id: null, laboratoryId: 1 },
  { id: 2, name: 'Chemistry Cabinet', description: 'Chemical reagents storage', sub_location_id: null, laboratoryId: 1 },
  { id: 3, name: 'Freezer Rack 2', description: 'Freezer rack for enzymes', sub_location_id: null, laboratoryId: 1 },
  { id: 4, name: 'Incubator Room', description: 'Temperature-controlled environment', sub_location_id: null, laboratoryId: 1 },
  { id: 5, name: 'Storage Shelf A1', description: 'General storage area', sub_location_id: null, laboratoryId: 1 },
]

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(value))), timeout))

export async function mockGetLocations(): Promise<Location[]> {
  return delay(mockLocations)
}

export async function mockGetLocationById(id: number): Promise<Location | undefined> {
  const location = mockLocations.find((loc) => loc.id === id)
  return delay(location)
}
