import type {
  SimpleEquipment,
  DetailedEquipment,
  CreateEquipmentRequest,
  EditEquipmentRequest,
  EquipmentUsageRecord,
  UseEquipmentRequest,
  CalendarMonth,
} from '@/types/equipment.types'
import {
  mockGetEquipment,
  mockGetDetailedEquipment,
  mockCreateEquipment,
  mockEditEquipment,
  mockUseEquipment,
  mockGetEquipmentUsageHistory,
  mockGetEquipmentCalendar,
} from '@/mocks/equipment'

export const equipmentService = {
  getAll: async (
    laboratoryId: number,
    page = 1,
    pageSize = 9
  ): Promise<{ equipment: SimpleEquipment[]; nextPage: number | null; totalCount: number }> => {
    void laboratoryId
    return mockGetEquipment(page, pageSize)
  },

  getById: async (id: number, laboratoryId: number): Promise<DetailedEquipment> => {
    void laboratoryId
    return mockGetDetailedEquipment(id)
  },

  create: async (data: CreateEquipmentRequest): Promise<string> => {
    return mockCreateEquipment(data)
  },

  edit: async (data: EditEquipmentRequest): Promise<string> => {
    return mockEditEquipment(data)
  },

  useEquipment: async (data: UseEquipmentRequest): Promise<string> => {
    return mockUseEquipment(data)
  },

  getUsageHistory: async (
    equipmentId: number,
    page = 1,
    pageSize = 10
  ): Promise<{ usages: EquipmentUsageRecord[]; nextPage: number | null; totalCount: number }> => {
    return mockGetEquipmentUsageHistory(equipmentId, page, pageSize)
  },

  getCalendar: async (equipmentId: number, year: number, month: number): Promise<CalendarMonth> => {
    return mockGetEquipmentCalendar(equipmentId, year, month)
  },
}
