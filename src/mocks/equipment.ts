import type {
  SimpleEquipment,
  DetailedEquipment,
  CreateEquipmentRequest,
  EditEquipmentRequest,
  EquipmentUsageRecord,
  UseEquipmentRequest,
  CalendarMonth,
} from '@/types/equipment.types'
import { mockLocations } from './locations'
import { mockResearchers } from './researchers'

let mockEquipmentStore: DetailedEquipment[] = [
  {
    id: 1,
    name: 'PCR Thermocycler',
    description: 'Bio-Rad T100 Thermal Cycler for PCR amplification. Supports 96-well plates.',
    propertyNumber: 'EQ-2023-001',
    location: mockLocations[3],
    location_id: mockLocations[3].id,
    laboratory_id: 1,
  },
  {
    id: 2,
    name: 'Centrifuge',
    description: 'Eppendorf 5424R refrigerated microcentrifuge. Max speed 15,000 rpm.',
    propertyNumber: 'EQ-2023-002',
    location: mockLocations[3],
    location_id: mockLocations[3].id,
    laboratory_id: 1,
  },
  {
    id: 3,
    name: 'Spectrophotometer',
    description: 'NanoDrop 2000 UV-Vis spectrophotometer for nucleic acid quantification.',
    propertyNumber: 'EQ-2023-003',
    location: mockLocations[4],
    location_id: mockLocations[4].id,
    laboratory_id: 1,
  },
  {
    id: 4,
    name: 'Microscope',
    description: 'Zeiss Axio Observer inverted fluorescence microscope with digital camera.',
    propertyNumber: 'EQ-2022-015',
    location: mockLocations[4],
    location_id: mockLocations[4].id,
    laboratory_id: 1,
  },
  {
    id: 5,
    name: 'Incubator',
    description: 'Thermo Scientific CO2 incubator for cell culture. Capacity: 170L.',
    propertyNumber: 'EQ-2022-008',
    location: mockLocations[3],
    location_id: mockLocations[3].id,
    laboratory_id: 1,
  },
  {
    id: 6,
    name: 'pH Meter',
    description: 'Mettler Toledo SevenCompact pH meter with temperature compensation.',
    propertyNumber: 'EQ-2023-012',
    location: mockLocations[4],
    location_id: mockLocations[4].id,
    laboratory_id: 1,
  },
  {
    id: 7,
    name: 'Vortex Mixer',
    description: 'Scientific Industries Vortex-Genie 2 for tube mixing.',
    propertyNumber: 'EQ-2023-018',
    location: mockLocations[4],
    location_id: mockLocations[4].id,
    laboratory_id: 1,
  },
  {
    id: 8,
    name: 'Gel Electrophoresis System',
    description: 'Bio-Rad Mini-PROTEAN Tetra Cell for protein and DNA gel electrophoresis.',
    propertyNumber: 'EQ-2022-021',
    location: mockLocations[4],
    location_id: mockLocations[4].id,
    laboratory_id: 1,
  },
]

// Mock usage history
let mockUsageHistory: EquipmentUsageRecord[] = [
  {
    id: 1,
    equipmentId: 1,
    researcher: mockResearchers[0],
    description: 'PCR amplification for gene cloning experiment',
    startDate: '2025-01-10T09:00:00.000Z',
    endDate: '2025-01-10T11:30:00.000Z',
  },
  {
    id: 2,
    equipmentId: 1,
    researcher: mockResearchers[1],
    description: 'qPCR analysis',
    startDate: '2025-01-12T14:00:00.000Z',
    endDate: '2025-01-12T16:00:00.000Z',
  },
  {
    id: 3,
    equipmentId: 2,
    researcher: mockResearchers[2],
    description: 'Cell pellet separation',
    startDate: '2025-01-11T10:00:00.000Z',
    endDate: '2025-01-11T10:30:00.000Z',
  },
  {
    id: 4,
    equipmentId: 3,
    researcher: mockResearchers[0],
    description: 'DNA concentration measurement',
    startDate: '2025-01-13T11:00:00.000Z',
    endDate: '2025-01-13T11:15:00.000Z',
  },
  {
    id: 5,
    equipmentId: 1,
    researcher: mockResearchers[3],
    description: null,
    startDate: '2025-01-15T08:00:00.000Z',
    endDate: '2025-01-15T10:00:00.000Z',
  },
]

let nextEquipmentId = mockEquipmentStore.length + 1
let nextUsageId = mockUsageHistory.length + 1

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(clone(value)), timeout))

const findEquipmentIndex = (id: number) => {
  const index = mockEquipmentStore.findIndex((equipment) => equipment.id === id)
  if (index === -1) {
    throw new Error('Equipment not found')
  }
  return index
}

export async function mockGetEquipment(page = 1, pageSize = 9): Promise<{
  equipment: SimpleEquipment[]
  nextPage: number | null
  totalCount: number
}> {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const equipment = mockEquipmentStore.slice(startIndex, endIndex).map((eq) => ({
    id: eq.id,
    name: eq.name,
  }))
  const hasMore = endIndex < mockEquipmentStore.length

  return delay({
    equipment,
    nextPage: hasMore ? page + 1 : null,
    totalCount: mockEquipmentStore.length,
  })
}

export async function mockGetDetailedEquipment(id: number): Promise<DetailedEquipment> {
  const index = findEquipmentIndex(id)
  return delay(mockEquipmentStore[index])
}

export async function mockCreateEquipment(data: CreateEquipmentRequest): Promise<string> {
  const location = mockLocations.find((loc) => loc.id === data.location_id) || mockLocations[0]
  const newEquipment: DetailedEquipment = {
    id: nextEquipmentId++,
    name: data.name,
    description: data.description,
    propertyNumber: data.propertyNumber,
    location,
    location_id: location.id,
    laboratory_id: 1,
  }

  mockEquipmentStore = [newEquipment, ...mockEquipmentStore]
  await delay(null)
  return 'Equipment created successfully (mock)'
}

export async function mockEditEquipment(data: EditEquipmentRequest): Promise<string> {
  const index = findEquipmentIndex(data.id)
  const location = mockLocations.find((loc) => loc.id === data.location_id) || mockLocations[0]
  mockEquipmentStore[index] = {
    ...mockEquipmentStore[index],
    ...data,
    location,
  }
  await delay(null)
  return 'Equipment updated successfully (mock)'
}

export async function mockUseEquipment(data: UseEquipmentRequest): Promise<string> {
  const researcher = mockResearchers.find((r) => r.id === data.researcherId) || mockResearchers[0]
  const newUsage: EquipmentUsageRecord = {
    id: nextUsageId++,
    equipmentId: data.equipmentId,
    researcher,
    description: data.description || null,
    startDate: data.startDate,
    endDate: data.endDate,
  }

  mockUsageHistory = [newUsage, ...mockUsageHistory]
  await delay(null)
  return 'Equipment usage scheduled successfully (mock)'
}

export async function mockDeleteEquipment(equipmentId: number): Promise<void> {
  const index = findEquipmentIndex(equipmentId)
  mockEquipmentStore.splice(index, 1)
  // Also remove related usage history
  mockUsageHistory = mockUsageHistory.filter((usage) => usage.equipmentId !== equipmentId)
  await delay(null)
}

export async function mockCheckEquipmentOverlap(
  equipmentId: number,
  startDate: string,
  endDate: string,
  excludeUsageId?: number
): Promise<{ hasOverlap: boolean; conflictingUsages: EquipmentUsageRecord[] }> {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const conflictingUsages = mockUsageHistory.filter((usage) => {
    // Skip if checking different equipment
    if (usage.equipmentId !== equipmentId) return false

    // Skip if this is the usage being edited
    if (excludeUsageId && usage.id === excludeUsageId) return false

    const usageStart = new Date(usage.startDate)
    const usageEnd = new Date(usage.endDate)

    // Check for overlap: two date ranges overlap if one starts before the other ends
    // Overlap exists if: start < usageEnd AND end > usageStart
    return start < usageEnd && end > usageStart
  })

  return delay({
    hasOverlap: conflictingUsages.length > 0,
    conflictingUsages,
  })
}

export async function mockGetEquipmentUsageHistory(
  equipmentId: number,
  page = 1,
  pageSize = 10
): Promise<{
  usages: EquipmentUsageRecord[]
  nextPage: number | null
  totalCount: number
}> {
  const filtered = mockUsageHistory.filter((usage) => usage.equipmentId === equipmentId)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const usages = filtered.slice(startIndex, endIndex)
  const hasMore = endIndex < filtered.length

  return delay({
    usages,
    nextPage: hasMore ? page + 1 : null,
    totalCount: filtered.length,
  })
}

export async function mockGetEquipmentCalendar(
  equipmentId: number,
  year: number,
  month: number
): Promise<CalendarMonth> {
  const filtered = mockUsageHistory.filter((usage) => {
    const usageDate = new Date(usage.startDate)
    return usage.equipmentId === equipmentId &&
           usageDate.getFullYear() === year &&
           usageDate.getMonth() + 1 === month
  })

  const daysMap = new Map<number, typeof filtered>()
  filtered.forEach((usage) => {
    const day = new Date(usage.startDate).getDate()
    if (!daysMap.has(day)) {
      daysMap.set(day, [])
    }
    daysMap.get(day)!.push(usage)
  })

  const days = Array.from(daysMap.entries()).map(([dayNumber, appointments]) => ({
    dayNumber,
    appointments: appointments.map((a) => ({
      id: a.id,
      startDate: a.startDate,
      endDate: a.endDate,
      researcher: a.researcher,
      description: a.description,
    })),
  }))

  return delay({
    month,
    year,
    days,
  })
}

// Export equipment store for use in other mocks
export const mockEquipment = mockEquipmentStore
