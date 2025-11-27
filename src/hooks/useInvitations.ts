import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invitationService } from '@/services/invitationService'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import type { CreateInvitationRequest, AcceptInvitationRequest } from '@/types/invitation.types'
import { getErrorMessage } from '@/lib/errors'

/**
 * Get all invitations for the current laboratory
 */
export function useInvitations() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['invitations', laboratoryId],
    queryFn: () => invitationService.getByLaboratory(laboratoryId!),
    enabled: !!laboratoryId,
  })
}

/**
 * Get pending invitations for the current laboratory
 */
export function usePendingInvitations() {
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useQuery({
    queryKey: ['invitations', 'pending', laboratoryId],
    queryFn: () => invitationService.getPending(laboratoryId!),
    enabled: !!laboratoryId,
  })
}

/**
 * Get invitation details by token (for public acceptance page)
 */
export function useInvitationByToken(token: string | null) {
  return useQuery({
    queryKey: ['invitation', 'token', token],
    queryFn: () => invitationService.getByToken(token!),
    enabled: !!token,
  })
}

/**
 * Create a new invitation
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient()
  const laboratoryId = useAuthStore((state) => state.laboratoryId)

  return useMutation({
    mutationFn: (data: CreateInvitationRequest) =>
      invitationService.create(data, laboratoryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      toast.success('Invitation sent successfully!')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to send invitation'))
    },
  })
}

/**
 * Accept an invitation
 */
export function useAcceptInvitation() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) => invitationService.accept(data),
    onSuccess: (response) => {
      // Set authentication after accepting invitation
      setAuth(response.token, response.user)
      toast.success('Welcome to the team!')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to accept invitation'))
    },
  })
}

/**
 * Resend an invitation
 */
export function useResendInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: number) => invitationService.resend(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      toast.success('Invitation resent successfully')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to resend invitation'))
    },
  })
}

/**
 * Cancel an invitation
 */
export function useCancelInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: number) => invitationService.cancel(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      toast.success('Invitation cancelled')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to cancel invitation'))
    },
  })
}

/**
 * Delete an invitation
 */
export function useDeleteInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: number) => invitationService.delete(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      toast.success('Invitation deleted')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to delete invitation'))
    },
  })
}
