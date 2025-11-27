import type {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  InvitationDetails,
} from '@/types/invitation.types'
import api from './api'
import {
  mockGetLaboratoryInvitations,
  mockGetPendingInvitations,
  mockGetInvitationByToken,
  mockCreateInvitation,
  mockAcceptInvitation,
  mockResendInvitation,
  mockCancelInvitation,
  mockDeleteInvitation,
} from '@/mocks/invitations'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export const invitationService = {
  /**
   * Get all invitations for a laboratory
   */
  getByLaboratory: async (laboratoryId: number): Promise<Invitation[]> => {
    if (USE_MOCK) {
      return mockGetLaboratoryInvitations(laboratoryId)
    }

    const response = await api.get('/invitations', {
      params: { laboratory_id: laboratoryId },
    })
    return response.data
  },

  /**
   * Get pending invitations for a laboratory
   */
  getPending: async (laboratoryId: number): Promise<Invitation[]> => {
    if (USE_MOCK) {
      return mockGetPendingInvitations(laboratoryId)
    }

    const response = await api.get('/invitations/pending', {
      params: { laboratory_id: laboratoryId },
    })
    return response.data
  },

  /**
   * Get invitation details by token (for public acceptance page)
   */
  getByToken: async (token: string): Promise<InvitationDetails | null> => {
    if (USE_MOCK) {
      return mockGetInvitationByToken(token)
    }

    const response = await api.get(`/invitations/token/${token}`)
    return response.data
  },

  /**
   * Create a new invitation (coordinator only)
   */
  create: async (
    data: CreateInvitationRequest,
    laboratoryId: number
  ): Promise<Invitation> => {
    if (USE_MOCK) {
      // In mock mode, we'll use a fake invitedBy ID
      return mockCreateInvitation(data, laboratoryId, 1)
    }

    const response = await api.post('/invitations', {
      ...data,
      laboratory_id: laboratoryId,
    })
    return response.data
  },

  /**
   * Accept an invitation and create user account
   */
  accept: async (
    data: AcceptInvitationRequest
  ): Promise<{ message: string; user: any; token: string }> => {
    if (USE_MOCK) {
      return mockAcceptInvitation(data)
    }

    const response = await api.post('/invitations/accept', data)
    return response.data
  },

  /**
   * Resend invitation email
   */
  resend: async (invitationId: number): Promise<string> => {
    if (USE_MOCK) {
      return mockResendInvitation(invitationId)
    }

    const response = await api.post(`/invitations/${invitationId}/resend`)
    return response.data.message
  },

  /**
   * Cancel an invitation
   */
  cancel: async (invitationId: number): Promise<void> => {
    if (USE_MOCK) {
      return mockCancelInvitation(invitationId)
    }

    await api.post(`/invitations/${invitationId}/cancel`)
  },

  /**
   * Delete an invitation
   */
  delete: async (invitationId: number): Promise<void> => {
    if (USE_MOCK) {
      return mockDeleteInvitation(invitationId)
    }

    await api.delete(`/invitations/${invitationId}`)
  },
}
