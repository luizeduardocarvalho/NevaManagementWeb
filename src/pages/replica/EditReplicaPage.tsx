import { useParams, useNavigate } from 'react-router-dom'
import { useReplicaById, useEditReplica } from '@/hooks/useReplicas'
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
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { EditReplicaRequest } from '@/types/replica.types'

export function EditReplicaPage() {
  const { t } = useTranslation('samples')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const replicaId = parseInt(id!)
  const navigate = useNavigate()

  const { data: replica, isLoading, error } = useReplicaById(replicaId)
  const { data: locations, isLoading: locationsLoading } = useLocations()
  const editReplica = useEditReplica()

  const [formData, setFormData] = useState<EditReplicaRequest>({
    id: replicaId,
    name: '',
    locationId: 0,
    nextTransferDate: '',
    notes: '',
  })

  useEffect(() => {
    if (replica) {
      setFormData({
        id: replica.id,
        name: replica.name,
        locationId: replica.locationId,
        nextTransferDate: replica.nextTransferDate,
        notes: replica.notes || '',
      })
    }
  }, [replica])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await editReplica.mutateAsync(formData)
    navigate(`/replicas/${replicaId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !replica) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to={`/replicas/${replicaId}`} />

      <div>
        <h1 className="text-3xl font-bold">{t('replicas.editReplica')}</h1>
        <p className="text-muted-foreground mt-2">{replica.sampleName}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('replicas.replicaDetails')}</CardTitle>
          <CardDescription>{t('replicas.editReplicaDescription')}</CardDescription>
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
                required
                disabled={editReplica.isPending}
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
                disabled={locationsLoading || editReplica.isPending}
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

            {/* Next Transfer Date */}
            <div className="space-y-2">
              <Label htmlFor="nextTransferDate">
                {t('fields.nextTransfer')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nextTransferDate"
                type="date"
                value={formData.nextTransferDate ? formData.nextTransferDate.split('T')[0] : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nextTransferDate: new Date(e.target.value).toISOString(),
                  })
                }
                required
                disabled={editReplica.isPending}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t('fields.notes')}</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={editReplica.isPending}
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
                onClick={() => navigate(`/replicas/${replicaId}`)}
                disabled={editReplica.isPending}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={editReplica.isPending}>
                {editReplica.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {tCommon('actions.saving')}
                  </>
                ) : (
                  t('replicas.updateReplica')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
