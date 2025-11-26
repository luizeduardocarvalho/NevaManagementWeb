import { useState } from 'react'
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
import { useLocations } from '@/hooks/useLocations'
import { useResearchers } from '@/hooks/useResearchers'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { CreateSampleRequest } from '@/types/sample.types'

interface SampleFormProps {
  initialData?: Partial<CreateSampleRequest>
  onSubmit: (data: CreateSampleRequest) => void
  isSubmitting: boolean
  submitLabel: string
}

export function SampleForm({ initialData, onSubmit, isSubmitting, submitLabel }: SampleFormProps) {
  const { t } = useTranslation('samples')
  const { t: tCommon } = useTranslation('common')
  const { data: locations, isLoading: locationsLoading } = useLocations()
  const { data: researchers, isLoading: researchersLoading } = useResearchers()

  const [formData, setFormData] = useState<CreateSampleRequest>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    origin: initialData?.origin || '',
    isolationDate: initialData?.isolationDate || '',
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    subcultureMedium: initialData?.subcultureMedium || '',
    subcultureIntervalDays: initialData?.subcultureIntervalDays || 30,
    researcherId: initialData?.researcherId || undefined as any,
    locationId: initialData?.locationId || undefined as any,
    tags: initialData?.tags || [],
  })

  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          {t('fields.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('fields.namePlaceholder')}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('fields.description')}</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={t('fields.descriptionPlaceholder')}
        />
      </div>

      {/* Origin */}
      <div className="space-y-2">
        <Label htmlFor="origin">
          {t('fields.origin')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="origin"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          placeholder={t('fields.originPlaceholder')}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Isolation Date */}
      <div className="space-y-2">
        <Label htmlFor="isolationDate">
          {t('fields.isolationDate')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="isolationDate"
          type="date"
          value={formData.isolationDate ? formData.isolationDate.split('T')[0] : ''}
          onChange={(e) =>
            setFormData({ ...formData, isolationDate: new Date(e.target.value).toISOString() })
          }
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Geographic Coordinates */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude">{t('fields.latitude')}</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })
            }
            placeholder={t('fields.latitudePlaceholder')}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">{t('fields.longitude')}</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })
            }
            placeholder={t('fields.longitudePlaceholder')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Subculture Medium */}
      <div className="space-y-2">
        <Label htmlFor="subcultureMedium">
          {t('fields.subcultureMedium')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="subcultureMedium"
          value={formData.subcultureMedium}
          onChange={(e) => setFormData({ ...formData, subcultureMedium: e.target.value })}
          placeholder={t('fields.subcultureMediumPlaceholder')}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Subculture Interval */}
      <div className="space-y-2">
        <Label htmlFor="subcultureIntervalDays">
          {t('fields.subcultureInterval')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="subcultureIntervalDays"
          type="number"
          min="1"
          value={formData.subcultureIntervalDays}
          onChange={(e) =>
            setFormData({ ...formData, subcultureIntervalDays: parseInt(e.target.value) })
          }
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">{t('fields.subcultureIntervalHelp')}</p>
      </div>

      {/* Researcher */}
      <div className="space-y-2">
        <Label htmlFor="researcher">
          {t('fields.researcher')} <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.researcherId ? String(formData.researcherId) : undefined}
          onValueChange={(value) => {
            const researcherId = parseInt(value)
            if (!isNaN(researcherId)) {
              setFormData({ ...formData, researcherId })
            }
          }}
          disabled={researchersLoading || isSubmitting}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={researchersLoading ? tCommon('loading') : t('fields.selectResearcher')}
            />
          </SelectTrigger>
          <SelectContent>
            {researchers && researchers.length > 0 ? (
              researchers.map((researcher) => {
                const displayName = `${researcher.first_name || ''} ${researcher.last_name || ''}`.trim() ||
                                   `Researcher #${researcher.id}`
                return (
                  <SelectItem key={researcher.id} value={String(researcher.id)}>
                    {displayName}
                  </SelectItem>
                )
              })
            ) : (
              <SelectItem value="no-researchers" disabled>
                {t('fields.noResearchers') || 'No researchers available'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">
          {tCommon('fields.location')} <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.locationId ? String(formData.locationId) : undefined}
          onValueChange={(value) => {
            const locationId = parseInt(value)
            if (!isNaN(locationId)) {
              setFormData({ ...formData, locationId })
            }
          }}
          disabled={locationsLoading || isSubmitting}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={locationsLoading ? tCommon('loading') : tCommon('fields.selectLocation')}
            />
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

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">{t('fields.tags')}</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder={t('fields.tagsPlaceholder')}
            disabled={isSubmitting}
          />
          <Button type="button" variant="outline" onClick={addTag} disabled={isSubmitting}>
            {tCommon('actions.add')}
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isSubmitting}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{t('fields.tagsHelp')}</p>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {tCommon('actions.saving')}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
