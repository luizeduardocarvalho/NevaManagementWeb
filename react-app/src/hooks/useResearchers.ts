import { useQuery } from '@tanstack/react-query'
import { researcherService } from '@/services/researcherService'
import type { SimpleResearcher } from '@/types/equipment.types'

export function useResearchers() {
  return useQuery({
    queryKey: ['researchers'],
    queryFn: (): Promise<SimpleResearcher[]> => researcherService.getAll(),
  })
}
