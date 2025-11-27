import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { laboratoryService } from '@/services/laboratoryService'
import { useAuthStore } from '@/store/authStore'
import type { CreateLaboratoryRequest } from '@/types/laboratory.types'

export function useLaboratory() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['laboratory', laboratoryId],
    queryFn: () => laboratoryService.getById(laboratoryId!),
    enabled: !!laboratoryId,
  })
}

export function useUserLaboratories() {
  return useQuery({
    queryKey: ['laboratories', 'user'],
    queryFn: () => laboratoryService.getUserLaboratories(),
  })
}

export function useCreateLaboratory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLaboratoryRequest) => laboratoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratories'] })
    },
  })
}
