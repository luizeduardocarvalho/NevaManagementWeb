import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sampleService } from '@/services/sampleService'
import { toast } from 'sonner'
import type { CreateSampleRequest } from '@/types/sample.types'

export function useSamples() {
  return useQuery({
    queryKey: ['samples'],
    queryFn: () => sampleService.getAll(),
  })
}

export function useSampleById(id: number) {
  return useQuery({
    queryKey: ['samples', id],
    queryFn: () => sampleService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSampleRequest) => sampleService.create(data),
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

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSampleRequest }) =>
      sampleService.edit(id, data),
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

  return useMutation({
    mutationFn: (sampleId: number) => sampleService.delete(sampleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      toast.success('Sample deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete sample')
    },
  })
}
