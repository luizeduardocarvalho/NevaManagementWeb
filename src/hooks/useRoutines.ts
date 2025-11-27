import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routineService } from '@/services/routineService'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import type { CreateRoutineRequest, UpdateStepCompletionRequest } from '@/types/routine.types'

export function useRoutines(scheduleType?: string) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['routines', laboratoryId, scheduleType],
    queryFn: () => routineService.getAll(laboratoryId!, scheduleType),
    enabled: !!laboratoryId,
  })
}

export function useRoutineById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['routines', id, laboratoryId],
    queryFn: () => routineService.getById(id, laboratoryId!),
    enabled: !!laboratoryId && !!id,
  })
}

export function useCreateRoutine() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (data: CreateRoutineRequest) => routineService.create(data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] })
      toast.success('Routine created successfully')
    },
    onError: () => {
      toast.error('Failed to create routine')
    },
  })
}

export function useEditRoutine() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateRoutineRequest }) =>
      routineService.edit(id, data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] })
      toast.success('Routine updated successfully')
    },
    onError: () => {
      toast.error('Failed to update routine')
    },
  })
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (id: number) => routineService.delete(id, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] })
      toast.success('Routine deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete routine')
    },
  })
}

export function useCheckAvailability(routineId: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['routines', 'availability', routineId, laboratoryId],
    queryFn: () => routineService.checkAvailability(routineId, laboratoryId!),
    enabled: !!laboratoryId && !!routineId,
  })
}

export function useStartExecution() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: (routineId: number) =>
      routineService.startExecution(routineId, userId!, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine-executions'] })
      toast.success('Routine execution started')
    },
    onError: () => {
      toast.error('Failed to start routine execution')
    },
  })
}

export function useUpdateStepCompletion() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (data: UpdateStepCompletionRequest) =>
      routineService.updateStepCompletion(data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine-executions'] })
    },
    onError: () => {
      toast.error('Failed to update step completion')
    },
  })
}

export function useCompleteExecution() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: ({
      executionId,
      notes,
      materials,
    }: {
      executionId: number
      notes?: string
      materials?: Array<{ productId: number; actualQuantity: number }>
    }) => routineService.completeExecution(executionId, laboratoryId!, notes, materials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine-executions'] })
      queryClient.invalidateQueries({ queryKey: ['products'] }) // Refresh products since inventory was deducted
      toast.success('Routine completed! Materials deducted from inventory')
    },
    onError: () => {
      toast.error('Failed to complete routine')
    },
  })
}

export function useCancelExecution() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (executionId: number) => routineService.cancelExecution(executionId, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine-executions'] })
      toast.success('Routine execution cancelled')
    },
    onError: () => {
      toast.error('Failed to cancel routine execution')
    },
  })
}

export function useExecutionById(executionId: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['routine-execution', executionId, laboratoryId],
    queryFn: () => routineService.getExecutionById(executionId, laboratoryId!),
    enabled: !!laboratoryId && !!executionId,
  })
}

export function useExecutionHistory(filters?: {
  routineId?: number
  status?: string
  executedBy?: number
  startDate?: string
  endDate?: string
}) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['routine-executions', laboratoryId, filters],
    queryFn: () => routineService.getExecutionHistory(laboratoryId!, filters),
    enabled: !!laboratoryId,
  })
}

export function useUpcomingRoutines(days: number = 7) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['upcoming-routines', laboratoryId, days],
    queryFn: () => routineService.getUpcomingRoutines(laboratoryId!, days),
    enabled: !!laboratoryId,
  })
}

export function useRoutineStatistics() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['routine-statistics', laboratoryId],
    queryFn: () => routineService.getStatistics(laboratoryId!),
    enabled: !!laboratoryId,
  })
}
