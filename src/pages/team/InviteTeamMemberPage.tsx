import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { useCreateInvitation } from '@/hooks/useInvitations'
import { ArrowLeft, Mail, Send, UserPlus } from 'lucide-react'
import type { CreateInvitationRequest } from '@/types/invitation.types'
import type { UserRole } from '@/types/auth.types'

export function InviteTeamMemberPage() {
  const navigate = useNavigate()
  const createInvitation = useCreateInvitation()
  const [formData, setFormData] = useState<CreateInvitationRequest>({
    email: '',
    role: 'student',
    firstName: '',
    lastName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      return
    }

    await createInvitation.mutateAsync(formData)

    // Reset form
    setFormData({
      email: '',
      role: 'student',
      firstName: '',
      lastName: '',
    })

    // Navigate to invitations list
    setTimeout(() => {
      navigate('/team/invitations')
    }, 1000)
  }

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'student',
      label: 'Student',
      description: 'Can view and use lab resources',
    },
    {
      value: 'technician',
      label: 'Technician',
      description: 'Can manage equipment and products',
    },
    {
      value: 'coordinator',
      label: 'Coordinator',
      description: 'Full administrative access',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/team/invitations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Invite Team Member</h1>
          <p className="text-muted-foreground mt-1">
            Send an invitation to join your laboratory
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Team Member Details
          </CardTitle>
          <CardDescription>
            Enter the email address and role for the new team member. They'll receive an
            invitation link to create their account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@university.edu"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={createInvitation.isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name (Optional)</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={createInvitation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name (Optional)</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={createInvitation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                disabled={createInvitation.isPending}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createInvitation.isPending || !formData.email}
              >
                {createInvitation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
              <Link to="/team/invitations">
                <Button type="button" variant="outline" disabled={createInvitation.isPending}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. An invitation email will be sent to the provided address</p>
          <p>2. The recipient will receive a secure link to create their account</p>
          <p>3. Once they sign up, they'll be automatically added to your laboratory</p>
          <p>4. The invitation link expires after 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
