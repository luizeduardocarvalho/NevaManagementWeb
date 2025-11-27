import type { UserRole } from './auth.types'

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

export interface Invitation {
  id: number
  laboratoryId: number
  laboratoryName?: string
  email: string
  role: UserRole
  invitedBy: number
  invitedByName?: string
  token: string
  status: InvitationStatus
  expiresAt: string
  createdAt: string
  acceptedAt?: string
}

export interface CreateInvitationRequest {
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
}

export interface AcceptInvitationRequest {
  token: string
  firstName: string
  lastName: string
  password: string
}

export interface InvitationDetails {
  invitation: Invitation
  laboratoryName: string
  invitedByName: string
}
