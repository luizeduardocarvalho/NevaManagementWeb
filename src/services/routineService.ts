import api from './api'
import { AxiosError } from 'axios'
import type {
  Routine,
  CreateRoutineRequest,
  AvailabilityCheck,
  RoutineExecution,
  UpdateStepCompletionRequest,
  ScheduledRoutine,
} from '@/types/routine.types'

export const routineService = {
  // Routine CRUD
  getAll: async (laboratoryId: number, scheduleType?: string): Promise<Routine[]> => {
    try {
      const params: Record<string, any> = {}
      if (scheduleType) params.scheduleType = scheduleType

      const response = await api.get('/routines', { params })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  getById: async (id: number, laboratoryId: number): Promise<Routine | null> => {
    try {
      const response = await api.get(`/routines/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  create: async (data: CreateRoutineRequest, laboratoryId: number): Promise<Routine> => {
    const response = await api.post('/routines', data)
    return response.data
  },

  edit: async (id: number, data: CreateRoutineRequest, laboratoryId: number): Promise<void> => {
    await api.put(`/routines/${id}`, data)
  },

  delete: async (id: number, laboratoryId: number): Promise<void> => {
    await api.delete(`/routines/${id}`)
  },

  // Execution
  checkAvailability: async (
    routineId: number,
    laboratoryId: number
  ): Promise<AvailabilityCheck> => {
    const response = await api.get(`/routines/${routineId}/availability`)

    // Transform backend response to match AvailabilityCheck interface
    // Backend returns: { available, materials: [{sufficient, availableQty, requiredQty, ...}], equipment: [{available, ...}] }
    // Frontend expects: { materialsAvailable, equipmentAvailable, materialIssues: [], equipmentConflicts: [] }
    const backendData = response.data

    const materials = backendData.materials || []
    const equipment = backendData.equipment || []

    // Check if all materials are sufficient
    const materialsAvailable = materials.every((m: any) => m.sufficient === true)

    // Check if all equipment is available
    const equipmentAvailable = equipment.every((e: any) => e.available === true)

    // Extract material issues (insufficient stock)
    const materialIssues = materials
      .filter((m: any) => m.sufficient === false)
      .map((m: any) => ({
        productId: m.productId,
        productName: m.productName,
        required: m.requiredQty,
        available: m.availableQty,
        unit: m.unit,
      }))

    // Extract equipment conflicts (not available)
    const equipmentConflicts = equipment
      .filter((e: any) => e.available === false)
      .map((e: any) => ({
        equipmentId: e.equipmentId,
        equipmentName: e.equipmentName,
        conflictTime: e.conflictTime || 'Currently in use',
        conflictDescription: e.status || 'Equipment is not available',
      }))

    return {
      materialsAvailable,
      equipmentAvailable,
      materialIssues,
      equipmentConflicts,
    }
  },

  startExecution: async (
    routineId: number,
    userId: number,
    laboratoryId: number
  ): Promise<RoutineExecution> => {
    const response = await api.post(`/routines/${routineId}/executions`, {
      executedBy: userId,
    })
    return response.data
  },

  updateStepCompletion: async (
    data: UpdateStepCompletionRequest,
    laboratoryId: number
  ): Promise<void> => {
    const { executionId, stepId, completed, notes } = data
    await api.patch(`/routines/executions/${executionId}/steps/${stepId}`, {
      completed,
      notes,
    })
  },

  completeExecution: async (
    executionId: number,
    laboratoryId: number,
    notes?: string,
    materials?: Array<{ productId: number; actualQuantity: number }>
  ): Promise<void> => {
    await api.post(`/routines/executions/${executionId}/complete`, {
      notes,
      materials,
    })
  },

  cancelExecution: async (executionId: number, laboratoryId: number): Promise<void> => {
    await api.post(`/routines/executions/${executionId}/cancel`)
  },

  getExecutionById: async (executionId: number, laboratoryId: number): Promise<RoutineExecution | null> => {
    try {
      const response = await api.get(`/routines/executions/${executionId}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // History
  getExecutionHistory: async (
    laboratoryId: number,
    filters?: {
      routineId?: number
      status?: string
      executedBy?: number
      startDate?: string
      endDate?: string
    }
  ): Promise<RoutineExecution[]> => {
    try {
      const params: Record<string, any> = {}
      if (filters?.routineId) params.routineId = filters.routineId
      if (filters?.status) params.status = filters.status
      if (filters?.executedBy) params.executedBy = filters.executedBy
      if (filters?.startDate) params.startDate = filters.startDate
      if (filters?.endDate) params.endDate = filters.endDate

      const response = await api.get('/routines/executions', { params })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // Statistics
  getStatistics: async (laboratoryId: number): Promise<any> => {
    try {
      const response = await api.get('/routines/statistics')
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // Upcoming routines
  getUpcomingRoutines: async (
    laboratoryId: number,
    days?: number
  ): Promise<ScheduledRoutine[]> => {
    try {
      const params: Record<string, any> = {}
      if (days) {
        params.days = days
      }
      const response = await api.get('/routines/upcoming', { params })

      // Transform backend response to match ScheduledRoutine interface
      // Backend returns: { id, name, scheduleType, nextDue, deadline, assignedTo }
      // Frontend expects: { id, routineId, routineName, routineDescription, dueDate, assignedToNames, ... }
      const routines = response.data.map((routine: any) => ({
        id: routine.id,
        routineId: routine.id,
        routineName: routine.name || 'Untitled Routine',
        routineDescription: routine.description || '',
        scheduledDate: routine.nextDue || routine.deadline,
        dueDate: routine.deadline || routine.nextDue,
        assignedTo: routine.assignedTo || [],
        assignedToNames: routine.assignedToNames || [],
        status: routine.status || 'pending',
        executionId: routine.executionId,
        laboratory_id: laboratoryId,
      }))

      return routines
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return []
      }
      throw error
    }
  },
}
