import { useParams, useNavigate } from 'react-router-dom'
import { useEquipmentById, useUseEquipment } from '@/hooks/useEquipment'
import { useResearchers } from '@/hooks/useResearchers'
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
import { Calendar } from 'lucide-react'
import { useState } from 'react'
import type { UseEquipmentRequest } from '@/types/equipment.types'

export function UseEquipmentPage() {
  const { id } = useParams<{ id: string }>()
  const equipmentId = parseInt(id!)
  const navigate = useNavigate()

  const { data: equipment, isLoading, error } = useEquipmentById(equipmentId)
  const { data: researchers, isLoading: researchersLoading } = useResearchers()
  const useEquipmentMutation = useUseEquipment()

  const [formData, setFormData] = useState({
    researcherId: 0,
    description: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: UseEquipmentRequest = {
      equipmentId,
      researcherId: formData.researcherId,
      description: formData.description || undefined,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    }

    await useEquipmentMutation.mutateAsync(data)
    navigate(`/equipment/${equipmentId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load equipment</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Schedule Equipment Usage</h1>
        <p className="text-muted-foreground mt-2">{equipment.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Usage Details
          </CardTitle>
          <CardDescription>
            Schedule when you'll be using this equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="researcher">
                Researcher <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.researcherId ? String(formData.researcherId) : ''}
                onValueChange={(value) => setFormData({ ...formData, researcherId: parseInt(value) })}
                disabled={researchersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={researchersLoading ? 'Loading...' : 'Select researcher'} />
                </SelectTrigger>
                <SelectContent>
                  {researchers?.map((researcher) => (
                    <SelectItem key={researcher.id} value={String(researcher.id)}>
                      {researcher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={useEquipmentMutation.isPending}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="What will you be doing with this equipment?"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  disabled={useEquipmentMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  disabled={useEquipmentMutation.isPending}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/equipment/${equipmentId}`)}
                disabled={useEquipmentMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={useEquipmentMutation.isPending}>
                {useEquipmentMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule Usage'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
