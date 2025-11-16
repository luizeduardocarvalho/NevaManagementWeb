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
import type { CreateProductRequest } from '@/types/product.types'

interface ProductFormProps {
  initialData?: Partial<CreateProductRequest>
  onSubmit: (data: CreateProductRequest) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Product',
}: ProductFormProps) {
  const { data: locations, isLoading: locationsLoading } = useLocations()

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    location_id: initialData?.location_id || 0,
    quantity: initialData?.quantity || 0,
    formula: initialData?.formula || '',
    unit: initialData?.unit || '',
    expiration_date: initialData?.expiration_date || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Product Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isSubmitting}
          placeholder="e.g., Ethanol 70%"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Optional description..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="formula">Formula / Composition</Label>
        <Input
          id="formula"
          value={formData.formula}
          onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
          disabled={isSubmitting}
          placeholder="e.g., C2H5OH"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">
            Unit <span className="text-destructive">*</span>
          </Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            required
            disabled={isSubmitting}
            placeholder="e.g., mL, g, units"
          />
        </div>
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

      <div className="space-y-2">
        <Label htmlFor="expiration_date">
          Expiration Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="expiration_date"
          type="date"
          value={formData.expiration_date}
          onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
          required
          disabled={isSubmitting}
        />
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
