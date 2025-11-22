import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { researcherService } from '@/services/researcherService'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import type { SimpleResearcher } from '@/types/researcher.types'
import type { CreateResearcherRequest } from '@/types/researcher.types'

// For dropdowns and selects (simple list)
export function useResearchers() {
  return useQuery({
    queryKey: ['researchers', 'simple'],
    queryFn: (): Promise<SimpleResearcher[]> => researcherService.getSimple(),
  })
}

// For researcher management page (full details)
export function useAllResearchers() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['researchers', 'all', laboratoryId],
    queryFn: () => researcherService.getAll(laboratoryId!),
    enabled: !!laboratoryId,
  })
}

export function useResearcherById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['researchers', id, laboratoryId],
    queryFn: () => researcherService.getById(id, laboratoryId!),
    enabled: !!laboratoryId && !!id,
  })
}

export function useCreateResearcher() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (data: CreateResearcherRequest) => researcherService.create(data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] })
      toast.success('Researcher created successfully')
    },
    onError: () => {
      toast.error('Failed to create researcher')
    },
  })
}

export function useEditResearcher() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateResearcherRequest }) =>
      researcherService.edit(id, data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] })
      toast.success('Researcher updated successfully')
    },
    onError: () => {
      toast.error('Failed to update researcher')
    },
  })
}

export function useDeleteResearcher() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (id: number) => researcherService.delete(id, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] })
      toast.success('Researcher deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete researcher')
    },
  })
}
