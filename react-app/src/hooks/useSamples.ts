import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sampleService } from '@/services/sampleService'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import type { CreateSampleRequest } from '@/types/sample.types'

export function useSamples() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['samples', laboratoryId],
    queryFn: () => sampleService.getAll(laboratoryId!),
    enabled: !!laboratoryId,
  })
}

export function useSampleById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['samples', id, laboratoryId],
    queryFn: () => sampleService.getById(id, laboratoryId!),
    enabled: !!laboratoryId && !!id,
  })
}

export function useCreateSample() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (data: CreateSampleRequest) => sampleService.create(data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      queryClient.invalidateQueries({ queryKey: ['replicas'] })
      toast.success('Sample created successfully with first replica')
    },
    onError: () => {
      toast.error('Failed to create sample')
    },
  })
}

export function useEditSample() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSampleRequest }) =>
      sampleService.edit(id, data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      toast.success('Sample updated successfully')
    },
    onError: () => {
      toast.error('Failed to update sample')
    },
  })
}

export function useDeleteSample() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (sampleId: number) => sampleService.delete(sampleId, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      toast.success('Sample deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete sample')
    },
  })
}
