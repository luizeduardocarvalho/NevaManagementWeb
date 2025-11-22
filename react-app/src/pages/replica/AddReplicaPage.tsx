import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCreateReplica } from '@/hooks/useReplicas'
import { useSampleById } from '@/hooks/useSamples'
import { useLocations } from '@/hooks/useLocations'
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
import { BackArrow } from '@/components/shared/BackArrow'
import { Spinner } from '@/components/shared/Spinner'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CreateReplicaRequest } from '@/types/replica.types'

export function AddReplicaPage() {
  const { t } = useTranslation('samples')
  const { t: tCommon } = useTranslation('common')
  const [searchParams] = useSearchParams()
  const sampleId = parseInt(searchParams.get('sampleId') || '0')
  const navigate = useNavigate()

  const { data: sample, isLoading: sampleLoading } = useSampleById(sampleId)
  const { data: locations, isLoading: locationsLoading } = useLocations()
  const createReplica = useCreateReplica()

  const [formData, setFormData] = useState<CreateReplicaRequest>({
    name: '',
    sampleId: sampleId,
    locationId: 0,
    creationDate: new Date().toISOString(),
    notes: '',
  })

  useEffect(() => {
    if (sample) {
      setFormData((prev) => ({
        ...prev,
        sampleId: sample.id,
      }))
    }
  }, [sample])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createReplica.mutateAsync(formData)
    navigate(`/samples/${sampleId}`)
  }

  if (sampleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!sample) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to={`/samples/${sampleId}`} />

      <div>
        <h1 className="text-3xl font-bold">{t('replicas.addReplica')}</h1>
        <p className="text-muted-foreground mt-2">{sample.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('replicas.replicaDetails')}</CardTitle>
          <CardDescription>{t('replicas.addReplicaDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
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
                placeholder={t('fields.replicaNamePlaceholder')}
                required
                disabled={createReplica.isPending}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                {tCommon('fields.location')} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.locationId ? String(formData.locationId) : ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, locationId: parseInt(value) })
                }
                disabled={locationsLoading || createReplica.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      locationsLoading ? tCommon('loading') : tCommon('fields.selectLocation')
                    }
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

            {/* Creation Date */}
            <div className="space-y-2">
              <Label htmlFor="creationDate">
                {t('fields.creationDate')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="creationDate"
                type="date"
                value={formData.creationDate ? formData.creationDate.split('T')[0] : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creationDate: new Date(e.target.value).toISOString(),
                  })
                }
                required
                disabled={createReplica.isPending}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t('fields.notes')}</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={createReplica.isPending}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t('fields.notesPlaceholder')}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/samples/${sampleId}`)}
                disabled={createReplica.isPending}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={createReplica.isPending}>
                {createReplica.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {tCommon('actions.saving')}
                  </>
                ) : (
                  t('replicas.addReplica')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
