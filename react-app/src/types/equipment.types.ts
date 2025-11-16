import type { Location } from './location.types'

export interface SimpleEquipment {
  id: number
  name: string
}

export interface DetailedEquipment {
  id: number
  name: string
  description: string
  propertyNumber: string
  location: Location
  location_id: number
  laboratory_id: number
}

export interface CreateEquipmentRequest {
  name: string
  description: string
  propertyNumber: string
  location_id: number
}

export interface EditEquipmentRequest extends CreateEquipmentRequest {
  id: number
}

export interface SimpleResearcher {
  id: number
  name: string
}

export interface EquipmentUsageRecord {
  id: number
  equipmentId: number
  researcher: SimpleResearcher
  description: string | null
  startDate: string
  endDate: string
}

export interface UseEquipmentRequest {
  equipmentId: number
  researcherId: number
  description?: string
  startDate: string
  endDate: string
}

export interface CalendarAppointment {
  id: number
  startDate: string
  endDate: string
  researcher: SimpleResearcher
  description: string | null
}

export interface CalendarDay {
  dayNumber: number
  appointments: CalendarAppointment[]
}

export interface CalendarMonth {
  month: number
  year: number
  days: CalendarDay[]
}
