import { useQuery } from '@tanstack/react-query'
import { locationService } from '@/services/locationService'
import { useAuthStore } from '@/store/authStore'
import type { Location } from '@/types/location.types'

export function useLocations() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['locations', laboratoryId],
    queryFn: (): Promise<Location[]> => locationService.getAll(),
    enabled: !!laboratoryId,
  })
}

export function useLocationById(id: number) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: (): Promise<Location | undefined> => locationService.getById(id),
    enabled: !!id,
  })
}
