import {
  mockGetSamples,
  mockGetSampleById,
  mockAddSample,
  mockEditSample,
  mockDeleteSample,
} from '@/mocks/samples'
import { mockAutoCreateFirstReplica } from '@/mocks/replicas'
import type { SimpleSample, DetailedSample, CreateSampleRequest } from '@/types/sample.types'

export const sampleService = {
  getAll: async (laboratoryId: number): Promise<SimpleSample[]> => {
    return mockGetSamples()
  },

  getById: async (id: number, laboratoryId: number): Promise<DetailedSample | null> => {
    return mockGetSampleById(id)
  },

  create: async (data: CreateSampleRequest, laboratoryId: number): Promise<void> => {
    const sample = await mockAddSample(data)
    // Auto-create first replica
    await mockAutoCreateFirstReplica(sample.id)
  },

  edit: async (id: number, data: CreateSampleRequest, laboratoryId: number): Promise<void> => {
    await mockEditSample(id, data)
  },

  delete: async (sampleId: number, laboratoryId: number): Promise<void> => {
    void laboratoryId
    return mockDeleteSample(sampleId)
  },
}
