import type { Sample, DetailedSample, SimpleSample } from '@/types/sample.types'
import { mockLocations } from './locations'
import { mockResearchers } from './researchers'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 350))

export const mockSampleStore: Sample[] = [
  {
    id: 1,
    name: 'Escherichia coli K-12',
    description: 'Non-pathogenic laboratory strain commonly used in molecular biology',
    origin: 'Laboratory Stock Collection, Cambridge, MA',
    isolationDate: '2023-01-20T00:00:00Z',
    latitude: 42.3601,
    longitude: -71.0589,
    subcultureMedium: 'LB Agar',
    subcultureIntervalDays: 30,
    researcherId: 1,
    locationId: 1,
    tags: ['bacteria', 'gram-negative', 'temp:37C', 'condition:good'],
    laboratory_id: 1,
    createdAt: '2023-01-20T00:00:00Z',
  },
  {
    id: 2,
    name: 'Saccharomyces cerevisiae S288C',
    description: 'Model organism for eukaryotic cell biology',
    origin: 'University Culture Collection, Boston, MA',
    isolationDate: '2023-02-12T00:00:00Z',
    latitude: 42.3505,
    longitude: -71.1054,
    subcultureMedium: 'YPD Agar',
    subcultureIntervalDays: 21,
    researcherId: 2,
    locationId: 2,
    tags: ['yeast', 'eukaryote', 'temp:30C', 'condition:excellent'],
    laboratory_id: 1,
    createdAt: '2023-02-12T00:00:00Z',
  },
  {
    id: 3,
    name: 'Arabidopsis thaliana Col-0',
    description: 'Wild-type ecotype for plant molecular genetics',
    origin: 'Field Collection, Cologne, Germany',
    isolationDate: '2023-03-08T00:00:00Z',
    latitude: 50.9375,
    longitude: 6.9603,
    subcultureMedium: 'MS Medium',
    subcultureIntervalDays: 60,
    researcherId: 3,
    locationId: 3,
    tags: ['plant', 'model-organism', 'temp:22C', 'photoperiod:16h', 'condition:good'],
    laboratory_id: 1,
    createdAt: '2023-03-08T00:00:00Z',
  },
  {
    id: 4,
    name: 'Bacillus subtilis 168',
    description: 'Gram-positive model organism for bacterial cell differentiation',
    origin: 'ATCC Culture Collection',
    isolationDate: '2023-04-03T00:00:00Z',
    subcultureMedium: 'Nutrient Agar',
    subcultureIntervalDays: 28,
    researcherId: 4,
    locationId: 1,
    tags: ['bacteria', 'gram-positive', 'temp:37C', 'spore-forming', 'condition:good'],
    laboratory_id: 1,
    createdAt: '2023-04-03T00:00:00Z',
  },
  {
    id: 5,
    name: 'Pseudomonas aeruginosa PAO1',
    description: 'Opportunistic pathogen for biofilm studies',
    origin: 'Clinical Isolate, Hospital Collection',
    isolationDate: '2023-06-18T00:00:00Z',
    subcultureMedium: 'Tryptic Soy Agar',
    subcultureIntervalDays: 14,
    researcherId: 5,
    locationId: 2,
    tags: ['bacteria', 'gram-negative', 'pathogen', 'biofilm', 'temp:37C', 'condition:fair'],
    laboratory_id: 1,
    createdAt: '2023-06-18T00:00:00Z',
  },
  {
    id: 6,
    name: 'Candida albicans SC5314',
    description: 'Human fungal pathogen for infection studies',
    origin: 'Medical Mycology Reference Center',
    isolationDate: '2023-07-22T00:00:00Z',
    subcultureMedium: 'Sabouraud Dextrose Agar',
    subcultureIntervalDays: 21,
    researcherId: 2,
    locationId: 4,
    tags: ['fungus', 'pathogen', 'temp:30C', 'condition:good'],
    laboratory_id: 1,
    createdAt: '2023-07-22T00:00:00Z',
  },
]

export async function mockGetSamples(): Promise<SimpleSample[]> {
  return delay(
    mockSampleStore.map((sample) => ({
      id: sample.id,
      name: sample.name,
      tags: sample.tags,
    }))
  )
}

export async function mockGetSampleById(id: number): Promise<DetailedSample | null> {
  const sample = mockSampleStore.find((s) => s.id === id)
  if (!sample) return delay(null)

  const researcher = mockResearchers.find((r) => r.id === sample.researcherId)
  const location = mockLocations.find((l) => l.id === sample.locationId)

  // Count replicas for this sample (will be implemented in replicas mock)
  const replicaCount = 1 // Placeholder - will be calculated from replica store

  return delay({
    ...sample,
    researcherName: researcher?.name || 'Unknown',
    locationName: location?.name || 'Unknown',
    replicaCount,
  })
}

export async function mockAddSample(
  data: Omit<Sample, 'id' | 'laboratory_id' | 'createdAt'>
): Promise<Sample> {
  const newSample: Sample = {
    ...data,
    id: Math.max(...mockSampleStore.map((s) => s.id)) + 1,
    laboratory_id: 1,
    createdAt: new Date().toISOString(),
  }
  mockSampleStore.push(newSample)
  return delay(newSample)
}

export async function mockEditSample(
  id: number,
  data: Omit<Sample, 'id' | 'laboratory_id' | 'createdAt'>
): Promise<void> {
  const index = mockSampleStore.findIndex((s) => s.id === id)
  if (index !== -1) {
    mockSampleStore[index] = {
      ...mockSampleStore[index],
      ...data,
    }
  }
  return delay(undefined)
}

export async function mockDeleteSample(sampleId: number): Promise<void> {
  const index = mockSampleStore.findIndex((s) => s.id === sampleId)
  if (index !== -1) {
    mockSampleStore.splice(index, 1)
  }
  return delay(undefined)
}
