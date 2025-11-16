import type { SimpleResearcher } from '@/types/equipment.types'

export const mockResearchers: SimpleResearcher[] = [
  { id: 1, name: 'Dr. Sarah Chen' },
  { id: 2, name: 'Dr. Michael Rodriguez' },
  { id: 3, name: 'Dr. Emily Watson' },
  { id: 4, name: 'Dr. James Park' },
  { id: 5, name: 'Dr. Lisa Anderson' },
]

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(value))), timeout))

export async function mockGetResearchers(): Promise<SimpleResearcher[]> {
  return delay(mockResearchers)
}
