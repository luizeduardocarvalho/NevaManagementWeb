import type { Researcher, SimpleResearcher } from '@/types/researcher.types'

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(value))), timeout))

export const mockResearchers: Researcher[] = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@labflux.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Molecular Biology',
    department: 'Genetics',
    laboratory_id: 1,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 2,
    name: 'Dr. Michael Rodriguez',
    email: 'michael.rodriguez@labflux.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Microbiology',
    department: 'Bacteriology',
    laboratory_id: 1,
    createdAt: '2023-02-20T00:00:00Z',
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    email: 'emily.watson@labflux.com',
    phone: '+1 (555) 345-6789',
    specialization: 'Plant Biology',
    department: 'Botany',
    laboratory_id: 1,
    createdAt: '2023-03-10T00:00:00Z',
  },
  {
    id: 4,
    name: 'Dr. James Park',
    email: 'james.park@labflux.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Biochemistry',
    department: 'Chemistry',
    laboratory_id: 1,
    createdAt: '2023-04-05T00:00:00Z',
  },
  {
    id: 5,
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@labflux.com',
    phone: '+1 (555) 567-8901',
    specialization: 'Cell Biology',
    department: 'Cellular Research',
    laboratory_id: 1,
    createdAt: '2023-05-12T00:00:00Z',
  },
]

export async function mockGetResearchers(): Promise<SimpleResearcher[]> {
  return delay(
    mockResearchers.map((r) => ({
      id: r.id,
      name: r.name,
    }))
  )
}

export async function mockGetAllResearchers(): Promise<Researcher[]> {
  return delay(mockResearchers)
}

export async function mockGetResearcherById(id: number): Promise<Researcher | null> {
  const researcher = mockResearchers.find((r) => r.id === id)
  return delay(researcher || null)
}

export async function mockAddResearcher(
  data: Omit<Researcher, 'id' | 'laboratory_id' | 'createdAt'>
): Promise<Researcher> {
  const newResearcher: Researcher = {
    ...data,
    id: Math.max(...mockResearchers.map((r) => r.id)) + 1,
    laboratory_id: 1,
    createdAt: new Date().toISOString(),
  }
  mockResearchers.push(newResearcher)
  return delay(newResearcher)
}

export async function mockEditResearcher(
  id: number,
  data: Omit<Researcher, 'id' | 'laboratory_id' | 'createdAt'>
): Promise<void> {
  const index = mockResearchers.findIndex((r) => r.id === id)
  if (index !== -1) {
    mockResearchers[index] = {
      ...mockResearchers[index],
      ...data,
    }
  }
  return delay(undefined)
}

export async function mockDeleteResearcher(id: number): Promise<void> {
  const index = mockResearchers.findIndex((r) => r.id === id)
  if (index !== -1) {
    mockResearchers.splice(index, 1)
  }
  return delay(undefined)
}
