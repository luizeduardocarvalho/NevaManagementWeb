import type {
  Replica,
  DetailedReplica,
  SimpleReplica,
  ReplicaWithTransferInfo,
} from '@/types/replica.types'
import { mockSampleStore } from './samples'
import { mockLocations } from './locations'
import { mockResearchers } from './researchers'
import { differenceInDays } from 'date-fns'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 350))

// Helper to calculate next transfer date
function calculateNextTransferDate(creationDate: string, intervalDays: number): string {
  const creation = new Date(creationDate)
  creation.setDate(creation.getDate() + intervalDays)
  return creation.toISOString()
}

export const mockReplicaStore: Replica[] = [
  // Sample 1: E. coli K-12 - 2 replicas
  {
    id: 1,
    name: 'EC-K12-R1',
    sampleId: 1,
    locationId: 1,
    creationDate: '2024-01-20T00:00:00Z',
    nextTransferDate: calculateNextTransferDate('2024-01-20T00:00:00Z', 30),
    notes: 'Primary working culture',
    laboratory_id: 1,
  },
  {
    id: 2,
    name: 'EC-K12-R2',
    sampleId: 1,
    parentReplicaId: 1,
    locationId: 1,
    creationDate: '2024-02-15T00:00:00Z',
    nextTransferDate: calculateNextTransferDate('2024-02-15T00:00:00Z', 30),
    notes: 'Backup culture',
    laboratory_id: 1,
  },
  // Sample 2: S. cerevisiae - 3 replicas
  {
    id: 3,
    name: 'SC-S288C-R1',
    sampleId: 2,
    locationId: 2,
    creationDate: '2024-02-12T00:00:00Z',
    nextTransferDate: calculateNextTransferDate('2024-02-12T00:00:00Z', 21),
    notes: 'Original culture',
    laboratory_id: 1,
  },
  {
    id: 4,
    name: 'SC-S288C-R2',
    sampleId: 2,
    parentReplicaId: 3,
    locationId: 2,
    creationDate: '2024-03-01T00:00:00Z',
    nextTransferDate: '2024-12-20T00:00:00Z', // Coming up soon!
    notes: 'For protein expression experiments',
    laboratory_id: 1,
  },
  {
    id: 5,
    name: 'SC-S288C-R3',
    sampleId: 2,
    parentReplicaId: 3,
    locationId: 5,
    creationDate: '2024-03-15T00:00:00Z',
    nextTransferDate: '2024-12-18T00:00:00Z', // Urgent!
    notes: 'Long-term storage at -80°C',
    laboratory_id: 1,
  },
  // Sample 3: Arabidopsis - 1 replica (simple sample)
  {
    id: 6,
    name: 'AT-COL-R1',
    sampleId: 3,
    locationId: 3,
    creationDate: '2024-03-08T00:00:00Z',
    nextTransferDate: calculateNextTransferDate('2024-03-08T00:00:00Z', 60),
    notes: 'Seeds from first generation',
    laboratory_id: 1,
  },
  // Sample 4: B. subtilis - 1 replica
  {
    id: 7,
    name: 'BS-168-R1',
    sampleId: 4,
    locationId: 1,
    creationDate: '2024-04-03T00:00:00Z',
    nextTransferDate: '2024-12-22T00:00:00Z',
    notes: 'Sporulation studies',
    laboratory_id: 1,
  },
  // Sample 5: P. aeruginosa - 2 replicas
  {
    id: 8,
    name: 'PA-PAO1-R1',
    sampleId: 5,
    locationId: 2,
    creationDate: '2024-06-18T00:00:00Z',
    nextTransferDate: '2024-12-16T00:00:00Z', // Very urgent!
    notes: 'Biofilm formation assays',
    laboratory_id: 1,
  },
  {
    id: 9,
    name: 'PA-PAO1-R2',
    sampleId: 5,
    parentReplicaId: 8,
    locationId: 4,
    creationDate: '2024-07-01T00:00:00Z',
    nextTransferDate: '2024-12-25T00:00:00Z',
    notes: 'Antibiotic resistance testing',
    laboratory_id: 1,
  },
  // Sample 6: C. albicans - 1 replica
  {
    id: 10,
    name: 'CA-SC5314-R1',
    sampleId: 6,
    locationId: 4,
    creationDate: '2024-07-22T00:00:00Z',
    nextTransferDate: '2024-12-28T00:00:00Z',
    notes: 'Antifungal susceptibility testing',
    laboratory_id: 1,
  },
]

export async function mockGetReplicasBySampleId(sampleId: number): Promise<SimpleReplica[]> {
  const replicas = mockReplicaStore
    .filter((r) => r.sampleId === sampleId)
    .map((r) => ({
      id: r.id,
      name: r.name,
      sampleId: r.sampleId,
    }))
  return delay(replicas)
}

export async function mockGetReplicaById(id: number): Promise<DetailedReplica | null> {
  const replica = mockReplicaStore.find((r) => r.id === id)
  if (!replica) return delay(null)

  const sample = mockSampleStore.find((s) => s.id === replica.sampleId)
  const location = mockLocations.find((l) => l.id === replica.locationId)
  const parentReplica = replica.parentReplicaId
    ? mockReplicaStore.find((r) => r.id === replica.parentReplicaId)
    : undefined
  const researcher = sample ? mockResearchers.find((r) => r.id === sample.researcherId) : undefined

  return delay({
    ...replica,
    sampleName: sample?.name || 'Unknown',
    locationName: location?.name || 'Unknown',
    parentReplicaName: parentReplica?.name,
    subcultureMedium: sample?.subcultureMedium || 'Unknown',
    subcultureIntervalDays: sample?.subcultureIntervalDays || 0,
    researcherName: researcher ? `${researcher.first_name} ${researcher.last_name}` : 'Unknown',
  })
}

export async function mockGetReplicasByTransferDate(
  page = 1,
  pageSize = 10
): Promise<{
  replicas: ReplicaWithTransferInfo[]
  nextPage: number | null
  totalCount: number
}> {
  const now = new Date()

  // Sort by transfer date ascending (most urgent first)
  const sorted = [...mockReplicaStore].sort(
    (a, b) => new Date(a.nextTransferDate).getTime() - new Date(b.nextTransferDate).getTime()
  )

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedReplicas = sorted.slice(startIndex, endIndex)

  const replicasWithInfo: ReplicaWithTransferInfo[] = paginatedReplicas.map((replica) => {
    const sample = mockSampleStore.find((s) => s.id === replica.sampleId)
    const location = mockLocations.find((l) => l.id === replica.locationId)
    const researcher = sample ? mockResearchers.find((r) => r.id === sample.researcherId) : undefined
    const daysUntilTransfer = differenceInDays(new Date(replica.nextTransferDate), now)

    return {
      id: replica.id,
      name: replica.name,
      sampleName: sample?.name || 'Unknown',
      nextTransferDate: replica.nextTransferDate,
      locationName: location?.name || 'Unknown',
      researcherName: researcher ? `${researcher.first_name} ${researcher.last_name}` : 'Unknown',
      daysUntilTransfer,
    }
  })

  const hasMore = endIndex < sorted.length

  return delay({
    replicas: replicasWithInfo,
    nextPage: hasMore ? page + 1 : null,
    totalCount: sorted.length,
  })
}

export async function mockAddReplica(
  data: Omit<Replica, 'id' | 'laboratory_id' | 'nextTransferDate'>
): Promise<Replica> {
  const sample = mockSampleStore.find((s) => s.id === data.sampleId)
  const subcultureIntervalDays = sample?.subcultureIntervalDays || 30

  const newReplica: Replica = {
    ...data,
    id: Math.max(...mockReplicaStore.map((r) => r.id)) + 1,
    nextTransferDate: calculateNextTransferDate(data.creationDate, subcultureIntervalDays),
    laboratory_id: 1,
  }
  mockReplicaStore.push(newReplica)
  return delay(newReplica)
}

export async function mockDuplicateReplica(id: number, newName: string): Promise<Replica> {
  const original = mockReplicaStore.find((r) => r.id === id)
  if (!original) throw new Error('Replica not found')

  const sample = mockSampleStore.find((s) => s.id === original.sampleId)
  const subcultureIntervalDays = sample?.subcultureIntervalDays || 30

  const duplicate: Replica = {
    ...original,
    id: Math.max(...mockReplicaStore.map((r) => r.id)) + 1,
    name: newName,
    parentReplicaId: id,
    creationDate: new Date().toISOString(),
    nextTransferDate: calculateNextTransferDate(new Date().toISOString(), subcultureIntervalDays),
    notes: `Duplicated from ${original.name}`,
  }
  mockReplicaStore.push(duplicate)
  return delay(duplicate)
}

export async function mockEditReplica(
  id: number,
  data: { name: string; locationId: number; nextTransferDate: string; notes?: string }
): Promise<void> {
  const index = mockReplicaStore.findIndex((r) => r.id === id)
  if (index !== -1) {
    mockReplicaStore[index] = {
      ...mockReplicaStore[index],
      ...data,
    }
  }
  return delay(undefined)
}

// Auto-create first replica when a sample is created
export async function mockAutoCreateFirstReplica(sampleId: number): Promise<Replica> {
  const sample = mockSampleStore.find((s) => s.id === sampleId)
  if (!sample) throw new Error('Sample not found')

  return mockAddReplica({
    name: `${sample.name.substring(0, 10).toUpperCase()}-R1`,
    sampleId: sampleId,
    locationId: sample.locationId,
    creationDate: sample.createdAt,
    notes: 'Auto-created first replica',
  })
}
