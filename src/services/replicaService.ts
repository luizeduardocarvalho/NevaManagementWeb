import {
  mockGetReplicasBySampleId,
  mockGetReplicaById,
  mockGetReplicasByTransferDate,
  mockAddReplica,
  mockDuplicateReplica,
  mockEditReplica,
} from '@/mocks/replicas'
import type {
  SimpleReplica,
  DetailedReplica,
  ReplicaWithTransferInfo,
  CreateReplicaRequest,
  EditReplicaRequest,
} from '@/types/replica.types'

export const replicaService = {
  getBySampleId: async (sampleId: number): Promise<SimpleReplica[]> => {
    return mockGetReplicasBySampleId(sampleId)
  },

  getById: async (id: number): Promise<DetailedReplica | null> => {
    return mockGetReplicaById(id)
  },

  getByTransferDate: async (
    page: number
  ): Promise<{
    replicas: ReplicaWithTransferInfo[]
    nextPage: number | null
    totalCount: number
  }> => {
    return mockGetReplicasByTransferDate(page)
  },

  create: async (data: CreateReplicaRequest): Promise<void> => {
    await mockAddReplica(data)
  },

  duplicate: async (id: number, newName: string): Promise<void> => {
    await mockDuplicateReplica(id, newName)
  },

  edit: async (data: EditReplicaRequest): Promise<void> => {
    await mockEditReplica(data.id, {
      name: data.name,
      locationId: data.locationId,
      nextTransferDate: data.nextTransferDate,
      notes: data.notes,
    })
  },
}
