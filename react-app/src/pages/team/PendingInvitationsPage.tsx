import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/shared/Spinner'
import {
  usePendingInvitations,
  useResendInvitation,
  useCancelInvitation,
} from '@/hooks/useInvitations'
import { Mail, RefreshCw, X, UserPlus, Clock, Calendar } from 'lucide-react'
import { formatDistanceToNow, format, isPast } from 'date-fns'
import type { Invitation } from '@/types/invitation.types'

function InvitationCard({ invitation }: { invitation: Invitation }) {
  const resendInvitation = useResendInvitation()
  const cancelInvitation = useCancelInvitation()

  const isExpired = isPast(new Date(invitation.expiresAt))

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'coordinator':
        return 'default'
      case 'technician':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{invitation.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant={getRoleBadgeVariant(invitation.role)}>
                    {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                  </Badge>
                  {isExpired && (
                    <Badge variant="destructive" className="text-xs">
                      Expired
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Sent {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires {format(new Date(invitation.expiresAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resendInvitation.mutate(invitation.id)}
              disabled={resendInvitation.isPending || isExpired}
            >
              {resendInvitation.isPending ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Resend
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={cancelInvitation.isPending}
                >
                  <X className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Invitation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will invalidate the invitation link sent to {invitation.email}. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => cancelInvitation.mutate(invitation.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Cancel Invitation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PendingInvitationsPage() {
  const { data: invitations, isLoading } = usePendingInvitations()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  const pendingInvitations = invitations?.filter((inv) => inv.status === 'pending') || []
  const expiredInvitations = pendingInvitations.filter((inv) =>
    isPast(new Date(inv.expiresAt))
  )
  const activeInvitations = pendingInvitations.filter(
    (inv) => !isPast(new Date(inv.expiresAt))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Invitations</h1>
          <p className="text-muted-foreground mt-1">
            Manage pending invitations to your laboratory
          </p>
        </div>
        <Link to="/team/invite">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingInvitations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activeInvitations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {expiredInvitations.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {pendingInvitations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Pending Invitations</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                You haven't sent any invitations yet. Invite team members to collaborate in your
                laboratory.
              </p>
              <Link to="/team/invite">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send First Invitation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {activeInvitations.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Active Invitations</h2>
                {activeInvitations.map((invitation) => (
                  <InvitationCard key={invitation.id} invitation={invitation} />
                ))}
              </div>
            )}

            {expiredInvitations.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Expired Invitations
                </h2>
                {expiredInvitations.map((invitation) => (
                  <InvitationCard key={invitation.id} invitation={invitation} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
