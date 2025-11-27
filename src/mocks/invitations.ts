import type {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  InvitationDetails,
} from '@/types/invitation.types'

let mockInvitationStore: Invitation[] = [
  {
    id: 1,
    laboratoryId: 1,
    laboratoryName: 'Main Research Lab',
    email: 'new.researcher@example.com',
    role: 'student',
    invitedBy: 1,
    invitedByName: 'Dr. Sarah Chen',
    token: 'inv_mock_token_abc123',
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 2,
    laboratoryId: 1,
    laboratoryName: 'Main Research Lab',
    email: 'tech.specialist@example.com',
    role: 'technician',
    invitedBy: 1,
    invitedByName: 'Dr. Sarah Chen',
    token: 'inv_mock_token_def456',
    status: 'pending',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    laboratoryId: 1,
    laboratoryName: 'Main Research Lab',
    email: 'accepted.user@example.com',
    role: 'student',
    invitedBy: 1,
    invitedByName: 'Dr. Sarah Chen',
    token: 'inv_mock_token_ghi789',
    status: 'accepted',
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

let nextInvitationId = mockInvitationStore.length + 1

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const delay = <T>(value: T, timeout = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(clone(value)), timeout))

const generateToken = (): string => {
  return `inv_mock_token_${Math.random().toString(36).substring(2, 15)}`
}

export async function mockGetLaboratoryInvitations(
  laboratoryId: number
): Promise<Invitation[]> {
  const invitations = mockInvitationStore.filter(
    (inv) => inv.laboratoryId === laboratoryId
  )
  return delay(invitations)
}

export async function mockGetPendingInvitations(laboratoryId: number): Promise<Invitation[]> {
  const invitations = mockInvitationStore.filter(
    (inv) => inv.laboratoryId === laboratoryId && inv.status === 'pending'
  )
  return delay(invitations)
}

export async function mockGetInvitationByToken(token: string): Promise<InvitationDetails | null> {
  const invitation = mockInvitationStore.find((inv) => inv.token === token)

  if (!invitation) {
    return delay(null)
  }

  // Check if expired
  if (new Date(invitation.expiresAt) < new Date()) {
    invitation.status = 'expired'
  }

  const details: InvitationDetails = {
    invitation,
    laboratoryName: invitation.laboratoryName || 'Main Research Lab',
    invitedByName: invitation.invitedByName || 'Lab Coordinator',
  }

  return delay(details)
}

export async function mockCreateInvitation(
  data: CreateInvitationRequest,
  laboratoryId: number,
  invitedBy: number
): Promise<Invitation> {
  const newInvitation: Invitation = {
    id: nextInvitationId++,
    laboratoryId,
    laboratoryName: 'Main Research Lab',
    email: data.email,
    role: data.role,
    invitedBy,
    invitedByName: 'Current User',
    token: generateToken(),
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: new Date().toISOString(),
  }

  mockInvitationStore = [...mockInvitationStore, newInvitation]
  return delay(newInvitation)
}

export async function mockAcceptInvitation(
  data: AcceptInvitationRequest
): Promise<{ message: string; user: any; token: string }> {
  const invitation = mockInvitationStore.find((inv) => inv.token === data.token)

  if (!invitation) {
    throw new Error('Invitation not found')
  }

  if (invitation.status !== 'pending') {
    throw new Error('Invitation is no longer valid')
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    invitation.status = 'expired'
    throw new Error('Invitation has expired')
  }

  // Mark as accepted
  invitation.status = 'accepted'
  invitation.acceptedAt = new Date().toISOString()

  // Create mock user
  const newUser = {
    id: Math.floor(Math.random() * 10000),
    clerkUserId: `user_${Math.random().toString(36).substring(2, 15)}`,
    email: invitation.email,
    firstName: data.firstName,
    lastName: data.lastName,
    laboratoryId: invitation.laboratoryId,
    role: invitation.role,
  }

  return delay({
    message: 'Invitation accepted successfully',
    user: newUser,
    token: `mock_jwt_token_${Math.random().toString(36).substring(2, 15)}`,
  })
}

export async function mockResendInvitation(invitationId: number): Promise<string> {
  const invitation = mockInvitationStore.find((inv) => inv.id === invitationId)

  if (!invitation) {
    throw new Error('Invitation not found')
  }

  if (invitation.status !== 'pending') {
    throw new Error('Can only resend pending invitations')
  }

  // Update token and expiry
  invitation.token = generateToken()
  invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  return delay('Invitation resent successfully')
}

export async function mockCancelInvitation(invitationId: number): Promise<void> {
  const index = mockInvitationStore.findIndex((inv) => inv.id === invitationId)

  if (index === -1) {
    throw new Error('Invitation not found')
  }

  mockInvitationStore[index].status = 'cancelled'
  await delay(null)
}

export async function mockDeleteInvitation(invitationId: number): Promise<void> {
  const index = mockInvitationStore.findIndex((inv) => inv.id === invitationId)

  if (index === -1) {
    throw new Error('Invitation not found')
  }

  mockInvitationStore.splice(index, 1)
  await delay(null)
}

// Export for use in other mocks
export const mockInvitations = mockInvitationStore
