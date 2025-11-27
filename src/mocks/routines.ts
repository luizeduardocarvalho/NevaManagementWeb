import type {
  Routine,
  CreateRoutineRequest,
  AvailabilityCheck,
  RoutineExecution,
  UpdateStepCompletionRequest,
  MaterialIssue,
  EquipmentConflict,
} from '@/types/routine.types'
import { mockProducts } from './products'
import { mockEquipment } from './equipment'

let routineIdCounter = 3
let executionIdCounter = 3

// Mock routines
export const mockRoutines: Routine[] = [
  {
    id: 1,
    name: '70% Alcohol Preparation',
    description: 'Procedure for preparing 70% ethanol solution for laboratory use',
    materials: [
      {
        id: 1,
        productId: 1, // Ethanol
        productName: 'Ethanol 99%',
        quantity: 700,
        unit: 'mL',
      },
      {
        id: 2,
        productId: 2, // Distilled Water
        productName: 'Distilled Water',
        quantity: 300,
        unit: 'mL',
      },
    ],
    equipment: [
      {
        id: 1,
        equipmentId: 1, // Autoclave
        equipmentName: 'Autoclave A1',
        estimatedDuration: 30,
        required: true,
      },
    ],
    steps: [
      {
        id: 1,
        order: 1,
        description: 'Measure 700mL of 99% ethanol using a graduated cylinder',
        notes: 'Ensure cylinder is clean and dry',
      },
      {
        id: 2,
        order: 2,
        description: 'Measure 300mL of distilled water',
      },
      {
        id: 3,
        order: 3,
        description: 'Mix ethanol and water in a clean container',
        notes: 'Mix gently to avoid splashing',
      },
      {
        id: 4,
        order: 4,
        description: 'Label the container with date and concentration',
      },
      {
        id: 5,
        order: 5,
        description: 'Store in a cool, dry place away from heat sources',
      },
    ],
    laboratory_id: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    scheduleType: 'recurring',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      startDate: '2025-01-01T00:00:00Z',
    },
    assignedTo: [2, 3], // Technician users
    assignedToNames: ['Maria Silva', 'João Santos'],
    createdBy: 1,
    createdByName: 'Dr. Ana Coordinator',
  },
  {
    id: 2,
    name: 'Medium Sterilization',
    description: 'Standard protocol for sterilizing culture medium using autoclave',
    materials: [
      {
        id: 3,
        productId: 3, // Culture Medium
        productName: 'LB Broth',
        quantity: 1000,
        unit: 'mL',
      },
    ],
    equipment: [
      {
        id: 2,
        equipmentId: 1, // Autoclave
        equipmentName: 'Autoclave A1',
        estimatedDuration: 60,
        required: true,
      },
      {
        id: 3,
        equipmentId: 2, // Incubator
        equipmentName: 'Incubator B2',
        estimatedDuration: 15,
        required: false,
      },
    ],
    steps: [
      {
        id: 6,
        order: 1,
        description: 'Prepare culture medium according to manufacturer instructions',
      },
      {
        id: 7,
        order: 2,
        description: 'Pour medium into autoclavable containers',
        notes: 'Fill only 2/3 of container capacity',
      },
      {
        id: 8,
        order: 3,
        description: 'Close containers loosely to allow steam escape',
      },
      {
        id: 9,
        order: 4,
        description: 'Place containers in autoclave',
      },
      {
        id: 10,
        order: 5,
        description: 'Autoclave at 121°C for 20 minutes',
      },
      {
        id: 11,
        order: 6,
        description: 'Allow to cool before removing from autoclave',
        notes: 'Wait at least 15 minutes',
      },
      {
        id: 12,
        order: 7,
        description: 'Tighten container lids once cooled',
      },
      {
        id: 13,
        order: 8,
        description: 'Store sterilized medium in designated area',
      },
    ],
    laboratory_id: 1,
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    scheduleType: 'template', // Manual execution only
    assignedTo: [],
    assignedToNames: [],
    createdBy: 1,
    createdByName: 'Dr. Ana Coordinator',
  },
  {
    id: 3,
    name: 'Chemistry 101 - Lab Class Preparation',
    description: 'Prepare materials and equipment for Organic Chemistry lab class on Jan 25th',
    materials: [
      {
        id: 4,
        productId: 1,
        productName: 'Ethanol 96%',
        quantity: 500,
        unit: 'mL',
      },
      {
        id: 5,
        productId: 7,
        productName: 'Sodium Chloride',
        quantity: 100,
        unit: 'g',
      },
      {
        id: 6,
        productId: 10,
        productName: 'Acetic Acid',
        quantity: 200,
        unit: 'mL',
      },
    ],
    equipment: [
      {
        id: 4,
        equipmentId: 1, // PCR Thermocycler
        equipmentName: 'PCR Thermocycler',
        estimatedDuration: 120,
        required: true,
      },
      {
        id: 5,
        equipmentId: 3, // Spectrophotometer
        equipmentName: 'Spectrophotometer',
        estimatedDuration: 30,
        required: true,
      },
    ],
    steps: [
      {
        id: 14,
        order: 1,
        description: 'Set up 15 workstations with beakers and stirring rods',
        notes: 'One workstation per student pair',
      },
      {
        id: 15,
        order: 2,
        description: 'Prepare reagent bottles with measured quantities',
      },
      {
        id: 16,
        order: 3,
        description: 'Check all equipment is functional and calibrated',
      },
      {
        id: 17,
        order: 4,
        description: 'Print and distribute lab procedure handouts',
      },
      {
        id: 18,
        order: 5,
        description: 'Verify safety equipment is available at each station',
        notes: 'Goggles, gloves, and lab coats',
      },
    ],
    laboratory_id: 1,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    scheduleType: 'one_time',
    deadline: '2025-01-25T08:00:00Z', // Must be ready by 8 AM on Jan 25th
    assignedTo: [2, 3], // Assigned to technicians
    assignedToNames: ['Maria Silva', 'João Santos'],
    createdBy: 4, // Created by a teacher/coordinator
    createdByName: 'Prof. Carlos Teacher',
  },
]

// Mock executions
export const mockExecutions: RoutineExecution[] = [
  {
    id: 1,
    routineId: 1,
    routineName: '70% Alcohol Preparation',
    executedBy: 1,
    executedByName: 'John Coordinator',
    startedAt: '2024-11-10T09:00:00Z',
    completedAt: '2024-11-10T09:30:00Z',
    status: 'completed',
    stepCompletions: [
      {
        stepId: 1,
        stepDescription: 'Measure 700mL of 99% ethanol using a graduated cylinder',
        completed: true,
        completedAt: '2024-11-10T09:05:00Z',
      },
      {
        stepId: 2,
        stepDescription: 'Measure 300mL of distilled water',
        completed: true,
        completedAt: '2024-11-10T09:10:00Z',
      },
      {
        stepId: 3,
        stepDescription: 'Mix ethanol and water in a clean container',
        completed: true,
        completedAt: '2024-11-10T09:15:00Z',
      },
      {
        stepId: 4,
        stepDescription: 'Label the container with date and concentration',
        completed: true,
        completedAt: '2024-11-10T09:20:00Z',
      },
      {
        stepId: 5,
        stepDescription: 'Store in a cool, dry place away from heat sources',
        completed: true,
        completedAt: '2024-11-10T09:30:00Z',
      },
    ],
    materialDeductions: [
      {
        productId: 1,
        productName: 'Ethanol 99%',
        quantityDeducted: 700,
        unit: 'mL',
      },
      {
        productId: 2,
        productName: 'Distilled Water',
        quantityDeducted: 300,
        unit: 'mL',
      },
    ],
    laboratory_id: 1,
  },
  {
    id: 2,
    routineId: 2,
    routineName: 'Medium Sterilization',
    executedBy: 2,
    executedByName: 'Jane Technician',
    startedAt: '2024-11-12T14:00:00Z',
    completedAt: '2024-11-12T15:30:00Z',
    status: 'completed',
    stepCompletions: [
      {
        stepId: 6,
        stepDescription: 'Prepare culture medium according to manufacturer instructions',
        completed: true,
        completedAt: '2024-11-12T14:10:00Z',
      },
      {
        stepId: 7,
        stepDescription: 'Pour medium into autoclavable containers',
        completed: true,
        completedAt: '2024-11-12T14:20:00Z',
      },
      {
        stepId: 8,
        stepDescription: 'Close containers loosely to allow steam escape',
        completed: true,
        completedAt: '2024-11-12T14:25:00Z',
      },
      {
        stepId: 9,
        stepDescription: 'Place containers in autoclave',
        completed: true,
        completedAt: '2024-11-12T14:30:00Z',
      },
      {
        stepId: 10,
        stepDescription: 'Autoclave at 121°C for 20 minutes',
        completed: true,
        completedAt: '2024-11-12T14:50:00Z',
      },
      {
        stepId: 11,
        stepDescription: 'Allow to cool before removing from autoclave',
        completed: true,
        completedAt: '2024-11-12T15:05:00Z',
      },
      {
        stepId: 12,
        stepDescription: 'Tighten container lids once cooled',
        completed: true,
        completedAt: '2024-11-12T15:10:00Z',
      },
      {
        stepId: 13,
        stepDescription: 'Store sterilized medium in designated area',
        completed: true,
        completedAt: '2024-11-12T15:30:00Z',
      },
    ],
    materialDeductions: [
      {
        productId: 3,
        productName: 'LB Broth',
        quantityDeducted: 1000,
        unit: 'mL',
      },
    ],
    laboratory_id: 1,
  },
]

// CRUD operations
export async function mockGetRoutines(laboratoryId: number): Promise<Routine[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockRoutines.filter((r) => r.laboratory_id === laboratoryId)
}

export async function mockGetRoutineById(
  id: number,
  laboratoryId: number
): Promise<Routine | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockRoutines.find((r) => r.id === id && r.laboratory_id === laboratoryId) || null
}

export async function mockAddRoutine(
  data: CreateRoutineRequest,
  laboratoryId: number
): Promise<Routine> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newRoutine: Routine = {
    id: ++routineIdCounter,
    name: data.name,
    description: data.description,
    materials: data.materials.map((m, index) => {
      const product = mockProducts.find((p) => p.id === m.productId)
      return {
        id: Date.now() + index,
        productId: m.productId,
        productName: product?.name || 'Unknown Product',
        quantity: m.quantity,
        unit: product?.unit || 'units',
      }
    }),
    equipment: data.equipment.map((e, index) => {
      const equip = mockEquipment.find((eq) => eq.id === e.equipmentId)
      return {
        id: Date.now() + index + 1000,
        equipmentId: e.equipmentId,
        equipmentName: equip?.name || 'Unknown Equipment',
        estimatedDuration: e.estimatedDuration,
        required: e.required,
      }
    }),
    steps: data.steps.map((s, index) => ({
      id: Date.now() + index + 2000,
      order: s.order,
      description: s.description,
      notes: s.notes,
    })),
    laboratory_id: laboratoryId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scheduleType: data.scheduleType,
    recurrence: data.recurrence,
    deadline: data.deadline,
    assignedTo: data.assignedTo || [],
    assignedToNames: [], // Would be populated from user service in real implementation
    createdBy: 1, // Would come from auth context
    createdByName: 'Current User',
  }

  mockRoutines.push(newRoutine)
  return newRoutine
}

export async function mockEditRoutine(
  id: number,
  data: CreateRoutineRequest,
  laboratoryId: number
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = mockRoutines.findIndex((r) => r.id === id && r.laboratory_id === laboratoryId)
  if (index === -1) throw new Error('Routine not found')

  mockRoutines[index] = {
    ...mockRoutines[index],
    name: data.name,
    description: data.description,
    materials: data.materials.map((m, idx) => {
      const product = mockProducts.find((p) => p.id === m.productId)
      return {
        id: mockRoutines[index].materials[idx]?.id || Date.now() + idx,
        productId: m.productId,
        productName: product?.name || 'Unknown Product',
        quantity: m.quantity,
        unit: product?.unit || 'units',
      }
    }),
    equipment: data.equipment.map((e, idx) => {
      const equip = mockEquipment.find((eq) => eq.id === e.equipmentId)
      return {
        id: mockRoutines[index].equipment[idx]?.id || Date.now() + idx + 1000,
        equipmentId: e.equipmentId,
        equipmentName: equip?.name || 'Unknown Equipment',
        estimatedDuration: e.estimatedDuration,
        required: e.required,
      }
    }),
    steps: data.steps.map((s, idx) => ({
      id: mockRoutines[index].steps[idx]?.id || Date.now() + idx + 2000,
      order: s.order,
      description: s.description,
      notes: s.notes,
    })),
    updatedAt: new Date().toISOString(),
  }
}

export async function mockDeleteRoutine(id: number, laboratoryId: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockRoutines.findIndex((r) => r.id === id && r.laboratory_id === laboratoryId)
  if (index !== -1) {
    mockRoutines.splice(index, 1)
  }
}

// Availability check
export async function mockCheckAvailability(
  routineId: number,
  laboratoryId: number
): Promise<AvailabilityCheck> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const routine = mockRoutines.find((r) => r.id === routineId && r.laboratory_id === laboratoryId)
  if (!routine) throw new Error('Routine not found')

  const materialIssues: MaterialIssue[] = []
  const equipmentConflicts: EquipmentConflict[] = []

  // Check material availability
  routine.materials.forEach((material) => {
    const product = mockProducts.find((p) => p.id === material.productId)
    if (product && product.quantity < material.quantity) {
      materialIssues.push({
        productId: material.productId,
        productName: material.productName,
        required: material.quantity,
        available: product.quantity,
        unit: material.unit,
      })
    }
  })

  // Mock equipment conflicts (for demonstration)
  // In real implementation, this would check the equipment calendar
  const hasConflict = Math.random() > 0.8 // 20% chance of conflict
  if (hasConflict && routine.equipment.length > 0) {
    equipmentConflicts.push({
      equipmentId: routine.equipment[0].equipmentId,
      equipmentName: routine.equipment[0].equipmentName,
      conflictTime: 'Tomorrow 14:00-15:00',
      conflictDescription: 'Already scheduled by Dr. Smith',
    })
  }

  return {
    materialsAvailable: materialIssues.length === 0,
    equipmentAvailable: equipmentConflicts.length === 0,
    materialIssues,
    equipmentConflicts,
  }
}

// Execution operations
export async function mockStartExecution(
  routineId: number,
  userId: number,
  laboratoryId: number
): Promise<RoutineExecution> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const routine = mockRoutines.find((r) => r.id === routineId && r.laboratory_id === laboratoryId)
  if (!routine) throw new Error('Routine not found')

  const newExecution: RoutineExecution = {
    id: ++executionIdCounter,
    routineId: routine.id,
    routineName: routine.name,
    executedBy: userId,
    executedByName: 'Current User', // In real app, get from user store
    startedAt: new Date().toISOString(),
    status: 'in_progress',
    stepCompletions: routine.steps.map((step) => ({
      stepId: step.id,
      stepDescription: step.description,
      completed: false,
    })),
    materialDeductions: [],
    laboratory_id: laboratoryId,
  }

  mockExecutions.push(newExecution)
  return newExecution
}

export async function mockUpdateStepCompletion(
  data: UpdateStepCompletionRequest,
  laboratoryId: number
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const execution = mockExecutions.find(
    (e) => e.id === data.executionId && e.laboratory_id === laboratoryId
  )
  if (!execution) throw new Error('Execution not found')

  const stepCompletion = execution.stepCompletions.find((sc) => sc.stepId === data.stepId)
  if (stepCompletion) {
    stepCompletion.completed = data.completed
    stepCompletion.completedAt = data.completed ? new Date().toISOString() : undefined
    stepCompletion.notes = data.notes
  }
}

export async function mockCompleteExecution(
  executionId: number,
  laboratoryId: number
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const execution = mockExecutions.find(
    (e) => e.id === executionId && e.laboratory_id === laboratoryId
  )
  if (!execution) throw new Error('Execution not found')

  const routine = mockRoutines.find((r) => r.id === execution.routineId)
  if (!routine) throw new Error('Routine not found')

  // Mark as completed
  execution.status = 'completed'
  execution.completedAt = new Date().toISOString()

  // Deduct materials from inventory
  execution.materialDeductions = routine.materials.map((material) => {
    const product = mockProducts.find((p) => p.id === material.productId)
    if (product) {
      product.quantity -= material.quantity
    }
    return {
      productId: material.productId,
      productName: material.productName,
      quantityDeducted: material.quantity,
      unit: material.unit,
    }
  })
}

export async function mockCancelExecution(
  executionId: number,
  laboratoryId: number
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const execution = mockExecutions.find(
    (e) => e.id === executionId && e.laboratory_id === laboratoryId
  )
  if (!execution) throw new Error('Execution not found')

  execution.status = 'cancelled'
  execution.completedAt = new Date().toISOString()
}

export async function mockGetExecutionHistory(
  laboratoryId: number,
  routineId?: number
): Promise<RoutineExecution[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let executions = mockExecutions.filter((e) => e.laboratory_id === laboratoryId)

  if (routineId) {
    executions = executions.filter((e) => e.routineId === routineId)
  }

  return executions.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
}

// Get upcoming scheduled routines (next 7 days)
export async function mockGetUpcomingRoutines(
  laboratoryId: number,
  days: number = 7
): Promise<Array<Routine & { dueDate: string; daysUntilDue: number }>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + days)

  const upcomingRoutines: Array<Routine & { dueDate: string; daysUntilDue: number }> = []

  mockRoutines
    .filter((r) => r.laboratory_id === laboratoryId)
    .forEach((routine) => {
      if (routine.scheduleType === 'one_time' && routine.deadline) {
        const deadline = new Date(routine.deadline)
        if (deadline >= now && deadline <= endDate) {
          const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          upcomingRoutines.push({
            ...routine,
            dueDate: routine.deadline,
            daysUntilDue: daysUntil,
          })
        }
      }

      if (routine.scheduleType === 'recurring' && routine.recurrence) {
        // Generate recurring instances for the next 7 days
        const instances = generateRecurringInstances(routine, now, endDate)
        instances.forEach((instance) => {
          const daysUntil = Math.ceil((instance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          upcomingRoutines.push({
            ...routine,
            dueDate: instance.toISOString(),
            daysUntilDue: daysUntil,
          })
        })
      }
    })

  return upcomingRoutines.sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
}

// Helper function to generate recurring routine instances
function generateRecurringInstances(
  routine: Routine,
  startDate: Date,
  endDate: Date
): Date[] {
  if (!routine.recurrence) return []

  const instances: Date[] = []
  const { frequency, interval, daysOfWeek, dayOfMonth, startDate: recurrenceStart } = routine.recurrence

  let currentDate = new Date(Math.max(startDate.getTime(), new Date(recurrenceStart).getTime()))

  while (currentDate <= endDate) {
    if (frequency === 'daily') {
      instances.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + interval)
    } else if (frequency === 'weekly' && daysOfWeek) {
      const currentDay = currentDate.getDay()
      if (daysOfWeek.includes(currentDay)) {
        instances.push(new Date(currentDate))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    } else if (frequency === 'monthly' && dayOfMonth) {
      if (currentDate.getDate() === dayOfMonth) {
        instances.push(new Date(currentDate))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    } else {
      break
    }
  }

  return instances
}
