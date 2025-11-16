import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/shared/Spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocations } from '@/hooks/useLocations'
import type { CreateEquipmentRequest } from '@/types/equipment.types'

interface EquipmentFormProps {
  initialData?: Partial<CreateEquipmentRequest>
  onSubmit: (data: CreateEquipmentRequest) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

export function EquipmentForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Equipment',
}: EquipmentFormProps) {
  const { data: locations, isLoading: locationsLoading } = useLocations()

  const [formData, setFormData] = useState<CreateEquipmentRequest>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    propertyNumber: initialData?.propertyNumber || '',
    location_id: initialData?.location_id || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Equipment Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isSubmitting}
          placeholder="e.g., PCR Thermocycler"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyNumber">
          Property Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="propertyNumber"
          value={formData.propertyNumber}
          onChange={(e) => setFormData({ ...formData, propertyNumber: e.target.value })}
          required
          disabled={isSubmitting}
          placeholder="e.g., EQ-2023-001"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          disabled={isSubmitting}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Detailed description of the equipment..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_id">
          Location <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.location_id ? String(formData.location_id) : ''}
          onValueChange={(value) => setFormData({ ...formData, location_id: parseInt(value) })}
          disabled={isSubmitting || locationsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={locationsLoading ? 'Loading locations...' : 'Select a location'} />
          </SelectTrigger>
          <SelectContent>
            {locations?.map((location) => (
              <SelectItem key={location.id} value={String(location.id)}>
                {location.name}
                {location.description && ` - ${location.description}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
