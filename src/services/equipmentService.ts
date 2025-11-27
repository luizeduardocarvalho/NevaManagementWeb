import type {
  SimpleEquipment,
  DetailedEquipment,
  CreateEquipmentRequest,
  EditEquipmentRequest,
  EquipmentUsageRecord,
  UseEquipmentRequest,
  CalendarMonth,
  EquipmentOverlapCheck,
} from '@/types/equipment.types'
import api from './api'
import { AxiosError } from 'axios'

export const equipmentService = {
  getAll: async (
    page = 1,
    pageSize = 9
  ): Promise<{ equipment: SimpleEquipment[]; nextPage: number | null; totalCount: number }> => {
    try {
      const response = await api.get('/equipment', {
        params: { page, pageSize },
      })
      const data = response.data
      return {
        equipment: Array.isArray(data?.equipment) ? data.equipment : [],
        nextPage: data?.nextPage ?? null,
        totalCount: data?.totalCount ?? 0,
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return {
          equipment: [],
          nextPage: null,
          totalCount: 0,
        }
      }
      throw error
    }
  },

  getById: async (id: number): Promise<DetailedEquipment> => {
    const response = await api.get(`/equipment/${id}`)
    if (!response.data) {
      throw new Error('Equipment not found')
    }
    return response.data
  },

  create: async (data: CreateEquipmentRequest): Promise<string> => {
    const response = await api.post('/equipment', data)
    return response.data.message || 'Equipment created successfully'
  },

  edit: async (data: EditEquipmentRequest): Promise<string> => {
    const response = await api.put(`/equipment/${data.id}`, data)
    return response.data.message || 'Equipment updated successfully'
  },

  useEquipment: async (data: UseEquipmentRequest): Promise<string> => {
    const response = await api.post(`/equipment/${data.equipmentId}/use`, {
      researcher_id: data.researcherId,
      description: data.description,
      start_date: data.startDate,
      end_date: data.endDate,
    })
    return response.data.message || 'Equipment usage recorded successfully'
  },

  getUsageHistory: async (
    equipmentId: number,
    page = 1,
    pageSize = 10
  ): Promise<{ usages: EquipmentUsageRecord[]; nextPage: number | null; totalCount: number }> => {
    const response = await api.get(`/equipment/${equipmentId}/usage-history`, {
      params: { page, pageSize },
    })
    const data = response.data
    return {
      usages: Array.isArray(data?.usages) ? data.usages : [],
      nextPage: data?.nextPage ?? null,
      totalCount: data?.totalCount ?? 0,
    }
  },

  getCalendar: async (equipmentId: number, year: number, month: number): Promise<CalendarMonth> => {
    const response = await api.get(`/equipment/${equipmentId}/calendar`, {
      params: { year, month },
    })
    return response.data
  },

  delete: async (equipmentId: number): Promise<void> => {
    await api.delete(`/equipment/${equipmentId}`)
  },

  checkOverlap: async (
    equipmentId: number,
    startDate: string,
    endDate: string,
    excludeUsageId?: number
  ): Promise<EquipmentOverlapCheck> => {
    const response = await api.get(`/equipment/${equipmentId}/check-overlap`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        exclude_usage_id: excludeUsageId,
      },
    })
    return response.data
  },
}
