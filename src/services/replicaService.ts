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
  getBySampleId: async (sampleId: number, laboratoryId: number): Promise<SimpleReplica[]> => {
    return mockGetReplicasBySampleId(sampleId)
  },

  getById: async (id: number, laboratoryId: number): Promise<DetailedReplica | null> => {
    return mockGetReplicaById(id)
  },

  getByTransferDate: async (
    laboratoryId: number,
    page: number
  ): Promise<{
    replicas: ReplicaWithTransferInfo[]
    nextPage: number | null
    totalCount: number
  }> => {
    return mockGetReplicasByTransferDate(page)
  },

  create: async (data: CreateReplicaRequest, laboratoryId: number): Promise<void> => {
    await mockAddReplica(data)
  },

  duplicate: async (id: number, newName: string, laboratoryId: number): Promise<void> => {
    await mockDuplicateReplica(id, newName)
  },

  edit: async (data: EditReplicaRequest, laboratoryId: number): Promise<void> => {
    await mockEditReplica(data.id, {
      name: data.name,
      locationId: data.locationId,
      nextTransferDate: data.nextTransferDate,
      notes: data.notes,
    })
  },
}
