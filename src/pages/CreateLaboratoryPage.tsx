import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/shared/Spinner'
import { laboratoryService } from '@/services/laboratoryService'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { Building2 } from 'lucide-react'
import type { CreateLaboratoryRequest } from '@/types/laboratory.types'

export function CreateLaboratoryPage() {
  const navigate = useNavigate()
  const updateUser = useAuthStore((state) => state.updateUser)
  const user = useAuthStore((state) => state.user)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateLaboratoryRequest>({
    name: '',
    description: '',
    address: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Laboratory name is required')
      return
    }

    setIsSubmitting(true)

    try {
      const laboratory = await laboratoryService.create(formData)

      // Update user with new laboratory ID
      if (user) {
        const updatedUser = { ...user, laboratoryId: laboratory.id }
        updateUser(updatedUser)
      }

      toast.success('Laboratory created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to create laboratory:', error)
      toast.error('Failed to create laboratory. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to LabFlux!</CardTitle>
          <CardDescription className="text-base">
            Let's set up your laboratory to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Laboratory Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Main Research Lab"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your laboratory"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Laboratory physical address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creating Laboratory...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Create Laboratory
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
