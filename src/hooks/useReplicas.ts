import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { replicaService } from '@/services/replicaService'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import type { CreateReplicaRequest, EditReplicaRequest } from '@/types/replica.types'

export function useReplicasBySampleId(sampleId: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['replicas', 'sample', sampleId, laboratoryId],
    queryFn: () => replicaService.getBySampleId(sampleId),
    enabled: !!laboratoryId && !!sampleId,
  })
}

export function useReplicaById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['replicas', id, laboratoryId],
    queryFn: () => replicaService.getById(id),
    enabled: !!laboratoryId && !!id,
  })
}

export function useReplicasByTransferDate() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useInfiniteQuery({
    queryKey: ['replicas', 'transfers', laboratoryId],
    queryFn: ({ pageParam = 1 }) => replicaService.getByTransferDate(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!laboratoryId,
  })
}

export function useCreateReplica() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReplicaRequest) => replicaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replicas'] })
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      toast.success('Replica created successfully')
    },
    onError: () => {
      toast.error('Failed to create replica')
    },
  })
}

export function useDuplicateReplica() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newName }: { id: number; newName: string }) =>
      replicaService.duplicate(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replicas'] })
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      toast.success('Replica duplicated successfully')
    },
    onError: () => {
      toast.error('Failed to duplicate replica')
    },
  })
}

export function useEditReplica() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EditReplicaRequest) => replicaService.edit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replicas'] })
      toast.success('Replica updated successfully')
    },
    onError: () => {
      toast.error('Failed to update replica')
    },
  })
}
