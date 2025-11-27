// Routine template definition
export interface Routine {
  id: number
  name: string
  description: string
  materials: RoutineMaterial[]
  equipment: RoutineEquipment[]
  steps: RoutineStep[]
  laboratory_id: number
  createdAt: string
  updatedAt: string
  // Scheduling fields
  scheduleType: 'one_time' | 'recurring' | 'template' // template = no schedule, manual execution only
  recurrence?: RecurrenceRule // only for recurring routines
  deadline?: string // ISO date for one_time routines
  assignedTo?: number[] // user IDs who should execute this routine
  assignedToNames?: string[] // names for display
  createdBy: number
  createdByName: string
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly'
  interval: number // e.g., every 2 days, every 3 weeks
  daysOfWeek?: number[] // 0-6 for weekly (0=Sunday)
  dayOfMonth?: number // 1-31 for monthly
  startDate: string // ISO date when recurrence starts
  endDate?: string // ISO date when recurrence ends (optional)
}

// Material required for routine
export interface RoutineMaterial {
  id: number
  productId: number
  productName: string
  quantity: number
  unit: string
}

// Equipment required for routine
export interface RoutineEquipment {
  id: number
  equipmentId: number
  equipmentName: string
  estimatedDuration: number // minutes
  required: boolean
}

// Step in routine checklist
export interface RoutineStep {
  id: number
  order: number
  description: string
  notes?: string
}

// Routine execution instance
export interface RoutineExecution {
  id: number
  routineId: number
  routineName: string
  executedBy: number
  executedByName: string
  startedAt: string
  completedAt?: string
  status: 'in_progress' | 'completed' | 'cancelled'
  stepCompletions: StepCompletion[]
  materialDeductions: MaterialDeduction[]
  laboratory_id: number
}

// Individual step completion
export interface StepCompletion {
  stepId: number
  stepDescription: string
  completed: boolean
  completedAt?: string
  notes?: string
}

// Material deducted after completion
export interface MaterialDeduction {
  productId: number
  productName: string
  quantityDeducted: number
  unit: string
}

// Availability check result
export interface AvailabilityCheck {
  materialsAvailable: boolean
  equipmentAvailable: boolean
  materialIssues: MaterialIssue[]
  equipmentConflicts: EquipmentConflict[]
}

export interface MaterialIssue {
  productId: number
  productName: string
  required: number
  available: number
  unit: string
}

export interface EquipmentConflict {
  equipmentId: number
  equipmentName: string
  conflictTime: string
  conflictDescription: string
}

// Request types for creating/editing routines
export interface CreateRoutineRequest {
  name: string
  description: string
  materials: {
    productId: number
    quantity: number
  }[]
  equipment: {
    equipmentId: number
    estimatedDuration: number
    required: boolean
  }[]
  steps: {
    order: number
    description: string
    notes?: string
  }[]
  // Scheduling fields
  scheduleType: 'one_time' | 'recurring' | 'template'
  recurrence?: RecurrenceRule
  deadline?: string
  assignedTo?: number[]
}

export interface EditRoutineRequest extends CreateRoutineRequest {
  id: number
}

// Request for executing a routine
export interface ExecuteRoutineRequest {
  routineId: number
}

// Update step completion
export interface UpdateStepCompletionRequest {
  executionId: number
  stepId: number
  completed: boolean
  notes?: string
}

// Scheduled routine instance (generated from recurring rules or one-time deadlines)
export interface ScheduledRoutine {
  id: number
  routineId: number
  routineName: string
  routineDescription: string
  scheduledDate: string // ISO date when this should be executed
  dueDate: string // ISO date when this is due (same as scheduledDate for daily, end of week for weekly, etc.)
  assignedTo: number[]
  assignedToNames: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'skipped'
  executionId?: number // if already started/completed
  laboratory_id: number
}

// Statistics
export interface RoutineStatistics {
  totalRoutines: number
  routinesByScheduleType: Array<{
    scheduleType: string
    count: number
  }>
  totalExecutions: number
  executionsByStatus: Array<{
    status: string
    count: number
  }>
  completionRate: number
  avgCompletionTime: number // in seconds
  topRoutines: Array<{
    routineId: number
    routineName: string
    count: number
  }>
  recentActivity: {
    last7Days: number
  }
}
