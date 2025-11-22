import {
  mockGetRoutines,
  mockGetRoutineById,
  mockAddRoutine,
  mockEditRoutine,
  mockDeleteRoutine,
  mockCheckAvailability,
  mockStartExecution,
  mockUpdateStepCompletion,
  mockCompleteExecution,
  mockCancelExecution,
  mockGetExecutionHistory,
  mockGetUpcomingRoutines,
} from '@/mocks/routines'
import type {
  Routine,
  CreateRoutineRequest,
  EditRoutineRequest,
  AvailabilityCheck,
  RoutineExecution,
  UpdateStepCompletionRequest,
} from '@/types/routine.types'

export const routineService = {
  // Routine CRUD
  getAll: async (laboratoryId: number): Promise<Routine[]> => {
    return mockGetRoutines(laboratoryId)
  },

  getById: async (id: number, laboratoryId: number): Promise<Routine | null> => {
    return mockGetRoutineById(id, laboratoryId)
  },

  create: async (data: CreateRoutineRequest, laboratoryId: number): Promise<Routine> => {
    return mockAddRoutine(data, laboratoryId)
  },

  edit: async (id: number, data: CreateRoutineRequest, laboratoryId: number): Promise<void> => {
    return mockEditRoutine(id, data, laboratoryId)
  },

  delete: async (id: number, laboratoryId: number): Promise<void> => {
    return mockDeleteRoutine(id, laboratoryId)
  },

  // Execution
  checkAvailability: async (
    routineId: number,
    laboratoryId: number
  ): Promise<AvailabilityCheck> => {
    return mockCheckAvailability(routineId, laboratoryId)
  },

  startExecution: async (
    routineId: number,
    userId: number,
    laboratoryId: number
  ): Promise<RoutineExecution> => {
    return mockStartExecution(routineId, userId, laboratoryId)
  },

  updateStepCompletion: async (
    data: UpdateStepCompletionRequest,
    laboratoryId: number
  ): Promise<void> => {
    return mockUpdateStepCompletion(data, laboratoryId)
  },

  completeExecution: async (executionId: number, laboratoryId: number): Promise<void> => {
    return mockCompleteExecution(executionId, laboratoryId)
  },

  cancelExecution: async (executionId: number, laboratoryId: number): Promise<void> => {
    return mockCancelExecution(executionId, laboratoryId)
  },

  // History
  getExecutionHistory: async (
    laboratoryId: number,
    routineId?: number
  ): Promise<RoutineExecution[]> => {
    return mockGetExecutionHistory(laboratoryId, routineId)
  },

  // Upcoming routines
  getUpcomingRoutines: async (
    laboratoryId: number,
    days?: number
  ): Promise<Array<Routine & { dueDate: string; daysUntilDue: number }>> => {
    return mockGetUpcomingRoutines(laboratoryId, days)
  },
}
