import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { researcherService } from '@/services/researcherService'
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
  return useQuery({
    queryKey: ['researchers', 'all'],
    queryFn: () => researcherService.getAll(),
  })
}

export function useResearcherById(id: number) {
  return useQuery({
    queryKey: ['researchers', id],
    queryFn: () => researcherService.getById(id),
    enabled: !!id,
  })
}

export function useCreateResearcher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateResearcherRequest) => researcherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] })
      toast.success('Team member created successfully')
    },
    onError: () => {
      toast.error('Failed to create team member')
    },
  })
}

export function useEditResearcher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateResearcherRequest }) =>
      researcherService.edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] })
      toast.success('Team member updated successfully')
    },
    onError: () => {
      toast.error('Failed to update team member')
    },
  })
}

export function useDeleteResearcher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => researcherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] })
      toast.success('Team member deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete team member')
    },
  })
}
