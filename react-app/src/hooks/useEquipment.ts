import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { equipmentService } from '@/services/equipmentService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import type {
  CreateEquipmentRequest,
  DetailedEquipment,
  EditEquipmentRequest,
  SimpleEquipment,
  UseEquipmentRequest,
} from '@/types/equipment.types'
import { getErrorMessage } from '@/lib/errors'

export function useEquipment() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['equipment', 'all', laboratoryId],
    queryFn: async (): Promise<SimpleEquipment[]> => {
      const result = await equipmentService.getAll(laboratoryId!, 1, 1000)
      return result.equipment
    },
    enabled: !!laboratoryId,
  })
}

export function useInfiniteEquipment() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useInfiniteQuery({
    queryKey: ['equipment', 'infinite', laboratoryId],
    queryFn: ({ pageParam = 1 }) => equipmentService.getAll(laboratoryId!, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!laboratoryId,
  })
}

export function useEquipmentById(id: number) {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['equipment', id, laboratoryId],
    queryFn: (): Promise<DetailedEquipment> => equipmentService.getById(id, laboratoryId!),
    enabled: !!id && !!laboratoryId,
  })
}

export function useEquipmentCalendar(equipmentId: number, year: number, month: number) {
  return useQuery({
    queryKey: ['equipment', equipmentId, 'calendar', year, month],
    queryFn: () => equipmentService.getCalendar(equipmentId, year, month),
    enabled: !!equipmentId,
  })
}

export function useEquipmentUsageHistory(equipmentId: number) {
  return useInfiniteQuery({
    queryKey: ['equipment', equipmentId, 'usage-history'],
    queryFn: ({ pageParam = 1 }) => equipmentService.getUsageHistory(equipmentId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!equipmentId,
  })
}

export function useCreateEquipment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateEquipmentRequest) => equipmentService.create(data),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to create equipment'),
        variant: 'destructive',
      })
    },
  })
}

export function useEditEquipment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: EditEquipmentRequest) => equipmentService.edit(data),
    onSuccess: (message, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to edit equipment'),
        variant: 'destructive',
      })
    },
  })
}

export function useUseEquipment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: UseEquipmentRequest) => equipmentService.useEquipment(data),
    onSuccess: (message, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.equipmentId, 'calendar'] })
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.equipmentId, 'usage-history'] })
      toast({
        title: 'Success',
        description: message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to schedule equipment'),
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (equipmentId: number) => equipmentService.delete(equipmentId, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      toast({
        title: 'Success',
        description: 'Equipment deleted successfully',
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to delete equipment'),
        variant: 'destructive',
      })
    },
  })
}

export function useCheckEquipmentOverlap(
  equipmentId: number,
  startDate: string,
  endDate: string,
  excludeUsageId?: number
) {
  return useQuery({
    queryKey: ['equipment', equipmentId, 'overlap', startDate, endDate, excludeUsageId],
    queryFn: () => equipmentService.checkOverlap(equipmentId, startDate, endDate, excludeUsageId),
    enabled: !!equipmentId && !!startDate && !!endDate,
  })
}
